import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { port, logger } from './config';
import { User } from './services/user.service';
import path from 'path';
import http from 'http';
import fetch from 'node-fetch';

import  HypersignAuth from 'hypersign-auth-js-sdk'

export default function app() {
    const app: Application = express();
    const server =  http.createServer(app);
    const options = {
        jwtSecret: 'SecureDSecret#12@',
        jwtExpiryTime: 30000,
        hsNodeUrl: 'https://ssi.hypermine.in/core' , 
    };
    
    const hypersign = new HypersignAuth({
        server, 
        baseUrl: 'http://192.168.43.43:4006',
        options
    });

    

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // Implement /hs/api/v2/auth API 
    app.post('/hs/api/v2/auth', hypersign.authenticate.bind(hypersign), async (req, res) => {
        try {
            const dataFromHypersign = req.body.hsUserData;
            console.log(dataFromHypersign)
            const userModel = dataFromHypersign.hs_userdata;

            if(!userModel) throw new Error(`Could not fetch usermodel from Hypersign auth`)
            console.log(userModel)
            /**
             * Example of user model
                {
                    Name: 'Vishwas',
                    Email: 'vishu112anand1@gmail.com',
                    id: 'did:hs:94c5f4b7-582c-4663-ae1e-c58f4488114f'
                },
            */

           const user = new User({
               fname: userModel.Name,
               email: userModel.Email,
               publicKey: userModel.id
           });

           // Check if this is first time user, Query db using userModel.id
           const userindbstr = await user.fetch({
               email: user.email,
               publicKey: user.publicKey
           })
           // If it is, then add this user in database
           if(!userindbstr || userindbstr === ""){
                console.log(`User ${user.email} is creating.`)
                await user.create();
           }else{
               // Otherwise, do not do anything.
                console.log(`User ${user.email} already exists.`)
           }
            res.status(200).send({ status: 200, message: "Success", error: null });
   
        } catch (e) {

            console.log(e)
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    })

    // use this api for verification of authorization token
    // this api gets called before each route in frontend
    // hypersign.authorize.bind(hypersign), 
    app.post('/protected', hypersign.authorize.bind(hypersign), (req, res) => {
        try {
            const user = req.body.userData;
            console.log(user)
            // Do whatever you want to do with it
            // Send a message or send to home page
            res.status(200).send({ status: 200, message: user, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });

    app.post('/hs/api/v2/app/create', async (req, res) => {
        try {
            // const user = req.body.userData;
            const appBasicConfig = req.body.basic;
            const appAdvConfig = req.body.advance;
            const hypersignJSON = {
                keys: {},
                app: {
                    did: "",
                    name: "",
                    description: "",
                    serviceEndpoint: ""
                },
                schemaId: "",
                network: "",
                mail: {
                    host: "",
                    port: 0,
                    user: "",
                    pass: "",
                    name: ""
                }
            }

            Object.assign(hypersignJSON , appAdvConfig);
            Object.assign(hypersignJSON.app, appBasicConfig);

            console.log(hypersignJSON)
            // step1: Make a call to core to generate keypair and register did

            const url = `https://ssi.hypermine.in/core/api/did/register?user=${JSON.stringify(hypersignJSON.app)}`;
            console.log(url)
            const resp =  await fetch(url)
            const json =  await resp.json();
            console.log(json.message.did)
            Object.assign(hypersignJSON.keys, json.message.keys);
            hypersignJSON.app.did = json.message.did
            // step2: Store app realated configuration in db
            // step3: Generate hypersign.json data and return
            res.status(200).send({ status: 200, message: hypersignJSON, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });

    // Login page
    // This became redundent
    app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')) })
    

    server.listen(port, () => logger.info(`The server is running on port ${port}`));

}
