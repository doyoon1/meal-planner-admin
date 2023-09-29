import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Sessions() {
  const { data: session } = useSession();

  if (session) {
    const { name, email, loginTimestamp } = session.user;
    const formattedTimestamp = loginTimestamp
      ? new Date(loginTimestamp).toLocaleString()
      : "Login timestamp not available"; // Handle missing or invalid loginTimestamp
    return (
      <Layout>
        <h1>Sessions</h1>
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Full name</td>
              <td>Email</td>
              <td>Date & Time</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{name}</td>
              <td>{email}</td>
              <td>{formattedTimestamp}</td>
              {/* Add action column if needed */}
              <td>Log in</td>
            </tr>
          </tbody>
        </table>
      </Layout>
    );
  }
}