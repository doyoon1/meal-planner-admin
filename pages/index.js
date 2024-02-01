import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [ratingStats, setRatingStats] = useState([]);
  const [recipeCounts, setRecipeCounts] = useState({});
  const [userCreationsByDate, setUserCreationsByDate] = useState([]);

  useEffect(() => {
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => setTotalRecipes(data.length));

    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setTotalCategories(data.length));

    axios.get("/api/visits")
      .then((response) => setTotalVisitors(response.data.count))
      .catch((error) => console.error("Error fetching visitor count:", error));

    axios.get("/api/user")
      .then((response) => setTotalUsers(response.data.length))
      .catch((error) => console.error("Error fetching total number of users:", error));

    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = Object.keys(data).map((date) => ({
          date,
          count: data[date],
        }));
        setUserCreationsByDate(formattedData);
      });

    fetch("/api/ratings")
      .then((response) => response.json())
      .then((data) => {
        const statsArray = Object.keys(data).map((value) => ({
          value: parseInt(value),
          count: data[value],
        }));
        setRatingStats(statsArray);
      });

    fetch("/api/recipeCounts")
      .then((response) => response.json())
      .then((data) => setRecipeCounts(data));
  }, []);

  return (
    <Layout>
      <div className="text-gray-900 flex items-center text-lg">
        <h2>
          <b>Dashboard</b>
        </h2>
      </div>
      <div className="flex flex-row gap-8 mt-10 mb-4">
        <p>Total no. of Recipes: <span className="text-red-400">{totalRecipes}</span></p>
        <p>Total no. of Visitors: <span className="text-red-400">{totalVisitors}</span></p>
        <p>Total no. of Categories: <span className="text-red-400">{totalCategories}</span></p>
        <p>Total no. of Subscribers: <span className="text-red-400">{totalUsers}</span></p>
      </div>
      <div className="flex flex-row gap-8">
        <div className="bg-purple-200 rounded-lg p-4 text-center w-3/6">
          <h3 className="text-xl font-semibold">Rating Statistics</h3>
          <ResponsiveContainer width="100%" height={200}>
          <BarChart width={400} height={200} data={ratingStats}>
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-yellow-200 rounded-lg p-4 text-center w-3/6">
          <h3 className="text-xl font-semibold">Number of Recipe by Locality</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { locality: 'Luzon', count: recipeCounts.Luzon || 0 },
              { locality: 'Visayas', count: recipeCounts.Visayas || 0 },
              { locality: 'Mindanao', count: recipeCounts.Mindanao || 0 },
            ]}>
              <XAxis dataKey="locality" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-blue-200 rounded-lg p-4 text-center mt-8">
        <h3 className="text-xl font-semibold">User Account Creations by Date</h3>
        <ResponsiveContainer width="90%" height={200}>
          <LineChart data={userCreationsByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}