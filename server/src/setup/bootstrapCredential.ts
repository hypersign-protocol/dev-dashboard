import { nodeServer, logger, bootstrapConfig, hs_schema, hypersignSDK, hostnameurl, serviceEndpoint } from '../config';
import { store, retrive } from '../utils/file';
import { Application } from '../services/application.service';

const  {keysfilePath, schemafilePath, hypersignFilePath} =  bootstrapConfig;

// Register DID
const registerDid = async () => {
    console.log("Register did...inside")

    const resp = await hypersignSDK.did.getDid({user : {
        name: hs_schema.APP_NAME
    }});

    const { did, keys, didDoc } = resp;
    const r = await hypersignSDK.did.register(didDoc);
    // store keys into file 
    console.log("Storing keys = " + JSON.stringify(keys))
    await store(keys, keysfilePath);
    console.log("Did registration finished.")
}


export async function fetchSchema({author}: {author: string}) : Promise<Array<object>>{
    const schemaGenerated = await hypersignSDK.schema.getSchema({author});
    return schemaGenerated;
}

// Register schema
export async function registerSchema1 ({name, description, author, attributes, storeSchema = false}: 
    {name: string, description: string, author: string, attributes: Array<string>, storeSchema: boolean}) {
    console.log("Registering schema start....")
    const schemaData = {
        name,
        author,
        description,
        properties: {}
    };

    if(!attributes || attributes.length <= 0){
        throw new Error("Please set schema attribtues in config before proceeding");
    }
    
    (attributes as Array<string>).forEach(element => {
        schemaData.properties[element] = ""
    });

    const schemaGenerated = await hypersignSDK.schema.generateSchema(schemaData);
    const r = await hypersignSDK.schema.registerSchema(schemaGenerated);

    if(storeSchema){
        const schemaToStore = {
            id: r["schemaId"],
            credentialName:  schemaData.name,
            attributes: attributes,
            version: "1.0",
            owner: schemaData.author,
            raw: r["schemaString"],
            description:  schemaData.description
        }
        await store(schemaToStore, schemafilePath);
    }
    return r;    
}


export async function generateHypersignJson (basic = {}, advance = {}, jwt = {}, rft = {}, ownerDid, storeHypersign = false) {

    const tempApp = {
        name: "",
        serviceEndpoint: "",
        authResourcePath: "",
        owner: ""
    }
    let hypersignJSON = {
        keys: {},
        schemaId: hs_schema.HS_AUTH_SERVER_SCHEMA,
        networkUrl: nodeServer.baseURl,
        isSubcriptionEnabled: false,
        socketConnTimeOut: 120000,
        mail: {
            host: "",
            port: 0,
            user: "",
            pass: "",
            name: ""
        },
        jwt: {
            secret: "",
            expiryTime: 0,
        },
        rft: {
            secret: "",
            expiryTime: 0,
        },
        appCredential: {}
    }

    Object.assign(hypersignJSON, advance);
    Object.assign(hypersignJSON.jwt, { ...jwt });
    Object.assign(hypersignJSON.rft, { ...rft });
    Object.assign(tempApp, {...basic});
    tempApp["owner"] = ownerDid // userData.id;
    
    const resp = await hypersignSDK.did.getDid({user : tempApp});
    const { did, keys, didDoc } = resp;
    const r = await hypersignSDK.did.register(didDoc);
    Object.assign(hypersignJSON.keys, keys);
    tempApp["did"] = did;


    // In case jwt configuration is not set by developer.
    if(hypersignJSON.jwt.secret == "") hypersignJSON.jwt.secret = hypersignSDK.did.getChallange();
    if(hypersignJSON.jwt.expiryTime == 0) hypersignJSON.jwt.expiryTime = 900000

    // In case refresh token configuration is not set by developer.
    if(hypersignJSON.rft.secret == "") hypersignJSON.rft.secret = hypersignSDK.did.getChallange();
    if(hypersignJSON.rft.expiryTime == 0) hypersignJSON.rft.expiryTime = 86400000

    // step2: Store app realated configuration in db
    const app = new Application({
        name: tempApp.name,
        did: tempApp["did"],
        owner: tempApp["owner"],
        // If the SchemaId is not set by developer, then take the default schema Id
        schemaId: hypersignJSON.schemaId && hypersignJSON.schemaId != "" ? hypersignJSON.schemaId: hs_schema.HS_AUTH_SERVER_SCHEMA,
        baseUrl: tempApp.serviceEndpoint,
        authResourcePath: tempApp.authResourcePath ? tempApp.authResourcePath : "",
        verifyResourcePath: advance["verifyResourcePath"] ? advance["verifyResourcePath"] : "",    
    });
    const appData = await app.create();

    Object.assign(hypersignJSON.appCredential, appData.appCredential);
    
    if(storeHypersign){
        hypersignJSON["isSubcriptionEnabled"] = false;
        await store(hypersignJSON, hypersignFilePath);
    }

    return {
        hypersignJSON,
        app: appData.app
    }
}

export async function bootstrap(){

    await registerDid()

    const keys = JSON.parse(await retrive(keysfilePath));
    const ownerDid = keys.publicKey.id.split('#')[0];

    const schemaData = {
        name: hs_schema.APP_NAME,
        author: ownerDid,
        description: hs_schema.DESCRIPTION,
        attributes: hs_schema.ATTRIBUTES as Array<string>,
        storeSchema: true
    }
    await registerSchema1 ( { ...schemaData }) 

    const config = {
        basic: {
            name: hs_schema.APP_NAME,
            description: hs_schema.DESCRIPTION,
            serviceEndpoint: serviceEndpoint,
            authResourcePath: "/hs/api/v2/auth",
            did: "",
            logoUrl: ""
        },
        advance: {}
    }    
    await generateHypersignJson(config.basic, config.advance, {}, {}, ownerDid, true);
    console.log('Done')
    return; 
}
