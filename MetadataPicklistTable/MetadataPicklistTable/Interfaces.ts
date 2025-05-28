export interface ITableMetadataResponse {
  value: ITableMetadata[];
}

export interface ITableMetadata {
  LogicalName: string;
  DisplayName: IDisplayName;
  MetadataId: string;
}

export interface IDisplayName {
  LocalizedLabels: IUserLocalizedLabel[];
  UserLocalizedLabel: IUserLocalizedLabel;
}

export interface IUserLocalizedLabel {
  Label: string;
  LanguageCode: number;
  MetadataId: string;
  HasChanged: boolean | null;
  IsManaged: boolean | null;
}

export interface IOption {
  children: string;
  value: string;
  filterText: string;
}