import * as React from "react";
import {
  ComboboxProps,
  FluentProvider,
  Theme,
  Combobox,
  Option,
} from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";
import { useAttributeMetadata } from "./useAttributeMetadata";
import { useStyles } from "./useStyles";

export interface IMetadataPicklistAttributeComponentProps {
  Value: string | undefined;
  OutputFormat: "BOTH" | "LOGICAL_ONLY";
  Context: ComponentFramework.Context<IInputs>;
  Table: string;
  OnValueChanged: (val: string | undefined) => void;
}

export const MetadataPicklistAttributeComponent = React.memo(
  (props: IMetadataPicklistAttributeComponentProps) => {
    const { Value, OutputFormat, Context, Table, OnValueChanged } = props;
    const tableName: string = Table.includes("|") ? Table.split("|")[1] : Table;
    const theme: Theme = Context.fluentDesignLanguage?.tokenTheme as Theme;
    const [isHovered, setIsHovered] = React.useState(false);
    const [value, setValue] = React.useState<string | undefined>();

    const styles = useStyles();
    const { options } = useAttributeMetadata(Context, tableName);

    const selectedOptionValue: string | null | undefined = !Value
      ? undefined
      : Value.includes("|")
        ? Value.split("|")[1]
        : Value;
    
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selectedOptionValue ? [selectedOptionValue] : []);
    const [matchingOptions, setMatchingOptions] = React.useState([...options]);

    React.useEffect(() => { 
      setValue(selectedOptionValue ? options.find(option => option.LogicalName === selectedOptionValue)?.DisplayName : "");
      setSelectedOptions(selectedOptionValue ? [selectedOptionValue] : []);
     }, [Value, Context]);

    React.useEffect(() => {
      setMatchingOptions([...options]);
      if (selectedOptionValue) {
        const selectedOptionFiltered = options.find(
          (option) => option.LogicalName === selectedOptionValue
        );
        if (selectedOptionFiltered) {
          setValue(selectedOptionFiltered.DisplayName);
          setSelectedOptions([selectedOptionFiltered.LogicalName]);
        }
        else {
          setValue("");
          setSelectedOptions([]);
          if (tableName == "NO_TABLE" || options.length > 0)
            OnValueChanged(undefined);
        }
      } else {
        setValue("");
        setSelectedOptions([]);
        OnValueChanged(undefined);
      }
    }, [options]);

    const onChange: ComboboxProps["onChange"] = (event) => {
      const val = event.target.value.trim();
      setValue(val);
      const matches = options.filter((option) => option.DisplayName.toLowerCase().includes(val.toLowerCase()));
      setMatchingOptions(matches);
    };

    const onOptionSelect: ComboboxProps["onOptionSelect"] = (event, data) => {
      const displayName = data.optionValue && data.optionValue == "placeholder" ? "" : options.find((option) => option.LogicalName === data.optionValue)?.DisplayName;
      setSelectedOptions(data.optionValue == "placeholder" ? [] : [data.optionValue].filter((v): v is string => typeof v === "string"));
      setValue(data.optionValue == "placeholder" ? "" : displayName);
      const outputValue = data.optionValue == "placeholder"
        ? undefined
        : OutputFormat === "BOTH"
          ? `${displayName}|${data.optionValue}`
          : data.optionValue;
      OnValueChanged(outputValue);
      if(data.optionValue == "placeholder") {
        setMatchingOptions([...options]);
      }
    };

    return (
      <FluentProvider theme={theme} className={styles.root}>
        <Combobox
          className={styles.dropdown}
          style={{ minWidth: "10px" }}
          onOptionSelect={onOptionSelect}
          onChange={onChange}
          placeholder={isHovered ? "--Select--" : "---"}
          appearance="filled-darker"
          selectedOptions={selectedOptions}
          value={value}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Option key="select-placeholder" value="placeholder">
            --Select--
          </Option>
          {matchingOptions.map((option) => (
            <Option key={option.LogicalName} value={option.LogicalName}>{`${option.DisplayName} (${option.LogicalName})`}</Option>
          ))}
        </Combobox>
      </FluentProvider>
    );
  }
);

MetadataPicklistAttributeComponent.displayName = "MetadataPicklistAttributeComponent";