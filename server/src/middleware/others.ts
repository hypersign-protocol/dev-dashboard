import { Subscription } from '../services/subscription.service';
import { Application } from '../services/application.service';
import { fetchSchema } from '../setup/bootstrapCredential';
import SubscriptionModel, { ISubscription } from '../models/subscription'
export async function validateUserSubscription(req, res, next) {
    try {
        const userDid = req.body.userData.id;
    
        const subscriptions:Array<ISubscription> = await SubscriptionModel.where({subscriber: userDid}).find({});

        const app = new Application({});
        const appList = await app.fetch({
            owner: userDid
        });

        const maxAppsCounts = subscriptions[0].maxAppsCounts;
        const createdAppsCount = appList.length;

        if (createdAppsCount >= maxAppsCounts) {
            throw new Error(`Upto ${maxAppsCounts} apps are allowed as per your subscribed plan.  Please upgrade your plan.`)
        }

        next();

    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message });
    }
}

export async function validateSchemaCreation(req, res, next) {
    try {
        const userDid = req.body.userData.id;
        const pricing = new Subscription({});
        const subscriptions = await pricing.fetch({
            subscriber: userDid
        });

        let schemaList = await fetchSchema({author: userDid});

        const maxAppsCounts = subscriptions[0]["maxAppsCounts"];
        const createdSchemaCount = schemaList.length;

        if (createdSchemaCount >= maxAppsCounts) {
            throw new Error(`Upto ${maxAppsCounts} schemas are allowed as per your subscribed plan. Please upgrade your plan.`)
        }
        next();

    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message });
    }
}

