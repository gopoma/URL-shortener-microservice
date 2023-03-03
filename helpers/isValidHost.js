const dns = require("dns");

function isValidHost(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err) => {
      if(err) {
        return  resolve(false);
      }

      return resolve(true);
    });
  });
}

module.exports = isValidHost;