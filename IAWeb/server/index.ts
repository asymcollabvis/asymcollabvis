import { Server, ServerCredentials } from "grpc";
import { loadCache } from "./cache/cache.js";
import { init } from "./data/data.js";
import { EchoServiceService } from "./message_grpc_pb.cjs";
import { EchoImpl } from "./services";

console.log("init");
await init();
console.log("init done");

console.log("loading cache");
let cachePromises = await loadCache();
await Promise.all(cachePromises);
console.log("loading cache done");


console.log("start server");

const server = new Server();
server.addService(EchoServiceService, new EchoImpl());

const port = 9091;
const uri = `0.0.0.0:${port}`;
console.log(`Starting server on ${uri}`);
server.bind(uri, ServerCredentials.createInsecure());

server.start();
