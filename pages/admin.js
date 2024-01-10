import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const AdminEmailsPage = () => {
  const [adminEmails, setAdminEmails] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const fetchAdminEmails = async () => {
    const response = await fetch("/api/admins");
    const data = await response.json();
    setAdminEmails(data);
  };  

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  const handleAddAdminEmail = async () => {
    const response = await fetch("/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newAdminEmail }),
    });
    
    if (response.ok) {
      fetchAdminEmails();
      setNewAdminEmail("");
    }
  };

  const confirmDelete = async (admin) => {
    const result = await Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete ${admin.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d55',
    });

    if (result.isConfirmed) {
      handleDeleteAdminEmail(admin._id);
    }
  };

  const handleDeleteAdminEmail = async (id) => {
    const response = await fetch(`/api/admins?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchAdminEmails();
    }
  };

  return (
    <Layout>
      <h1><b>Admins</b></h1>
      <div>
        <label>Add Admin Email</label>
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Enter an email address"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="mb-0"
          />
          <button onClick={handleAddAdminEmail} className="btn-primary text-sm">
            Add
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Admin Email List</h2>
        <table className="basic">
          <thead>
            <tr>
              <td>Email</td>
              <td>Date Added</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {adminEmails.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>{new Date(admin.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => confirmDelete(admin)}
                    className="bg-red-200 text-red-600 shadow-md inline-flex px-2 py-1 rounded-sm mx-1 items-center gap-1 text-sm"
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
      </div>
    </Layout>
  );
};

export default AdminEmailsPage;