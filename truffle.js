module.exports = {
  networks: {
      development: {
        host: "localhost",
        port: 7545,
        network_id: "*" // Match any network id
    }
/*
    ,
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 7545,         // <-- If you change this, also set the port option in .solcover.js.
      //gas: 0x888C46,      // <-- Use this high gas value
      //gasPrice: 0x01      // <-- Use this low gas price
    }
    */
 }
};
