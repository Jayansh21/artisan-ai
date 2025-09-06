import { useState, useEffect } from "react";

// Define your interfaces (adjust according to your actual types)
interface MarketTrend {
  id: string;
  name: string;
  // add other properties
}

interface RegionalPreference {
  id: string;
  region: string;
  // add other properties
}

interface PriceIntelligence {
  id: string;
  price: number;
  // add other properties
}

export const useMarketData = () => {
  // ✅ Correctly typed useState hooks
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [regionalPreferences, setRegionalPreferences] = useState<RegionalPreference[]>([]);
  const [priceIntelligence, setPriceIntelligence] = useState<PriceIntelligence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Explicitly returns a Promise<void>
    const fetchData = async (): Promise<void> => {
      try {
        // Mock data for now — replace with real service calls
        const trends: MarketTrend[] = []; 
        const preferences: RegionalPreference[] = [];
        const pricing: PriceIntelligence[] = [];

        setMarketTrends(trends);
        setRegionalPreferences(preferences);
        setPriceIntelligence(pricing);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    marketTrends,
    regionalPreferences,
    priceIntelligence,
    loading,
  };
};
