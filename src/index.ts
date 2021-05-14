import { StandardEngine } from 'src/Dynode/model/standardDefinitions';
import { Network } from 'src/Dynode/model/core';
import { StageUI, NodeUI, LinkUI } from 'src/Dynode/view';
import './main.scss';
import { examples, ExampleFuncCollection } from './examples';

// Temporarily, the network and stage will be published to the global scope
// so that they can be manipulated from the console

const engine = new StandardEngine();
const network = new Network('network', engine); // TODO: (PJ) I'd like to do engine.createNetwork() instead. Also, I don't think the networks need names.
const stageContainer = document.getElementById('dynodeContainer');
if (stageContainer === null) throw new Error('dynodeContainer element does not exist.');
const stage = new StageUI(stageContainer);

const exampleWrappers: ExampleFuncCollection = {};
for (const [key, value] of Object.entries(examples)) {
  exampleWrappers[key] = () => value(network, stage);
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  NodeUI,
  LinkUI,
  ...exampleWrappers,
});
