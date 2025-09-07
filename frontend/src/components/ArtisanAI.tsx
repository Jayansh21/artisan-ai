import React, { useState } from 'react';
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Settings, 
  BookOpen,
  BarChart3,
  Bot,
  MapPin,
  Phone,
  Mail,
  Star,
  Calendar,
  ArrowRight,
  Target
} from 'lucide-react';

// Import actual components from their respective folders
import MarketIntelligence from './intelligence/MarketIntelligence';
import SmartNetworking from './networking/CommunicationTemplates';
import BusinessAutomation from './automation/BusinessAutomation';
import {StorytellingDashboard} from './storytelling/StorytellingDashboard';

// Export TabId type for use in other components
export type TabId = 'market-expansion' | 'market-intelligence' | 'smart-networking' | 'business-automation' | 'storytelling';

// Main Market Expansion Analyzer Component
const MarketExpansion: React.FC = () => {
  const [sourceState, setSourceState] = useState('');
  const [targetState, setTargetState] = useState('');
  const [product, setProduct] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [expansionPlan, setExpansionPlan] = useState<any>(null);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const artisanProducts = [
    'Banarasi Silk Sarees', 'Kanchipuram Silk Sarees', 'Handloom Cotton Sarees',
    'Pashmina Shawls', 'Phulkari Dupatta', 'Bandhani Fabrics', 'Ikat Textiles',
    'Chikankari Kurtas', 'Block Print Fabrics', 'Kalamkari Art', 'Madhubani Paintings',
    'Warli Art', 'Tanjore Paintings', 'Pattachitra Art', 'Blue Pottery',
    'Terracotta Items', 'Dhokra Art', 'Brass Handicrafts', 'Wooden Handicrafts',
    'Leather Goods', 'Jute Products', 'Bamboo Crafts', 'Stone Carving',
    'Metal Crafts', 'Jewelry (Temple/Traditional)', 'Embroidered Fabrics',
    'Carpet/Rugs', 'Pottery', 'Glass Work', 'Paper Mache'
  ];

  const analyzeMarket = async () => {
    if (!sourceState || !targetState || !product) {
      alert('Please fill all fields');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      // Mock data - in real implementation, this would come from your API
      const mockMarketData = {
        marketSize: '₹65L annually',
        competition: 'Medium (12 active sellers)',
        demand: 'High (78% year-on-year growth)',
        culturalFit: 87,
        pricePoint: '₹2,500 - ₹8,500',
        seasonality: 'Peak: Oct-Mar (Wedding season)',
        localPartners: 34,
        distributionChannels: 12,
        marketEntry: '6-8 weeks estimated',
        investmentNeeded: '₹25,000 - ₹50,000'
      };

      const mockExpansionPlan = {
        phase1: {
          title: "Market Research & Local Partnerships",
          duration: "2-3 weeks",
          actions: [
            `Connect with 5 local boutique owners in ${targetState}`,
            "Partner with 2 wedding planners in the region",
            "Establish relationships with textile retailers"
          ],
          aiGeneratedContacts: [
            {
              name: "Sunita Boutique",
              owner: "Sunita Sharma", 
              phone: "+91-9876543210",
              location: "Rajpur Road, Dehradun",
              specialty: "Bridal wear",
              aiScore: 94,
              reason: "High customer rating, specializes in South Indian textiles"
            },
            {
              name: "Mountain Wedding Planners",
              owner: "Rajesh Thakur",
              phone: "+91-9876543211", 
              location: "Haridwar",
              specialty: "Destination weddings",
              aiScore: 88,
              reason: "Plans 200+ weddings annually, client base appreciates traditional wear"
            }
          ]
        },
        phase2: {
          title: "Cultural Adaptation & Product Localization",
          duration: "3-4 weeks", 
          actions: [
            `Adapt ${product} styles for ${targetState} climate preferences`,
            "Create regional fusion designs",
            "Develop climate-appropriate fabric combinations"
          ],
          aiInsights: [
            `${targetState} customers prefer specific fabric weights`,
            "Local preference for colors that match regional aesthetics",
            "Demand for traditional items with regional motifs"
          ]
        },
        phase3: {
          title: "Marketing & Brand Positioning",
          duration: "4-6 weeks",
          actions: [
            "Launch regional heritage campaign",
            "Partner with local influencers and cultural centers",
            "Organize exclusive showcases during regional festivals"
          ],
          marketingChannels: [
            "WhatsApp Business groups (15 identified)",
            "Local Facebook communities (8 groups, 45K members)",
            "Temple and cultural event sponsorships"
          ]
        }
      };

      setMarketData(mockMarketData);
      setExpansionPlan(mockExpansionPlan);
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setMarketData(null);
    setExpansionPlan(null);
    setSourceState('');
    setTargetState('');
    setProduct('');
  };

  // Results view
  if (marketData && expansionPlan) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Market Analysis Results</h1>
                  <p className="text-blue-100">{sourceState} → {targetState} | {product}</p>
                </div>
                <button 
                  onClick={resetAnalysis}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  New Analysis
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Market Overview Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-800">Market Size</h3>
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">{marketData.marketSize}</p>
                  <p className="text-green-700 text-sm mt-1">Annual market potential</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-800">Cultural Fit</h3>
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{marketData.culturalFit}%</p>
                  <p className="text-blue-700 text-sm mt-1">Compatibility score</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-purple-800">Investment</h3>
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-purple-900">{marketData.investmentNeeded}</p>
                  <p className="text-purple-700 text-sm mt-1">Initial capital required</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-orange-800">Competition</h3>
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-900">{marketData.competition}</p>
                  <p className="text-orange-700 text-sm mt-1">Market landscape</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl p-6 border border-rose-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-rose-800">Demand</h3>
                    <TrendingUp className="w-6 h-6 text-rose-600" />
                  </div>
                  <p className="text-lg font-bold text-rose-900">{marketData.demand}</p>
                  <p className="text-rose-700 text-sm mt-1">Growth trajectory</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl p-6 border border-cyan-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-cyan-800">Timeline</h3>
                    <Calendar className="w-6 h-6 text-cyan-600" />
                  </div>
                  <p className="text-lg font-bold text-cyan-900">{marketData.marketEntry}</p>
                  <p className="text-cyan-700 text-sm mt-1">Time to market</p>
                </div>
              </div>

              {/* Expansion Plan */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Generated Expansion Plan</h2>
                
                {Object.values(expansionPlan).map((phase: any, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{phase.title}</h3>
                        <p className="text-blue-600 font-medium">{phase.duration}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Key Actions</h4>
                        <ul className="space-y-2">
                          {phase.actions.map((action: string, actionIndex: number) => (
                            <li key={actionIndex} className="flex items-start space-x-2">
                              <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {phase.aiGeneratedContacts && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">AI-Generated Contacts</h4>
                          <div className="space-y-3">
                            {phase.aiGeneratedContacts.map((contact: any, contactIndex: number) => (
                              <div key={contactIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-medium text-gray-800">{contact.name}</h5>
                                    <p className="text-sm text-gray-600">{contact.owner}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                      <span className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{contact.location}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Phone className="w-3 h-3" />
                                        <span>{contact.phone}</span>
                                      </span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2">{contact.reason}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span className="font-semibold text-sm">{contact.aiScore}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500">AI Match</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.aiInsights && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">AI Insights</h4>
                          <ul className="space-y-2">
                            {phase.aiInsights.map((insight: string, insightIndex: number) => (
                              <li key={insightIndex} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <span className="text-gray-700 text-sm">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {phase.marketingChannels && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Marketing Channels</h4>
                          <ul className="space-y-2">
                            {phase.marketingChannels.map((channel: string, channelIndex: number) => (
                              <li key={channelIndex} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <span className="text-gray-700 text-sm">{channel}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input form view
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Expansion Analyzer</h2>
          <p className="text-lg text-gray-600">
            Discover new markets with AI-powered insights and expansion planning
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h3 className="text-xl font-bold text-white">Market Analysis Setup</h3>
            <p className="text-blue-100 mt-1">Configure your market expansion parameters</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Current State/Region
                  </label>
                  <select
                    value={sourceState}
                    onChange={(e) => setSourceState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select your state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Market State
                  </label>
                  <select
                    value={targetState}
                    onChange={(e) => setTargetState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select target state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Product/Craft
                  </label>
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select your product</option>
                    {artisanProducts.map(prod => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={analyzeMarket}
                  disabled={!sourceState || !targetState || !product || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing Market...</span>
                    </div>
                  ) : (
                    'Generate Expansion Plan'
                  )}
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">What You'll Get:</h4>
                <ul className="space-y-3">
                  {[
                    'Market size and demand analysis',
                    'Cultural fit assessment',
                    'Competition landscape overview',
                    'AI-generated contact list of potential partners',
                    'Step-by-step expansion roadmap',
                    'Investment requirements & timeline',
                    'Regional marketing strategies',
                    'Cultural adaptation recommendations'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="bg-blue-600 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Tab {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  {
    id: 'market-expansion',
    name: 'Market Expansion',
    icon: TrendingUp,
    component: MarketExpansion,
  },
  {
    id: 'market-intelligence',
    name: 'Market Intelligence',
    icon: Brain,
    component: MarketIntelligence,
  },
  {
    id: 'smart-networking',
    name: 'Smart Networking',
    icon: Users,
    component: SmartNetworking,
  },
  {
    id: 'business-automation',
    name: 'Business Automation',
    icon: Settings,
    component: BusinessAutomation,
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: BookOpen,
    component: StorytellingDashboard,
  },
];

const ArtisanAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('market-expansion');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MarketExpansion;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">ArtisanAI</h1>
                  <p className="text-sm text-gray-500">Intelligent Business Growth Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Notifications</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default ArtisanAI;