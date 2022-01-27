import React from "react";
import { Author, Category, ProcessedVideo } from "../common/interfaces";

interface DatabaseContextType {
    authors: { [key: string]: Author };
    categories: { [key: string]: Category };
    videos: ProcessedVideo[]
}
export const DatabaseContext = React.createContext<DatabaseContextType>({ authors: {}, categories: {}, videos: [] });
