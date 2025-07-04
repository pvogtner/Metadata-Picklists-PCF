import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import { IAttributeMetadata, IAttributeMetadataResponse, IOption } from "./Interfaces";

export const useAttributeMetadata = (Context: ComponentFramework.Context<IInputs>, tableName: string) => {
    const [options, setOptions] = React.useState<IOption[]>([]);

    React.useEffect(() => {
        const getMetadata: (tableName: string) => Promise<IAttributeMetadataResponse> = async (tableName: string) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const baseUrl: string = (Context as any).page.getClientUrl();
            const customFilter: string | null | undefined = Context.parameters.customFilter?.raw;
            let filter = "AttributeOf eq null";
            switch (customFilter) {
                case "Boolean":
                    filter += " and AttributeType eq 'Boolean'";
                    break;
                case "DateTime":
                    filter += " and AttributeType eq 'DateTime'";
                    break;
                case "Decimal":
                    filter += " and AttributeType eq 'Decimal'";
                    break;
                case "Double":
                    filter += " and AttributeType eq 'Double'";
                    break;
                case "Integer":
                    filter += " and AttributeType eq 'Integer'";
                    break;
                case "String":
                    filter += " and AttributeType eq 'String'";
                    break;
                case "Picklist":
                    filter += " and (AttributeType eq 'Picklist' or AttributeType eq 'State' or AttributeType eq 'Status')";
                    break;
                case "Lookup":
                    filter += " and (AttributeType eq 'Lookup' or AttributeType eq 'Customer' or AttributeType eq 'Owner' or AttributeType eq 'Uniqueidentifier')";
                    break;
                case "Number":
                    filter += " and (AttributeType eq 'Decimal' or AttributeType eq 'Double' or AttributeType eq 'Integer' or AttributeType eq Money)";
                    break;
                default:
                    break;
            };

            const url = `${baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${tableName}')/Attributes?$select=AttributeType,LogicalName,DisplayName&$filter=${filter}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                Accept: "application/json",
                Prefer: 'odata.include-annotations="*"',
                "Content-Type": "application/json; charset=utf-8",
                },
            });
            if (!response.ok) {
                console.log(`HTTP error! status: ${response.status}`);
                return { value: [] } as IAttributeMetadataResponse;
            }
            const data: IAttributeMetadataResponse = await response.json() as IAttributeMetadataResponse;
            return data;
        };

        const fetchMetadata = async () => {
            try {
                const data: IAttributeMetadataResponse = await getMetadata(tableName)
                const dataFiltered: IAttributeMetadata[] = data.value.filter(x => x.DisplayName?.UserLocalizedLabel?.Label)
                const dataSorted: IOption[] = dataFiltered.map((attribute) => ({
                    DisplayName: attribute.DisplayName.UserLocalizedLabel.Label,
                    LogicalName: attribute.LogicalName,
                })).slice().sort((a, b) => a.DisplayName.localeCompare(b.DisplayName));

                setOptions(dataSorted);
            } catch (error) {
                console.log("Error fetching metadata:", error);
            }
        };

        fetchMetadata().then(() => { return; }).catch((error) => { console.log(error); });
    }, [tableName, Context]);

    return { 
        options, 
    };
};