export interface Version {
  version: number;
  hash?: string;
  commonHash: string;
  isCommon: boolean;
  componentName?: string;
  buildTime: number;
}

export interface InsertComponent {
  version: number;
  hash: string;
  commonHash: string;
  isCommon: boolean;
  componentName: string;
  downloadUrl: string;
  buildTime: number;
}
