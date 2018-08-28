export const Methods = [
  {
    title: 'Minting',
    note:
      'This function can be used for sending EUREKA Tokens to a specific Ethereum Address. However, it can be called if and only if the Minting is still open (see function below). ',
    placeholder: 'Enter Ethereum Address for sending EKA tokens',
    stateKey: 'mintingAddress',
    buttonText: 'Mint'
  },

  {
    title: 'Finish Minting',
    note:
      'This function must be called once the Minting is finished. Attention: no other interaction is possible with the Smart Contract if this function gets not called. ',
    buttonText: 'Finish Minting'
  },
  {
    title: 'Assign Editor',
    placeholder: 'Enter Ethereum Address for assigning Editor',
    note:
      "With this function the Smart Contract owner can assign to a specific Ethereum Address a Editor's role within the EUREKA platform",
    stateKey: 'editorAddress',
    buttonText: 'Assign'
  }
];
