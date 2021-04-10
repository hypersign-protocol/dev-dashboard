import { nodeServer, logger, bootstrapConfig, hs_schema, hypersignSDK, hostnameurl } from '../config';
import { store, retrive } from '../utils/file';
import { Application } from '../services/application.service';
const  {keysfilePath, schemafilePath, hypersignFilePath} =  bootstrapConfig;


// Register DID
const registerDid = async () => {
    logger.info("Registering did start....")
    
    // const url = `${nodeServer.baseURl}${nodeServer.didCreateEp}?name=${hs_schema.APP_NAME}`;
    // // Call create api of core and get keys.json
    // const resp = await fetch(url);
    // const json = await resp.json();
    // if(json && json.status != 200) throw new Error(json.error);

    const resp = await hypersignSDK.did.getDid({user : {
        name: hs_schema.APP_NAME
    }});

    const { did, keys, didDoc } = resp;
    const r = await hypersignSDK.did.register(didDoc);
    // store keys into file 
    logger.info("Storing keys = " + JSON.stringify(keys))
    await store(keys, keysfilePath);
    logger.info("Did registration finished.")
}


// Register schema
const registerSchema = async () => {
    logger.info("Registering schema start....")
    const keys = JSON.parse(await retrive(keysfilePath));
    logger.info("Fetched keys = " + JSON.stringify(keys))
    
    const schemaData = {
        name: hs_schema.APP_NAME,
        author: keys.publicKey.id.split('#')[0],
        description: hs_schema.DESCRIPTION,
        properties: {}
    };

    if(!hs_schema.ATTRIBUTES || hs_schema.ATTRIBUTES.length <= 0){
        throw new Error("Please set schema attribtues in config before proceeding");
    }
    
    (hs_schema.ATTRIBUTES as Array<string>).forEach(element => {
        schemaData.properties[element] = ""
    });
    const schemaGenerated = await hypersignSDK.schema.generateSchema(schemaData);
    const r = await hypersignSDK.schema.registerSchema(schemaGenerated);


    const schemaToStore = {
        id: r["schemaId"],
        credentialName:  schemaData.name,
        attributes: hs_schema.ATTRIBUTES,
        version: "1.0",
        owner: schemaData.author,
        raw: r["schemaString"],
        description:  schemaData.description
    }
    await store(schemaToStore, schemafilePath);

}

export async function fetchSchema({author}: {author: string}) : Promise<Array<object>>{
    const schemaGenerated = await hypersignSDK.schema.getSchema({author});
    return schemaGenerated;
}

// Register schema
export async function registerSchema1 ({name, description, author, attributes, storeSchema = false}: 
    {name: string, description: string, author: string, attributes: Array<string>, storeSchema: boolean}) {
    logger.info("Registering schema start....")
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


export async function generateHypersignJson (basic = {}, advance = {}, ownerDid, storeHypersign = false) {

    const tempApp = {
        did: "",
        name: "",
        description: "",
        serviceEndpoint: "",
        owner: ""
    }
    let hypersignJSON = {
        keys: {},
        schemaId: hs_schema.HS_AUTH_SERVER_SCHEMA,
        networkUrl: nodeServer.baseURl,
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
        appCredential: {}
    }

    Object.assign(hypersignJSON, advance);
    Object.assign(tempApp, basic);
    tempApp.owner = ownerDid // userData.id;
    
    // step1: Make a call to core to generate keypair and register did
    // const url = `${nodeServer.baseURl}${nodeServer.didCreateEp}?user=${JSON.stringify(tempApp)}`;
    const resp = await hypersignSDK.did.getDid({user : tempApp});
    const { did, keys, didDoc } = resp;
    const r = await hypersignSDK.did.register(didDoc);
    Object.assign(hypersignJSON.keys, keys);
    tempApp.did = did;


    // In case jwt configuration is not set by developer.
    if(hypersignJSON.jwt.secret == "") hypersignJSON.jwt.secret = hypersignSDK.did.getChallange();
    if(hypersignJSON.jwt.expiryTime == 0) hypersignJSON.jwt.expiryTime = 120000

    // step2: Store app realated configuration in db
    const app = new Application({
        name: tempApp.name,
        did: tempApp.did,
        owner: tempApp.owner,
        schemaId: hypersignJSON.schemaId,
        serviceEp: tempApp.serviceEndpoint
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
            serviceEndpoint: hostnameurl,
            did: "",
            logoUrl: ""
        },
        advance: {}
    }    
    await generateHypersignJson(config.basic, config.advance, ownerDid, true); 
}


