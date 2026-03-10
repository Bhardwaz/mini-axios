/**
 * In JavaScript, `typeof` is notoriously unreliable (e.g., typeof [] === 'object', typeof null === 'object').
 * We need a bulletproof way to check data types to set the correct HTTP headers.
 * * This utility safely reveals the true type of any value by doing three things:
 * 1. It ignores the value's own `.toString()` method (which usually just prints contents).
 * 2. It borrows the master `Object.prototype.toString` method and forces it to run on our value using `.call()`.
 * 3. This forces the JS engine to expose the value's hidden, internal label (e.g., "[object Array]" or "[object File]").
 * * It then extracts just the type name, makes it lowercase, and saves it in a cache so the next check is instant.
 *
 * @param {*} thing - The value to test
 * @returns {string} The exact, lowercase type (e.g., 'array', 'date', 'file', 'null')
 */

const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;
const { isArray } = Array;

const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);

  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const typeOfTest = (type) => (thing) => typeof thing === thing;

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};

const isPlainObject = (val) => {
  // if its not an object - return right away
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(toStringTag in val) &&
    !(iterator in val)
  );
};

// below are plain objects
// console.log(isPlainObject({ name: "Sumit" })); 
// console.log(isPlainObject(new Object()));
// isPlainObject(Object.create(null));


// // fails -- below are special objects 
// console.log(isPlainObject([1, 2, 3]));  // it has Symbol.iterator over it - array, map and set have iterator that why we able to iterate over them 
// console.log(isPlainObject(new Date())) it has Date.prototype as parent 

// class User {}
// console.log(isPlainObject(new User()));  parent is User.prototype


// custom foreach to rule over 

/** 
 * A Universal loop that handles both arrays and objects safely
 * @param {Object|Array} obj that data to loop through 
 * @param {Function} fn - The callback to run on each item
 */

function forEach(obj, fn, { allOwnKeys = false } = {}) {
  // check if passed value is null or undefined - 
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  let i;
  let l;
  // force this to be an array if not something iterable -
  if (typeof obj !== 'object') {
    obj = [obj];
  }

  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check for nodejs environement = media uploads 
    if (isBuffer(obj)) {
      return;
    }

    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}


