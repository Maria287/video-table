import MaterialUiTextField, { TextFieldProps as MaterialUiTextFieldProps } from "@material-ui/core/TextField/TextField";
import React from "react";
import { InputError } from "./error";

export function TextField(props: MaterialUiTextFieldProps & { errorText?: string }): JSX.Element {
    const { errorText, ...textFieldProps } = props;
    return <>
        <MaterialUiTextField
            {...textFieldProps}
            error={errorText !== undefined}
            fullWidth
            variant="outlined"
        />
        <InputError errorText={errorText} />
    </>;
}
