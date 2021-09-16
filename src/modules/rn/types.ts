export interface Component {
  version: number;
  hash: string;
  commonHash: string;
  isCommon: boolean;
  componentName: string;
  downloadUrl: string;
  buildTime: number;
}
