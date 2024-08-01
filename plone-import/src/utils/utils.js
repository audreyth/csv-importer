/* trimming functions */

export const trimArray = (oldData, formData) => {
  const newData = formData.file;

  const trimmedArray = oldData.map((oldItem) => {
    const trimmedItem = {};
    for (const key in newData[0]) {
      if (key in newData[0] && key in oldItem) {
        trimmedItem[key] = oldItem[key];
      }
    }
    return trimmedItem;
  });

  return trimmedArray;
};

export const trimFieldName = (propName) => {
  const removeBrackets = propName.replace(/^\[[^\]]+\]\s*/, "");
  const addUnderscore = removeBrackets.replace(/\s+/g, "_");
  const formattedPropName = addUnderscore;

  return formattedPropName ? formattedPropName : propName;
};

export const trimServerUrl = (link) => {
  const matched = link.match(/([^/]*\/){3}/);
  return matched ? matched[0] : link;
};

export const trimLink = (link) => {
  const idRegex = /\/([^/]+)$/;

  const idMatch = link.match(idRegex);

  return idMatch ? idMatch[1].replace(/-/g, " ") : null;
};

export const removePrefixFromKeys = (data) => {
  return data.map((obj) => {
    const newObj = {};
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        const newKey = trimFieldName(prop);
        newObj[newKey] = obj[prop];
      }
    }
    return newObj;
  });
};

export const removePrefixFromTitles = (data) => {
  return data.map((obj) => {
    if (Object.prototype.hasOwnProperty.call(obj, "title")) {
      obj.title = trimFieldName(obj.title).toLowerCase();
    }
    return obj;
  });
};

/* other */

export const normalizeValue = (value) => {
  const numberValue = Number(value);
  return isNaN(numberValue) ? value : numberValue;
};

export const areValuesEqual = (value1, value2) => {
  const normalizedValue1 = normalizeValue(value1);
  const normalizedValue2 = normalizeValue(value2);

  return normalizedValue1 === normalizedValue2;
};

export const booleanToString = (value) => {
  if (typeof value === "boolean") return String(value);
  return value;
};

export const mergeArrays = (arr) => {
  const flattenedArray = arr.flat();
  const uniqueSet = new Set(flattenedArray);
  return Array.from(uniqueSet);
};

/* Language fix */

export const nonEnglishToEnglish = {
  ä: "a",
  ö: "o",
  ü: "ue",
  ß: "ss",
  é: "e",
  è: "e",
  á: "a",
  à: "a",
  ç: "c",
  ñ: "n",
  õ: "o",
  ø: "o",
  å: "a",
  æ: "ae",
  œ: "oe",
};

export const replaceNonEnglishLetters = (str) => {
  return str.replace(/[^a-zA-Z0-9\s-]/g, (char) => nonEnglishToEnglish[char] || char);
};

export const transformString = (str) => {
  let transformedStr = str.replace(/-/g, " ");

  transformedStr = replaceNonEnglishLetters(transformedStr);

  return transformedStr;
};
