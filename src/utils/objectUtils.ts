// JsonObject type definition copied from https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
export type JsonObject = {[Key in string]?: JsonValue};
type JsonArray = Array<JsonValue>;
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare type NewableType = new(...args: any[]) => object;

// Function used to inherit properties and methods
function applyMixins(derivedCtor: NewableType, constructors: NewableType[]): void {
  // Copies methods
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
          || Object.create(null),
      );
    });
  });
  // Copies properties
  constructors.forEach((BaseCtor) => {
    const empty = new BaseCtor();
    Object.keys(empty).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(empty, name)
          || Object.create(null),
      );
    });
  });
}
/**
 * Function, that checks if a property exists on object.
*
* @param obj The object ,that needs to be checked.
* @param prop The property, that needs to be checked.
*
*/
// eslint-disable-next-line @typescript-eslint/ban-types
function hasOwnProperty<X extends {}
, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return prop in obj;
}

export {
  applyMixins,
  hasOwnProperty,
};
