import { Pricing } from './pricing.service';
import SubscriptionModel, { ISubscription } from '../models/subscription'
import  { IPricing } from '../models/pricing'

export class Subscription{
    id: string;
    planId: string; 
    subscriber: string;
    
    subscriptionDate: string;
    planName: string;
    authCount: number; // how much has he exhausted
    maxAuthCount: number; // comes from plan
    numberOfApps: number;
    maxAppsCounts: number; // comes from plan

    constructor({ id= "", 
    planId = "",
    subscriber = "",
    subscriptionDate = "",
    planName = "",
    authCount = 0, 
    numberOfApps = 0, 
    maxAuthCount = 0, 
    maxAppsCounts = 0}){
        this.id = id;
        this.planId = planId;
        this.subscriber = subscriber;
        
        this.subscriptionDate = subscriptionDate;
        this.planName = planName;
        this.authCount = authCount;
        this.maxAuthCount = maxAuthCount;
        this.numberOfApps = numberOfApps;
        this.maxAppsCounts = maxAppsCounts;
    
    }

    async create(){

        const pricing =  new Pricing({});
        const plans = await pricing.fetch({planId: this.planId});
        const requiredPlan: IPricing = plans[0] as IPricing;

        this.maxAppsCounts = requiredPlan.maxAppsCount;
        this.maxAuthCount = requiredPlan.maxAuthCount;
        this.planName = requiredPlan.planName;

        this.subscriptionDate =  (new Date()).toUTCString(); // UTC: GMT

        const subs: ISubscription =  await SubscriptionModel.create({
            ...this
        }) 
        
        return subs;
    }

    async fetch(obj = {}){    
        if(Object.keys(obj).length === 0){
            obj = {subscriber: this.subscriber}
        }
        return await SubscriptionModel.where(obj).find({});
    }

    async update(params = {}, where = {}){

        if(Object.keys(where).length === 0){
            where = {_id: this.id}
        }


        const project: ISubscription = (await SubscriptionModel.findOneAndUpdate(
            where,
            params
          )) as ISubscription;
        return project;
    }

    async fetchOne(obj = {}): Promise<ISubscription>{    
        if(Object.keys(obj).length === 0){
            obj = {subscriber: this.subscriber}
        }
        const subs: ISubscription =  (await SubscriptionModel.where(obj).findOne()) as ISubscription;
        return  subs;
    }
}