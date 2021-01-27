import IApplication  from '../models/IApplication';
import { DBService, SchemaType } from './db.service';
import { hypersignSDK, bootstrapConfig, nodeServer} from '../config';
import { retrive } from '../utils/file';
const  {keysfilePath, schemafilePath} =  bootstrapConfig;
import { Subscription } from './subscription.service';

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
        this.serviceEp = serviceEp;
        
        this.dbSerice = new DBService();
    }

    toString(user: IApplication){
        return JSON.stringify(user);
    }

    async create(){
        const app = await this.dbSerice.add(SchemaType.Application, this);
        const appCredential = await this.getCredentials();
        return {app, appCredential};
    }



private addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString();
  }

    private async getCredentials() {
        const SCHEMA = JSON.parse(await retrive(schemafilePath));
        const schemaUrl = `${nodeServer.baseURl}${nodeServer.schemaGetEp}/${SCHEMA.id}`;
        const issuerKeys = JSON.parse(await retrive(keysfilePath));

        const pricing = new Subscription({});
        const subscriptions = await pricing.fetch({
            subscriber: this.owner
        });

        // TODO: need to do this in better way..more dynamic way.
        // make use of SCHEMA.attributes
        const attributesMap = {
            name: this.name,
            did: this.did,
            owner: this.owner,
            schemaId: this.schemaId,
            serviceEp: this.serviceEp,
            subscriptionId: subscriptions[0]['id'],
            planId: subscriptions[0]['planId'],
            planName: subscriptions[0]['planName']
        }

        const credential = await hypersignSDK.credential.generateCredential(schemaUrl, {
          subjectDid: this.did,
          issuerDid: issuerKeys.publicKey.id,
          expirationDate: this.addDays(new Date(), 60), // will expire in 2 months // dont hardcode it...
          attributesMap,
        })

        const signedCredential = await hypersignSDK.credential.signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
        return signedCredential
    }

    async fetch(obj = {}){    
        if(Object.keys(obj).length === 0){
            obj = {owner: this.owner}
        }
        return await this.dbSerice.getAll(SchemaType.Application, obj);
    }
}