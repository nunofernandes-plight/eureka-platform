export const getEtherscanLink = network => {
  if (network && network !== 'MAIN')
    return 'https://' + network.toLowerCase() + '.etherscan.io/';
  else return 'https://etherscan.io/';
};
