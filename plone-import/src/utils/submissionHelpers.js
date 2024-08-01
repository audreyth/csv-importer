import { getData } from "./apiHelpers";
import { transformString, trimLink, trimServerUrl } from "./utils";

export const checkFolder = async (errorMessage, formData, result) => {
  const isEmptyFolder = result.items.length === 0;

  if (isEmptyFolder && !formData.postToEmptyFolder) {
    return errorMessage("Selected folder is empty");
  }

  if (isEmptyFolder && formData.postToEmptyFolder && formData.autoCreateNewItems) {
    return true;
  }

  // return false;  // tk:
};

export const checkContentTypes = async (errorMessage, formData, result) => {
  const isValidInputType = await validateContentType(formData);

  if (!isValidInputType) {
    errorMessage("Invalid content type");
    return false;
  }

  const isSameContentType = await compareTypes(formData, result);

  if (!isSameContentType) {
    errorMessage("Content types do not match");
    return false;
  }

  return true;
};

export const validateContentType = async (formData) => {
  const trimmedUrl = await trimServerUrl(formData.url);
  const typesUrl = trimmedUrl + "@types";

  const result = await getData(formData, typesUrl);

  const typeExists = result.some((type) => type.id.toLowerCase() === formData.contentType.toLowerCase());

  return typeExists;
};

export const compareTypes = async (formData, result) => {
  const inputType = formData.contentType.toLowerCase();

  if (result.items.length === 0) {
    return "empty";
  }

  const resultItemType = result.items[0]["@type"].toLowerCase();

  const isMatch = inputType === resultItemType;

  return isMatch;
};

export const validatePrimaryKey = async (formData, item) => {
  const inputKey = formData.primaryKey.toLowerCase();

  const keyExists = inputKey in item;

  return keyExists;
};

export const comparePrimaryKeys = async (formData, item) => {
  const inputKey = formData.primaryKey.toLowerCase();

  const postedPKValue = item[inputKey].toLowerCase();
  const trimmedLink = trimLink(item["@id"]).toLowerCase();
  const transformedFieldName = transformString(postedPKValue);

  const isSame = transformedFieldName === trimmedLink;

  return isSame;
};

export const checkPrimaryKey = async (errorMessage, formData, result) => {
  const firstItemId = result.items[0]["@id"];
  const firstUrlItem = await getData(formData, firstItemId);

  const isValidPrimaryKey = await validatePrimaryKey(formData, firstUrlItem);

  if (!isValidPrimaryKey) {
    errorMessage("Invalid primary key");
    return false;
  }

  const isSamePrimaryKey = await comparePrimaryKeys(formData, firstUrlItem);

  if (!isSamePrimaryKey) {
    errorMessage("Primary keys do not match");
    return false;
  }

  return true;
};

export const getContentTypeData = async (formData) => {
  const { url, contentType } = formData;

  const trimmedUrl = await trimServerUrl(url);
  const contentTypeDataUrl = `${trimmedUrl}@types/${contentType}`;

  const result = await getData(formData, contentTypeDataUrl);

  const contentTypeProps = result.properties;

  return contentTypeProps;
};
