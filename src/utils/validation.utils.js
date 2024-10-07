const validation = (name, data, type, length) => {
  //   Check what ever the data have or not
  console.log(`${name}=${data}`)
if (!data) {
    return { error: `${name} Field is empty` };
}
  //   Check the type of Data
if (typeof data != type) {
   return { error: `Invalid ${name}! Must be ${type}` };
}
//check the length of data
if (data.length < length) {
    return { error: `Invalid ${name}! Length should be ${length}` };
}
return false;
};
export {validation}