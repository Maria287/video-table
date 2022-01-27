import { Grid } from "@material-ui/core";
import React from "react";

export function Row(props: { label: string; children?: React.ReactNode }): JSX.Element {
    return <>
        <Grid item xs={2}>{props.label}</Grid>
        <Grid item xs={10}>{props.children}</Grid>
    </>;
}