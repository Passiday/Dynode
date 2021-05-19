import type { Network } from 'src/Dynode/model/core';
import type { StageView } from 'src/Dynode/view';
import cellularAutomata from './cellularAutomata';
import logicNodeExample from './logicGates';
import controller from './controller';
import multiCycle from './multiCycle';

interface ExampleFunc {
  (network: Network, stage: StageView): unknown;
}

interface ExampleFuncCollection {
  [key: string]: ExampleFunc;
}

const examples: ExampleFuncCollection = {
  cellularAutomata,
  controller,
  multiCycle,
  logicNodeExample,
};

export {
  examples,
  ExampleFunc,
  ExampleFuncCollection,
};
