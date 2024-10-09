const validation = (name, data, type, length) => {
  console.log(`${name}=${data}`);

  // Check if data exists
  if (!data) {
    return { error: `${name} field is empty` };
  }

  // Check the type of Data
  if (typeof data !== type) {
    return { error: `Invalid ${name}! Must be of type ${type}` };
  }

  // Check for minimum length
  if (type === 'string' && data.length < length) {
    return { error: `Invalid ${name}! Length should be at least ${length}` };
  }

  // For numeric fields, ensure the number is positive (if needed)
  if (type === 'number' && data < length) {
    return { error: `Invalid ${name}! Must be at least ${length}` };
  }

  return null;
};
export {validation}

