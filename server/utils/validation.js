var isRealString = (str) => {
 
  return isNaN(str) && str.trim().length > 0;
};

module.exports = {isRealString};