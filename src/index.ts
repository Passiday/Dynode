import Network from './network';
import Node from './node';

const n = new Network();

import {SVGBuilder} from "./SVGBuilder";
declare var SVGBuilder: SVGBuilder;

function SVGPlayground() {
  const svg = new SVGBuilder();
  svg.insert(document.getElementById('dynodeContainer'));
  const r = svg.addRect({x:10, y:10, width:200, height:150, style:{fill:'yellow'}});
  r.translate(200, 100);
  const p = svg.addPath({style:{fill:'red'}});
  p.addPoint({cmd:'M', x:0, y:0});
  p.addPoint({cmd:'l', dx:100, dy:20});
  p.addPoint({cmd:'l', dx:-40, dy:50});
  p.addPoint({cmd:'Z'});
  p.update();
  p.translate(400, 200);
  svg.draggable(r);
  svg.draggable(p);
  return svg;
}

const sb = SVGPlayground();

declare global { function publishToGlobal(assets: Record<string, unknown>):void; }
publishToGlobal({
  demoNetwork: n,
  svgBuilder: sb
});