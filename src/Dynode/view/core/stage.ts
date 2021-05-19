import controllerExample from 'src/examples/controller';
import type { JsonObject } from 'src/utils/objectUtils';
import type Node from './node';

interface NodeConstructor {
  new(stage: Stage, config?: JsonObject): Node;
}

class Stage {
  private types: {[type: string]: NodeConstructor} = {};

  svgb: SVGBuilder;

  name = 'Node';

  debug: { [key: string]: unknown } = {};

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
    this.createMenu(container);
  }

  createMenu = (container: HTMLElement) => {
    const menu = document.createElement('div');
    const menuOption = document.createElement('ul');
    menu.className = 'menu';
    menuOption.className = 'menu-options';
    menuOption.innerHTML = `
        <li class="menu-option">Resolve</li>
        <li class="menu-option">Add Node</li>
    `;

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

    menuOption.addEventListener('click', (e) => {
      console.log('mouse-option', (e.target as HTMLElement));
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
