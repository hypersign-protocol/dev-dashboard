import { Router } from 'express';
import { Application } from '../services/application.service';
import { Subscription } from '../services/subscription.service';
import { User } from '../services/user.service';

export = (hypersign) => {
    const router = Router();

    router.post('/', hypersign.authenticate.bind(hypersign), async (req, res) => {
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
    router.post('/protected', hypersign.authorize.bind(hypersign), async (req, res) => {
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
    
    return router;

}