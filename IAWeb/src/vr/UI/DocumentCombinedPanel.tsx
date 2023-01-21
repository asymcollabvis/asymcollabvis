import React, { forwardRef } from "react";
import { selectDocumentState } from "../../features/document/documentSlice";
import { useAppSelector } from "../../hooks";
import DocumentListPanel from "./DocumentListPanel";
import DocumentPanel from "./DocumentPanel";
import Panel from "./Panel";

export default forwardRef(({}, docRef) => {
  const selector = useAppSelector;
  const documentState = selector(selectDocumentState);

  return (
    <Panel
      position={[-0.8, 1.9, -0.6]}
      width={0.7}
      height={0.8}
      title={"Document Panel"}
      ref={docRef}
    >
      <DocumentListPanel
        showTopBar={false}
        draggable={false}
        offset={0.022}
      ></DocumentListPanel>
      {documentState && (
        <DocumentPanel
          // position={[-0.5, 1.5, -0.5]}
          showTopBar={false}
          position={[0, -0.16, 0.001]}
          width={0.7}
          height={0.5}
          fontSize={0.012}
          draggable={false}
        ></DocumentPanel>
      )}
    </Panel>
  );
});
