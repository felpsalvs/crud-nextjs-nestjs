export interface AdditionalInfo {
  features: string[];
  benefits: string[];
  targetAudience: string;
  other: Record<string, string>;
}

export interface AIResponseData {
  description: string;
  suggestedPrice: number;
  additionalInfo: AdditionalInfo;
}

export type AIServiceResponse = {
  success: boolean;
  data: AIResponseData;
  error?: string;
};
