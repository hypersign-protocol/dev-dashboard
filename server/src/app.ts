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
import jwt from 'jsonwebtoken';

import { nodeServer, hypersignSDK} from './config';

import HypersignAuth from 'hypersign-auth-js-sdk'

export default function app() {
    const app = express();
    const server = http.createServer(app);
    const options = {
        jwtSecret: 'SecureDSecret#12@',
        jwtExpiryTime: 30000,
        hsNodeUrl: 'https://ssi.hypermine.in/core',
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


    async function validateUserSubscription(req, res, next) {
        try {
            const userDid = req.body.userData.id;
            const pricing = new Subscription({});
            const subscriptions = await pricing.fetch({
                subscriber: userDid
            });

            const app = new Application({});
            const appList = await app.fetch({
                owner: userDid
            });

            const maxAppsCounts = parseInt(subscriptions[0]['maxAppsCounts']);
            const createdAppsCount = appList.length;

            if (createdAppsCount >= maxAppsCounts) {
                throw new Error(`Upto ${maxAppsCounts} apps are allowed as per your subscribed plan.  Please upgrade your plan.`)
            }

            next();

        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    }

    async function validateSchemaCreation(req, res, next) {
        try {
            const userDid = req.body.userData.id;
            const pricing = new Subscription({});
            const subscriptions = await pricing.fetch({
                subscriber: userDid
            });


            let schemaList = [];
            const url = `${nodeServer.baseURl}${nodeServer.schemaListEp}`;
            const resp = await fetch(url)
            const j = await resp.json()

            if (j.status != 200) throw new Error(j.error);

            schemaList = j.message;
            if (schemaList && schemaList.length > 0) {
                schemaList = schemaList.filter(
                    (x) => x['owner'] === userDid
                );
            }

            const maxAppsCounts = parseInt(subscriptions[0]['maxAppsCounts']);
            const createdSchemaCount = schemaList.length;

            if (createdSchemaCount >= maxAppsCounts) {
                throw new Error(`Upto ${maxAppsCounts} schemas are allowed as per your subscribed plan. Please upgrade your plan.`)
            }
            next();

        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    }

    ///////////////////////////
    /// Authentication related
    // Implement /hs/api/v2/auth API 
    app.post('/hs/api/v2/auth', hypersign.authenticate.bind(hypersign), async (req, res) => {
        try {
            const dataFromHypersign = req.body.hsUserData;
            console.log(dataFromHypersign)
            const userModel = dataFromHypersign.hs_userdata;

            if (!userModel) throw new Error(`Could not fetch usermodel from Hypersign auth`)
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
            if (!userindbstr || userindbstr === "") {
                console.log(`User ${user.email} is creating.`)
                await user.create();
            } else {
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
            const pricing = new Subscription({});
            const subscriptions = await pricing.fetch({
                subscriber: user.id
            });
            const app = new Application({});
            const appList = await app.fetch({
                owner: user.id
            });

            if(subscriptions.length > 0){
                user.isSubscribed = true;
                user.subscriptionDetail = subscriptions[0];
                user.subscriptionDetail.numberOfApps = appList.length.toString();
            }else{
                user.isSubscribed = false;
            }
            
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
        try {
            const { userData } = req.body;
            const app = new Application({});
            const appList = await app.fetch({
                owner: userData.id
            });
            res.status(200).send({ status: 200, message: appList, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });

    app.post('/hs/api/v2/app/create', hypersign.authorize.bind(hypersign), validateUserSubscription, async (req, res) => {    
        try {
            const { userData } = req.body;

            const appBasicConfig = req.body.basic;
            const appAdvConfig = req.body.advance;

            const tempApp = {
                did: "",
                name: "",
                description: "",
                serviceEndpoint: "",
                owner: ""
            }
            let hypersignJSON = {
                keys: {},
                schemaId: "",
                networkUrl: "https://ssi.hypermine.in/core",
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

            Object.assign(hypersignJSON, appAdvConfig);
            Object.assign(tempApp, appBasicConfig);
            tempApp.owner = userData.id;
            
            // step1: Make a call to core to generate keypair and register did
            // const url = `${nodeServer.baseURl}${nodeServer.didCreateEp}?user=${JSON.stringify(tempApp)}`;
            const url = `https://ssi.hypermine.in/core/api/did/register?user=${JSON.stringify(tempApp)}`;
            console.log(url)
            const resp = await fetch(url)
            const json = await resp.json();
            console.log(json.message.did)
            Object.assign(hypersignJSON.keys, json.message.keys);
            tempApp.did = json.message.did;

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

            // step3: Generate hypersign.json data and return
            res.status(200).send({ status: 200, message: { hypersignJSON, newApp: appData.app }, error: null });
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
        const pricing = new Pricing({ ...plan });
        const price = await pricing.create();
        res.status(200).send({ status: 200, message: price, error: null });
    })

    app.get('/hs/api/v2/price', async (req, res) => {
        const pricing = new Pricing({});
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
        try {
            const subscription = req.body;
            if (!subscription || !subscription.planId) throw new Error('PlanId is not passed');
            subscription.subscriber = req.body.userData.id;
            const subsObject = new Subscription({ ...subscription });
            const newSubscription = await subsObject.create();
            res.status(200).send({ status: 200, message: newSubscription, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }

    })

    app.get('/hs/api/v2/subscription', hypersign.authorize.bind(hypersign), async (req, res) => {
        const pricing = new Subscription({});
        const subscriptions = await pricing.fetch({
            subscriber: req.body.userData.id
        });
        res.status(200).send({ status: 200, message: subscriptions, error: null });
    })

    async function updateAuthCount({credentialSubject}){
        
        const { subscriptionId, did, owner}  = credentialSubject;

        // Update application
        const applicationObj =  new Application({did});
        const application = await applicationObj.fetchOne();
        if(!application) throw new Error(`No application found with did = ${did}`);
        
        logger.debug('verify::updateAuthCount: application = ', application.did);
        let authCounts = application.authCounts == "" ? 0 : parseInt(application.authCounts);
        logger.debug('verify::updateAuthCount: application authCounts = ', authCounts);
        authCounts = authCounts + 1;
        await applicationObj.update({ authCounts: authCounts.toString() })


        // Update subscription
        const subscriptionObj =  new Subscription({
            id: subscriptionId, subscriber: owner
        });
        const subscription = await subscriptionObj.fetchOne();
        if(!subscription) throw new Error(`No subscription found with owner did = ${owner}`);

        let authCount = subscription.authCount == "" ? 0 : parseInt(subscription.authCount);
        authCount = authCount + 1;
        logger.debug('verify::updateAuthCount: subscription authCount = ', authCount);
        await subscriptionObj.update({ authCount: authCount.toString() });
    }

    app.post('/hs/api/v2/subscription/verify', async (req, res) => {

        try{
            // chcek if there is token in the query
        const { apiAuthToken } = req.query;
        logger.debug('verify:: apiAuthToken =  ', apiAuthToken)
        const jwtSecret ='jwtSecret123';
        
        if(apiAuthToken){
            logger.debug('verify:: Inside  apiAuthToken if');

            // verify JWT authAPIToken
            jwt.verify(apiAuthToken, jwtSecret, async (err, data) => {
                if(err) res.status(403).send({ status: 403, message: null, error: 'Unauthorized: Invalid token' })
                
                logger.debug('verify:: before updateAuthCount ');
                await updateAuthCount({credentialSubject: data});
                logger.debug('verify:: after updateAuthCount ');

                res.status(200).send({ status: 200, message: 'Success', error: null });
            });
        }else{
            // verify the presentation
            const vp = req.body;
            logger.debug('verify:: vp =  ', JSON.stringify(vp))
            if(!vp) {
                res.status(401).send({ status: 401, message: null, error: 'Unauthenticated: presentation not sent' });
            }
            const {credentialSubject} = vp.verifiableCredential[0];
            logger.debug('verify:: credentialSubject =  ', JSON.stringify(credentialSubject));
            if(!credentialSubject) throw Error('Credential subject not found in the vp');

            const applicationObj =  new Application({did: credentialSubject.did});
            if(!applicationObj.verifyPresentation(vp, vp.proof.challenge)){
                res.status(401).send({ status: 401, message: null, error: 'Unauthenticated: could not verify presentation' });
            }

            logger.debug('verify:: before updateAuthCount ');
            await updateAuthCount({credentialSubject});
            logger.debug('verify:: after updateAuthCount ');

            // Generate JWT authAPIToken and send back
            jwt.sign(
                credentialSubject,
                jwtSecret,
                { expiresIn: 120000 },
                async (err, token) => {
                    if (err) throw new Error(err);
                    res.status(200).send({ status: 200, message: token, error: null });
                });
        }

        }catch(e){
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
        
    })
    ///
    ///////////////////////////



    app.post('/hs/api/v2/schema/create', hypersign.authorize.bind(hypersign), validateSchemaCreation, async (req, res) => {
        try {
            const url = `${nodeServer.baseURl}${nodeServer.schemaCreateEp}`;
            let headers = {
                "Content-Type": "application/json",
              };
            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify(req.body),
                headers,
              });
            const j =  await resp.json();
            if(j.status != 200) throw new Error(j.error);
            logger.debug(j);
            res.status(200).send({ status: 200, message: j.message, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }

    })


    

    server.listen(port, () => logger.info(`The server is running on port ${port}`));

}
