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
    authCounts: string;
    constructor({ name= "", did = "", owner = "", schemaId = "", serviceEp = "", authCounts = "" }){
        this.id = did;
        this.name = name;
        this.did = did;
        this.owner = owner;
        this.schemaId = schemaId;
        this.serviceEp = serviceEp;
        this.authCounts = authCounts;
        
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

    async verifyPresentation(vpObj, challenge): Promise<boolean> {
        if (!vpObj) throw new Error('presentation is null')
        if (!challenge) throw new Error('challenge is null')
        const vc = vpObj.verifiableCredential[0];
        const isVerified = await hypersignSDK.credential.verifyPresentation({
            presentation: vpObj,
            challenge: challenge,
            issuerDid: vc.proof.verificationMethod,
            holderDid: vpObj.proof.verificationMethod
        });
        return isVerified.verified;
    }


    async fetch(obj = {}){    
        if(Object.keys(obj).length === 0){
            obj = {owner: this.owner}
        }
        return await this.dbSerice.getAll(SchemaType.Application, obj);
    }

    async fetchOne(obj = {}): Promise<IApplication>{    
        if(Object.keys(obj).length === 0){
            obj = {id: this.did}
        }
        return await this.dbSerice.getOne(SchemaType.Application, obj);
    }

    async update(params = {}, where = {}){

        if(Object.keys(where).length === 0){
            where = {id: this.did}
        }

        return await this.dbSerice.update(SchemaType.Application, params, where)
    }
}