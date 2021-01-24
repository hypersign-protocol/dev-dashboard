import IPricing from '../models/IPricing';
import { DBService, SchemaType } from './db.service';
import { hypersignSDK } from '../config';
export class Pricing implements IPricing {
    id: string;
    planName: string;
    planId: string;
    planPrice: string;
    planDescription: string;
    offerings: string;

    maxAppsCount: string;
    maxAuthCount: string;
    supportType: string;

    dbSerice: DBService;
    prefix: string;
    constructor({   id = "", 
                    planName = "", 
                    planPrice = "", 
                    planDescription = "",
                    offerings = "", 
                    maxAppsCount = "", 
                    maxAuthCount = "",
                    supportType = "" 
                }) {
        this.planName = planName;
        this.planId = id;
        this.id = id;
        this.planPrice = planPrice;
        this.planDescription = planDescription;
        this.offerings = offerings;
        this.maxAppsCount = maxAppsCount;
        this.maxAuthCount = maxAuthCount;
        this.supportType = supportType;
        this.dbSerice = new DBService();
        this.prefix = "pln_";
    }

    private getId() {
        const uuid = this.prefix + hypersignSDK.did.getChallange()
        return uuid.substring(0, 20)
    }

    toString(user: IPricing) {
        return JSON.stringify(user);
    }

    async create() {
        this.id = this.getId();
        const app = await this.dbSerice.add(SchemaType.Pricing, this);
        return app;
    }

    async fetch(obj = {}) {
        // if(Object.keys(obj).length === 0){
        //     obj = {owner: this.owner}
        // }
        return await this.dbSerice.getAll(SchemaType.Pricing, obj);
    }
}