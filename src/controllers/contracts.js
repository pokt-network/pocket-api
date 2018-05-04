module.exports.index = async function(ctx, next) {
  var result = [];

  // TO-DO: Do this dynamically
  result.push({name: 'NodeRegistryAPI', address: ctx.nodeRegistryAPI.address});
  result.push({name: 'EpochRegistryAPI', address: ctx.epochRegistryAPI.address});
  result.push({name: 'ContractDirectoryAPI', address: ctx.contractDirectoryAPI.address});

  ctx.body = {
    contracts: result
  }
  await next();
};
