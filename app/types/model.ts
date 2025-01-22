import type { ModelInfo } from '~/lib/modules/llm/types';

export type ProviderInfo = {
  staticModels: ModelInfo[];
  name: string;
  getDynamicModels?: (
    apiKeys?: Record<string, string>,
    providerSettings?: IProviderSetting,
    serverEnv?: Record<string, string>
  ) => Promise<ModelInfo[]>;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
  icon?: string;
  baseUrl?: string;
  apiKey?: string;
};

export interface IProviderSetting {
  enabled?: boolean;
  baseUrl?: string;
}

export type IProviderConfig = ProviderInfo & {
  settings: IProviderSetting;
};
