import {deployAndMint} from './deployer-and-mint.mjs';

const run = async () => {
  await deployAndMint();
  process.exit();
};

run();