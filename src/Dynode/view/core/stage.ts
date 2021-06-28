import controllerExample from 'src/examples/controller';
import type { JsonObject } from 'src/utils/objectUtils';
import { VEventTarget, VEvent } from 'src/utils/vanillaEvent';
import type Node from './node';

interface NodeConstructor {
  new(stage: Stage, config?: JsonObject): Node;
}

class Stage extends VEventTarget {
  private types: {[type: string]: NodeConstructor} = {};

  svgb: SVGBuilder;

  name = 'Node';

  debug: { [key: string]: unknown } = {};

  constructor(container: HTMLElement) {
    super();
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
    this.declareEvents(['menuResolve']);
    this.createMenu(container);
  }

  createMenu = (container: HTMLElement) => {
    const menu = document.createElement('div');
    const menuOption = document.createElement('ul');
    menu.className = 'menu';
    menuOption.className = 'menu-options';
    const optionOne = document.createElement('li');
    optionOne.className = 'menu-option';
    optionOne.innerHTML = 'Resolve';
    optionOne.onclick = () => { this.dispatchEvent(new VEvent('menuResolve')); };
    menuOption.append(optionOne);

    menu.append(menuOption);
    container.append(menu);
    let menuVisible = false;

    const toggleMenu = (command: string) => {
      menu.style.display = command === 'show' ? 'block' : 'none';
      menuVisible = !menuVisible;
    };

    window.addEventListener('click', (e) => {
      if (menuVisible) toggleMenu('hide');
    });

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      menu.style.left = `${e.pageX}px`;
      menu.style.top = `${e.pageY}px`;

      toggleMenu('show');
      return false;
    });
  };

  public addNodeType(type: string, ctor: NodeConstructor): void {
    this.types[type] = ctor;
  }

  public getNodeType(type: string): NodeConstructor {
    const typeClass = this.types[type];
    if (!typeClass) throw new Error(`Type ${type} does not exist!`);
    return typeClass;
  }

  public nodeTypeExists(type: string): boolean {
    return (type in this.types);
  }
}

export default Stage;
