import * as React from "react";
import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    maxWidth: "1000px",
  },
  dropdown: {
    width: "100%",
    minWidth: "unset",
    '>.fui-Combobox__input': {
        minWidth: "10px",
    }
  },
  listbox: {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
    zIndex: 9999, // fix overlapping/clipping issues
  },
  option: {
    padding: "10px 16px",
    fontSize: "14px",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#f3f2f1",
    },
    "&[aria-selected='true']": {
      backgroundColor: "#e5f1fb",
      fontWeight: 600,
    },
  },
});