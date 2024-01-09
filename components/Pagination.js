function Pagination({ recipesPerPage, totalRecipes, currentPage, paginate }) {
    const pageNumbers = [];
    const pageRange = 4;

    for (let i = 1; i <= Math.ceil(totalRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    const calculatePageRange = () => {
        const start = Math.max(1, currentPage - pageRange);
        const end = Math.min(pageNumbers.length, currentPage + pageRange);

        return pageNumbers.slice(start - 1, end);
    };

    const displayedPageNumbers = calculatePageRange();

    return (
        <nav className="flex justify-center items-center mt-4">
            <button
                onClick={() => {
                    if (currentPage > 1) {
                        paginate(currentPage - 1);
                    }
                }}
                className={`px-2 py-1 bg-icons text-white rounded-md mr-2 ${
                    currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {displayedPageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-2 py-1 rounded-md ${
                        currentPage === number ? 'bg-icons text-white' : 'bg-white text-icons'
                    } mr-2`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => {
                    if (currentPage < pageNumbers.length) {
                        paginate(currentPage + 1);
                    }
                }}
                className={`px-2 py-1 bg-icons text-white rounded-md ${
                    currentPage === pageNumbers.length ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={currentPage === pageNumbers.length}
            >
                Next
            </button>
        </nav>
    );
}

export default Pagination;