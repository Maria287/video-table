import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { ProcessedVideo } from '../common/interfaces';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { SearchComponent } from './searchComponent';
import { filterVideos } from '../common/filter';
import { DatabaseContext } from './databaseContext';
import { ConfirmationDialog } from './confirmationDialog';

interface VideosTableProps {
  onEditButtonClicked: (video: ProcessedVideo) => void;
  onDeleteVideoClicked: (video: ProcessedVideo) => void;
}

export const VideosTable: React.FC<VideosTableProps> = ({ onEditButtonClicked, onDeleteVideoClicked }) => {
  const databaseContext = useContext(DatabaseContext);
  const { authors, categories, videos } = databaseContext;

  const [selectedVideo, setSelectedVideo] = useState<ProcessedVideo | undefined>();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [filteredVideos, setFilteredVideos] = useState<ProcessedVideo[]>(videos);

  const handleClose = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed && selectedVideo) {
      onDeleteVideoClicked(selectedVideo);
    }
  }

  useEffect(() => {
    const filteredVideos = filterVideos({ authors, videos, categories, searchValue });
    setFilteredVideos(filteredVideos)
  },
    [searchValue, authors, videos, categories]
  );

  return (
    <>
      <SearchComponent onSearch={setSearchValue} />
      <TableContainer component={Paper} style={{ marginTop: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Video Name</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Highest resolution</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell component="th" scope="row">
                  {video.name}
                </TableCell>
                <TableCell>{authors[video.authorId]?.name}</TableCell>
                <TableCell>{video.categoryIds.map(c => categories[c]?.name).join(', ')}</TableCell>
                <TableCell>{video.highestQualityFormat}</TableCell>
                <TableCell>{video.releaseDate}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => onEditButtonClicked(video)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setShowConfirmation(true);
                      setSelectedVideo(video);
                    }}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >
      {
        showConfirmation
          ? <ConfirmationDialog
            title="Delete"
            text={<p>Do you really want to delete video <b>{selectedVideo?.name}</b></p>}
            onClose={handleClose}
          />
          : null
      }
    </>
  );
};
