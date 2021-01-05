//Function used to inherit properties and methods
function applyMixins(derivedCtor: any, constructors: any[]) {
    //Copies methods
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null)
        );
      });
    });
    //Copies properties
    constructors.forEach((baseCtor) => {
      let empty = new baseCtor();
      Object.keys(empty).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(empty, name) ||
            Object.create(null)
        );
      });
    });
  }

  export default applyMixins;