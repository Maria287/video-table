import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useStyles } from "./styles";

export interface FormProps {
    headline: string;
    onSubmitClick: () => void;
    onCancelClick: () => void;
    children?: React.ReactNode
}

export function Form(props: FormProps): JSX.Element {
    const classes = useStyles({ button: { backgroundColor: "blue" } });

    return <>
        <Typography variant={"h4"} style={{ marginTop: "40px" }}>
            {props.headline}
        </Typography>
        <hr />
        <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="center"
        >
            {props.children}

            <Grid item xs={2}></Grid>
            <Grid item xs={10}>
                <Button key="submit" variant="contained" className={classes.button} onClick={props.onSubmitClick}>
                    Submit
                </Button>
                <Button key="cancel" variant="contained" onClick={props.onCancelClick}>
                    Cancel
                </Button>
            </Grid>
        </Grid>
    </>;
}
