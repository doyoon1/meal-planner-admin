import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      let data = await response.json();

      // Sort users by Date Joined in descending order
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <Layout>
      <h1><b>Subscribed Users</b></h1>
      <div className="mt-6">
        <table className="basic">
          <thead>
            <tr>
              <td>Full Name</td>
              <td>Email</td>
              <td>Date Joined</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UsersPage;