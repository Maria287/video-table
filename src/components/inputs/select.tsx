import { MenuItem, Select as MaterialSelect, SelectProps as MaterialSelectProps } from "@material-ui/core";
import React from "react";
import { InputError } from "./error";

export interface SelectProps extends MaterialSelectProps {
    items: { [key: string]: { name: string } };
    errorText?: string;
}

export const Select: React.FC<SelectProps & {}> = props => {
    const { items, errorText, ...restProps } = props;

    return <>
        <MaterialSelect
            {...restProps}
            error={errorText !== undefined}
            fullWidth
            variant="outlined"
        >
            {
                Object.keys(props.items).map(i => {
                    return <MenuItem key={i} value={i}>{props.items[i].name}</MenuItem>;
                })
            }
        </MaterialSelect>
        <InputError errorText={errorText} />
    </>;
}
