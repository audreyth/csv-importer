import { useState } from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamationCircle } from "react-icons/hi";

import { Button } from "../Buttons/Button/Button";
import { Pagination } from "../Pagination/Pagination";

import "./style.scss";

export const RowsView = ({ formData, setFormData, titleText, rows, onImport, fileImportData }) => {
  const { file, selectedRows, primaryKey } = formData;

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const skipped = titleText.toLowerCase().includes("skipped");
  const failed = titleText.toLowerCase().includes("fail");
  const newItems = fileImportData?.newItemsPosted;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateDisplayItems = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
    return rows.slice(startIndex, endIndex);
  };

  const handleCheckboxChange = (item) => {
    const updatedSelectedRows = [...selectedRows];

    if (updatedSelectedRows.includes(item)) {
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(item), 1);
    } else {
      updatedSelectedRows.push(item);
    }
    setFormData({ ...formData, selectedRows: updatedSelectedRows });
  };

  const handleCheckAll = () => {
    const allChecked = selectedRows.length === file.length;

    if (allChecked) {
      setFormData({ ...formData, selectedRows: [] });
    } else {
      setFormData({ ...formData, selectedRows: file });
    }
  };

  const displayedItems = calculateDisplayItems();

  return (
    <section className="rows-view">
      {rows === file ? (
        <>
          <h4 className="rows-view__title">{titleText}</h4>
          <div className="rows-view__buttons-group">
            <Button type="button" styleType="select" onClick={handleCheckAll}>
              {selectedRows.length === file.length ? "Uncheck All" : "Check All"}
            </Button>
            <Button disabled={formData.selectedRows.length === 0} type="button" styleType="default" onClick={onImport}>
              start import
            </Button>
          </div>
          <ul className="rows-view__list">
            {displayedItems.map((item, index) => (
              <li key={index} className="rows-view__item--selectable">
                <input type="checkbox" name="checkbox" id={`checkbox-${index}`} className="rows-view__checkbox" checked={selectedRows.includes(item)} onChange={() => handleCheckboxChange(item)} />
                <label htmlFor={`checkbox_${index}`} className="rows-view__label">
                  {item[primaryKey]}
                </label>
              </li>
            ))}
          </ul>
          <Pagination totalItems={rows.length} rowsPerPage={rowsPerPage} handlePageChange={handlePageChange} currentPage={currentPage} />
        </>
      ) : (
        <>
          <h4 className="rows-view__title">{titleText}</h4>
          <ul className="rows-view__list">
            {displayedItems.map((item, index) => {
              const isNewItem = newItems?.some((newItem) => newItem[primaryKey] === item[primaryKey]);

              const ItemIcon = failed ? HiXCircle : skipped ? HiExclamationCircle : HiCheckCircle;

              const importedClass = failed ? "not-imported" : skipped ? "skipped" : "imported";

              return (
                <li key={index} className={`rows-view__item--${importedClass} ${isNewItem ? "new" : ""}`}>
                  <span className={`rows-view__item-icon--${importedClass}`}>
                    <ItemIcon />
                  </span>
                  {item[primaryKey]}
                </li>
              );
            })}
          </ul>
          {failed && (
            <div className="rows-view__message">
              <span className="rows-view__message-icon">
                <HiInformationCircle />
              </span>
              <p className="rows-view__message-text">Items failed: could not find matching items</p>
            </div>
          )}

          {skipped && (
            <div className="rows-view__message">
              <span className="rows-view__message-icon">
                <HiInformationCircle />
              </span>
              <p className="rows-view__message-text">Items skipped: no new data to update</p>
            </div>
          )}

          <Pagination totalItems={rows.length} rowsPerPage={rowsPerPage} handlePageChange={handlePageChange} currentPage={currentPage} />
        </>
      )}
    </section>
  );
};
