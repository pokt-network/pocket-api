var PocketApiServer = require('../server');

module.exports = function(program) {
  program
    .command('start')
    .option('-p, --port [number]', 'Specify port [3000]', '3000')
    .option('-e, --ethereum [value]', 'Ethereum RPC-API host and port [http://localhost:8545]', 'http://localhost:8545')
    .option('-n, --network [number]', 'Ethereum Network ID [4]', '4')
    .action(function (cmd) {
      new PocketApiServer(cmd.port, cmd.ethereum, cmd.network);
    });
}
