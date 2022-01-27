export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: { [key: string]: Format };
}

export interface Format {
  res: string;
  size: number;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  authorId: number;
  categoryIds: number[];
  releaseDate: string;
  highestQualityFormat: string;
}
