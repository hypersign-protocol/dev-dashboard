import { Router } from 'express';
import PricingModel, {IPricing} from '../models/pricing';

export = () => {

    const router = Router();

    router.post('/', async (req, res) => {
        const plan = req.body;
        plan.offerings = JSON.stringify(plan.offerings);
        const newPrice: IPricing = await PricingModel.create({
            ...plan
          });
        res.status(200).send({ status: 200, message: newPrice, error: null });
    })

    router.get('/', async (req, res) => {
        const pricings:Array<IPricing> = await PricingModel.find({});
        res.status(200).send({ status: 200, message: pricings, error: null });
    })

    return router;
}