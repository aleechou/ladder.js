const cluster = require('cluster')
if (cluster.isMaster) {
    require(__dirname+"/main.js")
}
else{
    require(__dirname+"/worker.js")
}

process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});