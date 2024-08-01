import { RowsView } from "../RowsView/RowsView";

import "./style.scss";

export const FileDetails = ({ formData, setFormData, fileImportData, onImport }) => {
  const { file, imported } = formData;
  const { itemsNotImported, itemsUpdated, newItemsPosted, isSameDataItems } = fileImportData;

  const importedRowsDisplay = [...itemsUpdated, ...newItemsPosted];

  const itemsFailedOrSkipped = isSameDataItems.length > 0 || itemsNotImported.length > 0;

  return (
    <section className="file-details">
      {!imported ? (
        <RowsView formData={formData} setFormData={setFormData} titleText="Select rows to import" rows={file} onImport={onImport} />
      ) : (
        <section className="file-details__import-result">
          {importedRowsDisplay.length > 0 && (
            <section className="file-details__items-imported">
              <RowsView formData={formData} setFormData={setFormData} titleText="Imported items" fileImportData={fileImportData} rows={importedRowsDisplay} />
            </section>
          )}

          {itemsFailedOrSkipped && (
            <section className={`file-details__items-failed${itemsUpdated.length === 0 ? "--row" : ""}`}>
              {isSameDataItems.length > 0 && <RowsView formData={formData} setFormData={setFormData} titleText="Skipped items" rows={isSameDataItems} />}

              {itemsNotImported.length > 0 && <RowsView formData={formData} setFormData={setFormData} titleText="Failed to import" rows={itemsNotImported} />}
            </section>
          )}
        </section>
      )}
    </section>
  );
};
