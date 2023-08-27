import React from "react";
import { Link } from "react-router-dom";

const blockStyle = {
  height: "55vh",
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  padding: 30,
  marginBottom: 20,
  cursor: "pointer",
  borderRadius: 25
};

const textStyle = {
  transform: "rotate(-45deg)",
  color: "#fff",
  fontSize: 50,
};

export default function Charts() {
  return (
    <div>
      <div className="heading">
        <h1 className="pb-4">Top 100 Songs</h1>
      </div>

      <div className="row ml-1">
        <Link
          to="/Charts/weekly"
          className="col-12 col-md-5 col-lg-3"
          style={{ ...blockStyle, backgroundColor: "#b32642" }}
        >
          <span style={textStyle}>WEEKLY</span>
        </Link>
        <Link
          to="/Charts/monthly"
          className="col-12 mt-3 mt-md-0 col-md-5 col-lg-3 offset-md-1"
          style={{ ...blockStyle, backgroundColor: "#2caea4" }}
        >
          <span style={textStyle}>MONTHLY</span>
        </Link>
        <Link
          to="/Charts/yearly"
          className="col-12 mt-3 mt-lg-0 col-md-5 col-lg-3 offset-lg-1"
          style={{ ...blockStyle, backgroundColor: "#84ca99" }}
        >
          <span style={textStyle}>YEARLY</span>
        </Link>
      </div>
    </div>
  );
}
