export default interface IApplication{
    id: string;
    planId: string; 
    subscriber: string; // owner's or admin's did
    subscriptionDate: string;
    planName: string;
    authCount: string; // how much has he exhausted
    maxAuthCount: string; // comes from plan
    numberOfApps: string;
    maxAppsCounts: string; // comes from plan
}



    
