import { getAuthors } from './authors';
import { Author, Format, ProcessedVideo, Video } from '../common/interfaces';

export const getVideos = (): Promise<ProcessedVideo[]> => {
  return Promise
    .all([getAuthors()])
    .then(([authors]) => {
      const processedVideos: ProcessedVideo[] = [];
      for (const author of authors) {
        for (const video of author.videos) {

          const arrayOfFormats = Object.keys(video.formats)
            .map(k => ({ name: k, ...video.formats[k] }))
            .sort(sortVideoFormats);

          const processedVideo: ProcessedVideo = {
            authorId: author.id,
            categoryIds: video.catIds,
            id: video.id,
            name: video.name,
            releaseDate: video.releaseDate,
            highestQualityFormat: `${arrayOfFormats[0].name} ${arrayOfFormats[0].res}`
          }

          processedVideos.push(processedVideo);
        }
      }

      return processedVideos;
    });
};

/**
 * Updates a video for the given author.
 * If the video does not exist yet for the author, the video is added.
 */
export const updateVideo = (
  oldVideo: ProcessedVideo | undefined,
  updatedVideoInformation: { name: string, authorId: number, catIds: number[] },
  authors: { [key: string]: Author },
  videos: ProcessedVideo[],
): Promise<void> => {
  const id = oldVideo ? oldVideo.id : getNextId(videos);

  const previousAuthor = oldVideo ? authors[oldVideo.authorId] : authors[updatedVideoInformation.authorId];
  const authorChanged = previousAuthor.id !== updatedVideoInformation.authorId;

  const authorToUpdate = authorChanged
    ? authors[updatedVideoInformation.authorId]
    : previousAuthor

  const indexOfVideo = authorChanged ? -1 : authorToUpdate.videos.findIndex(v => v.id === id);
  const currentVideo = indexOfVideo >= 0 ? previousAuthor.videos[indexOfVideo] : undefined;

  const updatedVideo: Video = {
    id,
    catIds: updatedVideoInformation.catIds,
    name: updatedVideoInformation.name,
    formats: currentVideo?.formats || { one: { res: "1080p", size: 1000 } },
    releaseDate: currentVideo?.releaseDate || new Date().toISOString().split('T')[0],
  };

  const newVideos: Video[] = indexOfVideo >= 0
    ? [
      ...authorToUpdate.videos.slice(0, indexOfVideo),
      updatedVideo,
      ...authorToUpdate.videos.slice(indexOfVideo + 1)
    ]
    : [
      ...authorToUpdate.videos,
      updatedVideo
    ];

  const updatedAuthor: Author = {
    ...authorToUpdate,
    videos: newVideos
  }

  return updateAuthor(updatedAuthor).then(() => {
    if (oldVideo && authorChanged) {
      deleteVideo(previousAuthor, oldVideo.id)
    }
  })
}

/**
 * Deletes a video from an author 
 */
export const deleteVideo = (author: Author, videoId: number): Promise<void> => {
  const indexOfVideo = author.videos.findIndex(v => v.id === videoId);

  if (indexOfVideo < 0) {
    return Promise.resolve();
  }

  const newVideos: Video[] = [
    ...author.videos.slice(0, indexOfVideo),
    ...author.videos.slice(indexOfVideo + 1)
  ]

  const updatedAuthor: Author = {
    ...author,
    videos: newVideos
  }

  return updateAuthor(updatedAuthor);
}

/**
 * Updates an author in the database
 */
export const updateAuthor = (author: Author): Promise<void> => {
  return fetch(`${process.env.REACT_APP_API}/authors/` + author.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(author)
  }).then(() => Promise.resolve());
}


function sortVideoFormats(a: Format, b: Format): number {
  if (a.size > b.size) {
    return -1;
  } else if (a.size < b.size) {
    return 1;
  } else {
    return parseResToNumber(a.res) > parseResToNumber(b.res) ? -1 : 1;
  }
}

function parseResToNumber(res: string): number {
  const parsedNumber = Number(res.replace("p", ""))

  if (isNaN(parsedNumber)) {
    throw new Error(`Invalid input data. Resolution ${res} could not be parsed`)
  }

  return parsedNumber;
}

function getNextId(videos: ProcessedVideo[]): number {
  return videos.map(v => v.id).sort((a, b) => a > b ? -1 : 1)[0] + 1;
}