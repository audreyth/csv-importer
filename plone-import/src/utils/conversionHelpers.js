import Papa from "papaparse";

import { getContentTypeData } from "./submissionHelpers";
import { removePrefixFromTitles } from "./utils";

export const parseCsvData = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      transformHeader: (header) => header.toLowerCase(),
      complete: (result) => {
        resolve({ data: result.data });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const stringToBoolean = (value) => {
  if (value.toLowerCase() === "ja" || value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "nein" || value.toLowerCase() === "false") return false;
  return Boolean(value);
};

export const fixFloat = (value) => {
  const parts = value.split(".");
  const emptyDecimals = parts.length === 2 && parts[1].endsWith("0") && parts[1].startsWith("0");

  if (emptyDecimals) return String(value);
  if (!parts[1]) return parseFloat(value).toFixed(1);
  return Number(value);
};

export const convertValue = (value, type) => {
  switch (type) {
    case "string":
      return String(value);
    case "number":
      return fixFloat(value);
    case "integer":
      return Number(value);
    case "boolean":
      return stringToBoolean(value);
    default:
      return value;
  }
};

export const convertFieldTypes = async (formData, fileData) => {
  const contentTypeProps = await getContentTypeData(formData);

  const contentTypesArray = Object.entries(contentTypeProps).map(([id, { title, type, factory }]) => ({
    id,
    title,
    type: factory === "Date" ? "date" : type,
    factory,
  }));

  const contentTypeData = removePrefixFromTitles(contentTypesArray);

  // console.log("contentTypeData", contentTypeData);

  return updateValues(contentTypeData, fileData);
};

export const updateValues = (contentTypeData, uploadedFileData) => {
  contentTypeData.forEach((item) => {
    const { id, title, type } = item;

    uploadedFileData.forEach((fileItem) => {
      if (fileItem[title] !== undefined || fileItem[id] !== undefined) {
        const keyMatch = Object.keys(fileItem).find((key) => key === title || key === id);

        if (keyMatch) {
          let fileItemValue = fileItem[keyMatch];

          const isSameType = type === typeof fileItemValue;

          const isTypeMismatch = !isSameType && fileItemValue !== null && fileItemValue !== "";

          if (isTypeMismatch) {
            fileItem[keyMatch] = convertValue(fileItemValue, type);
          } else if (typeof fileItemValue === "string") {
            fileItem[keyMatch] = fileItemValue.trimEnd();
          }
        }
      }
    });
  });

  return { contentTypeData, uploadedFileData };
};

export const fixKeyNames = (convertedData, formData) => {
  const { uploadedFileData, contentTypeData } = convertedData;
  const updatedFile = [];
  const removedKeys = [];

  const id = formData.primaryKey;

  for (const item of uploadedFileData) {
    const updatedKeyData = updateKeys(item, contentTypeData);
    updatedFile.push(updatedKeyData.updatedItem);
    removedKeys.push({ id: item[id], ...updatedKeyData.keysNotInTypeDictionary });
  }

  console.log("removedKeys", removedKeys);

  return { updatedFile, removedKeys };
};

export const updateKeys = (newItem, typeDictionary) => {
  const updatedItem = { ...newItem };
  const keysNotInTypeDictionary = [];

  Object.keys(newItem).forEach((key) => {
    const dictionaryEntryTitle = typeDictionary.find((entry) => entry.title === key);
    const dictionaryEntryId = typeDictionary.find((entry) => entry.id === key);
    const dictionaryEntry = dictionaryEntryId || dictionaryEntryTitle;

    if (!dictionaryEntry) {
      keysNotInTypeDictionary.push(key);
      delete updatedItem[key];
    } else if (dictionaryEntry.type === "date") {
      keysNotInTypeDictionary.push(key);
      delete updatedItem[key];
    } else if (dictionaryEntryTitle && !dictionaryEntryId) {
      const id = dictionaryEntryTitle.id;
      updatedItem[id] = updatedItem[key];
      delete updatedItem[key];
    }
  });

  // console.log("keysNotInTypeDictionary", keysNotInTypeDictionary);

  return { updatedItem, keysNotInTypeDictionary };
};
