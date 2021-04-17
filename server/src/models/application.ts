import mongoose,  { Schema, Document } from 'mongoose';

export interface IApplication extends Document{
    name: string; 
    did: string;
    owner: string;
    schemaId: string;
    serviceEp: string;
    authCounts: number;
}

const ApplicationSchema =  new Schema({
    name: { type: String, required: true } ,
    did: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    schemaId: { type: String, required: true },
    serviceEp: { type: String, required: true },
    authCounts: { type: Number, required: true }
})

export default mongoose.model<IApplication>("Application", ApplicationSchema);