import {getContractOwner} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import ContractOwner from '../schema/contract-owner.mjs';

export const writeContractOwnerInDB = async contract => {
  const id = 1;
  const contractOwnerAddress = await getContractOwner(contract);
  let contractOwner = await ContractOwner.findById(id);
  if(!contractOwner) {
    contractOwner = new ContractOwner({
      _id: id,
      address: contractOwnerAddress
    });
  } else {
    contractOwner.address = contractOwnerAddress;
  }
  return await contractOwner.save();
};