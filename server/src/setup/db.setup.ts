import { logger } from '../config'
import  create  from './pricing.setup';

export default  async function setupDb(){
    try{
        await create();
    }
    catch(e){
        logger.error(e)
    }
}

