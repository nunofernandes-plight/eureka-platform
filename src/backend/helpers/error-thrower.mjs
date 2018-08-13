
export default {
  notLoggedIn: () => {
    let error = new Error('Access denied, not logged in Backend');
    error.status = 401;
    throw error;
  },
  notCorrectEthereumAddress: () => {
    let error = new Error('Access denied, provided ethereum-address does not match owner-address');
    error.status = 403;
    throw error;
  }
}