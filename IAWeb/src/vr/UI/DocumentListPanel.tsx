import React, { useState } from "react";
import useDocumentList from "../../features/document/useDocumentList";
import Panel from "./Panel";
import { Text } from "@react-three/drei";
import Button from "./Button";
import { useAppDispatch } from "../../hooks";
import { setDocumentId } from "../../features/document/documentSlice";

const itemPerPage = 10;
export default function DocumentListPanel({
  position = [0, 0, 0],
  offset = 0.016,
  height = 0.2,
  showTopBar = true,
  draggable = true,
}) {
  console.log("DocumentListPanel");

  const documents = useDocumentList();
  const [page, setPage] = useState(0);

  const dispatch = useAppDispatch();
  const textLengthLimit = 50;

  return (
    <Panel
      position={position}
      offset={offset}
      height={height}
      showTopBar={showTopBar}
      draggable={draggable}
    >
      {/* <Text color="black" anchorX="left" anchorY="top" fontSize={0.01}>
        Document List Panel
      </Text> */}

      {[...Array(itemPerPage).keys()].map((_, i) => {
        const index = i + page * itemPerPage;
        if (index >= documents.length) {
          return null;
        }
        return (
          <Button
            key={index}
            height={0.025}
            width={0.5}
            onClick={() => {
              dispatch(setDocumentId(index));
            }}
          >
            {documents[index].id} | {documents[index].title.substring(0, Math.min(documents[index].title.length, textLengthLimit))}{documents[index].title.length > textLengthLimit ? "..." : ""} | {documents[index].using}
          </Button>
        );
      })}

      {(page + 1) * itemPerPage < documents.length && (
        <Button onClick={() => setPage(page + 1)}>Next Page</Button>
      )}
      {page > 0 && (
        <Button width={0.08} onClick={() => setPage(page - 1)}>
          Previous Page
        </Button>
      )}
    </Panel>
  );
}
