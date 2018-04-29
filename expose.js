var localtunnel = require('localtunnel'); 
var tunnel = localtunnel(8080, {subdomain:"stikk"},function(err, tunnel) {
    if (err) {}

});