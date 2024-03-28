import { IoCloseOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";

const Notification = (props) => {
  const seen = () => {
    props.setAlerts((prev) => prev.filter((ele, i) => i !== props.index));
  };

  return (
    <div className="card max-w-md border border-red-300 rounded-lg bg-white p-4 my-2 shadow-2xl ">
      <div className="header flex items-center gap-4">
        <span className="icon flex items-center justify-center rounded-full bg-red-500 text-white p-2">
          <IoNotifications />
        </span>
        <p className="alert font-semibold text-gray-700">New Critical Email!</p>
        <button
          onClick={seen}
          className="closeButton ml-auto border-none rounded-md text-xl h-8 w-8 flex items-center justify-center transition duration-300 hover:bg-red-600 hover:text-white"
        >
          <IoCloseOutline />
        </button>
      </div>

      <p className="message text-gray-700 mt-4">{props.children}</p>
    </div>
  );
};

export default Notification;
