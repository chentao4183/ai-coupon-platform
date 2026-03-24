export interface Platform {
  id: string;
  name: string;
  logo: string;
  discount: string;
  affiliateUrl: string;
  description: string;
  clicks: number;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

declare global {
  interface Window {
    editPlatform: (platform: Platform) => void;
    deletePlatform: (id: string) => void;
  }
}
