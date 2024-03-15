import { useState, useEffect, useRef } from "react";
import { IoIosMail } from "react-icons/io";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import axios from "axios";
import Mail from "./Mail";

export default function CriticalMails() {
  const [visibility, setVisibility] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "alert") {
        fetchAlerts();
        setVisibility(true);
        // Fetch new alerts separately if needed
      }
    };

    return () => {
      // Close WebSocket connection on component unmount
      socketRef.current.close();
    };
  }, []);

  // Fetch critical mails from the database
  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:3005/crtl-mails");
      setAlerts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch alerts on component mount
    fetchAlerts();
  }, []);

  // Mark email as seen
  const markAsSeen = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3005/see-mail/${id}`);
      if (res.status === 200) {
        // Update alerts without fetching data again
        setAlerts(
          alerts.map((alert) =>
            alert._id === id ? { ...alert, seen: true } : alert
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-1/3 fixed bottom-0 right-20 shadow-lg bg-white rounded-t-lg border border-gray-300 cursor-pointer">
      <div
        className="flex items-center justify-between bg-white shadow-md rounded-t-lg border border-b border-gray-300 px-2 py-3"
        onClick={() => setVisibility(!visibility)}
      >
        <div className="flex items-center font-bold">
          <span className="text-3xl">
            <IoIosMail />
          </span>
          <span className="mx-2">Critical Mails</span>
          <span className="rounded-full text-white bg-red-700 px-2 py-1 text-xs font-bold mr-3">
            2
          </span>
        </div>
        <div className="text-2xl">
          {visibility ? <GoChevronDown /> : <GoChevronUp />}
        </div>
      </div>

      <div
        className={`mails h-64 bg-gray-100 overflow-scroll  ${
          visibility ? "block" : "hidden"
        } `}
      >
        <div>
          {alerts.map((alert, index) => (
            <div key={index} onClick={() => markAsSeen(alert._id)}>
              <Mail sender={alert.sender} seen={alert.seen}>
                {Object.keys(alert).map((key) => {
                  if (key !== "seen" && key !== "_id") {
                    return (
                      <p>
                        {key}: {alert[key]}
                      </p>
                    );
                  }
                })}
              </Mail>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
