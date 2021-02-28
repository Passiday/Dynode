type SVGElementAttrs = {[name: string]: any};

export interface SVGElement {
  new(): SVGElement;
  element: HTMLElement;
  debugMode: boolean;
  log(...args: any[]): void;
  createElement(elementName: string, attr: SVGElementAttrs, nodeValue: string): HTMLElement;
  wrapElement(targetNode: HTMLElement): void;
  setAttributes(attr: SVGElementAttrs, force?: boolean): void;
  setStyle(styleObj: {[name: string]: string}, wipe?: boolean): void;
  setValue(nodeValue: string): void;
  init(elementName: string, attr: SVGElementAttrs, attrList: [string], nodeValue?: string): void;
  insert(container: HTMLElement|null, wipe?: boolean): void;
  remove(): void;
  clone(): void;
  getTransform(template?: string): SVGTransform;
  translate(x: number, y: number, relative?: boolean): void;
  rotate(angle: number, cx: number, cy: number, relative?: boolean): void;
  scale(sx: number, sy: number): void;
  setClip(clipPathId: string): void;
  lowerToBottom(): void;
  lower(): void;
  raise(): void;
  raiseToTop(): void;
}

export interface SVGTransform {
  new(targetNode: HTMLElement, template?: string): SVGTransform;
  addDefinition(fn: string, params: [number], apply?: boolean): void;
  clear(apply?: boolean): void;
  apply(): void;
}

export interface SVGRect extends SVGElement {
  new(attr: SVGElementAttrs): SVGRect;
}

export interface SVGCircle extends SVGElement {
  new(attr: SVGElementAttrs): SVGCircle;
}

export interface SVGEllipse extends SVGElement {
  new(attr: SVGElementAttrs): SVGEllipse;
}

export interface SVGLine extends SVGElement {
  new(attr: SVGElementAttrs): SVGLine;
}

export interface SVGPolyline extends SVGElement {
  new(attr: SVGElementAttrs, points?: [{[string]: number|string}]): SVGPolyline;
  addPoint(point: {[string]:number|string}): void;
  update(): void;
  clone(): SVGPolyline;
  wrapElement(targetNode: HTMLElement): void;
}

export interface SVGPolygon extends SVGPolyline {
  new(attr: SVGElementAttrs, points?: [{[string]:number|string}]): SVGPolygon;
}

export interface SVGPath extends SVGElement {
  new(attr: SVGElementAttrs, points?: [{[string]:number|string}]): SVGPath;
  addPoint(point: {[string]:number|string}): void;
  update(): void;
  clone(): SVGPath;
  wrapElement(targetNode: HTMLElement): void;
}

export interface SVGText extends SVGElement {
  new(attr: SVGElementAttrs, value: string): SVGText;
}

export interface SVGUse extends SVGElement {
  new(attr: SVGElementAttrs, href: string): SVGUse;
  setHref(href: string): void;
}

export interface SVGImage extends SVGElement {
  new(attr: SVGElementAttrs, imgURL: string): SVGImage;
  setHref(href: string): void;
  load(onLoaded?: function, onError?: function): void;
}

export interface SVGFile extends SVGElement {
  new(attr: SVGElementAttrs, svgURL: string): SVGFile;
  load(onLoaded?: function, onError?: function): void;
  getElement(id: string): SVGElement;
}

export interface SVGContainer extends SVGElement {
  new(): SVGContainer;
  addRect(attr?: SVGElementAttrs): SVGRect;
  addCircle(attr?: SVGElementAttrs): SVGCircle;
  addEllipse(attr?: SVGElementAttrs): SVGEllipse;
  addLine(attr?: SVGElementAttrs): SVGLine;
  addPolyline(attr?: SVGElementAttrs, points?: [{[string]:number|string}]): SVGPolyline;
  addPolygon(attr?: SVGElementAttrs, points?: [{[string]:number|string}]): SVGPolygon;
  addPath(attr?: SVGElementAttrs, points?: [{[string]:number|string}]): SVGPath;
  addText(attr?: SVGElementAttrs, value: string): SVGText;
  addGroup(attr?: SVGElementAttrs): SVGGroup;
  addForeignObject(attr?: SVGElementAttrs): SVGForeignObject;
  addDefs(attr?: SVGElementAttrs): SVGDefs;
  addUse(attr?: SVGElementAttrs, href: string): SVGUse
  addClipPath(attr?: SVGElementAttrs): SVGClipPath;
  addImage(attr: SVGElementAttrs, imgURL: string, onLoaded?: function, onError?: function): SVGImage;
  addSVGFile(attr: SVGElementAttrs, svgURL: string, onLoaded?: function, onError?: function): SVGFile;
}

export interface SVGBuilder extends SVGContainer {
  new(attr?:SVGElementAttrs): SVGBuilder;
  setViewBox(params: {[string]:number|string}): void;
  draggable(handle: SVGElement, callback?: function, body?: SVGElement): void;
}

export interface SVGGroup extends SVGContainer {
  new(attr: SVGElementAttrs): SVGGroup;
}

export interface SVGForeignObject extends SVGContainer {
  new(attr: SVGElementAttrs): SVGForeignObject;
}

export interface SVGClipPath extends SVGContainer {
  new(attr: SVGElementAttrs): SVGClipPath;
}

export interface SVGDefs extends SVGContainer {
  new(attr: SVGElementAttrs): SVGDefs;
}

/*
TODO:
export interface SVGSprite
export interface SVGSpriteInstance extends SVGGroup
*/
