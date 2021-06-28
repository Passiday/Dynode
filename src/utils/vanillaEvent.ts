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
  * An array of allowed events.
  * Allowed events are added using declareEvents or declareEvent method.
  */
  private eventList: string[] = [];

  /**
   * Adds allowed event types.
   * @param events An array of allowed event types.
   */
  declareEvents(events: string[]): void {
    events.forEach((event) => {
      this.declareEvent(event);
    });
  }

  /**
   * Adds allowed event type.
   * @param event An allowed event type.
   */
  declareEvent(event: string): void {
    if (this.eventList.includes(event)) {
      throw new Error(`EventList with the specified type ${event} already exists`);
    } else {
      this.eventList.push(event);
    }
  }

  /**
   * Removes allowed event types.
   * @param event Events to be removed from allowed event types.
   */
  removeEvents(events: string[]): void {
    events.forEach((event) => {
      this.removeEvent(event);
    });
  }

  /**
   * Removes an allowed event type.
   * @param event Event to be removed from allowed event types.
   */
  removeEvent(event: string): void {
    const index = this.eventList.indexOf(event);
    if (index === -1) {
      throw new Error(`EventList with the specified type ${event} doesn't exist`);
    }
    this.eventList.splice(index, -1);
  }

  /**
   * Attach an event listener to this object.
   *
   * @param type  Name of the event type.
   * @param func  Function that will handle the provided event type.
   */
  addEventListener(type: string, func: VEventHandler): void {
    if (!this.eventList.includes(type)) {
      throw new Error(`Event type (${type}) is not allowed. Currently allowed event types are ${this.eventList}`);
    }
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
    if (!this.eventList.includes(e.type)) {
      throw new Error(`Called event type (${e.type}) is not allowed. Currently allowed event types are ${this.eventList}`);
    }
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
