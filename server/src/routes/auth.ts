import { Router } from 'express';
import { Application } from '../services/application.service';
import { Subscription } from '../services/subscription.service';

export = (hypersign) => {
    const router = Router();

    router.post('/', hypersign.authenticate.bind(hypersign), async (req, res) => {
        try {
            const { data } = req.body.hypersign;
            if (!data.user) throw new Error(`Could not fetch usermodel from Hypersign auth`)
            res.status(200).send({ status: 200, message: "Success", error: null });

        } catch (e) {

            console.log(e)
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    })

    // use this api for verification of authorization token
    // this api gets called before each route in frontend
    router.post('/protected', hypersign.authorize.bind(hypersign), async (req, res) => {
        try {
            const user = req.body.hypersign.data;
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
    
    return router;

}