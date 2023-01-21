import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, UserInfo } from "../../common/message_pb";
import { RootState } from "../../store";

export type GNode = number[];
export type GLink = {
  source: number;
  target: number;
  data: string;
  id?: string;
  isMoveNode: boolean;
};

// Define a type for the slice state
interface GraphState {
  nodes: GNode[];
  links: GLink[];
  selectedNodeIds: number[];
  allSelectedNodeIds: { userId: string; id: number }[];
  nodesRaw: Node[];
  toBeCreatedNodePosition: { x?: number; y?: number; z?: number };
  nodesInstances?: THREE.InstancedMesh;
  isMoveNode?: string;
  graph?: THREE.Group;
}

// Define the initial state using that type
const initialState: GraphState = {
  nodes: [],
  links: [],
  selectedNodeIds: [],
  allSelectedNodeIds: [],
  nodesRaw: [],
  toBeCreatedNodePosition: {},
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setNodes(state, action: PayloadAction<GNode[]>) {
      state.nodes = action.payload;
    },
    setLinks(state, action: PayloadAction<GLink[]>) {
      state.links = action.payload;
    },
    setSelectedNodeIds(state, action: PayloadAction<number[]>) {
      state.selectedNodeIds = action.payload;
    },
    setAllSelectedNodeIds(
      state,
      action: PayloadAction<{ userId: string; id: number }[]>
    ) {
      state.allSelectedNodeIds = action.payload;
    },
    setNodesRaw(state, action: PayloadAction<Node[]>) {
      state.nodesRaw = action.payload;
    },
    setToBeCreatedNodePosition(
      state,
      action: PayloadAction<{ x?: number; y?: number; z?: number }>
    ) {
      state.toBeCreatedNodePosition = action.payload;
    },
    setNodesInstances(state, action: PayloadAction<THREE.InstancedMesh>) {
      state.nodesInstances = action.payload;
    },
    setIsMoveNode(state, action: PayloadAction<string | undefined>) {
      state.isMoveNode = action.payload;
    },
    setGraph(state, action: PayloadAction<THREE.Group>) {
      state.graph = action.payload;
    },
  },
});

export const {
  setNodes,
  setLinks,
  setSelectedNodeIds,
  setAllSelectedNodeIds,
  setNodesRaw,
  setToBeCreatedNodePosition,
  setNodesInstances,
  setIsMoveNode,
  setGraph
} = graphSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNodes = (state: RootState) => state.graph.nodes;
export const selectLinks = (state: RootState) => state.graph.links;
export const selectSelectedNodeIds = (state: RootState) =>
  state.graph.selectedNodeIds;
export const selectAllSelectedNodeIds = (state: RootState) =>
  state.graph.allSelectedNodeIds;
export const selectNodesRaw = (state: RootState) => state.graph.nodesRaw;
export const selectToBeCreatedNodePosition = (state: RootState) =>
  state.graph.toBeCreatedNodePosition;
export const selectNodesInstances = (state: RootState) =>
  state.graph.nodesInstances;
export const selectIsMoveNode = (state: RootState) => state.graph.isMoveNode;

export default graphSlice.reducer;
