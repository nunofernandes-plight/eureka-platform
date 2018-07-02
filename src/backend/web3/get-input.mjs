import path from 'path';
import fs from 'fs';

const DIR_NAME = path.resolve(path.dirname(''));

export const getEurekaSmartContractInput = () => {
  return {
    'Utils.sol': fs.readFileSync(
      path.resolve(DIR_NAME, 'src/smartcontracts/Utils.sol'),
      'utf-8'
    ),
    'SafeMath.sol': fs.readFileSync(
      path.resolve(DIR_NAME, 'src/smartcontracts/SafeMath.sol'),
      'utf-8'
    ),
    'Eureka.sol': fs.readFileSync(
      path.resolve(DIR_NAME, 'src/smartcontracts/Eureka.sol'),
      'utf-8'
    )
  };
};

export default getEurekaSmartContractInput;
