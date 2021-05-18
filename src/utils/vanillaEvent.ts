declare type VEventHandlerWithThis = (this:VEventTarget, v:VEvent<any>) => void;
declare type VEventHandlerWithoutThis = (v:VEvent<any>) => void;
declare type VEventHandler = VEventHandlerWithThis | VEventHandlerWithoutThis;

/**
 * TODO
 */
class VEventTarget {
  /**
   * A collection of registered events.
   */
  events: { [key: string]: VEventHandler[]; } = {};

  /**
   * Attach an event listener to this object.
   *
   * @param type  Name of the event type.
   * @param func  Function that will handle the provided event type.
   */
  addEventListener(type: string, func: VEventHandler): void {
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

  /**
   * Send an event to every registered event listener.
   *
   * @param e Event that is going to be sent.
   */
  dispatchEvent(e: VEvent<this>): void {
    e.currentTarget = this;
    e.target = this;
    if (e.type in this.events) {
      this.events[e.type].forEach((func: VEventHandler) => {
        func.call(this, e);
      });
    }
  }

  /**
   * Detach an event listener to this object.
   *
   * @param type  Name of the event type.
   * @param func  Handler reference which is going to be removed.
   */
  removeEventListener(type: string, func: VEventHandler): void {
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

class VEvent<T extends VEventTarget> {
  type: string;

  detail: unknown;

  currentTarget: T | undefined;

  target: T | undefined;

  constructor(type: string, customEventInit?: CustomEventInit) {
    this.type = type;
    if (customEventInit !== undefined) this.detail = customEventInit.detail;
  }
}

export {
  VEventTarget,
  VEvent,
  VEventHandler,
};
