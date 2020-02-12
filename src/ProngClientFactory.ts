import { CodeCredentials } from "./lib/types";
import { IProngClient, ProngClient } from "./lib/clients/ProngClient";

export default function createClient(config:{url: string, credentials: Required<CodeCredentials>}): IProngClient{
    return new ProngClient(config);
}