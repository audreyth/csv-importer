import { useState, useEffect } from "react";

import { removePrefixFromKeys, trimArray } from "../../utils/utils";
import { checkContentTypes, checkFolder, checkPrimaryKey } from "../../utils/submissionHelpers";
import { convertFieldTypes, fixKeyNames, parseCsvData } from "../../utils/conversionHelpers";
import { authUser, getData } from "../../utils/apiHelpers";
import { handleNewItem, processItem } from "../../utils/importHelpers";
import { createLog } from "../../utils/logHelpers";

import { Notification } from "../Notification/Notification";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { ImportForm } from "../ImportForm/ImportForm";
import { FileDetails } from "../FileDetails/FileDetails";
import { Log } from "../Log/Log";

import "./style.scss";

export const Container = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [logData, setLogData] = useState({});
  const [typeDictionary, setTypeDictionary] = useState([]);
  const [fieldsNotInTypeDictionary, setFieldsNotInTypeDictionary] = useState([]);
  const [fileImportData, setFileImportData] = useState({
    existingItems: [],
    itemsNotImported: [],
    itemsUpdated: [],
    newItemsPosted: [],
    isSameDataItems: [],
    fieldsNotImported: [],
  });
  const [formData, setFormData] = useState({
    // url: "",
    // username: "",
    // password: "",
    // contentType: "",
    // primaryKey: "",
    url: import.meta.env.VITE_BASE_URL,
    username: import.meta.env.VITE_BASE_USERNAME,
    password: import.meta.env.VITE_BASE_PASSWORD,
    contentType: "product",
    primaryKey: "artikelnummer",
    file: null,
    fileName: null,
    autoCreateNewItems: false,
    postToEmptyFolder: false,
    authenticated: false,
    submitted: false,
    imported: false,
    selectedRows: [],
  });

  const handleResetFormData = () => {
    const emptyFormData = {
      ...formData,
      // contentType: "",
      // primaryKey: "",
      contentType: "product", // tk: remove later
      primaryKey: "artikelnummer", // tk: rm later
      file: null,
      fileName: null,
      autoCreateNewItems: false,
      postToEmptyFolder: false,
      submitted: false,
      selectedRows: [],
      // authenticated: false,
      imported: false,
    };
    setFormData(emptyFormData);
    setFileImportData({ existingItems: [], itemsNotImported: [], itemsUpdated: [], newItemsPosted: [], isSameDataItems: [], fieldsNotImported: [] });
    setLogData({});
    setTypeDictionary([]);
    setFieldsNotInTypeDictionary([]);
  };

  const handleNotificationClose = () => {
    if (notification && notification.type !== "unauthorized") {
      setFormData({ ...formData, authenticated: true });
      setLoading(false);
    } else {
      setLoading(false);
      setFormData({ ...formData, authenticated: false });
    }

    setNotification(null);
  };

  const handleErrorNotif = (errorMessage) => {
    setNotification({ message: errorMessage, type: "error" });
  };

  const handleSuccessNotif = (successMessage) => {
    setNotification({ message: successMessage, type: "success" });
  };

  const onLogin = async () => {
    setLoading(true);

    const result = await authUser(formData);

    if (!result) {
      setNotification({
        message: "Failed to authenticate user",
        type: "unauthorized",
      });
      return;
    }

    handleSuccessNotif("User authenticated");
  };

  const onSubmit = async () => {
    const result = await getData(formData, formData.url);

    const isEmptyFolder = await checkFolder(handleErrorNotif, formData, result);

    if (!isEmptyFolder) {
      const isContentTypesValid = await checkContentTypes(handleErrorNotif, formData, result);

      if (!isContentTypesValid) {
        return;
      }

      const isPrimaryKeyValid = await checkPrimaryKey(handleErrorNotif, formData, result);

      if (!isPrimaryKeyValid) {
        return;
      }
    }

    const parsedData = await parseCsvData(formData.file);

    if (!parsedData) {
      handleResetFormData();
      return handleErrorNotif("Failed to parse file");
    }

    const trimmedFieldNames = removePrefixFromKeys(parsedData.data);

    if (!(formData.primaryKey.toLowerCase() in trimmedFieldNames[0])) {
      return handleErrorNotif("Primary key does not exist in uploaded file");
    }

    const convertedData = await convertFieldTypes(formData, trimmedFieldNames);

    const updated = fixKeyNames(convertedData, formData);

    setFormData({
      ...formData,
      file: updated.updatedFile,
      submitted: true,
    });

    setTypeDictionary(convertedData.contentTypeData);
    setFieldsNotInTypeDictionary(updated.removedKeys);
    setLoading(true);
    handleSuccessNotif("File submitted");
  };

  const onImport = async () => {
    setLoading(true);

    const importArrays = {
      existingItems: [],
      itemsNotImported: [],
      itemsUpdated: [],
      newItemsPosted: [],
      isSameDataItems: [],
      fieldsNotImported: [],
    };

    for (const item of formData.selectedRows) {
      const matchingObject = fieldsNotInTypeDictionary.find((fieldsObj) => fieldsObj.id === item[formData.primaryKey]);

      if (matchingObject) {
        importArrays.fieldsNotImported.push(matchingObject);
      }

      if (formData.postToEmptyFolder) {
        await handleNewItem(item, formData, importArrays);
      } else {
        await processItem(item, formData, importArrays);
      }
    }

    const allItemsAreSame = importArrays.isSameDataItems.length === formData.selectedRows.length;
    const noExistingItemsAndNoPost = importArrays.existingItems.length === 0 && !formData.autoCreateNewItems;

    if (allItemsAreSame) {
      handleResetFormData();
      return handleErrorNotif("Import skipped: nothing new to update");
    }

    if (noExistingItemsAndNoPost) {
      handleResetFormData();
      return handleErrorNotif("Import failed: selected items not found");
    }

    const trimmedExistingItems = trimArray(importArrays.existingItems, formData);

    setFileImportData({ ...importArrays, existingItems: trimmedExistingItems });
    setFormData({ ...formData, imported: true });
    handleSuccessNotif("Import completed");
  };

  const onFileRemove = () => {
    setLoading(false);
    handleResetFormData();
  };

  useEffect(() => {
    const generateLog = async () => {
      const log = await createLog(formData, fileImportData);
      setLogData(log);
    };

    generateLog();
  }, [formData, fileImportData]);

  return (
    <main className="import-container">
      <h2 className="import-container__title">Import CSV file</h2>
      <ImportForm formData={formData} setFormData={setFormData} onSubmit={onSubmit} onFileRemove={onFileRemove} onLogin={onLogin} />

      {formData.authenticated && formData.submitted && !loading && <FileDetails formData={formData} setFormData={setFormData} fileImportData={fileImportData} onImport={onImport} />}

      {!loading && formData.imported && <Log logData={logData} onFileRemove={onFileRemove} />}

      {loading && <LoadingSpinner />}

      <div className="notification-container">{notification && <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />}</div>
    </main>
  );
};
