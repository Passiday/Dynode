import {VEvent, VEventTarget} from '../src/vanillaEvent';


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

test('Event fires correctly', () => {
    let target = new VEventTarget();
    let event = new VEvent("test", {detail: ""});
    let otherEvent = new VEvent("other", {detail: ""});
    let func = (a:VEvent)=>{a.detail="ok"};

    target.addEventListener("test", func);
   
    target.dispatchEvent(otherEvent);
    expect(event.detail).toBe("");
    expect(otherEvent.detail).toBe("");

    target.dispatchEvent(event);
    expect(event.detail).toBe("ok");
    expect(otherEvent.detail).toBe("");
});

test('Removing an event works', () => {
    let target = new VEventTarget();
    let event = new VEvent("test", {detail: ""});
    let func = (a:VEvent)=>{a.detail+="ok"};

    target.addEventListener("test", func);
    target.dispatchEvent(event);
    expect(event.detail).toBe("ok");

    target.removeEventListener("test",func);
    target.dispatchEvent(event);
    expect(event.detail).toBe("ok");
});

test('Events fire correctly', () => {
    let target = new VEventTarget();
    let event = new VEvent("test", {detail: ""});
    let otherEvent = new VEvent("other", {detail: ""});
    let func1 = (a:VEvent)=>{a.detail+="this"};
    let func2 = (a:VEvent)=>{a.detail+="is"};
    let func3 = (a:VEvent)=>{a.detail+="not"};
    let func4 = (a:VEvent)=>{a.detail+="ok"};

    target.addEventListener("test", func1);
    target.addEventListener("test", func2);
    target.addEventListener("other",func3);
    target.addEventListener("test", func4);
    
    target.dispatchEvent(event);
    expect(event.detail).toBe("thisisok");
    expect(otherEvent.detail).toBe("");

    target.dispatchEvent(otherEvent);
    expect(event.detail).toBe("thisisok");
    expect(otherEvent.detail).toBe("not");

    event.detail = "";
    target.removeEventListener("test",func4);
    target.removeEventListener("other", func3);
    
    target.dispatchEvent(event);
    target.dispatchEvent(otherEvent);
    expect(event.detail).toBe("thisis");
    expect(otherEvent.detail).toBe("not");
});

test('Owner of the called function is the target', () => {
    let target = new VEventTarget();
    let event = new VEvent("test");
    class Test {
        func(a:VEvent){
            a.detail=this;
        }
    }
    let testObject = new Test();

    target.addEventListener("test", testObject.func);
    target.dispatchEvent(event);
    expect(event.detail).toBe(target);

});
