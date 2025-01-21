const crypto = require("crypto");

exports.generatePin = () => ({
  pin: crypto.randomInt(100000, 999999).toString(),
  expires: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
});
