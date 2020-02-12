//export * from './ProngClientFactory'

import createClient from './ProngClientFactory';

(function(window) {
  // @ts-ignore
  window.createClient = createClient;
})(window);

