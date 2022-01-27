import { Author, ProcessedVideo } from "./interfaces";

export interface SortParameters {
    sortingColumn: "name" | "author",
    videos: ProcessedVideo[];
    authors: { [key: string]: Author | undefined },
    order: "asc" | "desc"
}

export function getCompareValue(params: { video: ProcessedVideo } & SortParameters): string {
    if (params.sortingColumn === "name") {
        return params.video.name;
    }

    if (params.sortingColumn === "author") {
        return params.authors[params.video.authorId]?.name || "";
    }

    return "";
};

export function sortVideos(params: SortParameters): ProcessedVideo[] {
    const { videos, order } = params;
    return videos.sort((a, b) => {
        const value1 = getCompareValue({ video: a, ...params });
        const value2 = getCompareValue({ video: b, ...params });

        if (order === "asc") {
            return value1.localeCompare(value2);
        } else {
            return value2.localeCompare(value1);
        }

    });
}