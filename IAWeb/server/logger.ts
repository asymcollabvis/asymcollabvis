import * as winston from "winston";
import * as fsP from "fs/promises";
import * as fs from "fs";
import { EventType } from "./common";
import readline from "readline";
import events from "events";

const LOGDIR = "logs";

let logger;
function getLogger() {
  if (logger) {
    return logger;
  } else {
    return (logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({
          filename: `${LOGDIR}/${Date.now()}.log`,
        }),
      ],
    }));
  }
}

export default getLogger();

// recoverFromLogs("1661563336544.log");

function utf16ToText(s: string) {
  // return Buffer.from(s, 'utf-8').slice(3).toString('utf8')
  // return "{" + s.slice(2);
  // return JSON.parse(JSON.stringify(s));
  return s.startsWith("\uFEFF") ? s.slice(1) : s;
}

let cacheData: { timestamp: string; event: EventType; data: any }[] = [];
export async function recoverFromLogs(filename?: string) {
  if (cacheData.length > 0) {
    return cacheData;
  }

  let files: string[] = [];
  if (!filename) {
    // get latest log file name
    // filename = await fs.readdir(LOGDIR).then((files) => {
    //   if (files.length === 0) {
    //     return;
    //   }
    //   const latest = files
    //     .sort((a, b) => {
    //       return parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]);
    //     })
    //     .at(-2);
    //   return latest;
    // });

    // get all log files
    files = await fsP.readdir(LOGDIR + "/data");
  } else {
    files.push(filename);
  }

  let ret: { timestamp: string; event: EventType; data: any }[] = [];

  for (const file of files) {
    console.log(`recover from ${file}`);

    const rl = readline.createInterface({
      input: fs.createReadStream(`logs/data/${file}`, {
        encoding: file == "p1.log" ? "utf16le" : "utf8",
      }),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      line = file == "p1.log" ? utf16ToText(line) : line;
      let log = JSON.parse(line);
      let timestamp: string = log.timestamp;
      let msg = log.message;
      let eventName: EventType = msg.event;
      if (eventName === EventType.UserInfo) {
        return;
      }
      ret.push({ timestamp, event: eventName, data: msg.data });
    });

    await events.once(rl, "close");

    // let data = await fsP.readFile(`logs/data/${file}`, "utf8");
    // let lines = data.split("\n");
    // lines.forEach((line) => {
    //   if (line) {
    //     let log = JSON.parse(line);
    //     let timestamp: string = log.timestamp;
    //     let msg = log.message;
    //     let eventName: EventType = msg.event;
    //     ret.push({ timestamp, event: eventName, data: msg.data });
    //   }
    // });
  }

  cacheData = ret;
  return ret;
}

let cache;
export async function getLogsByIds(roomId: string, userId: string) {
  console.log("getting", roomId, userId);
  if (!cache || !cache[roomId] || !cache[roomId][userId]) {
    cache = {};
    await recoverFromLogs().then((logs) => {
      logs.forEach((log) => {
        if (!cache[log.data.roomid]) {
          cache[log.data.roomid] = {};
        }
        if (!cache[log.data.roomid][log.data.userid]) {
          cache[log.data.roomid][log.data.userid] = [];
        }
        cache[log.data.roomid][log.data.userid].push(log);
      });
    });
    // console.log("cache", cache);

    return cache[roomId][userId];
  } else {
    return cache[roomId][userId];
  }
}
