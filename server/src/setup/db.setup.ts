import { SchemaType, DBService } from '../services/db.service';
import { logger } from '../config'
import  create  from './pricing.setup';

let dbService: DBService;
dbService = new DBService();

async function dropTable(type: SchemaType){
    try{
        await dbService.dropTable(type)
    }catch(e){
        logger.error(e)
    }
}

async function createTable(type: SchemaType){
    await dbService.createTable(type) 
}

export default  async function setupDb(){
    try{
        await dropTable(SchemaType.User)
        await dropTable(SchemaType.Application)
        await dropTable(SchemaType.VerifiableCredential)
        await dropTable(SchemaType.Pricing)
        await dropTable(SchemaType.Subscription)
        
        await createTable(SchemaType.User) 
        await createTable(SchemaType.Application) 
        await createTable(SchemaType.VerifiableCredential)
        await createTable(SchemaType.Pricing)  
        await createTable(SchemaType.Subscription)
        
        await create();
    }
    catch(e){
        logger.error(e)
    }
}

