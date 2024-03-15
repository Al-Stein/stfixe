import React from "react";

export default function Mail(props) {
  return (
    <div
      className={`m-2 px-3 py-2 rounded-md shadow-md ${
        props.seen ? "" : "bg-red-100"
      }`}
    >
      {props.children}
    </div>
  );
}
