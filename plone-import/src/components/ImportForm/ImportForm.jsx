/* eslint-disable react-hooks/exhaustive-deps */
import { FormFields } from "../FormFields/FormFields";
import { Button } from "../Buttons/Button/Button";

import { useEffect, useState } from "react";

import "./style.scss";
import { ToggleSwitch } from "../Buttons/ToggleSwitch/ToggleSwitch";

export const ImportForm = ({ formData, setFormData, onSubmit, onFileRemove, onLogin }) => {
  const [autoCreate, setAutoCreate] = useState(false);
  const [importToEmptyFolder, setImportToEmptyFolder] = useState(false);

  const { username, password, url, file, contentType, submitted, authenticated, imported } = formData;

  const allFieldsEmpty = [url, username, password].every((field) => field !== "");

  const handleAutoCreateChange = () => setAutoCreate(!autoCreate);

  const handleImportToEmptyFolderChange = () => setImportToEmptyFolder(!importToEmptyFolder);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    setFormData({ ...formData, authenticated: false });

    const file = e.target.files[0];

    setFormData({ ...formData, file: file, fileName: e.target.files[0].name });
  };

  const handleFileRemove = () => {
    onFileRemove();
    setAutoCreate(false);
    setImportToEmptyFolder(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLogin = async () => {
    onLogin(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onLogin(formData);
    }
  };

  useEffect(() => {
    if (importToEmptyFolder) {
      setAutoCreate(true);
    }
    setFormData({ ...formData, autoCreateNewItems: autoCreate, postToEmptyFolder: importToEmptyFolder });
  }, [autoCreate, importToEmptyFolder]);

  return (
    <form onSubmit={handleSubmit} className="import-form">
      <FormFields formData={formData} onChange={handleChange} onFileChange={handleFileChange} onFileRemove={handleFileRemove} onKeyPress={handleKeyPress} />

      {!imported && authenticated && (
        <div className="import-form__options">
          <p className="import-form__options-text">options</p>
          <div className="import-form__options-buttons">
            <ToggleSwitch id="auto-create" checked={autoCreate} onChange={handleAutoCreateChange} label="auto-create new items" />
            <ToggleSwitch id="import-empty-folder" checked={importToEmptyFolder} onChange={handleImportToEmptyFolderChange} label="allow import into empty folder" />
          </div>
        </div>
      )}

      {!authenticated && (
        <Button disabled={!allFieldsEmpty} type="button" styleType="default" onClick={handleLogin}>
          login
        </Button>
      )}

      {file && !submitted && (
        <Button disabled={contentType === ""} type="submit" styleType="default" onClick={handleSubmit}>
          submit file
        </Button>
      )}
    </form>
  );
};
