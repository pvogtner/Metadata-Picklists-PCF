import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { MetadataPicklistTableComponent, IMetadataPicklistTableProps } from "./MetadataPicklistTableComponentDefault";
import * as React from "react";

export class MetadataPicklistTable implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private outputValue: string | undefined;

    
    constructor() { /** Empty Constructor */ }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    private onChange = (value: string | undefined): void => {
        this.outputValue = value;
        this.notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IMetadataPicklistTableProps = { 
            Context: this.context, 
            OnValueChange: this.onChange
        };
        return React.createElement(MetadataPicklistTableComponent, props);
    }

    public getOutputs(): IOutputs {
        return { value: this.outputValue };
    }

    
    public destroy(): void { /** Empty Destroy */ }
}
