import { hypersignSDK, bootstrapConfig, nodeServer } from "../config";
import { retrive } from "../utils/file";
import { Subscription } from "./subscription.service";
import ApplicationModel, { IApplication } from "../models/application";

const { keysfilePath, schemafilePath } = bootstrapConfig;

export class Application{
  id: string;
  name: string;
  did: string;
  owner: string;
  schemaId: string;
  baseUrl: string;
  authCounts: number;
  authResourcePath: string;
  verifyResourcePath: string;
  constructor({
    name = "",
    did = "",
    owner = "",
    schemaId = "",
    baseUrl = "",
    authResourcePath = "",
    verifyResourcePath = "",
    authCounts = 0,
  }) {
    this.id = did;
    this.name = name;
    this.did = did;
    this.owner = owner;
    this.schemaId = schemaId;
    this.baseUrl = baseUrl;
    this.authCounts = authCounts;
    this.authResourcePath = authResourcePath
    this.verifyResourcePath = verifyResourcePath 
  }

  async create() {
    const app: IApplication = await ApplicationModel.create({
      ...this,
    });
    const appCredential = await this.getCredentials();
    return { app, appCredential };
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
      subscriber: this.owner,
    });

    if (!subscriptions) {
      throw new Error("Please subscript to create applications");
    }
    // TODO: need to do this in better way..more dynamic way.
    // make use of SCHEMA.attributes
    const attributesMap = {
      name: this.name,
      did: this.did,
      owner: this.owner,
      schemaId: this.schemaId,
      baseUrl: this.baseUrl,
      authResourcePath: this.authResourcePath,
      verifyResourcePath: this.verifyResourcePath,
      subscriptionId: subscriptions[0] ? subscriptions[0]["id"] : "",
      planId: subscriptions[0] ? subscriptions[0]["planId"] : "",
      planName: subscriptions[0] ? subscriptions[0]["planName"] : "",
    };

    const credential = await hypersignSDK.credential.generateCredential(
      schemaUrl,
      {
        subjectDid: this.did,
        issuerDid: issuerKeys.publicKey.id,
        expirationDate: this.addDays(new Date(), 60), // will expire in 2 months // dont hardcode it...
        attributesMap,
      }
    );

    const signedCredential = await hypersignSDK.credential.signCredential(
      credential,
      issuerKeys.publicKey.id,
      issuerKeys.privateKeyBase58
    );
    return signedCredential;
  }

  async verifyPresentation(vpObj, challenge): Promise<boolean> {
    if (!vpObj) throw new Error("presentation is null");
    if (!challenge) throw new Error("challenge is null");
    const vc = vpObj.verifiableCredential[0];
    const isVerified = await hypersignSDK.credential.verifyPresentation({
      presentation: vpObj,
      challenge: challenge,
      issuerDid: vc.proof.verificationMethod,
      holderDid: vpObj.proof.verificationMethod,
    });
    return isVerified.verified;
  }

  async fetch(obj = {}) {
    if (Object.keys(obj).length === 0) {
      obj = { owner: this.owner };
    }
    const subscriptions: Array<IApplication> = await ApplicationModel.where(obj).find({});
    return subscriptions;
  }

  async fetchOne(obj = {}): Promise<IApplication> {
    if (Object.keys(obj).length === 0) {
      obj = { did: this.did };
    }

    const subscriptions: IApplication = (await ApplicationModel.where(
      obj
    ).findOne()) as IApplication;
    return subscriptions;
  }

  async update(params = {}, where = {}): Promise<IApplication> {
    if (Object.keys(where).length === 0) {
      where = { did: this.did };
    }
    const project: IApplication = (await ApplicationModel.findOneAndUpdate(
      where,
      params
    )) as IApplication;
    return project;
  }
}
