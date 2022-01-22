import React from "react";
import { useHistory } from "react-router-dom";

function randomRGB() {
  return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
}

function Genre({ genre }) {
  const history = useHistory();

  const openGenre = () => {
    history.push(`/Genres/${genre}`);
  };

  const style = {
    height: 100,
    backgroundColor: randomRGB(),
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    cursor: 'pointer',
  };
  return (
    <div className="col-6" onClick={openGenre}>
      <div className="d-flex" style={style}>
        <span style={{ fontSize: 30, color: "white" }}>{genre}</span>
      </div>
    </div>
  );
}

export default function Genres({ genres }) {
  return (
    <div className="row">
      {genres.map((genre) => (
        <Genre genre={genre} key={genre} />
      ))}
    </div>
  );
}
