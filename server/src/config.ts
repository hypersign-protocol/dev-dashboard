import env from "dotenv";
import path from "path";
import fs from "fs";
import HypersignSsiSDK from "hs-ssi-sdk";
import mongoose, { PromiseProvider } from "mongoose";
import { homedir } from "os";
import winston from "winston";

const envPath = path.resolve(__dirname, "../", process.env.NODE_ENV + ".env");

if (fs.existsSync(envPath)) {
  env.config({
    path: envPath,
  });
} else {
  env.config();
}

const dataDIR = process.env.DATA_DIR
  ? process.env.DATA_DIR
  : path.join(homedir(), "developerDashboard");
if (!fs.existsSync(dataDIR)) fs.mkdirSync(dataDIR);

let logger;
function setupLogger() {
  const logDIR = path.join(dataDIR, "./log");
  if (!fs.existsSync(logDIR)) fs.mkdirSync(logDIR);

  const { combine, timestamp, printf } = winston.format;
  const customLogFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
  });
  const logFilePath = path.join(logDIR, "developerDashboard.log");
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(timestamp(), customLogFormat),
    transports: [
      new winston.transports.File({
        filename: path.join(logDIR, "developerDashboard-error.log"),
        level: "error",
      }),
      new winston.transports.File({ filename: logFilePath }),
    ],
  });
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  logger.info(`Log filepath is set to ${logFilePath}`);
}
setupLogger();

const port = process.env.PORT || 5006;
const host = process.env.HOST || "localhost";
const hostnameurl = process.env.HOSTNAMEURL || `http://${host}:${port}`;


const keysDIR = path.join(dataDIR, "./keys");
  if (!fs.existsSync(keysDIR)) fs.mkdirSync(keysDIR);

const bootstrapConfig = {
  keysfilePath: path.join(keysDIR + "/keys.json"),
  schemafilePath: path.join(keysDIR + "/schema.json"),
  hypersignFilePath: process.env.NODE_ENV == "production" ? path.join(__dirname  + "/hypersign.json") : path.join(__dirname  + "/../" + "/hypersign.json"),
}

if (!fs.existsSync(dataDIR)) fs.mkdirSync(dataDIR);

//DATABASE
const dbConnUrl =
  process.env.DB_URL && process.env.DB_URL != ""
    ? process.env.DB_URL
    : "";
if (dbConnUrl) {
  mongoose.connect(
    dbConnUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.error("Error: could not connect to mongo database");
        return
      } else {
        console.log("Connected to mongo database");
      }
    }
  );
}

// DID Related:
// TODO: Not required for this project. so remove
const did = {
  sheme: process.env.DID_SCHEME || "did",
  method: process.env.DID_METHOD_NAME || "hypersign",
};

const jwtSecret = process.env.JWT_SECRET || "secretKey";
const jwtExpiryInMilli = 240000;

const nodeServer = {
  baseURl: process.env.NODE_SERVER_BASE_URL || "http://localhost:5000/",
  schemaGetEp: process.env.NODE_SERVER_SCHEMA_GET_EP || "api/v1/schema",
};

const hypersignSDK = new HypersignSsiSDK({ nodeUrl: nodeServer.baseURl });

const hs_schema = {
  APP_NAME: process.env.SCHEMA_NAME || "Hypersign Developer Portal",
  ATTRIBUTES: process.env.SCEHMA_ATTRIBUTES || [
    "name",
    "did",
    "owner",
    "schemaId",
    "serviceEp",
    "subscriptionId",
    "planId",
    "planName",
  ],
  DESCRIPTION:
    process.env.SCEHMA_DESCRIPTION ||
    "Credential to access Hypersign Authentication APIs",
  HS_AUTH_SERVER_SCHEMA:  process.env.HS_AUTH_SERVER_SCHEMA || "sch_3008d429-47fa-41fb-a2b0-6d9c294553d2",
};

const challengeExpTime = 5; // time at which session challenge will expire (in minutes)
const TEMP_CREDENTIAL_DIR = path.join(dataDIR, "./credential");
const serviceEndpoint = process.env.DEVELOPER_PORTAL_SERVICE_ENDPOINT || hostnameurl
export {
  port,
  host,
  logger,
  did,
  jwtSecret,
  jwtExpiryInMilli,
  nodeServer,
  bootstrapConfig,
  hypersignSDK,
  challengeExpTime,
  hs_schema,
  TEMP_CREDENTIAL_DIR,
  hostnameurl,
  serviceEndpoint
};
