import mongoose,  { Schema, Document } from 'mongoose';

export interface ISubscription extends Document{
    planId: string; 
    subscriber: string; // owner's or admin's did
    subscriptionDate: string;
    planName: string;
    authCount: number; // how much has he exhausted
    maxAuthCount: number;
    numberOfApps: number;
    maxAppsCounts: number;
}

const ApplicationSchema =  new Schema({
    planId: { type: String, required: true }, 
    subscriber: { type: String, required: true }, // owner's or admin's did
    subscriptionDate: { type: String, required: true },
    planName: { type: String, required: true },
    authCount: { type: Number, required: true }, // how much has he exhausted
    maxAuthCount: { type: Number, required: true },
    numberOfApps: { type: Number, required: true },
    maxAppsCounts: { type: Number, required: true }
})

export default mongoose.model<ISubscription>("Subscription", ApplicationSchema);





    
