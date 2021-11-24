import { Router } from 'express';
import { logger } from '../config';
import { Subscription } from '../services/subscription.service';
import { Application } from '../services/application.service';
import jwt from 'jsonwebtoken';


const options = {
    jwtSecret: 'SecureDSecret#12@',
    jwtExpiryTime: 30000
};

export = (hypersign) => {

    const router = Router();

    router.post('/create', hypersign.authorize.bind(hypersign), async (req, res) => {
        try {
            const subscription = req.body;
            if (!subscription || !subscription.planId) throw new Error('PlanId is not passed');
            const userData = req.body.hypersign.data;
            subscription.subscriber = userData.id;
            const subsObject = new Subscription({ ...subscription });
            const newSubscription = await subsObject.create();
            res.status(200).send({ status: 200, message: newSubscription, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }

    })

    router.get('/', hypersign.authorize.bind(hypersign), async (req, res) => {
        const userData = req.body.hypersign.data;
        const pricing = new Subscription({});
        const subscriptions = await pricing.fetch({
            subscriber: userData.id
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
        let authCounts = application.authCounts;
        logger.debug('verify::updateAuthCount: application authCounts = ', authCounts);
        authCounts = authCounts + 1;
        await applicationObj.update({ authCounts: authCounts })


        // Update subscription
        const subscriptionObj =  new Subscription({
            id: subscriptionId, subscriber: owner
        });
        const subscription = await subscriptionObj.fetchOne();
        if(!subscription) throw new Error(`No subscription found with owner did = ${owner}`);

        let authCount = subscription.authCount
        authCount = authCount + 1;
        logger.debug('verify::updateAuthCount: subscription authCount = ', authCount);
        await subscriptionObj.update({ authCount });
    }

    router.post('/verify', async (req, res) => {

        try{
            // chcek if there is token in the query
        const { apiAuthToken } = req.query;
        logger.debug('verify:: apiAuthToken =  ', apiAuthToken)
        
        
        if(apiAuthToken){
            logger.debug('verify:: Inside  apiAuthToken if');

            // verify JWT authAPIToken
            jwt.verify(apiAuthToken, options.jwtSecret, async (err, data) => {
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
                options.jwtSecret,
                { expiresIn: options.jwtExpiryTime },
                async (err, token) => {
                    if (err) throw new Error(err);
                    res.status(200).send({ status: 200, message: token, error: null });
                });
        }

        }catch(e){
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
        
    })
    
    return router;
}