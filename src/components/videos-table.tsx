import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import { ProcessedVideo } from '../common/interfaces';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { SearchComponent } from './searchComponent';
import { filterVideos } from '../common/filter';
import { DatabaseContext } from './databaseContext';
import { ConfirmationDialog } from './confirmationDialog';
import { sortVideos } from '../common/sort';

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
  const [filteredAndSortedVideos, setFilteredAndSortedVideos] = useState<ProcessedVideo[]>(videos);
  const [sorting, setSorting] = useState<{ order: "asc" | "desc", column: "name" | "author" }>({ order: "asc", column: "name" });


  const handleClose = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed && selectedVideo) {
      onDeleteVideoClicked(selectedVideo);
    }
  }

  const onSortingClicked = (column: "name" | "author") => {
    const nextSorting = column !== sorting.column
      ? "asc"
      : sorting.order === "asc" ? "desc" : "asc"
    setSorting({ column, order: nextSorting });
  }

  useEffect(() => {
    const filteredVideos = filterVideos({ authors, videos, categories, searchValue });
    console.log(sorting.order);
    console.log(videos.map(f => f.name));

    console.log(filteredVideos.map(f => f.name));
    sortVideos({ authors, videos: filteredVideos, sortingColumn: sorting.column, order: sorting.order });
    console.log(filteredVideos.map(f => f.name));

    setFilteredAndSortedVideos(filteredVideos)
  },
    [searchValue, authors, videos, categories, sorting]
  );

  console.log(filteredAndSortedVideos.map(f => f.name));

  return (
    <>
      <SearchComponent onSearch={setSearchValue} />
      <TableContainer component={Paper} style={{ marginTop: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  direction={sorting.order}
                  active={sorting.column === "name"}
                  onClick={() => onSortingClicked("name")}
                >
                  Video Name
                </TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel
                direction={sorting.order}
                active={sorting.column === "author"}
                onClick={() => onSortingClicked("author")}
              >
                Author
                </TableSortLabel></TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Highest resolution</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedVideos.map((video) => {
              console.log(video.name, video.id);
              return <TableRow key={video.name} >
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
              </TableRow>;
            })}
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
