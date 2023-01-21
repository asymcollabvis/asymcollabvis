import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentState } from "../../common/message_pb";
import { RootState } from "../../store";

export type DocInfo = {
  id: string;
  title: string;
  fileName: string;
  author?: string;
  date?: string;
};

// Define a type for the slice state
interface DocumentSliceState {
  documentId: number;
  selectedText: string;
  documentState?: DocumentState;
  documents: DocInfo[];
  selectedTextFrom: number;
}

// Define the initial state using that type
const initialState: DocumentSliceState = {
  documentId: 0,
  selectedText: "",
  documents: [],
  selectedTextFrom: -1,
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocumentId(state, action: PayloadAction<number>) {
      state.documentId = action.payload;
    },
    setSelectedText(
      state,
      action: PayloadAction<{
        text: string;
        from: number;
      }>
    ) {
      // console.log(state.selectedText);
      const { text, from } = action.payload;

      state.selectedText = text;
      state.selectedTextFrom = from;
    },
    setDocumentState(state, action: PayloadAction<DocumentState>) {
      state.documentState = action.payload;
    },
    setDocInfos(state, action: PayloadAction<DocInfo[]>) {
      state.documents = action.payload;
    },
  },
});

export const { setDocumentId, setSelectedText, setDocumentState, setDocInfos } =
  documentSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDocumentId = (state: RootState) => state.document.documentId;
export const selectSelectedText = (state: RootState) =>
  state.document.selectedText;
export const selectDocumentState = (state: RootState) =>
  state.document.documentState;
export const selectSelectedTextFrom = (state: RootState) =>
  state.document.selectedTextFrom;
export const selectDocuments = (state: RootState) => state.document.documents;

export default documentSlice.reducer;
