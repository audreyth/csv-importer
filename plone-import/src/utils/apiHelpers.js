import { apiSubmission } from "../api/api";
import { transformString } from "./utils";

export const authUser = async (formData) => {
  const { url, username, password } = formData;

  try {
    const result = await apiSubmission({
      method: "GET",
      url,
      username,
      password,
    });

    return result;
  } catch (error) {
    console.error("Failed to authenticate user.", error);
    return null;
  }
};

export const getData = async (formData, url) => {
  const { username, password } = formData;

  try {
    const result = await apiSubmission({
      method: "GET",
      url,
      username,
      password,
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getItem = async (item, formData) => {
  const { url, username, password, primaryKey } = formData;

  const transformedFieldName = transformString(item[primaryKey]);
  const itemId = transformedFieldName.replace(/\s/g, "-").toLowerCase();

  try {
    const itemUrl = `${url}/${itemId}`;

    const result = await apiSubmission({
      method: "GET",
      url: itemUrl,
      username,
      password,
    });

    return result;
  } catch (error) {
    console.error(`Failed to find item with ID ${item[primaryKey]}.`, error);
    return null;
  }
};

export const updateItem = async (currentItem, newItem, formData) => {
  const { username, password, primaryKey } = formData;

  const newUrl = currentItem["@id"].toLowerCase();

  try {
    const itemUrl = newUrl;

    const result = await apiSubmission({
      method: "PATCH",
      url: itemUrl,
      username,
      password,
      body: { title: currentItem.title, ...newItem },
    });

    return result;
  } catch (error) {
    console.error(`Error updating item with ID ${currentItem[primaryKey]}`, error);
    return null;
  }
};

export const postItem = async (item, formData) => {
  const { url, username, password, contentType, primaryKey } = formData;

  try {
    const result = await apiSubmission({
      method: "POST",
      url,
      username,
      password,
      body: {
        "@type": contentType.toLowerCase(),
        gmcfeed: "low", // this tho
        title: item[primaryKey],
        ...item,
      },
    });

    return result;
  } catch (error) {
    console.error(`Error posting item with ID ${item[primaryKey]}`, error);
    return null;
  }
};
