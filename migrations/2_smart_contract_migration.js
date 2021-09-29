const SmartContract = artifacts.require("REDNUMBERS");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "Red Numbers", "RNs", 
  "ipfs://Qmd9jiQsaFYmKTnvX6VmozbdAqE9brR4FLBqWKGBJkYVwn/",
  "ipfs://QmUfxR9NVXdKXym9rxmAHVHMNDKnfq225Qqvkid2gtZ5ho/unrevealed.json");
};
