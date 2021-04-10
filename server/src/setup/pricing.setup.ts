import PricingModel, {IPricing} from '../models/pricing';
import {v4 as uuidv4 } from 'uuid';
const plans = [
    {
        planId: uuidv4(),
        planName: "Tier 1",
        planPrice: "$0/month",
        planDescription: "Developers and Independent Projects",
        offerings: "",
        maxAppsCount: 3,
        maxAuthCount: 1500,
        supportType: "Business Hours Support"
    },
    {
        planId: uuidv4(),
        planName: "Tier 2",
        planPrice: "$100/month",
        planDescription: "Small & Medium Businesses",
        offerings: "",
        maxAppsCount: 10,
        maxAuthCount: 10000,
        supportType: "Business Hours Support"
    },
    {
        planId: uuidv4(),
        planName: "Tier 3",
        planPrice: "$500/month",
        planDescription: "Large Enterprise",
        offerings: "",
        maxAppsCount: 0,
        maxAuthCount: 0,
        supportType: "24/7 Support for all Applications"
    }
]


export default function create(){
    plans.forEach(async plan => {
        const price: IPricing = await PricingModel.create({
            ...plan
          });
        console.log('Plan ' + price.planName + ' created. PlanId = ', price.id);
    })
}

