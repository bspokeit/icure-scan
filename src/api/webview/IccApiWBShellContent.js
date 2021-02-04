//window.crypto = require('./msrCrypto');

import IccApi from './icc-api-bridge';

// IccApi.initCrypto().then((result) => {
//   console.log(result);
// });

setTimeout(function () {
  console.log('IccApi : ', IccApi);
  // window.alert('greetings from the WebView !');
}, 3000);
