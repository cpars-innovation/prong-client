import createClient from './ProngClientFactory'
import {IProngConfigClient, ProngClientType} from "./lib/types";

export * from './ProngClientFactory'

const client = <IProngConfigClient> createClient({
    url: 'https://iot.cpars.de/prong/',
    credentials: {
        username: 'root',
        client_id: 'b3f3b982-16ab-11ea-83b0-000c29effd1c',
        client_secret: 'saqw21!@',
        password: 'Sommer1!',
    },
}, ProngClientType.CONFIG);

client.get('mapping').then(result=>{
    console.log(result);
    }
);
