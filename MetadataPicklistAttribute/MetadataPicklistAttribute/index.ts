import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { MetadataPicklistAttributeComponent, IMetadataPicklistAttributeComponentProps } from "./MetadataPicklistAttributeComponent";
import * as React from "react";

export class MetadataPicklistAttribute implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;
    private outputValue: string | undefined;

    constructor() { /* Empty constructor. */ }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this._context = context;
    }

    private onChange = (value: string | undefined): void => {
        this.outputValue = value;
        this.notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IMetadataPicklistAttributeComponentProps = { 
            Value: context.parameters.value.raw ?? undefined,
            OutputFormat: context.parameters.outputFormat.raw ?? "BOTH",
            Context: this._context,
            Table: context.parameters.tableName.raw ?? "NO_TABLE",
            OnValueChanged: this.onChange
        };
        return React.createElement(MetadataPicklistAttributeComponent, props);
    }

    public getOutputs(): IOutputs {
        return { value: this.outputValue };
    }

    public destroy(): void { /* Empty on destroy. */ }
}
