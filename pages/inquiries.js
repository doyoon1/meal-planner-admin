import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Pagination from '@/components/CommentsPagination';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get('/api/inquiries');
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const customSort = (a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  };

  const sortedInquiries = [...inquiries].sort(customSort);

  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = sortedInquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <h1>
        <b>Inquiries</b>
      </h1>
      <table className="basic">
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Message</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {currentInquiries.map((inquiry) => (
            <tr key={inquiry._id}>
              <td>{inquiry.name}</td>
              <td>{inquiry.email}</td>
              <td>{inquiry.message}</td>
              <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <Pagination
          itemsPerPage={inquiriesPerPage}
          totalItems={inquiries.length}
          currentPage={currentPage}
          onPageChange={paginate}
        />
      </div>
    </Layout>
  );
}
