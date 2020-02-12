//export * from './ProngClientFactory'

import createClient from './ProngClientFactory';

(function(window) {
  // @ts-ignore
  window.createClient = createClient;
})(window);

/*const prongClient = createClient({
  url: 'https://iot.cpars.de/prong/',
  credentials: {
    username: 'root',
    client_id: 'b3f3b982-16ab-11ea-83b0-000c29effd1c',
    client_secret: 'saqw21!@',
    password: 'Sommer1!',
  },
});

prongClient.get('Equipment', 's4demo', {id: '217100001'}).then(
  function(result) {
    console.log(result);
  },
  function(error) {
    console.log(error);
  },
);
*/