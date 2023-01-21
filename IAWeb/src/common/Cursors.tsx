import NavigationIcon from "@mui/icons-material/Navigation";
import { Html } from "@react-three/drei";
import React from "react";
import { selectUserList } from "../features/room/roomSlice";
import { useAppSelector } from "../hooks";
import Cursor from "./Cursor";

export default function Cursors() {
  //   const cursors = useCursorList();
  //   return (
  //     <group>
  //       {cursors.map((cursor) => (
  //         <Cursor key={cursor.id} cursor={cursor} />
  //       ))}
  //     </group>
  //   );

  const selector = useAppSelector;
  const users = selector(selectUserList);

  return (
    <group>
      {users.map((user, i) => (
        <Cursor key={i} userId={user.getId()}></Cursor>
      ))}
    </group>
  );
}
