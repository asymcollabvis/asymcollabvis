import pkg from "./message_pb.cjs";
import { clientTypeToString } from "./utils.js";
const { UserList } = pkg;

export function leave(
  roomId: string,
  rooms: { [roomId: string]: pkg.Room },
  userInfo: pkg.UserInfo,
  streamRoomUserCalls,
  users,
  lastUserInfo
) {
  const userId = userInfo.getId();
  if (roomId) {
    if (roomId in rooms) {
      let usersInRoom = rooms[roomId].getUsersList();

      rooms[roomId].setUsersList(
        usersInRoom.filter((user) => user.getId() != userInfo.getId())
      );

      // remove stream calls
      // streamRoomUserCalls = removeUserFromRoomStream(
      //   userId,
      //   roomId,
      //   streamRoomUserCalls
      // );
      // streamRoomGraphStatusCalls = removeUserFromRoomStream(
      //   userId,
      //   roomId,
      //   streamRoomGraphStatusCalls
      // );
      // streamRoomGraphCalls = removeUserFromRoomStream(
      //   userId,
      //   roomId,
      //   streamRoomGraphCalls
      // );
    }

    let streamRoomUserCall = streamRoomUserCalls[roomId];
    if (streamRoomUserCall) {
      streamRoomUserCall.forEach((call) => {
        let _userlist = new UserList();
        _userlist.setUsersList(rooms[roomId].getUsersList());
        call.write(_userlist);
      });
    }
  }
  delete users[roomId][userId];
  if (lastUserInfo[userId]) {
    clearInterval(lastUserInfo[userId].interval);
    lastUserInfo[userId] = { userInfo: userInfo };
  }
  // userList.setUsersList(Object.values(users));
  // streamUserCalls.forEach((call) => {
  //   call.write(userList);
  // });

  console.log(clientTypeToString(userInfo.getType()), userId, "left");
  console.log("remaining users", Object.keys(users[roomId]));
}
