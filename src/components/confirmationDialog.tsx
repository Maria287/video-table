
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React from 'react';

export interface ConfirmationDialogProps {
    onClose: (confirmed: boolean) => void;
    title: string;
    text: React.ReactNode;
}
export function ConfirmationDialog(props: ConfirmationDialogProps): JSX.Element {
    return <Dialog
        open={true}
        onClose={() => props.onClose(false)}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
    >
        <DialogTitle id="confirmation-dialog-title">
            {props.title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
                {props.text}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.onClose(false)}>No</Button>
            <Button onClick={() => props.onClose(true)}>Yes</Button>
        </DialogActions>
    </Dialog>;
}