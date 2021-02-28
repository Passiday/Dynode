function SVGPlayground() {
  const svg = new SVGBuilder();
  svg.insert(document.getElementById('dynodeContainer'));
  const r = svg.addRect({
    x: 10,
    y: 10,
    width: 200,
    height: 150,
    style: { fill: 'yellow' },
  });
  r.translate(200, 100);
  const p = svg.addPath({ style: { fill: 'red' } });
  p.addPoint({ cmd: 'M', x: 0, y: 0 });
  p.addPoint({ cmd: 'l', dx: 100, dy: 20 });
  p.addPoint({ cmd: 'l', dx: -40, dy: 50 });
  p.addPoint({ cmd: 'Z' });
  p.update();
  p.translate(400, 200);
  const fog = svg.addGroup();
  fog.translate(50, 30);
  const fo = fog.addForeignObject({ width: 400, height: 200 });
  const foDiv = document.createElement('div');
  foDiv.innerHTML = 'Hello, <strong>World</strong>. This is plain HTML in a <em>&lt;foreignObject&gt;</em> SVG element.';
  foDiv.style.backgroundColor = 'rgba(255,255,255,0.5)';
  foDiv.style.position = 'absolute';
  foDiv.style.top = '0px';
  foDiv.style.bottom = '0px';
  fo.element.appendChild(foDiv);
  svg.draggable(r);
  svg.draggable(p);
  svg.draggable(fog);
  return svg;
}

const sb = SVGPlayground();

publishToGlobal({
  svgBuilder: sb,
});
