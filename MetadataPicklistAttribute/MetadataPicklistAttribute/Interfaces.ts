export interface IMetadata {
  LogicalName: string;
  DisplayName: IDisplayName;
  MetadataId: string;
}

export interface IAttributeMetadata extends IMetadata {
    AttributeType: string;
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
    DisplayName: string;
    LogicalName: string;
}

export interface IAttributeMetadataResponse {
    value: IAttributeMetadata[];
}