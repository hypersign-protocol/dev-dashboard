import { Pricing } from '../services/pricing.service';

const plans = [
    {
        planName: "Tier 1",
        planPrice: "$0/month",
        planDescription: "Developers and Independent Projects",
        offerings: "",
        maxAppsCount: "3",
        maxAuthCount: "1500",
        supportType: "Business Hours Support"
    },
    {
        planName: "Tier 2",
        planPrice: "$100/month",
        planDescription: "Small & Medium Businesses",
        offerings: "",
        maxAppsCount: "10",
        maxAuthCount: "10000",
        supportType: "Business Hours Support"
    },
    {
        planName: "Tier 3",
        planPrice: "$500/month",
        planDescription: "Large Enterprise",
        offerings: "",
        maxAppsCount: "Unlimited",
        maxAuthCount: "Unlimited",
        supportType: "24/7 Support for all Applications"
    }
]


export default function create(){
    plans.forEach(async plan => {
        const pricing  = new Pricing({...plan});
        const price = await pricing.create();
        console.log('Plan ' + price.planName + ' created. PlanId = ', price.id);
    })
}

