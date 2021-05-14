import type { Network } from 'src/Dynode/model/core';
import type { StageUI } from 'src/Dynode/view';
import cellularAutomataExample from './cellularAutomataExample';
import controllerExample from './controllerExample';
import multiCycleExample from './multiCycleExample';

interface ExampleFunc {
  (network: Network, stage: StageUI): unknown;
}

interface ExampleFuncCollection {
  [key: string]: ExampleFunc;
}

const examples: ExampleFuncCollection = {
  cellularAutomataExample,
  controllerExample,
  multiCycleExample,
};

export {
  examples,
  ExampleFunc,
  ExampleFuncCollection,
};
