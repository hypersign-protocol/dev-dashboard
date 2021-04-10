import mongoose,  { Schema, Document } from 'mongoose';

export interface IPricing extends Document{
    planName: string; 
    planId: string;
    planPrice: string;
    planDescription: string;
    offerings: string;
    maxAppsCount: number;
    maxAuthCount: number;
    supportType: string;
}

const ApplicationSchema =  new Schema({
    planName: { type: String, required: true } ,
    planId: { type: String, required: true, unique: true } ,
    planPrice: { type: String, required: true } ,
    planDescription: { type: String, required: true } ,
    offerings: { type: String } ,
    maxAppsCount: { type: Number, required: true },
    maxAuthCount: { type: Number, required: true },
    supportType: { type: String, required: true } 
})

export default mongoose.model<IPricing>("Pricing", ApplicationSchema);
