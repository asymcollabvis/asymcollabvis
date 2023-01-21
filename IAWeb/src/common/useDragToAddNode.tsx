import { addLink, addNode, clearNodeSelection, updateNode } from "./graph";
import { setSelectedText } from "../features/document/documentSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import store from "../store";

export default function useDragToAddNode() {
  const dispatch = useAppDispatch();

  function dragToAddNode() {
    const position = store.getState().graph.toBeCreatedNodePosition;
    const _user = store.getState().user.userInfo;
    const _documentIndex = store.getState().document.documentId;
    const _documentId = store.getState().document.documents[_documentIndex].fileName;
    if (!_user) {
      return;
    }

    const _selectedText = store.getState().document.selectedText;
    const _selectedNodeIds = store.getState().graph.selectedNodeIds;
    if (_selectedText != "") {
      // handle drag text to canvas
      console.log("drag text to canvas. Text:", _selectedText);

      if (_selectedNodeIds.length == 2) {
        // create a link
        addLink(
          _user,
          _selectedNodeIds[0],
          _selectedNodeIds[1],
          _selectedText,
          _documentId
        );
      } else if (_selectedNodeIds.length == 1) {
        // update node
        updateNode(_user, _selectedText);
      } else {
        // create a node
        addNode(
          _user,
          _selectedText,
          _documentId,
          position.x,
          position.y,
          position.z
        );
      }

      // reset selected text
      dispatch(setSelectedText({ text: "", from: -1 }));
    }
  }

  return {
    dragToAddNode,
  };
}
