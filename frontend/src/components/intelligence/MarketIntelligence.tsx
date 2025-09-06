// frontend/src/components/intelligence/MarketIntelligence.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Users, MapPin, Clock, IndianRupee, AlertTriangle, Star } from 'lucide-react';

interface MarketTrend {
  id: number;
  trend: string;
  type: 'trending' | 'seasonal' | 'opportunity';
  color: string;
  growth: string;
  region: string;
}

interface RegionalInsight {
  region: string;
  demand: string;
  competition: string;
  priceRange: string;
  seasonality: string;
  opportunities: string[];
}

interface PriceAlert {
  product: string;
  region: string;
  currentPrice: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  alert: 'high' | 'medium' | 'low';
}

const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'insights' | 'pricing' | 'recommendations'>('trends');
  const [loading, setLoading] = useState(false);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [regionalInsights, setRegionalInsights] = useState<RegionalInsight[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  const fetchMarketIntelligence = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMarketTrends([
        {
          id: 1,
          trend: "Banarasi sarees demand up 45% in Delhi NCR",
          type: "trending",
          color: "red",
          growth: "+45%",
          region: "Delhi NCR"
        },
        {
          id: 2,
          trend: "Dhokra art gaining popularity in Bangalore",
          type: "opportunity",
          color: "blue",
          growth: "+67%",
          region: "Karnataka"
        },
        {
          id: 3,
          trend: "Wedding season approaching - jewelry demand rising",
          type: "seasonal",
          color: "purple",
          growth: "+30%",
          region: "Pan India"
        },
        {
          id: 4,
          trend: "Handloom cotton gaining traction in metros",
          type: "trending",
          color: "green",
          growth: "+23%",
          region: "Mumbai, Chennai"
        }
      ]);

      setRegionalInsights([
        {
          region: "Uttarakhand",
          demand: "High for traditional wear during wedding season",
          competition: "Medium - 12 active sellers",
          priceRange: "₹2,500 - ₹8,500",
          seasonality: "Peak: Oct-Mar",
          opportunities: ["Destination wedding market", "Temple town retail", "Tourist souvenir market"]
        },
        {
          region: "Punjab",
          demand: "Strong demand for Phulkari and heavy fabrics",
          competition: "High - 25 active sellers",
          priceRange: "₹3,000 - ₹12,000",
          seasonality: "Peak: Nov-Feb, Apr-May",
          opportunities: ["Export potential", "Diaspora market", "Festival collections"]
        },
        {
          region: "Gujarat",
          demand: "Growing interest in South Indian textiles",
          competition: "Low - 8 active sellers",
          priceRange: "₹2,000 - ₹9,000",
          seasonality: "Year-round with Navratri peak",
          opportunities: ["Business community events", "Cultural fusion designs", "Corporate gifting"]
        }
      ]);

      setPriceAlerts([
        {
          product: "Kanchipuram Silk Sarees",
          region: "Delhi",
          currentPrice: "₹8,500",
          trend: "up",
          change: "+12%",
          alert: "high"
        },
        {
          product: "Cotton Handloom",
          region: "Mumbai",
          currentPrice: "₹3,200",
          trend: "stable",
          change: "+2%",
          alert: "low"
        },
        {
          product: "Temple Jewelry",
          region: "Bangalore",
          currentPrice: "₹5,800",
          trend: "down",
          change: "-8%",
          alert: "medium"
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'seasonal':
        return <Clock className="w-4 h-4" />;
      case 'opportunity':
        return <Star className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getTrendColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'bg-red-50 border-red-200 text-red-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getPriceAlertColor = (alert: string) => {
    switch (alert) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const renderTrends = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Market Trends</h3>
        <button 
          onClick={fetchMarketIntelligence}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading market trends...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {marketTrends.map((trend) => (
            <div
              key={trend.id}
              className={`p-4 rounded-lg border ${getTrendColor(trend.color)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getTrendIcon(trend.type)}
                  <div>
                    <p className="font-medium">{trend.trend}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm opacity-75">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{trend.region}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{trend.growth}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  trend.type === 'trending' ? 'bg-red-100 text-red-800' :
                  trend.type === 'seasonal' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {trend.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Regional Insights</h3>
      <div className="grid gap-6">
        {regionalInsights.map((insight, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="text-xl font-semibold text-gray-800">{insight.region}</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Demand</p>
                  <p className="text-gray-800">{insight.demand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Competition Level</p>
                  <p className="text-gray-800">{insight.competition}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Price Range</p>
                  <p className="text-gray-800 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {insight.priceRange}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Seasonality</p>
                  <p className="text-gray-800">{insight.seasonality}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Market Opportunities</p>
              <div className="flex flex-wrap gap-2">
                {insight.opportunities.map((opp, oppIndex) => (
                  <span
                    key={oppIndex}
                    className="px-3 py-1 bg-blue-50 text-blue-800 text-sm rounded-full border border-blue-200"
                  >
                    {opp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Price Intelligence & Alerts</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 hours ago</span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {priceAlerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getPriceAlertColor(alert.alert)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="font-medium">{alert.product}</p>
                  <p className="text-sm opacity-75">{alert.region}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-lg">{alert.currentPrice}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <span className={`flex items-center ${
                    alert.trend === 'up' ? 'text-red-600' :
                    alert.trend === 'down' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${
                      alert.trend === 'down' ? 'transform rotate-180' : ''
                    }`} />
                    {alert.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Pricing Recommendations</h4>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• Consider reducing prices by 5-8% in high-competition markets</li>
          <li>• Premium pricing opportunity in Uttarakhand (low competition)</li>
          <li>• Festival season pricing can be 20-30% higher than regular</li>
          <li>• Bundle offerings work well in Gujarat market</li>
        </ul>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">AI-Powered Recommendations</h3>
      
      <div className="grid gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">High Priority Actions</h4>
          </div>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2"></span>
              <span>Enter Uttarakhand market immediately - low competition, high demand</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2"></span>
              <span>Launch wedding collection before October peak season</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2"></span>
              <span>Partner with destination wedding planners in hill stations</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">Medium Priority</h4>
          </div>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></span>
              <span>Explore Gujarat market with cultural fusion designs</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></span>
              <span>Develop corporate gifting packages for festival season</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">Long-term Opportunities</h4>
          </div>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
              <span>Build online presence for metro customers seeking authentic handloom</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
              <span>Establish supply chain in Punjab for export opportunities</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Intelligence</h2>
        <p className="text-gray-600">Real-time market insights and AI-powered recommendations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'trends', label: 'Market Trends', icon: TrendingUp },
          { key: 'insights', label: 'Regional Insights', icon: MapPin },
          { key: 'pricing', label: 'Price Intelligence', icon: IndianRupee },
          { key: 'recommendations', label: 'AI Recommendations', icon: Star }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'pricing' && renderPricing()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
};

export default MarketIntelligence;