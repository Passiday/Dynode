import {VEvent, VEventTarget} from '../src/vanillaEvent';
import applyMixins from '../src/objectUtils';


test('Adding duplicates causes an error', () => {
    let target = new VEventTarget();
    let func = ()=>{};

    target.addEventListener("test", func);
    expect(()=>target.addEventListener("test", func)).toThrow(Error);
});

test('Removing a function that was not added causes an error', () => {
    let target = new VEventTarget();
    let func = ()=>{};
    let otherFunc = ()=>{};

    expect(()=>target.removeEventListener("test", func)).toThrow(Error);

    target.addEventListener("test", otherFunc);
    expect(()=>target.removeEventListener("test", func)).toThrow(Error);
});

test('Event fires', () => {
    let target = new VEventTarget();
    let eventFired = false;
    let func = ()=>{eventFired=true};

    target.addEventListener("test", func);
   
    target.dispatchEvent(new VEvent("test"));
    expect(eventFired).toBe(true);
});

test('Event fires correctly', () => {
    let target = new VEventTarget();
    let eventFired = false;
    let func = ()=>{eventFired=true};

    target.addEventListener("test", func);
   
    target.dispatchEvent(new VEvent("other"));
    expect(eventFired).toBe(false);

    target.dispatchEvent(new VEvent("test"));
    expect(eventFired).toBe(true);
});

test('Removing an event works', () => {
    let target = new VEventTarget();
    let counter = 0;
    let func = ()=>{counter++};

    target.addEventListener("test", func);
    target.dispatchEvent(new VEvent("test"));
    expect(counter).toBe(1);

    target.removeEventListener("test",func);
    target.dispatchEvent(new VEvent("test"));
    expect(counter).toBe(1);
});

test('Events fire correctly', () => {
    let target = new VEventTarget();
    let message1 = "";
    let message2 = "";
    let func1 = ()=>{message1+="this"};
    let func2 = ()=>{message1+="is"};
    let func3 = ()=>{message2+="not"};
    let func4 = ()=>{message1+="ok"};

    target.addEventListener("test", func1);
    target.addEventListener("test", func2);
    target.addEventListener("other",func3);
    target.addEventListener("test", func4);
    
    target.dispatchEvent(new VEvent("test"));
    expect(message1).toBe("thisisok");
    expect(message2).toBe("");

    target.dispatchEvent(new VEvent("other"));
    expect(message1).toBe("thisisok");
    expect(message2).toBe("not");

    message1 = "";
    target.removeEventListener("test",func4);
    target.removeEventListener("other", func3);
    
    target.dispatchEvent(new VEvent("test"));
    target.dispatchEvent(new VEvent("other"));
    expect(message1).toBe("thisis");
    expect(message2).toBe("not");
});

test('Owner of the called function is the target', () => {
    let target = new VEventTarget();
    let fuctionThis:unknown;
    function test(this: void,a:VEvent){
        fuctionThis=this;
    }
    target.addEventListener("test", test);
    target.dispatchEvent(new VEvent("test"));
    expect(fuctionThis).toBe(target);
});

test('Inheritance example', () => {
    class Cat extends VEventTarget{
        hunger = 1;
        name: string;
        constructor(name: string){
            super();
            this.name = name;
        }
    }
    let cat = new Cat("Kitty");
    cat.addEventListener("feed", function(this: Cat, a:VEvent){this.hunger--});
    cat.dispatchEvent(new VEvent("feed"));
    expect(cat.hunger).toBe(0);

});
test('Multiple class inheritance example', () => {
    class Animal{
        hunger = 1;
        name: string;
        constructor(name: string){
            this.name = name;
        }
    }
    class Cat{
        constructor(name: string){
            this.name = name;
        }
        play(){this.hunger++};
    };
    interface Cat extends Animal, VEventTarget {}
    applyMixins(Cat, [Animal, VEventTarget]);

    let cat = new Cat("Kitty")
    cat.addEventListener("feed", function(this: Cat, a:VEvent){this.hunger--});
    cat.play();
    expect(cat.hunger).toBe(2);
    cat.dispatchEvent(new VEvent("feed"));
    expect(cat.hunger).toBe(1);
});
