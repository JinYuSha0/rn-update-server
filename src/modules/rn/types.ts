export interface Component {
  platform: string;
  version: number;
  hash: string;
  commonHash: string;
  componentName: string;
  componentType: number;
  downloadUrl: string;
  buildTime: number;
}
