module.exports.hex2a = function(hexx) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

module.exports.parseNodeRawData = function(nodeRawData) {
  return {
    nonce: nodeRawData[0],
    owner: nodeRawData[1],
    networks: nodeRawData[2].map(function(currentValue){return module.exports.hex2a(currentValue)}),
    endpoint: nodeRawData[3]
  }
}
