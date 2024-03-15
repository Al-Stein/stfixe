import React from "react";

export default function DashboardSection(props) {
  return (
    <div className="rounded-lg p-5 m-5 bg-white shadow-md">
      {props.children}
    </div>
  );
}
