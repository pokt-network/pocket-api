const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const NodesController = require('./controllers/nodes');
const ContractsController = require('./controllers/contracts');
const KoaLogger = require('koa-logger');

class PocketApiServer {
  constructor(port) {
    this.configureServer();
    this.setupControllers();
    this.configureRoutes();
    // Start the node
    this.start(port);
  }

  start(port){
    this.webServer.listen(port, function(){
      console.log("Pocket Api started on port:%d", this.address().port);
    });
  }

  // TO-DO: Implement this
  setupControllers(){

  }

  configureRoutes(){
    this.webServer.use(this.webRouter.routes());
    this.webServer.use(this.webRouter.allowedMethods());
  }

  configureServer(){
    this.webServer = new Koa();
    this.webRouter = new Router();
    this.webServer.use(KoaBody());
    this.webServer.use(KoaLogger());
  }
}

module.exports = PocketApiServer;
