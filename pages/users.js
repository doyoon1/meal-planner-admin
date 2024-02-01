import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      const sortedUsers = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          recipesPerPage={usersPerPage}
          totalRecipes={users.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </Layout>
  );
};

export default UsersPage;
