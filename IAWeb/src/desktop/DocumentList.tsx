import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "../hooks";
import useDocumentList from "../features/document/useDocumentList";
import { setDocumentId } from "../features/document/documentSlice";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 10 },
  { field: "title", headerName: "Title", width: 300 },
  //   { field: "author", headerName: "Author" },
  //   { field: "date", headerName: "Date" },
  { field: "using", headerName: "Using" },
];
export default function DocumentDisplayList() {
  console.log("DocumentDisplayList");

  const documents = useDocumentList();
  const dispatch = useAppDispatch();

  //   console.log(documents.slice(0, 10));

  return (
    <div
      style={{
        height: 300,
        width: "100%",
        paddingRight: "8px",
        paddingLeft: "8px",
      }}
    >
      <DataGrid
        density={"compact"}
        rows={[...documents]}
        columns={columns}
        pageSize={10}
        onSelectionModelChange={(itm) => dispatch(setDocumentId(itm[0]))}
      />
    </div>
  );
}
