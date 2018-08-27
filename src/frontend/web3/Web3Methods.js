export const submitArticle = (_contract, _from, _to, _amount, _data) => {
  return _contract.methods
    .transferAndCall(
      _to,
      _amount,
      '0x20159e37',
      // '0x9b718dd9',
      _data
    )
    .send({
      from: _from
    });
};
