declare type ValidFunction1 = (this:VEventTarget, v:VEvent) => void;
declare type ValidFunction2 = (v:VEvent) => void;
declare type ValidFunction = ValidFunction1|ValidFunction2;

class VEventTarget {
  events: { [key: string]: ValidFunction[]; } = {};

  addEventListener(type: string, func: ValidFunction): void {
    if (type in this.events) {
      if (this.events[type].indexOf(func) !== -1) {
        throw new Error(`Event listener with the specified type and function: ${type} ${func} already exists`);
      } else {
        this.events[type].push(func);
      }
    } else {
      this.events[type] = [func];
    }
  }

  dispatchEvent(e: VEvent): void {
    e.currentTarget = this;
    e.target = this;
    if (e.type in this.events) {
      this.events[e.type].forEach((func: ValidFunction) => {
        func.call(this, e);
      });
    }
  }

  removeEventListener(type: string, func: ValidFunction): void {
    if (type in this.events) {
      const index = this.events[type].indexOf(func);
      if (index !== -1) {
        this.events[type].splice(index, 1);
        return;
      }
    }
    throw new Error(`Could not find event listener with the specified type and function: ${type} ${func}`);
  }
}
interface CustomEventInit{
  detail: unknown;
}
class VEvent {
  type: string;

  detail: unknown;

  currentTarget: VEventTarget | undefined;

  target: VEventTarget | undefined;

  constructor(type: string, customEventInit?: CustomEventInit) {
    this.type = type;
    if (customEventInit !== undefined) this.detail = customEventInit.detail;
  }
}

export {
  VEventTarget,
  VEvent,
};
