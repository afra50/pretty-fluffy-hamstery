import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/components/ui/pagination.scss";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
	// Jeśli jest tylko jedna strona (lub zero), w ogóle nie pokazujemy paginacji
	if (totalPages <= 1) return null;

	// Generowanie tablicy z numerami stron
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="pagination">
			<button
				className="pagination_arrow"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}>
				<ChevronLeft size={20} />
			</button>

			<div className="pagination_numbers">
				{pages.map((page) => (
					<button
						key={page}
						className={`pagination_number ${currentPage === page ? "active" : ""}`}
						onClick={() => onPageChange(page)}>
						{page}
					</button>
				))}
			</div>

			<button
				className="pagination_arrow"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}>
				<ChevronRight size={20} />
			</button>
		</div>
	);
};

export default Pagination;
