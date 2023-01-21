import pkg from "./message_pb.cjs";
const { UserInfo } = pkg;

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

export function removeUserFromRoomStream(
  userId: string,
  roomId: string,
  stream: {}
) {
  stream[roomId]
    .filter((call) => {
      return call.request.getUserid() == userId;
    })
    .forEach((call) => {
      call.end();
    });
  return stream[roomId].filter((call) => {
    return call.request.getUserid() != userId;
  });
}

export function clientTypeToString(type: any) {
  for (const key in UserInfo.ClientType) {
    if (UserInfo.ClientType[key] == type) {
      return key;
    }
  }
}
