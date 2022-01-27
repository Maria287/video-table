import { makeStyles, Theme } from "@material-ui/core";

type StyleProps = {
    button?: {
        backgroundColor: string;
        color?: string;
    }
}

export const useStyles = makeStyles<Theme, StyleProps>({
    button: {
        backgroundColor: props => props.button?.backgroundColor || "grey",
        color: props => props.button?.color || "white",
        marginRight: "10px"
    }
});