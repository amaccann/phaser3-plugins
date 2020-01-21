/**
 * @function forEach
 * @description Quick forEach across any collection (note, reverse search for speed)
 * @param {Array} collection
 * @param {Function} iterator
 * @param {Object} scope
 */
export default function forEach(collection = [], iterator, scope) {
  let i = collection.length;

  while (i--) {
    if (collection[i]){
      iterator.apply(scope, [collection[i]]);
    }
  }
}
