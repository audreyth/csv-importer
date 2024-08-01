import { getItem, postItem, updateItem } from "./apiHelpers";
import { areValuesEqual } from "./utils";

export const processItem = async (item, formData, importArrays) => {
  const findItemResult = await getItem(item, formData);

  if (findItemResult) {
    importArrays.existingItems.push(findItemResult);
    await handleExistingItem(findItemResult, item, formData, importArrays);
  } else {
    await handleNewItem(item, formData, importArrays);
  }
};

export const handleExistingItem = async (currentItem, newItem, formData, importArrays) => {
  const isSameData = Object.keys(newItem).every((key) => currentItem[key] !== undefined && areValuesEqual(currentItem[key], newItem[key]));
  console.log("isSameData", isSameData);

  if (isSameData) {
    importArrays.isSameDataItems.push(newItem);
    return;
  }

  const updateResult = await updateItem(currentItem, newItem, formData);

  if (!updateResult) {
    importArrays.itemsNotImported.push(newItem);
  } else {
    importArrays.itemsUpdated.push(newItem);
  }
};

export const handleNewItem = async (newItem, formData, importArrays) => {
  if (!formData.autoCreateNewItems) {
    importArrays.itemsNotImported.push(newItem);
    return;
  }

  const postResult = await postItem(newItem, formData);

  if (!postResult) {
    importArrays.itemsNotImported.push(newItem);
  } else {
    importArrays.newItemsPosted.push(newItem);
  }
};
