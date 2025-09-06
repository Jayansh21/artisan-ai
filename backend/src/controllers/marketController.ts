// backend/src/controllers/marketController.ts
import { Request, Response } from 'express';
import { MarketAnalysisService } from '../services/marketAnalysisService';
import { ContactDiscoveryService } from '../services/contactDiscoveryService';

const marketService = new MarketAnalysisService();
const contactService = new ContactDiscoveryService();

export const analyzeMarket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceState, targetState, product, monthlyRevenue } = req.body;
    
    if (!sourceState || !targetState || !product) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const analysis = await marketService.analyzeMarket(sourceState, targetState, product);
    const expansionPlan = await generateExpansionPlan(sourceState, targetState, product);
    
    res.status(200).json({
      marketData: analysis,
      expansionPlan,
      success: true
    });
  } catch (error) {
    console.error('Market analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze market' });
  }
};

const generateExpansionPlan = async (sourceState: string, targetState: string, product: string) => {
  const contacts = await contactService.findContacts(targetState, 'retailer', product);
  
  return {
    phase1: {
      title: "Market Research & Local Partnerships",
      duration: "2-3 weeks",
      actions: [
        `Connect with ${Math.floor(Math.random() * 3) + 3} local boutique owners in ${targetState}`,
        "Partner with 2 wedding planners in the region",
        "Establish relationships with textile retailers"
      ],
      aiGeneratedContacts: contacts.slice(0, 2)
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
};