import { useEffect, useState } from "react";
import { useClient } from "../../common/client";
import { RequestById, Document } from "../../common/message_pb";
import { useAppDispatch, useAppSelector } from "../../hooks";
import store from "../../store";
import { selectUser } from "../user/userSlice";
import { selectDocumentId } from "./documentSlice";

export default function useDocument(index: number | null = null) {
  const selector = useAppSelector;
  const documentId = index ?? selector(selectDocumentId);
  const client = useClient();

  const [document, setDocument] = useState<string>("");
  const user = selector(selectUser);

  useEffect(() => {
    // console.log(documentId);

    if (user) {
      const request = new RequestById();
      request.setId(`${documentId}`);
      request.setUserid(user.getId());
      request.setRoomid(user.getRoomid());
      client.getDoument(request, {}, (err, res: Document) => {
        // console.log(res.getContent());

        setDocument(res.getContent().trim().replace(/\n *(\w)/g, "$1").replace(/\n/g, "\n\n"));
      });

      if (index == null)
        client.updateDocumentState(request, {}, (err, res) => {
        });
    }
  }, [documentId]);

  return document;
}
