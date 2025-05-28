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
  Context: ComponentFramework.Context<IInputs>;
  Table: string;
  OnValueChanged: (val: string | undefined) => void;
}

export const MetadataPicklistAttributeComponent = React.memo(
  (props: IMetadataPicklistAttributeComponentProps) => {
    const { Context, Table, OnValueChanged } = props;
    const tableName: string = Table.includes("|") ? Table.split("|")[1] : Table;

    const selectedOptionRaw: string | null = Context.parameters.value.raw;
    const selectedOptionValue: string | null | undefined = selectedOptionRaw ? selectedOptionRaw.split("|")[1] : undefined;
    const theme: Theme = Context.fluentDesignLanguage?.tokenTheme as Theme;
    
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selectedOptionValue ? [selectedOptionValue] : []);
    const [isHovered, setIsHovered] = React.useState(false);
    const [value, setValue] = React.useState<string | undefined>();

    const styles = useStyles();
    const { options } = useAttributeMetadata(Context, tableName);

    console.log("OPTIONS: ", options);
    const [matchingOptions, setMatchingOptions] = React.useState([...options]);

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

    //const [customSearch, setCustomSearch] = React.useState<string | undefined>();

    const onChange: ComboboxProps["onChange"] = (event) => {
      const val = event.target.value.trim();
      setValue(val);
      const matches = options.filter((option) => option.DisplayName.toLowerCase().includes(val.toLowerCase()));
      setMatchingOptions(matches);
      // if (val.length && matches.length < 1) {
      //   setCustomSearch(val);
      // } else {
      //   setCustomSearch(undefined);
      // }
    };

    const onOptionSelect: ComboboxProps["onOptionSelect"] = (event, data) => {
      const matchingOption =
        data.optionText &&
        options.some((option) => option.DisplayName.includes(data.optionText!));
      // if (matchingOption) {
      //   setCustomSearch(undefined);
      // } else {
      //   setCustomSearch(data.optionText);
      // }
      setSelectedOptions(data.optionValue == "placeholder" ? [] : [data.optionValue].filter((v): v is string => typeof v === "string"));
      setValue(data.optionValue == "placeholder" ? "" : data.optionText);
      OnValueChanged(data.optionValue == "placeholder" || !data.optionText ? undefined : `${data.optionText}|${data.optionValue}`);
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
          {/* {customSearch ? (
            <Option key="freeform" text={customSearch}>
              No Attributes for "{customSearch}"
            </Option>
          ) : null} */}
          <Option key="select-placeholder" value="placeholder">
            --Select--
          </Option>
          {matchingOptions.map((option) => (
            <Option key={option.LogicalName} value={option.LogicalName}>{option.DisplayName}</Option>
          ))}
        </Combobox>
      </FluentProvider>
    );
  }
);

MetadataPicklistAttributeComponent.displayName = "MetadataPicklistAttributeComponent";