function Pagination({ recipesPerPage, totalRecipes, currentPage, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

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
            {pageNumbers.map(number => (
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
