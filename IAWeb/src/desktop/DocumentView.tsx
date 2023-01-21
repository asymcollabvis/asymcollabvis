import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  selectDocumentId,
  setSelectedText,
} from "../features/document/documentSlice";
import { useGesture } from "@use-gesture/react";
import useDocument from "../features/document/useDocument";
import { Box } from "@mui/material";

export default function DocumentView() {
  const dispatch = useAppDispatch();

  const document = useDocument();
  const selector = useAppSelector;
  const documentId = selector(selectDocumentId);
  console.log("document", document);

  const bind = useGesture({
    onPointerUp: ({ event, ...sharedState }) => {
      console.log(window.getSelection()?.toString());

      dispatch(
        setSelectedText({
          text: window.getSelection()?.toString() ?? "",
          from: documentId,
        })
      );
    },
  });

  return (
    <Box
      component={"div"}
      {...bind()}
      style={{
        height: 600,
        overflow: "auto",
        width: "100%",
        whiteSpace: "pre-line",
        fontSize: "20px",
        padding: "8px",
      }}
    >
      <div>Document ID: {documentId}</div>

      <div>{document}</div>
    </Box>
  );
}
