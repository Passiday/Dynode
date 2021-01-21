import { VEvent, VEventTarget } from '../src/vanillaEvent';
import applyMixins from '../src/objectUtils';

test('Adding duplicates causes an error', () => {
  const target = new VEventTarget();
  const func = () => {};

  target.addEventListener('test', func);
  expect(() => target.addEventListener('test', func)).toThrow(Error);
});

test('Removing a function that was not added causes an error', () => {
  const target = new VEventTarget();
  const func = () => {};
  const otherFunc = () => {};

  expect(() => target.removeEventListener('test', func)).toThrow(Error);

  target.addEventListener('test', otherFunc);
  expect(() => target.removeEventListener('test', func)).toThrow(Error);
});

test('Event fires', () => {
  const target = new VEventTarget();
  let eventFired = false;
  const func = () => { eventFired = true; };

  target.addEventListener('test', func);

  target.dispatchEvent(new VEvent('test'));
  expect(eventFired).toBe(true);
});

test('Event fires correctly', () => {
  const target = new VEventTarget();
  let eventFired = false;
  const func = () => { eventFired = true; };

  target.addEventListener('test', func);

  target.dispatchEvent(new VEvent('other'));
  expect(eventFired).toBe(false);

  target.dispatchEvent(new VEvent('test'));
  expect(eventFired).toBe(true);
});

test('Removing an event works', () => {
  const target = new VEventTarget();
  let counter = 0;
  const func = () => { counter++; };

  target.addEventListener('test', func);
  target.dispatchEvent(new VEvent('test'));
  expect(counter).toBe(1);

  target.removeEventListener('test', func);
  target.dispatchEvent(new VEvent('test'));
  expect(counter).toBe(1);
});

test('Events fire correctly', () => {
  const target = new VEventTarget();
  let message1 = '';
  let message2 = '';
  const func1 = () => { message1 += 'this'; };
  const func2 = () => { message1 += 'is'; };
  const func3 = () => { message2 += 'not'; };
  const func4 = () => { message1 += 'ok'; };

  target.addEventListener('test', func1);
  target.addEventListener('test', func2);
  target.addEventListener('other', func3);
  target.addEventListener('test', func4);

  target.dispatchEvent(new VEvent('test'));
  expect(message1).toBe('thisisok');
  expect(message2).toBe('');

  target.dispatchEvent(new VEvent('other'));
  expect(message1).toBe('thisisok');
  expect(message2).toBe('not');

  message1 = '';
  target.removeEventListener('test', func4);
  target.removeEventListener('other', func3);

  target.dispatchEvent(new VEvent('test'));
  target.dispatchEvent(new VEvent('other'));
  expect(message1).toBe('thisis');
  expect(message2).toBe('not');
});

test('Owner of the called function is the target', () => {
  const target = new VEventTarget();
  let fuctionThis:unknown;
  function test(this: void) {
    fuctionThis = this;
  }
  target.addEventListener('test', test);
  target.dispatchEvent(new VEvent('test'));
  expect(fuctionThis).toBe(target);
});

test('Inheritance example', () => {
  class Cat extends VEventTarget {
    hunger = 1;

    name: string;

    constructor(name: string) {
      super();
      this.name = name;
    }

    feed() {
      if (this.hunger > 0) this.hunger--;
      this.dispatchEvent(new VEvent('update'));
    }
  }
  const hungerLevels: {[name: string]: number;} = {};
  const cat = new Cat('Kitty');
  cat.addEventListener('update', function temp(this: Cat) {
    hungerLevels[this.name] = this.hunger;
  });
  cat.feed();
  expect(hungerLevels.Kitty).toBe(0);
});
test('Multiple class inheritance example', () => {
  class Animal {
    hunger = 1;

    name: string;

    constructor(name: string) {
      this.name = name;
    }

    baseFeed() {
      if (this.hunger > 0) this.hunger--;
    }
  }
  class Cat {
    constructor(name: string) {
      this.name = name;
    }

    play() {
      this.hunger++;
      this.dispatchEvent(new VEvent('update'));
    }

    feed() {
      this.baseFeed();
      this.dispatchEvent(new VEvent('update'));
    }
  }
  interface Cat extends Animal, VEventTarget {}
  applyMixins(Cat, [Animal, VEventTarget]);

  const hungerLevels: {[name: string]: number;} = {};
  const cat = new Cat('Kitty');
  cat.addEventListener('update', function temp(this: Cat) {
    hungerLevels[this.name] = this.hunger;
  });
  cat.play();
  expect(hungerLevels.Kitty).toBe(2);
  cat.feed();
  expect(hungerLevels.Kitty).toBe(1);
});
