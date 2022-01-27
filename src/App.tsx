import React, { useEffect, useState } from 'react';
import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@material-ui/core';
import { VideosTable } from './components/videos-table';
import { deleteVideo, getVideos } from './services/videos';
import { Author, Category, ProcessedVideo } from './common/interfaces';
import { EditVideoScreen } from './components/editVideoForm';
import { getAuthors } from './services/authors';
import { getCategories } from './services/categories';
import { useStyles } from './components/styles';
import { DatabaseContext } from './components/databaseContext';
import { convertArrayToMap } from './common/helpers';

const App: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: Author }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [currentScreen, setCurrentScreen] = useState<"Table" | "EditScreen">("Table");
  const [selectedVideo, setSelectedVideo] = useState<ProcessedVideo | undefined>();

  const classes = useStyles({ button: { backgroundColor: "green" } });

  useEffect(() => {
    getVideos().then((videos) => {
      setVideos(videos);
    });
    getCategories().then((categories) => {
      setCategories(convertArrayToMap(categories));
    });
    getAuthors().then(authors => {
      setAuthors(convertArrayToMap(authors));
    })
  }, []);

  const handleOnLeave = (cancel: boolean) => {
    setCurrentScreen("Table");
    setSelectedVideo(undefined);

    if (cancel === false) {
      getVideos().then((videos) => {
        setVideos(videos);
      });
      getAuthors().then(authors => {
        setAuthors(convertArrayToMap(authors));
      })
    }
  }

  const handleDelete = (video: ProcessedVideo) => {
    const author = authors[video.authorId];
    if (author !== undefined) {
      deleteVideo(author, video?.id).then(e => {
        getVideos()
          .then((videos) => {
            setVideos(videos);
          });
      })
    }
  };

  return (
    <DatabaseContext.Provider value={{ videos, categories, authors }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Videos</Typography>
          <Grid container justifyContent="flex-end" onClick={() => setCurrentScreen("EditScreen")}>
            {
              currentScreen === "Table"
                ? <Button variant="contained" className={classes.button}>
                  Add video
                  </Button>
                : null
            }
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>
        {
          currentScreen === "Table"
            ? <VideosTable
              onEditButtonClicked={video => { setSelectedVideo(video); setCurrentScreen("EditScreen"); }}
              onDeleteVideoClicked={video => { handleDelete(video); }}
            />
            : <EditVideoScreen
              video={selectedVideo}
              onLeave={(cancel: boolean) => { handleOnLeave(cancel); }}
            />
        }
      </Container>
    </DatabaseContext.Provider>
  );
};

export default App;
