/* class SVGBElement ***************************************************************************************************************************/

class SVGBElement {
  // Base class for all svg elements
  constructor() {
    this.debugMode = false;
    this.attrList = [
      "id", "style", "class",
      "onclick", "onmousedown", "onmouseup", "onmousemove", "onmouseenter", "onmouseleave"
    ];
  }

  log(args) {
    if (!this.debugMode) return;
    console.log.apply(null, arguments);    
  }

  createElement(elementName, attr, nodeValue) {
    this.element = document.createElementNS("http://www.w3.org/2000/svg", elementName);
    this.setAttributes(attr);
    this.setValue(nodeValue);
    return this.element;
  }

  captureElement(targetNode) {
    this.element = targetNode;
  }

  setAttributes(attr, force) {
    if (!attr) attr = {};
    if (!this.attrList) return;
    for (let attrName in attr) {
      if (force || this.attrList.includes(attrName)) {
        let attrValue = attr[attrName];
        if (attrValue === null) {
          this.element.removeAttribute(attrName);
          continue;
        }
        if (attrName == "style" && typeof attrValue == "object") {
          this.setStyle(attrValue, true);
        } else {
          if (typeof(attrValue) === 'function') {
            this.element[attrName] = attrValue;
            continue;
          }
          this.element.setAttribute(attrName, attrValue);
        }
      } else {
        this.log("Warning: unsupported attribute", attrName);
      }
    }
  }

  setStyle(styleObj, wipe) {
    if (!styleObj) {
      if (!wipe) return;
      this.setAttributes({style:null});
    }
    if (wipe) {
      this.setAttributes({style:null});
    }
    for (let stylePty in styleObj) {
      this.element.style[stylePty] = styleObj[stylePty];
    }
  }

  setValue(nodeValue) {
    if (nodeValue !== undefined) this.element.innerHTML = nodeValue;
  }

  init(elementName, attr, attrList, nodeValue) {
    if (!attrList) attrList = [];
    this.attrList.push(...attrList);
    if (elementName === undefined) return;
    this.createElement(elementName, attr, nodeValue);
  }

  insert(container, wipe) {
    if (wipe) {
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
    }
    container.appendChild(this.element);
  }

  remove() {
    this.element.parentNode.removeChild(this.element);
  }

  clone() {
    if (!this.element) return null;
    var c = new this.constructor();
    c.element = this.element.cloneNode();
    return c;
  }

  getTransform(template) {
    if (!this.transform) this.transform = new SVGBTransform(this.element, template);
    return this.transform;
  }

  translate(x, y, relative) {
    var t = this.getTransform("TRS"); // Tranlate+Rotate+Scale
    if (t.template == "TRS") {
      var params = t.list[0].params;
      if (relative) {
        params[0] += x;
        params[1] += y;
      } else {
        params[0] = x;
        params[1] = y;
      }
      t.apply();
    }
  }

  rotate(angle, cx, cy, relative) {
    if (typeof cx == "undefined") cx = 0;
    if (typeof cy == "undefined") cy = 0;
    var t = this.getTransform("TRS");
    if (t.template == "TRS") {
      var params = t.list[1].params;
      if (relative) {
        params[0] += angle;
        params[1] = cx;
        params[2] = cy;
      } else {
        params[0] = angle;
        params[1] = cx;
        params[2] = cy;
      }
      t.apply();
    }
  }

  scale(sx, sy) {
    var t = this.getTransform("TRS");
    if (t.template == "TRS") {
      t.list[2].params = [sx, sy];
      t.apply();
    }
  }

  setClip(clipPathId) {
    if (clipPathId) {
      //this.setAttributes({"clip-path": "url(#" + SVGUtils.htmlEncode(clipPathId) + ")"}, true);
      this.setAttributes({"clip-path": "url(#" + clipPathId + ")"}, true);
    } else {
      this.setAttributes({"clip-path": null}, true);
    }
  }

  lowerToBottom() {
    this.element.parentNode.insertBefore(this.element, this.element.parentNode.firstChild);
  }

  lower() {
    let previousSibling = this.element.previousSibling;
    if (!previousSibling) return;
    this.element.parentNode.insertBefore(this.element, previousSibling);
  }

  raise() {
    let nextSibling = this.element.nextSibling;
    if (!nextSibling) return;
    this.element.parentNode.insertBefore(this.element, nextSibling.nextSibling);
  }

  raiseToTop() {
    this.element.parentNode.appendChild(this.element);
  }
}

/* class SVGBTransform *********************************************************************************************************************/

class SVGBTransform {
  constructor(targetNode, template) {
    this.targetNode = targetNode;
    this.list = []; // List of transform definitions
    switch (template) {
      case "TRS":
        this.addDefinition("translate", [0, 0]);
        this.addDefinition("rotate", [0, 0, 0]);
        this.addDefinition("scale", [1, 1]);
        break;
    }
    this.template = template ? template : null;
  }

  addDefinition(fn, params, apply) {
    if (this.template) return;
    if (!["matrix", "translate", "scale", "rotate", "skewX", "skewY"].includes(fn)) return;
    this.list.push({
      fn    : fn,
      params: params
    });
    if (apply) this.apply();
  }

  clear(apply) {
    this.list = [];
    this.template = null;
    if (apply) this.apply();
  }

  apply() {
    var transformList = [];
    this.list.forEach(function(definition) {
      transformList.push(definition.fn + "(" + definition.params.join(" ") + ")");
    });
    this.targetNode.setAttribute("transform", transformList.join(" "));
  }
}

/* class SVGBRect **************************************************************************************************************************/

class SVGBRect extends SVGBElement {
  constructor(attr) {
    super();
    this.init("rect", attr, ["x", "y", "width", "height", "rx", "ry"]);
  }
}

/* class SVGBCircle ************************************************************************************************************************/

class SVGBCircle extends SVGBElement {
  constructor(attr) {
    super();
    this.init("circle", attr, ["cx", "cy", "r"]);
  }
}

/* class SVGBEllipse ***********************************************************************************************************************/

class SVGBEllipse extends SVGBElement {
  constructor(attr) {
    super();
    this.init("ellipse", attr, ["cx", "cy", "rx", "ry"]);
  }
}

/* class SVGBLine **************************************************************************************************************************/

class SVGBLine extends SVGBElement {
  constructor(attr) {
    super();
    this.init("line", attr, ["x1", "y1", "x2", "y2"]);
  }
}

/* class SVGBPolyline **********************************************************************************************************************/

class SVGBPolyline extends SVGBElement {
  constructor(attr, points) {
    super();
    this.init("polyline", attr);
    this.points = (typeof points == "undefined") ? [] : points;
    this.update();
  }

  addPoint(pointData) {
    // pointData: an object with x and y properties
    this.points.push(pointData);
  }

  update() {
    var pointsAttr = this.points.map((pointData) => {
      var x = ("x" in pointData) ? pointData.x : 0;
      var y = ("y" in pointData) ? pointData.y : 0;
      return x + " " + y;
    }).join(" ");
    this.element.setAttribute("points", pointsAttr);
  }

  clone() {
    var c = super.clone();
    c.points = this.points.slice();
    return c;
  }

  captureElement(targetNode) {
    super.captureElement(targetNode);
    // TODO: parse the "points" attribute 
  }
}

/* class SVGBPolygon ***********************************************************************************************************************/

class SVGBPolygon extends SVGBPolyline {
  constructor(attr, points) {
    super();
    this.init("polygon", attr);
    this.points = (typeof points == "undefined") ? [] : points;
    this.update();
  }
}

/* class SVGBPath **************************************************************************************************************************/

// Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

class SVGBPath extends SVGBElement  {
  constructor(attr, points) {
    super();
    this.init("path", attr);
    this.points = [];
    if (typeof points != "undefined") {
      points.forEach(point => this.addPoint(point));
    }
    this.update();
  }

  addPoint(pointData) {
    // pointData: an object with properties
    var point;
    if (pointData.cmd == "M") {
      // Move to, absolute coordinates. Parameters: x, y
      point = {
        cmd: "M",
        x  : ("x" in pointData) ? pointData.x : 0,
        y  : ("y" in pointData) ? pointData.y : 0
      }
    } else if (pointData.cmd == "m") {
      // Move to, relative coordinates. Parameters: dx, dy
      point = {
        cmd: "m",
        dx : ("dx" in pointData) ? pointData.dx : 0,
        dy : ("dy" in pointData) ? pointData.dy : 0
      }
    } else if (pointData.cmd == "L") {
      // Line to, absolute coordinates. Parameters: x, y
      point = {
        cmd: "L",
        x  : ("x" in pointData) ? pointData.x : 0,
        y  : ("y" in pointData) ? pointData.y : 0
      }
    } else if (pointData.cmd == "l") {
      // Line to, relative coordinates. Parameters: dx, dy
      point = {
        cmd: "l",
        dx : ("dx" in pointData) ? pointData.dx : 0,
        dy : ("dy" in pointData) ? pointData.dy : 0
      }
    } else if (pointData.cmd == "H") {
      // Horizontal line to, absolute coordinates. Parameters: x
      point = {
        cmd: "H",
        x  : ("x" in pointData) ? pointData.x : 0
      }
    } else if (pointData.cmd == "h") {
      // Horizontal line to, relative coordinates. Parameters: dx
      point = {
        cmd: "h",
        dx : ("dx" in pointData) ? pointData.dx : 0
      }
    } else if (pointData.cmd == "V") {
      // Vertical line to, absolute coordinates. Parameters: y
      point = {
        cmd: "V",
        y  : ("y" in pointData) ? pointData.y : 0
      }
    } else if (pointData.cmd == "v") {
      // Vertical line to, relative coordinates. Parameters: dy
      point = {
        cmd: "v",
        dy : ("dy" in pointData) ? pointData.dy : 0
      }
    } else if (pointData.cmd == "C") {
      // Cubic bezier curve to, absolute coordinates. Parameters: x1, y1, x2, y2, x, y
      point = {
        cmd: "C",
        x1 : ("x1" in pointData) ? pointData.x1 : 0,
        y1 : ("y1" in pointData) ? pointData.y1 : 0,
        x2 : ("x2" in pointData) ? pointData.x2 : 0,
        y2 : ("y2" in pointData) ? pointData.y2 : 0,
        x  : ("x"  in pointData) ? pointData.x  : 0,
        y  : ("y"  in pointData) ? pointData.y  : 0
      }
    } else if (pointData.cmd == "c") {
      // Cubic bezier curve to, relative coordinates. Parameters: dx1, dy1, dx2, dy2, dx, dy
      point = {
        cmd: "c",
        dx1: ("dx1" in pointData) ? pointData.dx1 : 0,
        dy1: ("dy1" in pointData) ? pointData.dy1 : 0,
        dx2: ("dx2" in pointData) ? pointData.dx2 : 0,
        dy2: ("dy2" in pointData) ? pointData.dy2 : 0,
        dx : ("dx"  in pointData) ? pointData.dx  : 0,
        dy : ("dy"  in pointData) ? pointData.dy  : 0
      }
    } else if (pointData.cmd == "S") {
      // Smooth cubic bezier curve to, absolute coordinates. Parameters: x2, y2, x, y
      point = {
        cmd: "S",
        x2 : ("x2" in pointData) ? pointData.x2 : 0,
        y2 : ("y2" in pointData) ? pointData.y2 : 0,
        x  : ("x"  in pointData) ? pointData.x  : 0,
        y  : ("y"  in pointData) ? pointData.y  : 0
      }
    } else if (pointData.cmd == "s") {
      // Smooth cubic bezier curve to, relative coordinates. Parameters: dx2, dy2, dx, dy
      point = {
        cmd: "s",
        dx2: ("dx2" in pointData) ? pointData.dx2 : 0,
        dy2: ("dy2" in pointData) ? pointData.dy2 : 0,
        dx : ("dx"  in pointData) ? pointData.dx  : 0,
        dy : ("dy"  in pointData) ? pointData.dy  : 0
      }
    } else if (pointData.cmd == "Q") {
      // Quadratic bezier curve to, absolute coordinates. Parameters: x1, y1, x, y
      point = {
        cmd: "Q",
        x1 : ("x1" in pointData) ? pointData.x1 : 0,
        y1 : ("y1" in pointData) ? pointData.y1 : 0,
        x  : ("x"  in pointData) ? pointData.x  : 0,
        y  : ("y"  in pointData) ? pointData.y  : 0
      }
    } else if (pointData.cmd == "q") {
      // Quadratic bezier curve to, relative coordinates. Parameters: dx1, dy1, dx, dy
      point = {
        cmd: "q",
        dx1: ("dx1" in pointData) ? pointData.dx1 : 0,
        dy1: ("dy1" in pointData) ? pointData.dy1 : 0,
        dx : ("dx"  in pointData) ? pointData.dx  : 0,
        dy : ("dy"  in pointData) ? pointData.dy  : 0
      }
    } else if (pointData.cmd == "T") {
      // Smooth quadratic bezier curve to, absolute coordinates. Parameters: x, y
      point = {
        cmd: "T",
        x  : ("x"  in pointData) ? pointData.x  : 0,
        y  : ("y"  in pointData) ? pointData.y  : 0,
      }
    } else if (pointData.cmd == "t") {
      // Smooth quadratic bezier curve to, relative coordinates. Parameters: dx, dy
      point = {
        cmd: "t",
        dx : ("dx"  in pointData) ? pointData.dx  : 0,
        dy : ("dy"  in pointData) ? pointData.dy  : 0
      }
    } else if (pointData.cmd == "A") {
      // Arc to, absolute coordinates. Parameters: rx, ry, angle, large, sweep, x, y
      point = {
        cmd: "A",
        rx   : ("rx"    in pointData) ? pointData.rx    : 0, // ellipse x-radius
        ry   : ("ry"    in pointData) ? pointData.ry    : 0, // ellipse y-radius
        angle: ("angle" in pointData) ? pointData.angle : 0, // x-axis rotation angle
        large: ("large" in pointData) ? pointData.large : 0, // large-arc-flag: 0 for <180 degrees arc, 1 for >180 degrees arc.
        sweep: ("sweep" in pointData) ? pointData.sweep : 0, // sweep-flag: 0 for left-bending arc, 1 for right-bending arc
        x    : ("x"     in pointData) ? pointData.x     : 0, // end-point x
        y    : ("y"     in pointData) ? pointData.y     : 0  // end-point y
      }
    } else if (pointData.cmd == "a") {
      // Arc to, relative coordinates. Parameters: rx, ry, angle, large, sweep, dx, dy
      point = {
        cmd: "a",
        rx   : ("rx"    in pointData) ? pointData.rx    : 0, // ellipse x-radius
        ry   : ("ry"    in pointData) ? pointData.ry    : 0, // ellipse y-radius
        angle: ("angle" in pointData) ? pointData.angle : 0, // x-axis rotation angle
        large: ("large" in pointData) ? pointData.large : 0, // large-arc-flag: 0 for <180 degrees arc, 1 for >180 degrees arc.
        sweep: ("sweep" in pointData) ? pointData.sweep : 0, // sweep-flag: 0 for left-bending arc, 1 for right-bending arc
        dx   : ("dx"    in pointData) ? pointData.dx    : 0, // end-point relative dx
        dy   : ("dy"    in pointData) ? pointData.dy    : 0  // end-point relative dy
      }

    } else if (pointData.cmd == "Z" || pointData.cmd == "z") {
      // Close path. Parameters: none
      point = {
        cmd: "Z"
      }
    }
    this.points.push(point);
  }

  update() {
    var pointsAttr = this.points.map((pointData) => {
      var output = ""
      if (pointData.cmd == "M") {
        output = [pointData.cmd, pointData.x, pointData.y];
      } else if (pointData.cmd == "m") {
        output = [pointData.cmd, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "L") {
        output = [pointData.cmd, pointData.x, pointData.y];
      } else if (pointData.cmd == "l") {
        output = [pointData.cmd, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "H") {
        output = [pointData.cmd, pointData.x];
      } else if (pointData.cmd == "h") {
        output = [pointData.cmd, pointData.dx];
      } else if (pointData.cmd == "V") {
        output = [pointData.cmd, pointData.y];
      } else if (pointData.cmd == "v") {
        output = [pointData.cmd, pointData.dy];
      } else if (pointData.cmd == "C") {
        output = [pointData.cmd, pointData.x1, pointData.y1, pointData.x2, pointData.y2, pointData.x, pointData.y];
      } else if (pointData.cmd == "c") {
        output = [pointData.cmd, pointData.dx1, pointData.dy1, pointData.dx2, pointData.dy2, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "S") {
        output = [pointData.cmd, pointData.x2, pointData.y2, pointData.x, pointData.y];
      } else if (pointData.cmd == "s") {
        output = [pointData.cmd, pointData.dx2, pointData.dy2, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "Q") {
        output = [pointData.cmd, pointData.x1, pointData.y1, pointData.x, pointData.y];
      } else if (pointData.cmd == "q") {
        output = [pointData.cmd, pointData.dx1, pointData.dy1, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "T") {
        output = [pointData.cmd, pointData.x, pointData.y];
      } else if (pointData.cmd == "t") {
        output = [pointData.cmd, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "A") {
        output = [pointData.cmd, pointData.rx, pointData.ry, pointData.angle, pointData.large ? 1 : 0, pointData.sweep ? 1 : 0, pointData.x, pointData.y];
      } else if (pointData.cmd == "a") {
        output = [pointData.cmd, pointData.rx, pointData.ry, pointData.angle, pointData.large ? 1 : 0, pointData.sweep ? 1 : 0, pointData.dx, pointData.dy];
      } else if (pointData.cmd == "Z" || pointData.cmd == "z") {
        output = [pointData.cmd];
      }
      return output.join(" ");
    }).join(" ");
    this.element.setAttribute("d", pointsAttr);
  }

  clone() {
    var c = super.clone();
    c.points = this.points.slice();
    return c;
  }

  captureElement(targetNode) {
    super.captureElement(targetNode);
    // TODO: parse the "d" attribute 
  }
}

/* class SVGBText **************************************************************************************************************************/

class SVGBText extends SVGBElement {
  constructor(attr, value) {
    super();
    this.init("text", attr, ["x", "y", "text-anchor"], value);
  }
}

/* class SVGBUse **************************************************************************************************************************/

class SVGBUse extends SVGBElement {
  constructor(attr, href) {
    super();
    this.init("use", attr, ["x", "y"]);
    this.setHref(href);
  }

  setHref(href) {
    this.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + href);
  }
}

/* class SVGImage **************************************************************************************************************************/

class SVGImage extends SVGBElement {
  constructor(attr, imgURL) {
    super();
    this.init("image", attr, ["x", "y", "width", "height", "preserveAspectRatio"]);
    this.imgURL = imgURL;
    this.loaded = false;
    // Note: the <image> element is not inserted in the container until it is not successfully loaded.
  }

  load(onLoaded, onError) {
    var self = this;
    this.loaded = false;
    this.element.addEventListener('load', function() {
      if (self.loaded) return; // To avoid repeat onLoaded call due to the Chrome bug 
      self.loaded = true;
      if (typeof onLoaded === "function") {
        onLoaded.call(self);
      }
    });
    this.element.addEventListener('error', function() {
      self.loaded = false;
      if (typeof onError === "function") {
        onError.call(self);
      }
    });
    self.element.setAttribute("href", this.imgURL);
  }
}

/* class SVGBFile **************************************************************************************************************************/

class SVGBFile extends SVGBElement {
  constructor(attr, svgURL) {
    super();
    this.attr = attr;
    this.svgURL = svgURL;
    this.loaded = false;
    // Note: can't call the init() method because the element does not exist yet! It will be created only when the load() method results in successfully loaded svg document
  }

  load(onLoaded, onError) {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status >= 400) {
        // File not found
        if (typeof onError === "function") {
          onError.call(self, xhr);
        }
      }
      if (xhr.readyState == 4 && xhr.status == 200) {
        self.element = xhr.responseXML.getElementsByTagName('svg')[0];
        self.setAttributes(self.attr);
        self.loaded = true;
        if (typeof onLoaded === "function") {
          onLoaded.call(self);
        }
      }
    }
    xhr.open('GET', this.svgURL, true);
    xhr.send(null);
  }

  getElement(id) {
    // Find an element with corresponding id attribute and return a corresponding SVGBElement instance
    if (!this.element) return null;

    var node = this.element.querySelector('#' + id);
    if (!node) return null;

    return SVGBuilder.fromElement(node);
  }
}

/* class SVGBContainer *************************************************************************************************************************/

class SVGBContainer extends SVGBElement {
  constructor() {
    // Superclass constructor
    super();
  }

  wipe() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }
  }

  addRect(attr) {
    // Add new rect element
    this.log("Adding rect element, attr=", attr);
    var svgObject = new SVGBRect(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addCircle(attr) {
    // Add new circle element
    this.log("Adding circle element, attr=", attr);
    var svgObject = new SVGBCircle(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addEllipse(attr) {
    // Add new ellipse element
    this.log("Adding ellipse element, attr=", attr);
    var svgObject = new SVGBEllipse(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addLine(attr) {
    // Add new line element
    this.log("Adding line element, attr=", attr);
    var svgObject = new SVGBLine(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addPolyline(attr, points) {
    // Add new plolyline element
    this.log("Adding polyline element, attr=", attr, " points=", points);
    var svgObject = new SVGBPolyline(attr, points);
    svgObject.insert(this.element);
    return svgObject;
  }

  addPolygon(attr, points) {
    // Add new plolygon element
    this.log("Adding polygon element, attr=", attr, " points=", points);
    var svgObject = new SVGBPolygon(attr, points);
    svgObject.insert(this.element);
    return svgObject;
  }

  addPath(attr, points) {
    // Add new plolygon element
    this.log("Adding path element, attr=", attr, " points=", points);
    var svgObject = new SVGBPath(attr, points);
    svgObject.insert(this.element);
    return svgObject;
  }

  addText(attr, value) {
    var svgObject = new SVGBText(attr, value);
    svgObject.insert(this.element);
    return svgObject;
  }

  addGroup(attr) {
    var svgObject = new SVGBGroup(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addForeignObject(attr) {
    var svgObject = new SVGBForeignObject(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addDefs(attr) {
    var svgObject = new SVGBDefs(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addUse(attr, href) {
    var svgObject = new SVGBUse(attr, href);
    svgObject.insert(this.element);
    return svgObject;
  }

  addClipPath(attr) {
    var svgObject = new SVGBClipPath(attr);
    svgObject.insert(this.element);
    return svgObject;
  }

  addImage(attr, imgURL, onLoaded, onError) {
    var svgObject = new SVGImage(attr, imgURL);
    var container = this.element;
    svgObject.load(function() {
      this.insert(container);
      if (typeof onLoaded !== "function") return;
      onLoaded.call(this);
    }, function(xhr) {
      if (typeof onError !== "function") return;
      onError.call(this, xhr);
    });
    return svgObject;
  }

  addSVGBFile(attr, svgURL, onLoaded, onError) {
    var svgObject = new SVGBFile(attr, svgURL);
    var container = this.element;
    svgObject.load(function() {
      this.insert(container);
      if (typeof onLoaded !== "function") return;
      onLoaded.call(this);
    }, function(xhr) {
      if (typeof onError !== "function") return;
      onError.call(this, xhr);
    });
    return svgObject;
  }
}

/* class SVGBDraggable ********************************************************************************************************************/

class SVGBDraggableEvent {
  constructor(type) {
    this.type = type;
    this.currentTarget = null;
    this.target = null;
  }
}

class SVGBDraggable {
  constructor(body) {
    this.body = body;
    this.active = false; // true when the draggable body is being dragged, false when not

    // Retrieve the current translation
    const position = this.getPosition();
    this.xObject = position.x; // current body origin point x coordinate relative to the parent;
    this.yObject = position.y; // current body origin point y coordinate relative to the parent;

    this.xStart   = this.xObject; // body x coordinate at start;
    this.yStart   = this.yObject; // body y coordinate at start;
    this.xScreen  = 0; // mouse pointer x coordinate in the screen coordinate space;
    this.yScreen  = 0; // mouse pointer y coordinate in the screen coordinate space;
    this.dxScreen = 0; // x component of the drag vector from the drag start point, in the screen coordinate space;
    this.dyScreen = 0; // y component of the drag vector from the drag start point, in the screen coordinate space;
    this.xLocal   = 0; // mouse pointer x coordinate in the local coordinate space (that might be translated and rotated);
    this.yLocal   = 0; // mouse pointer y coordinate in the local coordinate space;
    this.dxLocal  = 0; // x component of the drag vector from the drag start point, in local coordinate space;
    this.dyLocal  = 0; // y component of the drag vector from the drag start point, in local coordinate space;

    this.onStartDrag = null; // the event handler to launch when mouse is pressed on the draggable body
    this.handle = null; // the SVGBElement where the mouse pressed element is registered

    this.eventListeners = {
      "start": [],
      "move" : [],
      "stop" : []
    };
  }

  getPosition() {
    const t = this.body.getTransform("TRS");
    if (t.template != "TRS") throw new Error("This SVGBuilder object has custom transform definitions that prevent reliable position detection.");
    const txParams = t.list[0].params;
    return {
      x: txParams[0],
      y: txParams[1]
    };
  }

  setPosition(newPosition) {
    // Adjust position of the draggable object, in the local coordinate space
    // This can be called from within move event handler, to constrain the dragged body movement
    if ("x" in newPosition) this.xObject = newPosition.x;
    if ("y" in newPosition) this.yObject = newPosition.y;
  }

  getLocalCoords(xScreen, yScreen, dxScreen, dyScreen) {
    const xform = this.body.element.parentNode.getScreenCTM().inverse();
    return {
      x: xform.a * xScreen + xform.c * yScreen + xform.e,
      y: xform.b * xScreen + xform.d * yScreen + xform.f,
      dx: xform.a * dxScreen + xform.c * dyScreen,
      dy: xform.b * dxScreen + xform.d * dyScreen
    }
  }

  enable(handle, onStartDrag) {
    // Enable the dragging behaviour
    if (!handle) handle = this.handle;
    if (!onStartDrag) onStartDrag = this.onStartDrag;
    if (!handle || !onStartDrag) return;
    this.handle = handle;
    this.onStartDrag = onStartDrag;
    this.handle.element.addEventListener("mousedown", this.onStartDrag);
  }

  disable() {
    // Disable the dragging behaviour. It can be later re-enabled by calling the enable() method.
    if (!this.handle || !this.onStartDrag) return;
    this.handle.element.removeEventListener("mousedown", this.onStartDrag);
  }

  isActive() {
    return this.active;
  }

  start() {
    this.active = true;
    this.xStart = this.xObject;
    this.yStart = this.yObject;
    this.dispatchEvent(new SVGBDraggableEvent("start"));
    this.body.translate(this.xObject, this.yObject);
  }

  move() {
    this.dispatchEvent(new SVGBDraggableEvent("move"));
    this.body.translate(this.xObject, this.yObject);
  }

  release() {
    // Stop the dragging while the mouse button is still down. Leave the draggable body where it is now.
    if (!this.active) return;
    this.stop();
  }

  cancel() {
    // Stop the dragging while the mouse button is still down. Move the draggable body where it was before the dragging.
    this.setPosition({
      x: this.xStart,
      y: this.yStart
    });
    this.release();
  }

  stop() {
    this.dispatchEvent(new SVGBDraggableEvent("stop"));
    this.body.translate(this.xObject, this.yObject);
    this.active = false;
  }

  addEventListener(eventType, eventListener) {
    if (!(eventType in this.eventListeners)) return;
    const eventListeners = this.eventListeners[eventType];
    if (eventListeners.includes(eventListener)) return;
    eventListeners.push(eventListener);
  }

  removeEventListener(eventType, eventListener) {
    if (!(eventType in this.eventListeners)) return;
    const eventListeners = this.eventListeners[eventType];
    const index = eventListeners.indexOf(eventListener);
    if (index == -1) return;
    eventListeners.splice(index, 1);
  }

  dispatchEvent(draggableEvent) {
    draggableEvent.currentTarget = this;
    draggableEvent.target = this;
    if (draggableEvent.type in this.eventListeners) {
      this.eventListeners[draggableEvent.type].forEach((listener) => {
        listener.call(this, draggableEvent);
      });
    }
  }
}

/* class SVGBuilder ***********************************************************************************************************************/

class SVGBuilder extends SVGBContainer {
  constructor(attr) {
    super();
    this.init("svg", attr, ["viewBox"]);
  }

  setViewBox(params) {
    /*
    Set the viewbox, aspect ratio and alignment properties
    params: object {
      x
      y
      width
      height
      xAlign: min | mid | max
      yAlign: min | mid | max
      fit: meet (default) | slice | stretch
    }
    if some parameters are missing, read them from the current viewBox attribute, if available
    if params is null or missing - the viewbox and preserveAspectRatio parameters are removed
    https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
    https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
    */
    if (!params || typeof params != "object") {
      this.setAttributes({viewBox:null, preserveAspectRatio: null}, true);
      return;
    }
    // Get the current properties by reading and parsing the element's viewBox and preserveAspectRatio attributes
    var currentViewBox = this.element.getAttribute("viewBox");
    var currentPreserveAspectRatio = this.element.getAttribute("preserveAspectRatio");
    //this.log("currentViewBox=", currentViewBox, "; currentPreserveAspectRatio=", currentPreserveAspectRatio);
    var parseViewBox = /^(-?\d*\.?\d*) (-?\d*\.?\d*) (\d*\.?\d*) (\d*\.?\d*)$/.exec(currentViewBox);
    if (parseViewBox) {
      if (params.x === undefined) params.x = parseViewBox[1];
      if (params.y === undefined) params.y = parseViewBox[2];
      if (params.width === undefined) params.width = parseViewBox[3];
      if (params.height === undefined) params.height = parseViewBox[4];
    }
    var parsePreserveAspectRatio = /^(none|x(Min|Mid|Max)Y(Min|Mid|Max))( (meet|slice))?$/.exec(currentPreserveAspectRatio);
    if (parsePreserveAspectRatio) {
      if (parsePreserveAspectRatio[1] == "none") {
        if (params.fit === undefined) params.fit = "stretch";
      } else {
        if (params.xAlign === undefined) params.xAlign = parsePreserveAspectRatio[2].toLowerCase();
        if (params.yAlign === undefined) params.yAlign = parsePreserveAspectRatio[3].toLowerCase();
        if (params.fit === undefined && parsePreserveAspectRatio[4]) params.fit = parsePreserveAspectRatio[5].toLowerCase() == "slice" ? "slice" : "meet";
      }
    }
    // Fill in the defaults for the missing parameters
    if (params.x === undefined) params.x = 0;
    if (params.y === undefined) params.y = 0;
    if (params.width === undefined) params.width = this.element.clientWidth;
    if (params.height === undefined) params.height = this.element.clientHeight;
    if (params.xAlign === undefined) params.xAlign = "mid";
    if (params.yAlign === undefined) params.yAlign = "mid";
    if (params.fit === undefined) params.fit = "meet";
    // Set the new attribute values
    var newViewBox = `${params.x} ${params.y} ${params.width} ${params.height}`;
    var newPreserveAspectRatio = params.fit == "stretch" ? "none" : "xM" + params.xAlign.slice(1) + "YM" + params.yAlign.slice(1) + " " + params.fit;
    //this.log("viewBox =", newViewBox, "; preserveAspectRatio =", newPreserveAspectRatio)
    this.setAttributes({viewBox:newViewBox, preserveAspectRatio:newPreserveAspectRatio}, true);
  }

  draggable(handle, body) {
    // handle   - the object that captures the mousedown event
    // body     - optional object that is dragged around. By default, it's the handle. But it can be another element, for example a group object that contains the handle object
    const draggable = new SVGBDraggable(body ? body : handle);

    // draggableStore property is global to an SVGBuilder object. It keeps track of all essential dragging-related data
    if (!this.draggableStore) {
      this.draggableStore = {
        draggable: null, // The draggable object currently being dragged
        xStart   : 0, // Start point x, at screen coordinates
        yStart   : 0, // Start point y, at screen coordinates
        dxScreen : 0, // X distance dragged, at screen coordinates
        dyScreen : 0, // Y distance dragged, at screen coordinates
        xLocal   : 0, // Pointer x, at local coordinates
        yLocal   : 0, // Pointer y, at local coordinates
        dxLocal  : 0, // Horizontal distance dragged, at local coordinates
        dyLocal  : 0, // Y distance dragged, at local coordinates
        xTOffset : 0, // X translation, at drag start
        yTOffset : 0, // Y translation, at drag start
      }
    }

    /*
    There are three functions:
    - onStartDrag - run when the mouse button is pressed wile cursor is on the handle;
    - onDrag      - run when the mouse is moved while the mouse button is still pressed;
    - onStopDrag   - run when the mouse button is released or the cursor has left the svg element area;

    Only the startDrag function is registered as an event listener for the handle element. The two other functions
    drag and onStopDrag are registered as event listeners on the svg element, only once.
    */

    const onStartDrag = (evt) => {
      evt.preventDefault();

      const ds = this.draggableStore;
      ds.draggable = draggable;

      const mousePos = {
        x: evt.clientX,
        y: evt.clientY
      };
      ds.xStart = mousePos.x;
      ds.yStart = mousePos.y;

      // Retrieve the current translation
      try {
        const position = ds.draggable.getPosition();
        ds.xTOffset = position.x;
        ds.yTOffset = position.y;
      }
      catch {
        ds.draggable = null;
        return;
      }

      const pointerLocalCoords = ds.draggable.getLocalCoords(mousePos.x, mousePos.y);
      ds.xLocal = pointerLocalCoords.x;
      ds.yLocal = pointerLocalCoords.y;

      // Update the draggable object properties, dispatch the start event
      ds.draggable.xObject  = ds.xTOffset;
      ds.draggable.yObject  = ds.yTOffset;
      ds.draggable.xScreen  = mousePos.x;
      ds.draggable.yScreen  = mousePos.y;
      ds.draggable.dxScreen = 0;
      ds.draggable.dyScreen = 0;
      ds.draggable.xLocal   = ds.xLocal;
      ds.draggable.yLocal   = ds.yLocal;
      ds.draggable.dxLocal  = 0;
      ds.draggable.dyLocal  = 0;
      ds.draggable.start();
    }

    draggable.enable(handle, onStartDrag);

    if (this.element.getAttribute("draggable-init")) return draggable;

    // This is the first time the svgb.draggable() function is called, so the global events must be initialized

    const onDrag = (evt) => {
      const ds = this.draggableStore;
      if (!ds.draggable || !ds.draggable.isActive()) return;

      evt.preventDefault();
      // Estimate the drag distance, in the screen coordinate space
      const mousePos = {
        x: evt.clientX,
        y: evt.clientY
      };
      ds.dxScreen = mousePos.x - ds.xStart;
      ds.dyScreen = mousePos.y - ds.yStart;
      // Calculate the pointer coords and drag vector in the draggable object coordinate space
      const pointerLocalCoords = ds.draggable.getLocalCoords(mousePos.x, mousePos.y, ds.dxScreen, ds.dyScreen);
      ds.xLocal = pointerLocalCoords.x;
      ds.yLocal = pointerLocalCoords.y;
      ds.dxLocal = pointerLocalCoords.dx;
      ds.dyLocal = pointerLocalCoords.dy;

      // Update the draggable object properties, dispatch the move event
      ds.draggable.xObject  = ds.xTOffset + ds.dxLocal;
      ds.draggable.yObject  = ds.yTOffset + ds.dyLocal;
      ds.draggable.xScreen  = mousePos.x;
      ds.draggable.yScreen  = mousePos.y;
      ds.draggable.dxScreen = ds.dxScreen;
      ds.draggable.dyScreen = ds.dyScreen;
      ds.draggable.xLocal   = ds.xLocal;
      ds.draggable.yLocal   = ds.yLocal;
      ds.draggable.dxLocal  = ds.dxLocal;
      ds.draggable.dyLocal  = ds.dyLocal;
      ds.draggable.move();
    }

    var onStopDrag = (evt) => {
      const ds = this.draggableStore;
      if (!ds.draggable || !ds.draggable.isActive()) return;

      // Update the draggable object properties, dispatch the end event
      ds.draggable.xObject  = ds.xTOffset + ds.dxLocal;
      ds.draggable.yObject  = ds.yTOffset + ds.dyLocal;
      ds.draggable.xScreen  = evt.clientX;
      ds.draggable.yScreen  = evt.clientY;
      ds.draggable.dxScreen = 0;
      ds.draggable.dyScreen = 0;
      ds.draggable.xLocal   = ds.xLocal;
      ds.draggable.yLocal   = ds.yLocal;
      ds.draggable.dxLocal  = 0;
      ds.draggable.dyLocal  = 0;
      ds.draggable.stop();

      // Clear the selected draggable
      ds.draggable = null;
    }

    // Register the event handlers
    this.element.setAttribute("draggable-init", 1);
    this.element.addEventListener("mousemove", onDrag);
    this.element.addEventListener("mouseleave", onStopDrag);
    this.element.addEventListener("mouseup", onStopDrag);

    return draggable;
  }

  static fromElement(targetNode) {
    var nodeName = targetNode.nodeName.toLowerCase();
    var svgObject;
    if (nodeName == "rect") {
      svgObject = new SVGBRect();
    } else if (nodeName == "circle") {
      svgObject = new SVGBCircle();
    } else if (nodeName == "ellipse") {
      svgObject = new SVGBEllipse();
    } else if (nodeName == "line") {
      svgObject = new SVGBLine();
    } else if (nodeName == "polyline") {
      svgObject = new SVGBPolyline();
    } else if (nodeName == "polygon") {
      svgObject = new SVGBPolygon();
    } else if (nodeName == "path") {
      svgObject = new SVGBPath();
    } else if (nodeName == "text") {
      svgObject = new SVGBText();
    } else if (nodeName == "g") {
      svgObject = new SVGBGroup();
    } else if (nodeName == "foreignObject") {
      svgObject = new SVGBForeignObject();
    } else if (nodeName == "defs") {
      svgObject = new SVGBDefs();
    } else if (nodeName == "clipPath") {
      svgObject = new SVGBClipPath();
    } else {
      svgObject = new SVGBElement();
    }
    svgObject.captureElement(targetNode);
    return svgObject;
  }
}

/* class SVGBGroup *************************************************************************************************************************/

class SVGBGroup extends SVGBContainer {
  constructor(attr) {
    super();
    this.init("g", attr);
  }
}

/* class SVGBForeignObject *************************************************************************************************************************/

class SVGBForeignObject extends SVGBContainer {
  constructor(attr) {
    super();
    this.init("foreignObject", attr, ["x", "y", "width", "height"]);
  }
}

/* class SVGBClipPath *************************************************************************************************************************/

class SVGBClipPath extends SVGBContainer {
  constructor(attr) {
    super();
    this.init("clipPath", attr);
  }
}

/* class SVGBDefs *************************************************************************************************************************/

class SVGBDefs extends SVGBContainer {
  constructor(attr) {
    super();
    this.init("defs", attr);
  }
}

/* SVGBSprite and SVGBSpriteInstance *************************************************************************************************************************/

class SVGBSprite {
  constructor(svg, spriteWidth, spriteHeight) {
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.id = Math.floor(Math.random() * 1000000);

    var defs = svg.element.ownerDocument.getElementById("defs-" + this.id);
    if (defs) {
      this.defs = new SVGBDefs();
      this.defs.captureElement(defs);
    } else {
      this.defs = svg.addDefs({id:"defs-" + this.id});
    }

    var clip = this.defs.addClipPath({id:"clip-" + this.id});
    clip.addRect({x:0, y:0, width:this.spriteWidth, height:this.spriteHeight});

    this.loaded = false;
  }

  loadSpritesheet(SVGBFileURL, cols, frames) {
    this.cols = cols;
    this.frames = frames;
    if (this.spriteSheet) this.spriteSheet.remove();
    this.spriteSheet = this.defs.addGroup({id:"spriteSheet-" + this.id});
    this.spriteSheet.addSVGBFile({}, SVGBFileURL, () => this.loaded = true);
  }

  create(container, x, y) {
    var instance = new SVGBSpriteInstance(container, this);
    instance.translate(x, y);
    return instance;
  }
}

class SVGBSpriteInstance extends SVGBGroup {

  constructor(container, source) {
    super();
    this.source = source;
    this.insert(container.element);
    this.setClip("clip-" + source.id);
    this.spriteSheet = this.addUse({x:0, y:0}, "spriteSheet-" + source.id);
    this.frame = 0;
    this.framerate = 1;
    this.looping = false;
  }

  setFrame(frame) {
    frame = frame % this.source.frames;
    this.frame = frame;
    var row = Math.floor(frame / this.source.cols);
    var col = frame % this.source.cols;
    this.spriteSheet.translate(-this.source.spriteWidth * col, -this.source.spriteHeight * row);
  }

  nextFrame() {
    this.setFrame(++this.frame);
  }

  loop(framerate) {
    if (!framerate) framerate = 1;
    this.framerate = framerate;
    var looper = () => {
      if (!document.getElementById("clip-" + this.source.id)) return;
      if (!this.looping) return;
      this.nextFrame();
      window.setTimeout(looper, 1000 / this.framerate);            
    }
    this.looping = true;
    looper();
  }

  stop() {
    this.looping = false;
  }
}

