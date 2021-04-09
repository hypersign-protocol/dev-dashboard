import env from 'dotenv'
import sqlite from 'sqlite3';
import path from 'path';
import fs from 'fs'
import HypersignSsiSDK  from 'hs-ssi-sdk';

const log = require('simple-node-logger');


env.config();

const log_dir = path.resolve(__dirname,'../log')
const db_dir = path.resolve(__dirname,'../db')

if(!fs.existsSync(log_dir)) fs.mkdirSync(log_dir)
if(!fs.existsSync(db_dir)) fs.mkdirSync(db_dir)

// LOGGING
const log_path = path.resolve(__dirname, process.env.LOG_FILEPATH || 'ssi-infra.log')
const logger = log.createSimpleLogger({
    logFilePath: log_path,
    timestampFormat: process.env.LOG_TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss.SSS'
})
logger.setLevel(process.env.LOG_LEVEL || 'info')

const port = process.env.PORT || 5006;
const host = process.env.HOST || "localhost";
const hostnameurl = process.env.HOSTNAMEURL || `http://${host}:${port}`;

const bootstrapConfig = {
    keysfilePath : path.join(__dirname + '/keys.json'),
    schemafilePath : path.join(__dirname + '/schema.json'),
    hypersignFilePath : path.join(__dirname + '/hypersign.json')
}

// DATABASE
// Ref: https://www.sqlitetutorial.net/sqlite-nodejs/
const db_file_path = process.env.DATABASE_FILEPATH || 'ssi.db'; 
const db_path = path.resolve(__dirname, db_file_path)
const db =  new sqlite.Database(db_path, (err) => {
    if(err){
        logger.error(`SQLite db error:  ${err.message}`)
    }else{
        logger.info(`Connected to ssi-infa database. DB path = ${db_path}`)
    }
});

// DID Related: 
// TODO: Not required for this project. so remove
const did = {
    sheme : process.env.DID_SCHEME || 'did',
    method : process.env.DID_METHOD_NAME || 'hypersign',
}

const jwtSecret = process.env.JWT_SECRET || 'secretKey'
const jwtExpiryInMilli = 240000

const nodeServer = {
    baseURl: process.env.NODE_SERVER_BASE_URL ||  "http://localhost:5000/",//"https://ssi.hypermine.in/core/",
    didCreateEp: process.env.NODE_SERVER_DID_CREATE_EP || "api/did/register",
    schemaCreateEp: process.env.NODE_SERVER_SCHEMA_CREATE_EP || "api/schema/create",
    schemaGetEp: process.env.NODE_SERVER_SCHEMA_GET_EP || "api/v1/schema",
    schemaListEp: process.env.NODE_SERVER_SCHEMA_LIST_EP || "api/schema/list",
}

const mail = {
   host: process.env.MAIL_HOST || "smtp.gmail.com",
   port: process.env.MAIL_PORT || 465 ,
   user: process.env.MAIL_USERNAME || "example@gmail.com",
   pass: process.env.MAIL_PASSWORD || "ExamplePassword1@",
   name: process.env.MAIL_NAME || "Hypermine Admin",
}


// const options = { nodeUrl: `${nodeServer.baseURl}`,  didScheme:  "did:hs"}
// const hypersignSDK = {
//     did: hsdk.did(options),
//     credential: hsdk.credential(options)
// }

const hypersignSDK = new HypersignSsiSDK(
    { nodeUrl: nodeServer.baseURl } // Hypersign node url
  );


const hs_schema = {
    APP_NAME: process.env.SCHEMA_NAME || 'Hypersign Developer Credential',
    ATTRIBUTES: process.env.SCEHMA_ATTRIBUTES || ["name",  "did",  "owner",  "schemaId",  "serviceEp", "subscriptionId", "planId", "planName"],
    DESCRIPTION: process.env.SCEHMA_DESCRIPTION || "Credential to access Hypersign Authentication APIs",
    HS_AUTH_SERVER_SCHEMA: "sch_3008d429-47fa-41fb-a2b0-6d9c294553d2"
}

        

        
const challengeExpTime = 5 // time at which session challenge will expire (in minutes)


const TEMP_CREDENTIAL_DIR = path.join(__dirname + "/../" + "temp/");



export  {
    port,
    host,
    logger,
    db,
    did,
    jwtSecret,
    jwtExpiryInMilli,
    nodeServer,
    mail,
    bootstrapConfig,
    hypersignSDK,
    challengeExpTime,
    hs_schema,
    TEMP_CREDENTIAL_DIR,
    hostnameurl
}