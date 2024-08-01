import { useState } from "react";
import { saveAs } from "file-saver";

import { booleanToString } from "../../utils/utils";
import { Button } from "../Buttons/Button/Button";

import "./style.scss";

export const Log = ({ logData, onFileRemove }) => {
  const [toggle, setToggle] = useState(false);

  const handleNewImport = () => {
    onFileRemove();
  };

  const downloadLogFile = () => {
    const data = JSON.stringify(logData, null, 2);
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "log_data.txt");
  };

  const logDataNotEmpty = Object.keys(logData.newItems).length > 0 || Object.keys(logData.updatedData).length > 0;

  return (
    <>
      {logDataNotEmpty && (
        <>
          <section className="buttons-group">
            <Button type="button" styleType="default" onClick={() => setToggle(!toggle)}>
              View Log
            </Button>
            <Button type="button" styleType="default" onClick={downloadLogFile}>
              Download Log
            </Button>
            <Button type="button" styleType="default" onClick={handleNewImport}>
              new import
            </Button>
          </section>

          {toggle && (
            <section className="log">
              {Object.keys(logData.updatedData).length > 0 && (
                <>
                  <h4 className="log__title">Updated data</h4>
                  <table className="log__table">
                    <thead>
                      <tr className="log__table-header">
                        <th>ID</th>
                        <th>Field</th>
                        <th>Old Value</th>
                        <th>Updated Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(logData.updatedData).map(([itemId, fields]) =>
                        Object.entries(fields).map(([field, values], index) => {
                          const oldValue = booleanToString(values.oldValue);
                          const updatedValue = booleanToString(values.updatedValue);

                          return (
                            <tr key={`${itemId}_${field}_${index}`} className="log__table-row">
                              <td>{itemId}</td>
                              <td>{field}</td>
                              <td>{oldValue}</td>
                              <td>{updatedValue}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {Object.keys(logData.newItems).length > 0 && (
                <>
                  <h4 className="log__title">New items</h4>
                  <ul className="log__new-items">
                    {Object.entries(logData.newItems).map(([itemId]) => (
                      <li key={`${itemId}`} className="log__new-item">
                        {itemId}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {Object.keys(logData.fieldsFailedToImport).length > 0 && (
                <>
                  <h4 className="log__title">Fields not imported</h4>
                  <p className="log__text">Fields do not exist in content type</p>
                  <table className="log__table">
                    <thead>
                      <tr className="log__table-header">
                        <th>ID</th>
                        <th>Field</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(logData.fieldsFailedToImport).map(([itemId, fields]) =>
                        Object.entries(fields).map(([field, value], index) => {
                          if (field === "id") return null;
                          return (
                            <tr key={`${itemId}_${field}_${index}`} className="log__table-row">
                              <td>{itemId}</td>
                              <td>{value}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
};
