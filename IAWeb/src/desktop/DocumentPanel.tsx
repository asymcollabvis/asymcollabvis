import { Grid } from "@mui/material";
import React from "react";
import { selectDocumentState } from "../features/document/documentSlice";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../hooks";
import DocumentList from "./DocumentList";
import DocumentView from "./DocumentView";

export default function DocumentPanel() {
    const selector = useAppSelector;
    const user = selector(selectUser);

    const documentState = selector(selectDocumentState);

    return (
        <>
            {user?.getRoomid() && (
                <Grid item xs>
                    <DocumentList></DocumentList>
                    {documentState && <DocumentView></DocumentView>}
                </Grid>
            )}
        </>
    );
}