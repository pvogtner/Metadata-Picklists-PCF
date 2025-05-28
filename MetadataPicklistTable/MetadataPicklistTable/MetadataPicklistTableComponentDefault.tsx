import * as React from "react";
import {
  Dropdown,
  Option,
  makeStyles,
  FluentProvider,
  Theme,
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";
import { IOption } from "./Interfaces";
import { useMetadata } from "./useMetadata";

export interface IMetadataPicklistTableProps {
  Context: ComponentFramework.Context<IInputs>;
  OnValueChange: (val: string | undefined) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    maxWidth: "1000px",
  },
  dropdown: {
    width: "100%",
    minWidth: "10px",
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

export const MetadataPicklistTableComponent = React.memo(
  (props: IMetadataPicklistTableProps) => {
    const { Context, OnValueChange } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const selectedOptionRaw: string | null = Context.parameters.value.raw;
    const selectedOption: string | null | undefined = selectedOptionRaw ? selectedOptionRaw.split("|")[0] : undefined;
    const selectedOptionValue: string | null | undefined = selectedOptionRaw ? selectedOptionRaw.split("|")[1] : undefined;
    //const showTables: "APPONLY" | "ALLTABLES" = Context.parameters.showTables.raw ?? "APPONLY";
    const theme: Theme = Context.fluentDesignLanguage?.tokenTheme as Theme;
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selectedOptionValue ? [selectedOptionValue] : []);
    const [value, setValue] = React.useState<string | undefined>(selectedOption);
    
    console.log("selectedOptionValue", selectedOptionValue);
    console.log("selectedOption", selectedOption);

    const styles = useStyles();

    const { tables } = useMetadata(Context);
    console.log("tables", tables);

    const onOptionSelect= (ev: SelectionEvents, data: OptionOnSelectData) => {
      setSelectedOptions(data.optionValue == "placeholder" ? [] : [data.optionValue].filter((v): v is string => typeof v === "string"));
      setValue(data.optionValue == "placeholder" ? undefined : data.optionText);
      OnValueChange(data.optionValue != "placeholder" ? `${data.optionText}|${data.optionValue}` : undefined);
    };

    return (
      <FluentProvider theme={theme} className={styles.root}>
        <Dropdown
          className={styles.dropdown}
          placeholder={isHovered ? "--Select--" : "---"}
          appearance="filled-darker"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          value={value}
          onOptionSelect={onOptionSelect}
          selectedOptions={selectedOptions}
        >
          <Option key="select-placeholder" className={styles.option} value="placeholder">
            --Select--
          </Option>
          {tables.slice().sort((a, b) =>
            a.DisplayName.UserLocalizedLabel.Label.localeCompare(b.DisplayName.UserLocalizedLabel.Label)
          ).map((table, i) => (
            <Option
              key={i}
              className={styles.option}
              value={table.LogicalName}
            >
              {table.DisplayName.UserLocalizedLabel.Label}
            </Option>
          ))}
        </Dropdown>
      </FluentProvider>
    );
  }
);

MetadataPicklistTableComponent.displayName = "MetadataPicklistTableComponent";
