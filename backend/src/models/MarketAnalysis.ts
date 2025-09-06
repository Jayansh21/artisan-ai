// backend/src/models/MarketAnalysis.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketAnalysis extends Document {
  userId: string;
  sourceState: string;
  targetState: string;
  product: string;
  analysisResults: {
    marketSize: string;
    competition: string;
    demand: string;
    culturalFit: number;
    pricePoint: string;
    seasonality: string;
    localPartners: number;
    distributionChannels: number;
    marketEntry: string;
    investmentNeeded: string;
  };
  expansionPlan: any;
  createdAt: Date;
  updatedAt: Date;
}

const MarketAnalysisSchema: Schema = new Schema({
  userId: { type: String, required: true },
  sourceState: { type: String, required: true },
  targetState: { type: String, required: true }, 
  product: { type: String, required: true },
  analysisResults: {
    marketSize: String,
    competition: String,
    demand: String,
    culturalFit: Number,
    pricePoint: String,
    seasonality: String,
    localPartners: Number,
    distributionChannels: Number,
    marketEntry: String,
    investmentNeeded: String
  },
  expansionPlan: Schema.Types.Mixed
}, {
  timestamps: true
});

export default mongoose.model<IMarketAnalysis>('MarketAnalysis', MarketAnalysisSchema);