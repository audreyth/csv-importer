export const stringValueIsFloat = (oldVal, newVal) => {
  if (typeof oldVal === "number" && typeof newVal === "string" && !isNaN(newVal)) {
    return oldVal === parseFloat(newVal);
  } else {
    return oldVal === newVal;
  }
};

export const createLog = async (formData, fileImportData) => {
  const { existingItems, newItemsPosted, fieldsNotImported } = fileImportData;
  const { primaryKey, selectedRows } = formData;

  const newItems = {};
  const fieldsFailedToImport = {}

  if (fieldsNotImported.length > 0) {
    fieldsNotImported.forEach((item) => {
      const itemId = item.id;
      fieldsFailedToImport[itemId] = { ...item };

      console.log(fieldsFailedToImport)
    });

  }

  if (newItemsPosted.length > 0) {
    newItemsPosted.forEach((item) => {
      const itemId = item[primaryKey];
      newItems[itemId] = { newItem: "NEW ITEM CREATED" };
    });
  }

  const hasDataChanged = existingItems.reduce((result, oldItem) => {
    const newDataItem = selectedRows.find((item) => item[primaryKey] === oldItem[primaryKey]);

    if (!newDataItem) return result;

    const itemId = newDataItem[primaryKey];

    Object.keys(oldItem)
      .sort()
      .forEach((key) => {
        const oldValue = oldItem[key];
        const updatedValue = newDataItem[key];
        const valueCondition = (oldValue !== null || updatedValue !== "") && !stringValueIsFloat(oldValue, updatedValue);

        if (valueCondition) {
          if (!result[itemId]) {
            result[itemId] = {};
          }
          result[itemId][key] = { oldValue, updatedValue };
        }
      });
    return result;
  }, {});

  const logData = { updatedData: hasDataChanged, newItems, fieldsFailedToImport };

  return logData;
};
