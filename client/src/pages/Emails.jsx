import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Emails() {
  const [emails, setEmails] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:3005/crtl-mails");
      setEmails(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Mark email as seen
  const markAsSeen = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3005/see-mail/${id}`);
      if (res.status === 200) {
        // Update alerts without fetching data again
        setEmails(
          emails.map((alert) =>
            alert._id === id ? { ...alert, seen: true } : alert
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <table className="table-auto text-center w-full border-collapse border border-gray-30">
        <thead className="border">
          <tr>
            <th>Initiateur</th>
            <th>numero de tt</th>
            <th>id connexion</th>
            <th>site client</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email, index) => (
            <tr
              key={index}
              className={`${
                !email.seen && "bg-red-50"
              } hover:bg-gray-100 hover:shadow-lg`}
              onClick={() => markAsSeen(email._id)}
            >
              <td>{email["initiateur"]}</td>
              <td>{email["numero de tt"]}</td>
              <td>{email["id connexion"]}</td>
              <td>{email["site client"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
