import { Button } from "../Buttons/Button/Button";

import "./style.scss";

export const Pagination = ({ totalItems, rowsPerPage, handlePageChange, currentPage }) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleNext = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    handlePageChange(nextPage);
  };

  const handlePrevious = () => {
    const previousPage = Math.max(currentPage - 1, 1);
    handlePageChange(previousPage);
  };

  const handleFirst = () => {
    handlePageChange(1);
  };

  const handleLast = () => {
    handlePageChange(totalPages);
  };

  return totalItems > rowsPerPage ? (
    <div className="pagination">
      <Button type="button" styleType="page" disabled={currentPage === 1} onClick={handleFirst}>
        1
      </Button>
      <Button type="button" styleType="page" disabled={currentPage === 1} onClick={handlePrevious}>
        &lt;
      </Button>
      <p className="pagination__current-page">
        Page {currentPage} of {totalPages}
      </p>
      <Button type="button" styleType="page" disabled={currentPage === totalPages} onClick={handleNext}>
        &gt;
      </Button>
      <Button type="button" styleType="page" disabled={currentPage === totalPages} onClick={handleLast}>
        {totalPages}
      </Button>
    </div>
  ) : (
    ""
  )
};
