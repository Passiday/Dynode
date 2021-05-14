import StageUI from './stageUI';
import { JsonObject, JsonValue } from '../objectUtils';
import { VEvent, VEventTarget } from '../vanillaEvent';

class InputUI extends VEventTarget {
  body: HTMLDivElement;

  control: HTMLInputElement;

  name: string;

  title: string;

  value: JsonValue;

  constructor(config: JsonObject) {
    super();
    // Get the params
    this.name = 'name' in config ? <string> config.name : 'InputID';
    this.title = 'title' in config ? <string> config.title : 'InputTitle';
    this.value = 'value' in config ? <JsonValue> config.value : null; // TO DO: if the "value" key is not available, the state is "nothing".

    /*
    <div class="input">
      <label>
        <div>Input name</div>
       <input type="text" value="input value">
      </label>
    </div>
    */

    // Create input container
    this.body = document.createElement('div');
    this.body.classList.add('input');

    // Add input detail
    const label = document.createElement('label');

    const labelTxt = document.createElement('div');
    labelTxt.innerText = this.title;
    label.appendChild(labelTxt);

    this.control = document.createElement('input');
    label.appendChild(this.control);
    this.control.setAttribute('type', 'text');
    this.control.setAttribute('name', this.name);
    this.setValue(this.value);
    this.body.appendChild(label);

    // Bind the events
    const { self } = { self: this };

    this.control.addEventListener('change', function (this:HTMLInputElement) {
      self.onChange(this.value);
    });
  }

  insert(container: HTMLDivElement): void {
    container.appendChild(this.body);
  }

  onChange(value: string) {
    // The input control value has changed
    // TODO Handle the value according to the input type
    this.value = value;
    console.log('Input [', this.name, '] onChange:', this.value);
    this.dispatchEvent(new VEvent('change'));
  }

  setValue(value: JsonValue): void {
    // Update the input value
    this.value = value;
    console.log('Input [', this.name, '] setValue:', this.value);
    this.control.setAttribute('value', `${this.value}`); // TODO convert the value to string according to the value type
  }

  getValue(): JsonValue {
    return this.value;
  }

  getSocketPos(): {x:number, y: number} {
    const bcr = this.body.getBoundingClientRect();
    return {
      x: bcr.left,
      y: bcr.top + bcr.height / 2,
    };
  }
}

class NodeUI extends VEventTarget {
  stage: StageUI;

  name: string;

  container: SVGBGroup;

  frame?: SVGBRect;

  body: HTMLDivElement;

  inputsContainer: HTMLDivElement;

  outputsContainer: HTMLDivElement;

  inputs: InputUI[] = [];

  infoBox: HTMLDivElement;

  config: JsonObject;

  constructor(stage: StageUI, config?: JsonObject) {
    super();
    this.config = config === undefined ? {} : config;

    this.stage = stage;
    this.name = 'name' in this.config ? <string> this.config.name : 'Node';

    /*
    <g class="node">
      <rect class="body">
      <rect class="title">
      <text class="titleBarText">
      <foreignObject>
        <div class="body">
          <div class="section socketContainer">
            <div class="inputs">
              -- input elements --
            </div>
            <div class="outputs">
            </div>
          </div>
          <div class="section infoBox">
          </div>
        </div>
      </foreignObject>
    </g>
    */

    this.container = stage.svgb.addGroup({ class: 'node' });

    this.body = document.createElement('div');
    this.body.classList.add('body');

    const socketSection = this.addSection('socketContainer');

    this.inputsContainer = document.createElement('div');
    this.inputsContainer.classList.add('inputs');
    socketSection.appendChild(this.inputsContainer);

    this.outputsContainer = document.createElement('div');
    this.outputsContainer.classList.add('outputs');
    socketSection.appendChild(this.outputsContainer);

    this.infoBox = this.addSection('infoBox');
    this.infoBox.innerHTML = 'Hello, <strong>World</strong>. This is plain HTML in a <em>&lt;foreignObject&gt;</em> SVG element.';

    this.body.appendChild(this.infoBox);

    this.redraw();
  }

  addSection(className?: string): HTMLDivElement {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    if (className !== undefined) {
      sectionDiv.classList.add(className);
    }
    this.body.appendChild(sectionDiv);
    return sectionDiv;
  }

  addInput(inputConfig: JsonObject): InputUI {
    const input = new InputUI(inputConfig);
    input.addEventListener('change', (ev) => new VEvent('inputChange', {
      // TODO Fix VEvent, so that there's no need to type cast ev.target
      detail: {
        [(ev.target as InputUI).name]: {
          value: (ev.target as InputUI).value,
        },
      },
    }));
    this.inputs.push(input);
    input.insert(this.inputsContainer);
    return input;
  }

  getInput(name: string): InputUI | null {
    for (const input of this.inputs) {
      if (input.name === name) return input;
    }
    return null;
  }

  updateInputs(inputStates: JsonObject): void {
    // TODO: Update input values and enabled states
    for (const inputName of Object.keys(inputStates)) {
      const input = this.getInput(inputName);
      if (input) {
        const inputState = <JsonObject> inputStates[inputName];
        input.setValue(<JsonValue> inputState.value);
      }
    }
  }

  addSocket(x: number, y: number): void {
    // Temporary code, just for some visual reference
    const socketUI = this.container.addGroup();
    socketUI.addCircle({
      cx: 0,
      cy: 0,
      r: 5,
      style: { fill: 'white' },
    });
    socketUI.addLine({
      x1: 0,
      y1: -10,
      x2: 0,
      y2: 10,
      style: { stroke: 'black' },
    });
    socketUI.addLine({
      x1: -10,
      y1: 0,
      x2: 10,
      y2: 0,
      style: { stroke: 'black' },
    });
    socketUI.translate(x, y);
  }

  setInfo(contents: string): void {
    this.infoBox.innerHTML = contents;
  }

  redraw(): void {
    // Redraw the node UI
    this.container.wipe();

    // Title bar
    const titleBarHeight = 25;
    const titleBar = this.container.addRect({
      x: 0, y: 0, width: 200, height: titleBarHeight, class: 'titleBar',
    });
    this.container.addText({ x: 5, y: 20, class: 'titleBarText' }, this.name);
    this.stage.svgb.draggable(titleBar, this.container);
    // Body frame
    this.frame = this.container.addRect({
      x: 0, y: titleBarHeight, width: 200, height: 150, class: 'body',
    });

    // Main body
    const fo = this.container.addForeignObject({
      x: 0, y: 25, width: 200, height: 125,
    });
    fo.element.appendChild(this.body);

    // Populate the inputs
    const inputConfigList = 'inputs' in this.config ? <[JsonObject]> this.config.inputs : [];
    const containerRect = this.container.element.getBoundingClientRect();
    inputConfigList.forEach((inputConfig) => {
      const input = this.addInput(inputConfig);
      const inputSocketPos = input.getSocketPos();
      this.addSocket(
        0,
        inputSocketPos.y - containerRect.top,
      );
    });

    this.updateHeight();
  }

  updateHeight(): void {
    // Update the height of the frame rect and foreignObject element to fit the contents of the body
    const fo = this.body.parentElement;
    if (!fo) return;
    fo.setAttribute('height', `${this.body.clientHeight}`);
    this.frame?.setAttributes({ height: `${this.body.clientHeight}` });
  }

  remove(): void {
    this.container.remove();
  }
}

export default NodeUI;
