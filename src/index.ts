import { CodeCredentials, ProngClientType, Clients } from './lib/types';
import { ProngConfigClient, ProngResourceClient, ProngProxyClient } from './lib/clients';

export * from './lib/types';

/**
 * Factory Method for creating a prong client.
 * The default client is the Resource Client since that is what is most often used
 * you can control which client is created by passing the type as the second
 * argument to the factory.
 * @param config
 * @param type
 */
export function createClient(config: {url: string; credentials: Required<CodeCredentials>}, type: ProngClientType = ProngClientType.RESOURCE): Clients {
    switch (type) {
      case ProngClientType.CONFIG:
        return new ProngConfigClient(config);
      case ProngClientType.RESOURCE:
        return new ProngResourceClient(config);
      case ProngClientType.PROXY:
        return new ProngProxyClient(config);
    }
  }
  