import pkg from "../message_pb.cjs";
const {
  GraphViewData,
  Position,
  Rotation,
  Scale,
  ServerNodesStatus,
  SpatialInfo,
  Node,
  Link,
  NodeList,
  NodeSpatialInfo,
  LinkList,
} = pkg;
import { getData } from "./data";
import * as d3force from "d3-force-3d";
import logger from "../logger.js";
import { EventType } from "../common.js";

export function createLinkForce(links: any[]) {
  return d3force
    .forceLink(links)
    .id((d, i) => d.id)
    .strength((d) =>
      d.source.name == "document" || d.target.name == "document" ? 0.005 : 0.03
    )
    .distance(100);
}

export function boundingForce(boundingBox) {
  // console.log("boundingForce");
  let nodes, nDim;

  function force() {
    nodes.forEach((node) => {
      const { x, y, z } = node;
      if (x < boundingBox.x) {
        node.x = boundingBox.x;
        node.vx = 0;
      }
      if (x > boundingBox.x + boundingBox.width) {
        node.x = boundingBox.x + boundingBox.width;
        node.vx = 0;
      }
      if (y < boundingBox.y) {
        node.y = boundingBox.y;
        node.vy = 0;
      }
      if (y > boundingBox.y + boundingBox.height) {
        node.y = boundingBox.y + boundingBox.height;
        node.vy = 0;
      }
      if (nDim == 3 && z < boundingBox.z) {
        node.z = boundingBox.z;
        node.vz = 0;
      }
      if (nDim == 3 && z > boundingBox.z + boundingBox.depth) {
        node.z = boundingBox.z + boundingBox.depth;
        node.vz = 0;
      }
    });
  }

  force.initialize = function (_nodes, ...args) {
    // console.log("initialize bounding force");

    nodes = _nodes;
    nDim = args.find((arg) => [1, 2, 3].includes(arg)) || 2;
  };

  return force;
}

export function createGraph(
  data: { links: any[]; nodes: any[] },
  roomId: string,
  numOfDoc: number
) {
  if (data) {
    console.log("loading data from cache");
  } else {
    data = getData();

    let numDocPerCol = numOfDoc / 2;
    let clientScale = 0.004;

    const getAngle = function () {
      return (Math.PI / 10) * numDocPerCol;
    };

    // push document nodes
    new Array(numOfDoc).fill(0).forEach((_, i) => {
      let x =
        (Math.cos(
          ((i % numDocPerCol) / (numDocPerCol - 1)) * getAngle() -
          (getAngle() - Math.PI) / 2
        ) /
          clientScale) *
        1.8;
      let y =
        (Math.floor(i / numDocPerCol) * 1 +
          0.05 -
          2 + 0.5) /
        clientScale;
      let z =
        (-Math.sin(
          ((i % numDocPerCol) / (numDocPerCol - 1)) * getAngle() -
          (getAngle() - Math.PI) / 2
        ) /
          clientScale) *
        1.8;

      data.nodes.push({
        id: 10000 + i, // HACK: id > 10000 is document
        name: "document",
        data: "document",
        type: "document",
        roomid: roomId,
        fx: x,
        fy: y,
        fz: z,
        x,
        y,
        z,
      });
    });
    console.log("loading default data");
  }

  let nodes3d = JSON.parse(JSON.stringify(data.nodes));
  let layout = d3force
    .forceSimulation(nodes3d, 3)
    .force("charge", d3force.forceManyBody().strength(-15).distanceMax(200))
    .force(
      "collide",
      d3force
        .forceCollide()
        .radius((d) => (d.name === "document" ? 1.5 * 5 : 5) + 1)
    )
    .force("link", createLinkForce(JSON.parse(JSON.stringify(data.links))))
    .force("x", (d) => (d.type == "document" ? d3force.forceX(d.fx) : null))
    .force("y", (d) => (d.type == "document" ? d3force.forceY(d.fy) : null))
    .force("z", (d) => (d.type == "document" ? d3force.forceZ(d.fz) : null))
    .force(
      "bound",
      boundingForce({
        x: -500,
        y: -500,
        z: -500,
        width: 1000,
        height: 1000,
        depth: 1000,
      })
    )
  // .alphaTarget(0.1);
  // .force("center", d3force.forceCenter());

  let nodes2d = JSON.parse(JSON.stringify(data.nodes)).map((d) => {
    let x = d.x;
    let z = d.z;
    // project 3d to 2d arc
    let r = Math.sqrt(x * x + z * z);
    let theta = Math.atan2(z, x);
    d.x = r * theta + (Math.PI * r) / 2;
    if (d.fx) d.fx = r * theta + (Math.PI * r) / 2;
    // console.log(d.x);

    delete d["z"];
    delete d["vz"];
    delete d["fz"];
    return d;
  });

  // console.log("nodes2d", nodes2d);

  let layout2D = d3force
    .forceSimulation(nodes2d)
    .force("charge", d3force.forceManyBody().strength(-15).distanceMax(100))
    .force(
      "collide",
      d3force
        .forceCollide()
        .radius((d) => (d.name === "document" ? 1.5 * 5 : 5) + 1)
    )
    .force("link", createLinkForce(JSON.parse(JSON.stringify(data.links))))
    .force("x", (d) => (d.type == "document" ? d3force.forceX(d.fx) : null))
    .force("y", (d) => (d.type == "document" ? d3force.forceY(d.fy) : null))
    .force(
      "bound",
      boundingForce({
        x: -((1000 * Math.PI) / 2),
        y: -500,
        width: 1000 * Math.PI,
        height: 1000,
      })
    )
  // .alphaTarget(0.1);

  // .force("center", d3force.forceCenter());

  let graphViewData = new GraphViewData();
  let nodes = new NodeList();
  let links = new LinkList();

  // initialize graph view data
  // var x = layout.result[0],
  //   y = layout.result[1],
  //   z = layout.result[2];
  layout.nodes().forEach((node: any, i: number) => {
    // console.log("node", node);
    let newNode = new Node();
    newNode.setId(`${node.id}`);
    newNode.setName(node.name);
    newNode.setData(node.data);
    newNode.setCreatedby(node.createdBy);
    newNode.setCreatedfrom(node.createdFrom);
    newNode.setRoomid(roomId);
    graphViewData.addNodes(newNode);

    let _node = new NodeSpatialInfo();
    _node.setId(`${node.id}`);
    _node.setRoomid(roomId);
    _node.setSpatialinfo(
      createSpatialInfo([node.x, node.y, node.z ?? 0], [0, 0, 0, 0], [1, 1, 1])
    );
    nodes.addSpatialinfos(_node);
  });
  data.links.forEach((link: any) => {
    let link_ = new Link();
    // links has been updated by d3-force-3d
    link_.setSource(link.source.id);
    link_.setTarget(link.target.id);
    link_.setId(link.id);
    link_.setData(link.data);
    link_.setCreatedby(link.createdby);
    link_.setCreatedfrom(link.createdfrom);
    link_.setRoomid(roomId);
    links.addLinks(link_);

    // console.log(link_.toObject());

    graphViewData.addLinks(link_);
  });

  graphViewData.setSpatialinfo(
    createSpatialInfo([0, 0, 0], [0, 0, 0, 0], [1, 1, 1])
  );

  return { graphViewData, nodes, links, layout, layout2D };
}

export function updateGraph(
  layout: any,
  graphViewData: pkg.GraphViewData,
  newPose: pkg.SpatialInfo
) {
  layout.tick();
  // console.log("updateGraph", graphViewData.getNodesList().length, layout.nodes());

  // initialize graph view data
  let oldNodeList = graphViewData.getNodesList();
  let newNodeList: pkg.Node[] = [];
  layout.nodes().forEach((node: any, i: number) => {
    let _node = oldNodeList[i];
    _node.setSpatialinfo(
      createSpatialInfo([node.x, node.y, node.z ?? 0], [0, 0, 0, 0], [1, 1, 1])
    );
    newNodeList.push(_node);
  });

  graphViewData.setNodesList(newNodeList);
  graphViewData.setSpatialinfo(newPose);
}

export function getNodesSpatialInfo(layout: any, nodesList: pkg.NodeList) {
  nodesList.setSpatialinfosList(
    layout.nodes().map((node: any, i: number) => {
      let _nodeSpatialInfo = nodesList.getSpatialinfosList()[i];
      return _nodeSpatialInfo.setSpatialinfo(
        createSpatialInfo(
          [node.x, node.y, node.z ?? 0],
          [0, 0, 0, 0],
          [1, 1, 1]
        )
      );
    })
  );

  return nodesList;
}

export function createStatus() {
  const serverNodesStatus = new ServerNodesStatus();
  return serverNodesStatus;
}

export function createSpatialInfo(
  pos: [number, number, number],
  rot: [number, number, number, number],
  scale: [number, number, number]
) {
  let spatialinfo = new SpatialInfo();
  let _pos = new Position();
  _pos.setX(pos[0]);
  _pos.setY(pos[1]);
  _pos.setZ(pos[2]);
  spatialinfo.setPosition(_pos);
  let _rot = new Rotation();
  _rot.setX(rot[0]);
  _rot.setY(rot[1]);
  _rot.setZ(rot[2]);
  _rot.setW(rot[3]);
  spatialinfo.setRotation(_rot);
  let _scale = new Scale();
  _scale.setX(scale[0]);
  _scale.setY(scale[1]);
  _scale.setZ(scale[2]);
  spatialinfo.setScale(_scale);
  return spatialinfo;
}

/**
 * Add a link to the target graph and assign the id to the link
 * @param graphs
 * @param roomId
 * @param graphViewData
 * @param link
 */
export function addLinkToGraph(graphs, roomId, graphViewData, link) {
  let lastItem = graphs[roomId].data.getGraphviewdata().getLinksList().at(-1);
  let nextId = lastItem ? +lastItem.getId() + 1 : 0;
  link.setId(`${nextId}`);
  // console.log("adding link", link.getTarget(), link.getSource(), link.toObject());
  // console.log( layouts[roomId]["3D"].nodes());
  logger.info({
    event: EventType.AddLink,
    data: { ...link.toObject(), userid: link.getUpdatedby() },
  });

  graphViewData.addLinks(link);
}
