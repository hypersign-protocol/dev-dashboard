import IApplication  from '../models/IApplication';
import { DBService, SchemaType } from './db.service';
import { hypersignSDK } from '../config';
export class Application implements IApplication{
    id: string;
    name: string;
    did:  string;
    owner: string;
    schemaId: string;
    serviceEp: string;
    dbSerice: DBService;
    constructor({ name= "", did = "", owner = "", schemaId = "", serviceEp = "", }){
        this.id = did;
        this.name = name;
        this.did = did;
        this.owner = owner;
        this.schemaId = schemaId;
        this.serviceEp = serviceEp
        
        this.dbSerice = new DBService();
    }

    toString(user: IApplication){
        return JSON.stringify(user);
    }

    async create(){
        await this.dbSerice.add(SchemaType.Application, this);
        return true;
    }

    async fetch(obj = {}){    
        if(Object.keys(obj).length === 0){
            obj = {owner: this.owner}
        }
        return await this.dbSerice.getAll(SchemaType.Application, obj);
    }
}