import { useEffect, useState } from "react";
import { useClient } from "../../common/client";
import {
  DocumentList,
  EmptyMessage,
  RequestById,
} from "../../common/message_pb";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUserList } from "../room/roomSlice";
import { selectUser } from "../user/userSlice";
import {
  selectDocuments,
  selectDocumentState,
  setDocInfos,
  setDocumentState,
} from "./documentSlice";

export type DocumentListData = {
  id: string;
  title: string;
  author?: string;
  date?: string;
  using?: string[];
};
export default function useDocumentList() {
  const [documentsWithUsing, setDocumentsWithUsing] = useState<
    DocumentListData[]
  >([]);
  const client = useClient();
  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  const documentState = selector(selectDocumentState);
  const documents = selector(selectDocuments);
  const user = selector(selectUser);

  useEffect(() => {
    // console.log("useDocumentList", documentState);

    let newDocuments: DocumentListData[] = JSON.parse(
      JSON.stringify(documents)
    );
    // clean up
    newDocuments.forEach((doc) => {
      doc.using = [];
    });
    // console.log(newDocuments);

    // update using
    if (documentState && user && newDocuments.length > 0) {
      // console.log("test");
      documentState.getDocumentstatesMap().forEach((readByList, docId) => {
        // console.log(newDocuments, docId);

        const doc = newDocuments.find((doc) => doc.id === docId);
        // console.log(doc);

        if (doc) {
          // console.log(readByList.getIdsList());

          doc.using = readByList
            .getIdsList()
            .filter((id) => id !== user.getId());
          // console.log(doc.using);
        }
        // console.log(newDocuments.find((doc) => doc.id === docId));
      });
      setDocumentsWithUsing(newDocuments);
    }
  }, [documentState, documents]);

  return documentsWithUsing;
}
