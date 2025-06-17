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
import { useMetadata } from "./useMetadata";
import { useStyles } from "./useStyles";

export interface IMetadataPicklistTableProps {
  Value: string | undefined;
  Context: ComponentFramework.Context<IInputs>;
  OnValueChange: (val: string | undefined) => void;
}

export const MetadataPicklistTableComponent = React.memo(
  (props: IMetadataPicklistTableProps) => {
    const { Value, Context, OnValueChange } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const selectedOptionRaw: string | null = Context.parameters.value.raw;
    const selectedOption: string | null | undefined = selectedOptionRaw ? selectedOptionRaw.split("|")[0] : undefined;
    const selectedOptionValue: string | null | undefined = selectedOptionRaw ? selectedOptionRaw.split("|")[1] : undefined;
    //const showTables: "APPONLY" | "ALLTABLES" = Context.parameters.showTables.raw ?? "APPONLY";
    const theme: Theme = Context.fluentDesignLanguage?.tokenTheme as Theme;
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selectedOptionValue ? [selectedOptionValue] : []);
    const [value, setValue] = React.useState<string | undefined>(selectedOption);
    
    const styles = useStyles();
    const { tables } = useMetadata(Context);
   
    React.useEffect(() => {
      setSelectedOptions(selectedOptionValue ? [selectedOptionValue] : []);
      setValue(selectedOption);
    }, [Value, Context]);

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
