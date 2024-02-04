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
  const [topRatedRecipes, setTopRatedRecipes] = useState([]);

  useEffect(() => {
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => setTotalRecipes(data.length));

      fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => {
          setTopRatedRecipes(data);
      });

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
      <div className="flex flex-row gap-8 mt-8">
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
      <div className="bg-green-200 rounded-lg p-4 text-center mt-8">
        <h3 className="text-xl font-semibold mb-4">Top 10 Rated Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRatedRecipes.map((recipe) => (
                <div key={recipe._id} className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="text-lg font-semibold mb-2">{recipe.title}</h4>
                    <p className="flex justify-center items-center text-sm mb-2">
                      Rating: {recipe.averageRating}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                      </svg>
                    </p>
                </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}