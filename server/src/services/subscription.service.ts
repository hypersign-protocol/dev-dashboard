import ISubscription  from '../models/ISubscription';
import { DBService, SchemaType } from './db.service';
import { hypersignSDK } from '../config';
export class Subscription implements ISubscription{
    id: string;
    planId: string; 
    subscriber: string;
    dbSerice: DBService;
    prefix: string;
    constructor({ id= "", planId = "", subscriber = ""}){
        this.id = id;
        this.planId = planId;
        this.subscriber = subscriber;
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