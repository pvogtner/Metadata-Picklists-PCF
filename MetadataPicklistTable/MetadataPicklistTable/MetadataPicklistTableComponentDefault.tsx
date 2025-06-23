import * as React from "react";
import {
  Dropdown,
  Option,
  FluentProvider,
  Theme,
  SelectionEvents,
  OptionOnSelectData,
  Input,
} from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";
import { useMetadata } from "./useMetadata";
import { useStyles } from "./useStyles";

export interface IMetadataPicklistTableProps {
  Value: string | undefined;
  OutputFormat: "BOTH" | "LOGICAL_ONLY";
  Context: ComponentFramework.Context<IInputs>;
  OnValueChange: (val: string | undefined) => void;
}

export const MetadataPicklistTableComponent = React.memo(
  (props: IMetadataPicklistTableProps) => {
    const { Value, Context, OnValueChange } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [value, setValue] = React.useState<string | undefined>(undefined);
    const theme: Theme = Context.fluentDesignLanguage?.tokenTheme as Theme;

    const styles = useStyles();
    const { tables } = useMetadata(Context);

    const selectedLogicalName: string | undefined = !Value 
      ? undefined 
      : Value.includes("|") 
        ? Value.split("|")[1] 
        : Value;

    React.useEffect(() => {
      if (tables.length === 0)
        return;
      
      const displayName = tables.find(table => table.LogicalName === selectedLogicalName)?.DisplayName.UserLocalizedLabel.Label;
      setSelectedOptions(selectedLogicalName ? [selectedLogicalName] : []);
      setValue(displayName);
    }, [tables, Value]);

    const onOptionSelect= (ev: SelectionEvents, data: OptionOnSelectData) => {
      setSelectedOptions(data.optionValue == "placeholder" ? [] : [data.optionValue].filter((v): v is string => typeof v === "string"));
      setValue(data.optionValue == "placeholder" ? undefined : data.optionText);
      const outputValue = data.optionValue == "placeholder" 
        ? undefined 
        : props.OutputFormat === "BOTH"
          ? `${data.optionText}|${data.optionValue}` 
          : data.optionValue;
      OnValueChange(outputValue);
    };

    return value || !Value ? (
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
          ).map((table) => (
            <Option
              key={table.LogicalName}
              className={styles.option}
              value={table.LogicalName}
            >
              {table.DisplayName.UserLocalizedLabel.Label}
            </Option>
          ))}
        </Dropdown>
      </FluentProvider>
    ) : (
      <Input appearance="filled-darker" className={styles.root} placeholder="---"></Input>
    );
  }
);

MetadataPicklistTableComponent.displayName = "MetadataPicklistTableComponent";
