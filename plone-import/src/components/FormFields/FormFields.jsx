import { Button } from "../Buttons/Button/Button";

import "./style.scss";

export const FormFields = ({ formData, onChange, onFileChange, onFileRemove, onKeyPress }) => {
  const { url, username, password, authenticated, contentType, primaryKey, file, fileName } = formData;

  return (
    <fieldset className="form-fields">
      <div className="form-fields__group">
        <label className="form-fields__label" htmlFor="url">
          Server URL
        </label>
        <input className="form-fields__input" type="text" name="url" id="url" value={url} onChange={onChange} onKeyDown={onKeyPress} />
      </div>

      <section className="form-fields__user">
        <div className="form-fields__group">
          <label className="form-fields__label" htmlFor="username">
            Username
          </label>
          <input className="form-fields__input" type="text" name="username" id="username" value={username} onChange={onChange} onKeyDown={onKeyPress} autoComplete="username" />
        </div>
        <div className="form-fields__group">
          <label className="form-fields__label" htmlFor="password">
            Password
          </label>
          <input className="form-fields__input" type="password" name="password" id="password" value={password} onChange={onChange} onKeyDown={onKeyPress} />
        </div>
      </section>

      {authenticated && (
        <section className="form-fields__file">
          <section className="form-fields__details">
            <div className="form-fields__group">
              <label className="form-fields__label" htmlFor="contentType">
                Content Type
              </label>
              <input className="form-fields__input" type="text" name="contentType" id="contentType" value={contentType} onChange={onChange} />
            </div>

            <div className="form-fields__group">
              <label className="form-fields__label" htmlFor="primaryKey">
                Primary Key
              </label>
              <input className="form-fields__input" type="text" name="primaryKey" id="primaryKey" value={primaryKey} onChange={onChange} />
            </div>
          </section>

          <section className="file-upload">
            <span className="file-upload__label">File Upload</span>
            <div className="file-upload__input-container">
              {!file && (
                <label htmlFor="file" className="file-upload__button">
                  Choose File
                </label>
              )}
              <input
                type="file"
                className="file-upload__input"
                name="file"
                id="file"
                accept=".csv"
                onChange={onFileChange}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              <span className="file-upload__file-name">{fileName ? fileName : ""}</span>
              <Button onClick={onFileRemove} disabled={!file} type="button" styleType="remove">
                Clear
              </Button>
            </div>
          </section>
        </section>
      )}
    </fieldset>
  );
};
