export default function getFromChild(child, path = '') {
  const split = path.split('.');
  return split.reduce((obj, key, index) => {
    const lastItem = index === split.length - 1;
    return lastItem ? obj[key] : obj[key] || {};
  }, child);
}
