import { Router } from 'express';
import { Application } from '../services/application.service';
import { generateHypersignJson } from '../setup/bootstrapCredential';
import { validateUserSubscription } from '../middleware/others';
export = (hypersign) => {

    const router = Router();

    router.get('/', hypersign.authorize.bind(hypersign), async (req, res) => {
        try {
            const userData  = req.body.hypersign.data;
            const app = new Application({});
            const appList = await app.fetch({
                owner: userData.email
            });
            res.status(200).send({ status: 200, message: appList, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });

    router.post('/create', hypersign.authorize.bind(hypersign), validateUserSubscription, async (req, res) => {    
    // router.post('/create',  hypersign.authorize.bind(hypersign), async (req, res) => {    
        try {
            const userData  = req.body.hypersign.data;
            const { basic, advance, jwt, rft  } = req.body;
            console.log("Before calling generateHypersignJson")
            const { hypersignJSON, app } = await generateHypersignJson(basic, advance, jwt, rft, userData ? userData["email"]: basic.did ); 
            console.log("After calling generateHypersignJson")
            // step3: Generate hypersign.json data and return
            res.status(200).send({ status: 200, message: { hypersignJSON, newApp: app }, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    });
    
    return router;
}