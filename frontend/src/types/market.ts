export interface MarketTrend {
  id: number;
  name: string;
  value: number;
}

export interface RegionalPreference {
  region: string;
  preference: string;
}

export interface PriceIntelligence {
  productId: number;
  price: number;
}
