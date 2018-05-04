var Utils = require('../utils');

const INDEX_PER_PAGE = 10;

module.exports.index = async function(ctx, next) {
  var params = ctx.query,
      page = params.page ? params.page : 1,
      nodesIndexLength = await ctx.nodeRegistryAPI.getNodesIndexLength(),
      totalPages = nodesIndexLength === 0 ? 1 : Math.ceil(nodesIndexLength/INDEX_PER_PAGE),
      result = [],
      initialIndex = (page - 1) * INDEX_PER_PAGE,
      maxIndex = page * INDEX_PER_PAGE;

  if (nodesIndexLength !== 0 && page <= totalPages) {
    for (var i = initialIndex; i < maxIndex; i++) {
      if (i < nodesIndexLength) {
        var currentNodeNonce = await ctx.nodeRegistryAPI.nodesIndex(i),
            currentNodeRawData = await ctx.nodeRegistryAPI.getNode(currentNodeNonce),
            currentNode = Utils.parseNodeRawData(currentNodeRawData);
        result.push(currentNode);
      } else {
        break;
      }
    }
  }

  ctx.body = {
    nodes: result
  }
  await next();
};

module.exports.get = async function(ctx, next) {
  var params = ctx.params,
      nodeRawData = await ctx.nodeRegistryAPI.getNode(ctx.params.nonce),
      node = Utils.parseNodeRawData(nodeRawData);
  ctx.body = {
    node: node
  }
  await next();
};
