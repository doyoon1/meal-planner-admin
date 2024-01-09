import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        axios.get('/api/logs').then(response => {
            setLogs(response.data);
        });

        // Fetch all recipes and store them in the state
        axios.get('/api/recipes').then(response => {
            const recipesMap = {};
            response.data.forEach(recipe => {
                recipesMap[recipe._id] = recipe.title;
            });
            setRecipes(recipesMap);
        });
    }, []);

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = async (id) => {
        try {
            const shouldDelete = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this log entry!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (shouldDelete.isConfirmed) {
                await axios.delete(`/api/logs?id=${id}`);
                // Refresh logs after deletion
                const response = await axios.get('/api/logs');
                setLogs(response.data);

                Swal.fire('Deleted!', 'The log entry has been deleted.', 'success');
            }
        } catch (error) {
            console.error("Error deleting log:", error);
            Swal.fire('Error!', 'An error occurred while deleting the log entry.', 'error');
        }
    };

    return (
        <Layout>
            <h1><b>Audit Log</b></h1>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Action</td>
                        <td>Recipe</td>
                        <td>Full Name</td>
                        <td>Date</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.map((log) => (
                        <tr key={log._id}>
                            <td>{log.action}</td>
                            <td>{recipes[log.recipe] || 'Unknown Recipe'}</td>
                            <td>{log.userName}</td>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(log._id)}
                                    className="bg-red-200 text-red-600 shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <Pagination
                    itemsPerPage={logsPerPage}
                    totalItems={logs.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>
        </Layout>
    );
}
