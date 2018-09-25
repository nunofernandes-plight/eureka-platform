import {deploy} from './deployer-and-mint.mjs';

const run = async () => {
  await deploy();
  process.exit();
};

run();