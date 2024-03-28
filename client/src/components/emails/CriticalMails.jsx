import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Notification from "../alert/Notification";

export default function CriticalMails() {
  const [alerts, setAlerts] = useState([]);
  const audio = useRef(new Audio(require("./loud_alarm.mp3")));
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket("ws://localhost:8080");
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "alert") {
        unseen();
        setAlerts(message.payload);
        audio.current.play();
      }
    };

    return () => {
      // Close WebSocket connection on component unmount
      socketRef.current.close();
    };
  }, []);

  const unseen = async () => {
    try {
      const res = await axios.get("http://localhost:3005/unseen");
      setAlerts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    unseen();
  }, []);

  return (
    <div className="fixed bottom-5 right-5">
      <div>
        {alerts.map((alert, index) => (
          <div key={index}>
            <Notification index={index} seen={alert.seen} setAlerts={setAlerts}>
              nouveau email critique avec <br /> id de connection{" "}
              <b>{alert["id connexion"]}</b>
            </Notification>
          </div>
        ))}
      </div>
    </div>
  );
}
