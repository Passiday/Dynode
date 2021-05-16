import { Engine, Network } from 'src/Dynode/model';
import { StageView, NodeView, LinkView } from 'src/Dynode/view';
import './index.scss';
import { examples, ExampleFuncCollection } from 'src/examples';

// Temporarily, the network and stage will be published to the global scope
// so that they can be manipulated from the console

const engine = new Engine();
const network = new Network('network', engine); // TODO: (PJ) I'd like to do engine.createNetwork() instead. Also, I don't think the networks need names.
const stageContainer = document.getElementById('dynodeContainer');
if (stageContainer === null) throw new Error('dynodeContainer element does not exist.');
const stage = new StageView(stageContainer);

const exampleWrappers: ExampleFuncCollection = {};
for (const [key, value] of Object.entries(examples)) {
  exampleWrappers[key] = () => value(network, stage);
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  NodeView,
  LinkView,
  example: exampleWrappers,
});
