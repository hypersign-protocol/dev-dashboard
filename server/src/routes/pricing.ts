import { Router } from 'express'
import { Pricing } from '../services/pricing.service';

export = () => {

    const router = Router();

    router.post('/create', async (req, res) => {
        const plan = req.body;
        plan.offerings = JSON.stringify(plan.offerings);
        const pricing = new Pricing({ ...plan });
        const price = await pricing.create();
        res.status(200).send({ status: 200, message: price, error: null });
    })

    router.get('/', async (req, res) => {
        const pricing = new Pricing({});
        let pricings = await pricing.fetch();
        res.status(200).send({ status: 200, message: pricings, error: null });
    })

    return router;
}