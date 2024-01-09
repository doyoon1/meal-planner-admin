import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  useEffect(() => {
    // Fetch comments on component mount
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments');
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const sortedComments = [...comments].sort((a, b) => a.approved - b.approved);
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleApprove = async (commentId) => {
    try {
      // Show SweetAlert for confirmation
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to approve this comment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });

      if (result.isConfirmed) {
        // Send a request to update the comment's approved field
        const response = await axios.put(`/api/approve/${commentId}`);

        // Update the comments state with the updated comment
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, approved: true } : comment
          )
        );

        // Show success message
        Swal.fire("Approved!", "Comment has been approved.", "success");
      }
    } catch (error) {
      console.error(`Error approving comment with ID ${commentId}:`, error);
      Swal.fire("Error", "An error occurred while approving the comment.", "error");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      // Show SweetAlert for confirmation
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this comment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (result.isConfirmed) {
        // Send a DELETE request to delete the comment
        await axios.delete(`/api/comments/${commentId}`);
  
        // Update the comments state by filtering out the deleted comment
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
  
        // Show success message
        Swal.fire("Deleted!", "Comment has been deleted.", "success");
      }
    } catch (error) {
      console.error(`Error deleting comment with ID ${commentId}:`, error);
      Swal.fire("Error", "An error occurred while deleting the comment.", "error");
    }
  };  

  return (
    <Layout>
      <h1><b>Comments</b></h1>
      <table className="basic">
        <thead>
          <tr>
            <td>Full Name</td>
            <td>Recipe</td>
            <td>Comment</td>
            <td>Date</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {currentComments.map((comment) => (
            <tr key={comment._id}>
              <td>{comment.user.firstName} {comment.user.lastName}</td>
              <td>{comment.recipe.title}</td>
              <td>{comment.text}</td>
              <td>{new Date(comment.createdAt).toLocaleString()}</td>
              <td>
                {/* Only show the button if the comment is not approved */}
                {!comment.approved && (
                  <button
                    onClick={() => handleApprove(comment._id)}
                    className="bg-green-200 text-green-600 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Allow
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment._id)}
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
          itemsPerPage={commentsPerPage}
          totalItems={comments.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </Layout>
  );
}