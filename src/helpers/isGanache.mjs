export const isGanache = (web3) => {
  return web3.currentProvider.host === "http://localhost:7545";
};