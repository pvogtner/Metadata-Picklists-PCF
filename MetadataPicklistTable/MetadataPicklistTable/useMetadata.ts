/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import { ITableMetadataResponse, ITableMetadata } from "./Interfaces";

type RetrieveMultipleResponse = ComponentFramework.WebApi.RetrieveMultipleResponse;
type Entity = ComponentFramework.WebApi.Entity;

export const useMetadata = (Context: ComponentFramework.Context<IInputs>) => {
    const [tables, setTables] = React.useState<ITableMetadata[]>([]);
    const TableList: "APPONLY" | "ALLTABLES" = Context.parameters.showTables.raw ?? "APPONLY";

    React.useEffect(() => {
        const getAppId: () => string | null = () => {
            return new URLSearchParams(window.location.search).get("appid");
        };

        const getAppUniqueId: (appId: string) => Promise<string> = async (appId: string) => {
            const appModule: Entity = await Context.webAPI.retrieveRecord("appmodule", appId, "?$select=appmoduleidunique");
            return appModule.appmoduleidunique as string;
        };

        const getAppTableIds: (appUniqueId: string) => Promise<string[]> = async (appUniqueId: string) => {
            const tables: RetrieveMultipleResponse = await Context.webAPI.retrieveMultipleRecords("appmodulecomponent", `?$select=objectid,componenttype&$filter=(_appmoduleidunique_value eq ${appUniqueId} and componenttype eq 1)`);
            return tables.entities
                .map((table: Entity) => table.objectid)
                .filter((id): id is string => typeof id === "string");
        };

        const getAppTables: (ids: string[]) => Promise<string[]> = async (ids: string[]) => {
            let filter = "";
            ids.forEach((id: string, index: number) => {
                filter += `entityid eq ${id}`;
                if (index < ids.length - 1) {
                    filter += " or ";
                }
            });

            const tables: RetrieveMultipleResponse = await Context.webAPI.retrieveMultipleRecords("entity", `?$select=logicalname&$filter=(${filter})`);
            return tables.entities
                .map((table: Entity) => table.logicalname)
                .filter((id): id is string => typeof id === "string");
        };

        const getMetadata: () => Promise<ITableMetadataResponse> = async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const baseUrl: string = (Context as any).page.getClientUrl();
            const url = `${baseUrl}/api/data/v9.2/EntityDefinitions?$select=LogicalName,DisplayName&$filter=IsValidForAdvancedFind eq true and IsCustomizable/Value eq true`;
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ITableMetadataResponse = await response.json() as ITableMetadataResponse;
            return data;
        };

        const getTablesForDropdown: () => Promise<void> = async () => {
            const appId: string | null = getAppId();
            
            if (TableList === "APPONLY") {
                if (appId === null) {
                    console.error("App ID not found in URL parameters.");
                    return void 0;
                }

                const appUniqueId: string = await getAppUniqueId(appId);
                const appTableIds: string[] = await getAppTableIds(appUniqueId);
                const appTablesList: string[] = await getAppTables(appTableIds);
                const metadataTables: ITableMetadataResponse = await getMetadata();
                const filteredTables: ITableMetadata[] = metadataTables.value.filter((table: ITableMetadata) =>
                    appTablesList.includes(table.LogicalName)
                );
                const filteredTablesSorted: ITableMetadata[] = filteredTables.sort((a: ITableMetadata, b: ITableMetadata) => a.LogicalName.localeCompare(b.LogicalName));
                console.log("Filtered Tables: ", filteredTablesSorted);
                setTables(filteredTablesSorted);
            }
            else if (TableList === "ALLTABLES") {
                const metadataTables: ITableMetadataResponse = await getMetadata();
                const filteredTables: ITableMetadata[] = metadataTables.value.sort((a: ITableMetadata, b: ITableMetadata) => a.LogicalName.localeCompare(b.LogicalName));
                console.log("All Tables: ", filteredTables);
                setTables(filteredTables);
            }
        };

        getTablesForDropdown().then(() => { return; }).catch((error) => { console.log(error); });
    }, []);

    return {
        tables,
    };
};
