import Network from './network';
import Node from './node';

const n = new Network();

declare global { function publishToGlobal(assets: Record<string, unknown>):void; }
global.publishToGlobal({
  demoNetwork: n,
});
