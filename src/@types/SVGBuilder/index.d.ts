/* eslint-disable @typescript-eslint/no-explicit-any */

declare type SVGBElementAttrs = { [name: string]: any };

declare type SVGBPoint = { x: number, y: number };

declare type SVGBPointPartial = { x?: number, y?: number };

declare class SVGBElement {
  constructor();
  element: HTMLElement;

  debugMode: boolean;

  log(...args: any[]): void;
  createElement(elementName: string, attr: SVGBElementAttrs, nodeValue: string): HTMLElement;
  wrapElement(targetNode: HTMLElement): void;
  setAttributes(attr: SVGBElementAttrs, force?: boolean): void;
  setStyle(styleObj: {[name: string]: string}, wipe?: boolean): void;
  setValue(nodeValue: string): void;
  init(elementName: string, attr: SVGBElementAttrs, attrList: [string], nodeValue?: string): void;
  insert(container: HTMLElement|null, wipe?: boolean): void;
  remove(): void;
  clone(): void;
  getTransform(template?: string): SVGBTransform;
  translate(x: number, y: number, relative?: boolean): void;
  rotate(angle: number, cx: number, cy: number, relative?: boolean): void;
  scale(sx: number, sy: number): void;
  setClip(clipPathId: string): void;
  lowerToBottom(): void;
  lower(): void;
  raise(): void;
  raiseToTop(): void;
}

declare class SVGBTransform {
  constructor(targetNode: HTMLElement, template?: string);
  addDefinition(fn: string, params: [number], apply?: boolean): void;
  clear(apply?: boolean): void;
  apply(): void;
}

declare class SVGBRect extends SVGBElement {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBCircle extends SVGBElement {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBEllipse extends SVGBElement {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBLine extends SVGBElement {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBPolyline extends SVGBElement {
  constructor(attr: SVGBElementAttrs, points?: [{[string]: number|string}]);
  addPoint(point: {[string]:number|string}): void;
  update(): void;
  clone(): SVGBPolyline;
  wrapElement(targetNode: HTMLElement): void;
}

declare class SVGPolygon extends SVGBPolyline {
  constructor(attr: SVGBElementAttrs, points?: [{[string]:number|string}]);
}

declare class SVGBPath extends SVGBElement {
  constructor(attr: SVGBElementAttrs, points?: [{[string]:number|string}]);
  addPoint(point: {[string]:number|string}): void;
  update(): void;
  clone(): SVGBPath;
  wrapElement(targetNode: HTMLElement): void;
}

declare class SVGBText extends SVGBElement {
  constructor(attr: SVGBElementAttrs, value: string);
}

declare class SVGBUse extends SVGBElement {
  constructor(attr: SVGBElementAttrs, href: string);
  setHref(href: string): void;
}

declare class SVGBImage extends SVGBElement {
  constructor(attr: SVGBElementAttrs, imgURL: string);
  setHref(href: string): void;
  load(onLoaded?: function, onError?: function): void;
}

declare class SVGBFile extends SVGBElement {
  constructor(attr: SVGBElementAttrs, svgURL: string);
  load(onLoaded?: function, onError?: function): void;
  getElement(id: string): SVGBElement;
}

declare class SVGBContainer extends SVGBElement {
  constructor();
  wipe(): void;
  addElement(
    elementName: string, attr: SVGBElementAttrs, attrList: [string], nodeValue?: string
  ): SVGBElement;
  addContainerElement(
    elementName: string, attr: SVGBElementAttrs, attrList: [string], nodeValue?: string
  ): SVGBContainer;
  addRect(attr?: SVGBElementAttrs): SVGBRect;
  addCircle(attr?: SVGBElementAttrs): SVGBCircle;
  addEllipse(attr?: SVGBElementAttrs): SVGBEllipse;
  addLine(attr?: SVGBElementAttrs): SVGBLine;
  addPolyline(attr?: SVGBElementAttrs, points?: [{[string]:number|string}]): SVGBPolyline;
  addPolygon(attr?: SVGBElementAttrs, points?: [{[string]:number|string}]): SVGPolygon;
  addPath(attr?: SVGBElementAttrs, points?: [{[string]:number|string}]): SVGBPath;
  addText(attr?: SVGBElementAttrs, value: string): SVGBText;
  addGroup(attr?: SVGBElementAttrs): SVGBGroup;
  addForeignObject(attr?: SVGBElementAttrs): SVGBForeignObject;
  addDefs(attr?: SVGBElementAttrs): SVGBDefs;
  addUse(attr?: SVGBElementAttrs, href: string): SVGBUse
  addClipPath(attr?: SVGBElementAttrs): SVGBClipPath;
  addImage(
    attr: SVGBElementAttrs, imgURL: string, onLoaded?: function, onError?: function
  ): SVGBImage;
  addSVGBFile(
    attr: SVGBElementAttrs, svgURL: string, onLoaded?: function, onError?: function
  ): SVGBFile;
}

declare class SVGBDraggableEvent {
  type: string;

  currentTarget: SVGBDraggable;

  target: SVGBDraggable;

  constructor(type: string);
}

declare class SVGBDraggable {
  body: SVGBElement;

  xBody: number;

  yBody: number;

  xBodyOffset: number;

  yBodyOffset: number;

  xStart: number;

  yStart: number;

  xScreenStart: number;

  yScreenStart: number;

  xScreen: number;

  yScreen: number;

  dxScreen: number;

  dyScreen: number;

  xLocal: number;

  yLocal: number;

  dxLocal: number;

  dyLocal: number;

  constructor(body: SVGBElement);
  isActive(): boolean;
  getPosition(): void;
  setPosition(point: SVGBPointPartial, pointerReg?: boolean): void;
  isSnapped(): boolean;
  snap(point?: SVGBPointPartial, pointerReg?: boolean): void;
  unsnap(): void;
  enable(handle: SVGBElement, onStartDrag: (e: Event) => void): void;
  disable(): void;
  start(position: SVGBPoint): void;
  move(position: SVGBPoint): void;
  release(): void;
  cancel(): void;
  stop(): void;
  addEventListener(eventType: string, eventListener: (e: SVGBDraggableEvent) => void): void;
  removeEventListener(eventType: string, eventListener: (e: SVGBDraggableEvent) => void): void;
  dispatchEvent(draggableEvent: SVGBDraggableEvent): void;
}

declare class SVGBuilder extends SVGBContainer {
  constructor(attr?:SVGBElementAttrs);
  setViewBox(params: {[string]:number|string}): void;
  draggable(handle: SVGBElement, body?: SVGBElement): SVGBDraggable;
}

declare class SVGBGroup extends SVGBContainer {
  constructor(attr?: SVGBElementAttrs);
}

declare class SVGBForeignObject extends SVGBContainer {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBClipPath extends SVGBContainer {
  constructor(attr: SVGBElementAttrs);
}

declare class SVGBDefs extends SVGBContainer {
  constructor(attr: SVGBElementAttrs);
}

/*
TODO:
SVGSprite
SVGSpriteInstance
*/

/* eslint-enable */
