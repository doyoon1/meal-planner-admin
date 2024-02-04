import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/components/CommentsPagination";
import Swal from "sweetalert2";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  useEffect(() => {
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

  const customSort = (a, b) => {
    if (a.approved && !b.approved) {
      return 1;
    } else if (!a.approved && b.approved) {
      return -1;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  };

  const sortedComments = [...comments].sort(customSort);

  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleApprove = async (comment) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${comment.approved ? 'hide' : 'allow'} this comment?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${comment.approved ? 'hide' : 'allow'} it!`,
      });
  
      if (result.isConfirmed) {
        await axios.put(`/api/approve/${comment._id}`);
  
        setComments((prevComments) =>
          prevComments.map((prevComment) =>
            prevComment._id === comment._id
              ? { ...comment, approved: !comment.approved }
              : prevComment
          )
        );
  
        const action = comment.approved ? 'Hidden' : 'Allowed';
        Swal.fire(action + '!', `Comment has been ${action.toLowerCase()}.`, "success");
      }
    } catch (error) {
      console.error(`Error toggling approval for comment with ID ${comment._id}:`, error);
      Swal.fire("Error", "An error occurred while toggling approval for the comment.", "error");
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
              <td>{comment.user?.firstName || comment.user?.lastName ? `${comment.user?.firstName || ''} ${comment.user?.lastName || 'Deleted User'}` : 'Unknown User'}</td>
              <td>{comment.recipe ? comment.recipe.title : 'Deleted Recipe'}</td>
              <td>{comment.text}</td>
              <td>{new Date(comment.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleApprove(comment)}
                  className={`bg-${comment.approved ? 'yellow' : 'green'}-200 text-${comment.approved ? 'yellow' : 'green'}-600 shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    {comment.approved ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    )}
                  </svg>
                  {comment.approved ? 'Hide' : 'Allow'}
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
          onPageChange={paginate}
        />
      </div>
    </Layout>
  );
}