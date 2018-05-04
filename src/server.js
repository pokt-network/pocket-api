const KoaStatic = require('koa-static');
const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const NodesController = require('./controllers/nodes');
const ContractsController = require('./controllers/contracts');
const KoaLogger = require('koa-logger');
const ContractDirectoryAPIABI = require('./contracts/ContractDirectoryAPI.json').abi;
const NodeRegistryAPIABI = require('./contracts/NodeRegistryAPI.json').abi;
const EpochRegistryAPIABI = require('./contracts/EpochRegistryAPI.json').abi;
const ContractDirectoryAPIAddressMap = {
  '4': "0x1510f9fafa49f35fb6a4851a8c2ff56435e60902"
};
var TruffleContract = require("truffle-contract");
var Web3 = require("web3");

class PocketApiServer {
  constructor(port, ethereumURL, networkID) {
    console.log("Initialized server on port: " + port + " Ethereum Node: " + ethereumURL + " and Networkd ID: " + networkID);
    // Setup properties
    this.port = port;
    this.ethereumURL = ethereumURL;
    this.networkID = networkID;
    this.web3HttpProvider = new Web3.providers.HttpProvider(this.ethereumURL);

    // Initialize server configurations
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

  setupControllers(){
    var server = this;
    // Setup the /nodes routes
    this.webRouter.get('/nodes/:nonce', async (ctx, next) => {
      ctx.nodeRegistryAPI = await server.getNodeRegistryAPI();
      await next();
    }, NodesController.get);
    this.webRouter.get('/nodes', async (ctx, next) => {
      ctx.nodeRegistryAPI = await server.getNodeRegistryAPI();
      await next();
    }, NodesController.index);

    // Setup the /contracts routes
    this.webRouter.get('/contracts', async (ctx, next) => {
      ctx.nodeRegistryAPI = await server.getNodeRegistryAPI();
      ctx.epochRegistryAPI = await server.getEpochRegistryAPI();
      ctx.contractDirectoryAPI = await server.getContractDirectoryAPI();
      await next();
    }, ContractsController.index);
  }

  configureRoutes(){
    this.webServer.use(this.webRouter.routes());
    this.webServer.use(this.webRouter.allowedMethods());
    this.webServer.use(KoaStatic('public'));
  }

  configureServer(){
    this.webServer = new Koa();
    this.webRouter = new Router();
    this.webServer.use(KoaBody());
    this.webServer.use(KoaLogger());
  }

  getContractDirectoryAddress() {
    var result = ContractDirectoryAPIAddressMap[this.networkID];
    if (!result) {
      throw "Invalid network ID";
    }
    return result;
  }

  async getContractAddress(contract) {
    var contractDirectoryAPI = await this.getContractDirectoryAPI(),
        result = await contractDirectoryAPI.contracts.call(contract);
    return result;
  }

  async getNodeRegistryAPI() {
    if (!this.nodeRegistryAPI) {
      this.nodeRegistryAPI = await this.getContractInstance(NodeRegistryAPIABI, await this.getContractAddress('NodeRegistry'));
    }
    return this.nodeRegistryAPI;
  }

  async getEpochRegistryAPI() {
    if (!this.epochRegistryAPI) {
      this.epochRegistryAPI = await this.getContractInstance(EpochRegistryAPIABI, await this.getContractAddress('EpochRegistry'));
    }
    return this.epochRegistryAPI;
  }

  async getContractDirectoryAPI() {
    if (!this.contractDirectoryAPI) {
      this.contractDirectoryAPI = await this.getContractInstance(ContractDirectoryAPIABI, this.getContractDirectoryAddress());
    }
    return this.contractDirectoryAPI;
  }

  getContractInstance(abi, address) {
    var Contract = TruffleContract({
          abi: abi
        }),
        result = null;
    Contract.setNetwork(parseInt(this.networkID));
    Contract.setProvider(this.web3HttpProvider);
    return new Promise(function(resolve, reject){
      Contract.at(address).then(function(instance){
        resolve(instance);
      });
    });
  }
}

//https://rinkeby.infura.io/mTHA4OGRiv9h9kJgTv7u

module.exports = PocketApiServer;
