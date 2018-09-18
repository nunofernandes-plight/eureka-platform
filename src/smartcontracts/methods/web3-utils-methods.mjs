export const getGasEstimation = (func, fromAccount) => {
  return func.estimateGas({
    from: fromAccount
  });
};
