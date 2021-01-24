import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { port, logger } from './config';
import { User } from './services/user.service';
import { Application } from './services/application.service';
import { Subscription } from './services/subscription.service';
import { Pricing } from './services/pricing.service';
import http from 'http';
import fetch from 'node-fetch';

import  HypersignAuth from 'hypersign-auth-js-sdk'

export default function app() {
    const app = express();
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

    ///////////////////////////
    /// Authentication related
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
    app.post('/protected', hypersign.authorize.bind(hypersign), async (req, res) => {
        try {
            const user = req.body.userData;
            const pricing  = new Subscription({});
            const subscriptions = await pricing.fetch({
                subscriber: user.id
            });
            const app = new Application({});
            const appList = await app.fetch({
                owner: user.id
            });
            user.isSubscribed = subscriptions.length > 0 ? true: false;
            user.subscriptionDetail = subscriptions[0];
            user.subscriptionDetail.numberOfApps = appList.length.toString();
            // Do whatever you want to do with it
            // Send a message or send to home page
            res.status(200).send({ status: 200, message: user, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });
    ///
    ///////////////////////////


    ///////////////////////// 
    ///Application related
    app.get('/hs/api/v2/app', hypersign.authorize.bind(hypersign), async (req, res) => {
        try{
            const {userData} = req.body;
            const app = new Application({});
            const appList = await app.fetch({
                owner: userData.id
            });
            res.status(200).send({ status: 200, message: appList, error: null });
        }catch(e){
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });

    app.post('/hs/api/v2/app/create', hypersign.authorize.bind(hypersign), async (req, res) => {
        try {
            const {userData} = req.body;
            
            const appBasicConfig = req.body.basic;
            const appAdvConfig = req.body.advance;
            const hypersignJSON = {
                keys: {},
                app: {
                    did: "",
                    name: "",
                    description: "",
                    serviceEndpoint: "",
                    owner: ""
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
            hypersignJSON.app.owner = userData.id;
            console.log(hypersignJSON)

            // step1: Make a call to core to generate keypair and register did
            const url = `https://ssi.hypermine.in/core/api/did/register?user=${JSON.stringify(hypersignJSON.app)}`;
            console.log(url)
            const resp =  await fetch(url)
            const json =  await resp.json();
            console.log(json.message.did)
            Object.assign(hypersignJSON.keys, json.message.keys);
            hypersignJSON.app.did = json.message.did;
            
            
            // step2: Store app realated configuration in db
            const app = new Application({
                name: hypersignJSON.app.name,
                did: hypersignJSON.app.did,
                owner: hypersignJSON.app.owner,
                schemaId: hypersignJSON.schemaId,
                serviceEp: hypersignJSON.app.serviceEndpoint
            });
            const newApp = await app.create();

            

            // step3: Generate hypersign.json data and return
            res.status(200).send({ status: 200, message: {hypersignJSON, newApp}, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });
    ///
    ///////////////////////////

    ///////////////////////// 
    ///Pricing related
    app.post('/hs/api/v2/price/create', async (req, res) => {
        const plan = req.body;
        plan.offerings = JSON.stringify(plan.offerings);
        const pricing  = new Pricing({...plan});
        const price = await pricing.create();
        res.status(200).send({ status: 200, message: price, error: null });
    })

    app.get('/hs/api/v2/price', async (req, res) => { 
        const pricing  = new Pricing({});
        let pricings = await pricing.fetch();
        // pricings = pricings.map(x => {
        //     const obj =  Object.assign({}, x);
        //     obj['offerings'] = JSON.parse(obj['offerings'])
        //     return obj
        // });
        res.status(200).send({ status: 200, message: pricings, error: null });
    })
    ///
    ///////////////////////////

    ///////////////////////// 
    ///Subscription related
    app.post('/hs/api/v2/subscription/create', hypersign.authorize.bind(hypersign), async (req, res) => {
        try{
            const subscription = req.body;
            if(!subscription || !subscription.planId) throw new Error('PlanId is not passed');
            subscription.subscriber = req.body.userData.id;
            const subsObject  = new Subscription({...subscription});
            const newSubscription = await subsObject.create();
            res.status(200).send({ status: 200, message: newSubscription, error: null });
        }catch(e){
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
        
    })

    app.get('/hs/api/v2/subscription', hypersign.authorize.bind(hypersign), async (req, res) => { 
        const pricing  = new Subscription({});
        const subscriptions = await pricing.fetch({
            subscriber: req.body.userData.id
        });
        res.status(200).send({ status: 200, message: subscriptions, error: null });
    })
    ///
    ///////////////////////////

    

    server.listen(port, () => logger.info(`The server is running on port ${port}`));

}
