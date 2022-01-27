import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";

export function InputError(props: { errorText?: string }): JSX.Element | null {
    return props.errorText
        ? <FormHelperText style={{ color: "red" }}>{props.errorText}</FormHelperText>
        : null;
}
