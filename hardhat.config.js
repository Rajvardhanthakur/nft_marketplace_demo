require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.4",
    paths: {
        artifacts: "./src/backend/artifacts",
        sources: "./src/backend/contracts",
        cache: "./src/backend/cache",
        tests: "./src/backend/test"
    },
    networks: {
        rinkeby: {
            url: 'https://eth-rinkeby.alchemyapi.io/v2/5knCTQoFdcQc0gMsya7DpqKmNfT8jZKn',
            accounts: ['adb57ca905510a86061316608261056fbdb6e095615c37fc81bf835356f2bcc3']
        }
    }
}