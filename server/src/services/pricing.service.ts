import PricingModel, { IPricing } from '../models/pricing'
import { v4 as uuidv4 } from 'uuid';
export class Pricing {
    planName: string;
    planId: string;
    planPrice: string;
    planDescription: string;
    offerings: string;

    maxAppsCount: number;
    maxAuthCount: number;
    supportType: string;

    constructor({   
                    planName = "", 
                    planPrice = "", 
                    planDescription = "",
                    offerings = "", 
                    maxAppsCount = 0, 
                    maxAuthCount = 0,
                    supportType = "" 
                }) {
        this.planName = planName;
        this.planPrice = planPrice;
        this.planDescription = planDescription;
        this.offerings = offerings;
        this.maxAppsCount = maxAppsCount;
        this.maxAuthCount = maxAuthCount;
        this.supportType = supportType;   
        this.planId = "";     
    }

    async create() {
        this.planId = uuidv4();
        const app: IPricing = await PricingModel.create({
            ...this,
          });
        return app;
    }

    async fetch(obj = {}) {
        const subscriptions: Array<IPricing> = await PricingModel.where(obj).find();
        return subscriptions;
    }
}