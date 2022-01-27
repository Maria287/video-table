import { TextField, IconButton } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";

export const SearchComponent: React.FC<{ onSearch: (searchValue: string | undefined) => void }> = props => {
    const [searchValue, setSearchValue] = useState<string | undefined>();

    return <TextField
        id="search-input"
        value={searchValue || ""}
        onChange={e => setSearchValue(e.target.value)}
        style={{ marginTop: '40px' }}
        variant="outlined"
        onKeyPress={(e) => {
            if (e.key === 'Enter') {
                props.onSearch(searchValue)
            }
        }}
        InputProps={{
            startAdornment: <IconButton aria-label="search" onClick={() => props.onSearch(searchValue)}>
                <SearchIcon color="primary" />
            </IconButton >
        }}
    />;
}

