import type Network from '../network';
import type { StageUI } from '../DynodeUI';
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
  ExampleFuncCollection
};
