// frontend/src/services/marketService.ts
import api from './api';

export interface MarketAnalysisRequest {
  sourceState: string;
  targetState: string;
  product: string;
  monthlyRevenue: string;
}

export const marketService = {
  analyzeMarket: async (data: MarketAnalysisRequest) => {
    const response = await api.post('/market/analyze', data);
    return response.data;
  },

  getMarketTrends: async () => {
    // Mock data for development
    return [
      {
        id: 1,
        trend: "Banarasi sarees demand up 45% in Delhi NCR",
        type: "trending",
        color: "red"
      },
      {
        id: 2, 
        trend: "Dhokra art gaining popularity in Bangalore (67% increase)",
        type: "trending",
        color: "blue"
      },
      {
        id: 3,
        trend: "Wedding season approaching - jewelry demand rising",
        type: "seasonal",
        color: "purple"
      }
    ];
  },

  getRegionalPreferences: async () => {
    return [
      { region: "North India", preference: "Heavy fabrics, Gold work" },
      { region: "West India", preference: "Mirror work, Bright colors" },
      { region: "East India", preference: "Handloom, Traditional motifs" }
    ];
  },

  getPriceIntelligence: async () => {
    return [
      { category: "Silk Sarees (Premium)", range: "₹8,000 - ₹25,000" },
      { category: "Cotton Handloom", range: "₹2,500 - ₹8,000" },
      { category: "Festival Collections", range: "+30% premium" }
    ];
  }
};
export {}

export {}
