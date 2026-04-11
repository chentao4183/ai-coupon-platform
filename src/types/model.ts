export interface ModelCompany {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  website: string;
  country: string;
  description: string;
  founded?: string;
}

export interface ModelVersion {
  id: string;
  versionName: string;
  versionCode: string;
  contextLength: number;
  maxOutputTokens: number;
  trainingCutoff: string;
  capabilities: string[];
  releasedAt: string;
  isLatest: boolean;
  multimodal: boolean;
}

export interface PricingPlan {
  id: string;
  versionId: string;
  name: string;
  planType: 'subscription' | 'pay-per-use' | 'enterprise';
  pricing: {
    amount: number;
    currency: string;
    period: string;
  };
  priceDetails?: {
    inputPrice: number;   // per 1M tokens
    outputPrice: number;  // per 1M tokens
    cacheInputPrice?: number;
    currency: string;
  };
  limits: {
    requestsPerHour?: number;
    requestsPerDay?: number;
    tokensPerMonth?: number;
    features: string[];
    restrictions: string[];
  };
  discount?: {
    type: string;
    value: number;
    description: string;
    validUntil?: string;
  };
  popular: boolean;
}

export interface Model {
  id: string;
  name: string;
  nameEn: string;
  companyId: string;
  logo: string;
  website: string;
  description: string;
  longDescription: string;
  capabilities: string[];
  scenarios: string[];
  versions: ModelVersion[];
  pricingPlans: PricingPlan[];
  tags: string[];
  featured: boolean;
  active: boolean;
  order: number;
  compliance?: string[];
  privateDeployment?: string;
  free?: boolean;
}

export interface ModelData {
  companies: ModelCompany[];
  models: Model[];
}
