import { Author, Category, ProcessedVideo } from "./interfaces";

export interface SearchParameter {
    searchValue?: string;
    videos: ProcessedVideo[];
    authors: { [key: string]: Author | undefined };
    categories: { [key: string]: Category | undefined };
}

export function compare(value: string | undefined, searchString: string): boolean {
    return (value || "").toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) >= 0;
}

export function filterVideos(params: SearchParameter) {
    const { videos, searchValue, authors, categories } = params;
    return searchValue
        ? videos.filter(video => {
            if (compare(video.name, searchValue)) {
                return true;
            }

            if (compare(authors[video.authorId]?.name, searchValue)) {
                return true;
            }

            if (video.categoryIds.some(c => compare(categories[c]?.name, searchValue))) {
                return true;
            }

            return false;

        })
        : videos;
}
