import * as fs from "fs/promises";
const CACHE_PATH = "./cache";

const cache: {
  [roomId: string]: {
    nodes: any[];
    links: any[];
  };
} = {};

export async function loadCache() {
  const files = await fs.readdir(CACHE_PATH);
  let cachePromises: Promise<any>[] = [];
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      let id = file.split(".")[0];
      cachePromises.push(
        fs.readFile(`${CACHE_PATH}/${file}`, "utf8").then((data) => {
          cache[id] = JSON.parse(data);
        })
      );
    }
  });
  return cachePromises;
}

export function saveCache(roomId: string, nodes: any[], links: any[]) {
  cache[roomId] = {
    nodes,
    links,
  };
  return fs.writeFile(
    `${CACHE_PATH}/${roomId}.json`,
    JSON.stringify(cache[roomId])
  );
}

export function getCache(roomId: string) {
  return cache[roomId];
}
