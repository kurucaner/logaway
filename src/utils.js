export function isUndefined(value) {
  return typeof value === "undefined" || value === undefined;
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isEmptyArray(value) {
  if (isUndefined(value) || !isArray(value)) return true;
  return value.length === 0;
}

export function arrayHasLength(value) {
  return !isEmptyArray(value);
}
