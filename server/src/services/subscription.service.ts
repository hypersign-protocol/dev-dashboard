import ISubscription  from '../models/ISubscription';
import IPricing from '../models/IPricing';
import { DBService, SchemaType } from './db.service';
import { Pricing } from './pricing.service';
import { hypersignSDK } from '../config';
export class Subscription implements ISubscription{
    id: string;
    planId: string; 
    subscriber: string;
    dbSerice: DBService;
    prefix: string;

    subscriptionDate: string;
    planName: string;
    authCount: string; // how much has he exhausted
    maxAuthCount: string; // comes from plan
    numberOfApps: string;
    maxAppsCounts: string; // comes from plan

    constructor({ id= "", planId = "", subscriber = "", subscriptionDate = "", planName = "", authCount ="", numberOfApps = "" ,maxAuthCount = "", maxAppsCounts = ""}){
        this.id = id;
        this.planId = planId;
        this.subscriber = subscriber;
        
        this.subscriptionDate = subscriptionDate;
        this.planName = planName;
        this.authCount = authCount;
        this.maxAuthCount = maxAuthCount;
        this.numberOfApps = numberOfApps;
        this.maxAppsCounts = maxAppsCounts;
    
        this.dbSerice = new DBService();
        this.prefix = "subs_";
    }

    toString(user: ISubscription){
        return JSON.stringify(user);
    }

    private getId(){
        const uuid = this.prefix + hypersignSDK.did.getChallange();
        return uuid.substring(0, 20)
    }

    async create(){

        const pricing =  new Pricing({});
        const plans = await pricing.fetch({id: this.planId});
        const requiredPlan: IPricing = plans[0] as IPricing;

        this.maxAppsCounts = requiredPlan.maxAppsCount;
        this.maxAuthCount = requiredPlan.maxAuthCount;
        this.planName = requiredPlan.planName;

        this.subscriptionDate =  (new Date()).toUTCString(); // UTC: GMT

        this.id = this.getId();

        const app = await this.dbSerice.add(SchemaType.Subscription, this);
        return app;
    }

    async fetch(obj = {}){    
        if(Object.keys(obj).length === 0){
            obj = {subscriber: this.subscriber}
        }
        return await this.dbSerice.getAll(SchemaType.Subscription, obj);
    }
}