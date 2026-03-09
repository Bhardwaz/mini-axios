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
const kindOf = ((cache) => (thing) => { 
     const str = Object.prototype.toString.call(thing);
     
     return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));