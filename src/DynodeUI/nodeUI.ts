import { StageUI } from './stageUI';

class NodeUI {

  stage: StageUI;

  name: string;

  container: SVGBGroup;

  frame?: SVGBRect;

  body: HTMLDivElement;

  inputsContainer: HTMLDivElement;

  outputsContainer: HTMLDivElement;

  inputs: HTMLDivElement[];

  infoBox: HTMLDivElement;

  constructor(stage: StageUI, name?: string) {
    this.stage = stage;
    this.name = name || 'Node';

    this.container = stage.svgb.addGroup({ class: 'node' });

    this.body = document.createElement('div');
    this.body.classList.add('body');

    const socketContainer = document.createElement('div');
    socketContainer.classList.add('socketContainer');
    this.body.appendChild(socketContainer);

    this.inputsContainer = document.createElement('div');
    this.inputsContainer.classList.add('inputs');
    socketContainer.appendChild(this.inputsContainer);

    this.outputsContainer = document.createElement('div');
    this.outputsContainer.classList.add('outputs');
    socketContainer.appendChild(this.outputsContainer);

    this.infoBox = document.createElement('div');
    this.infoBox.classList.add('infoBox');    
    this.infoBox.innerHTML = 'Hello, <strong>World</strong>. This is plain HTML in a <em>&lt;foreignObject&gt;</em> SVG element.';

    this.body.appendChild(this.infoBox);

    this.inputs = [];

    this.redraw();
  }

  addInput(inputName: string, inputValue: string) {
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input');
    // Add input detail
    const label = document.createElement('label');

    const labelTxt = document.createElement('div');
    labelTxt.innerText = inputName;
    label.appendChild(labelTxt);

    const textbox = document.createElement('input');
    label.appendChild(textbox);
    textbox.setAttribute('type', 'text');
    textbox.setAttribute('value', inputValue);
    inputContainer.appendChild(label);
    // Bind the events
    textbox.addEventListener('change', function(this:HTMLInputElement) {
      console.log('Input [', inputName, '] new value:', this.value);
    })
    // Register
    this.inputs.push(inputContainer);
    this.inputsContainer.appendChild(inputContainer);
    this.updateHeight()
  }

  setInfo(contents: string) {
    this.infoBox.innerHTML = contents;
  }

  redraw() {
    // Redraw the node UI
    this.container.wipe();
    this.frame = this.container.addRect({
        x: 0, y: 0, width: 200, height: 150, class: 'body',
    });
    const titleBar = this.container.addRect({
        x: 0, y: 0, width: 200, height: 25, class: 'titleBar',
    });
    this.stage.svgb.draggable(titleBar, null, this.container);

    this.container.addText({ x: 5, y: 20, class: 'titleBarText' }, this.name);
    const fo = this.container.addForeignObject({
        x: 0, y: 25, width: 200, height: 125,
    });
    fo.element.appendChild(this.body);    
  }

  updateHeight() {
    const fo = this.body.parentElement;
    if (!fo) return;
    fo.setAttribute('height', this.body.clientHeight + '');
    this.frame?.setAttributes({'height': this.body.clientHeight + 20});
  }

  remove() {
    this.container.remove();
  }
}

export { NodeUI };