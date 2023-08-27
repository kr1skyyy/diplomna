import React from "react";
import Button from '@mui/material/Button';

import { useHistory } from "react-router-dom";
import { faker } from '@faker-js/faker';

function randomRGB() {
  return `rgb(40,${Math.random() * 180},${Math.random() * 180})`;
}

function capitalize(name) {
  return name.split('-').map((part) => part.charAt(0).toUpperCase() + part.substring(1)).join('-');
}

function Genre({ genre }) {
  const history = useHistory();

  const openGenre = () => {
    history.push(`/Genres/${genre}`);
  };

  const wrapperStyle = {
    height: 150,
    background: `url(${faker.image.urlPicsumPhotos()})`,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    cursor: 'pointer',
    borderRadius: '25px'
  };

  const innerStyle = {
    fontSize: 30,
    color: randomRGB(),
    background: '#fff',
    padding: '10px 20px',
    borderRadius: '25px',
    opacity: 0.7,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
  };

  return (
    <div className="col-6 col-lg-4" onClick={openGenre}>
      <div className="d-flex" style={wrapperStyle}>        
        <span style={innerStyle}>{capitalize(genre)}</span>
      </div>
    </div>
  );
}

export default function Genres({ genres }) {
  const [page, setPage] = React.useState(0);
  const pageSize = 12;
  const start = page * pageSize;
  const end = start + pageSize;

  return (
    <div className="row">
      {genres.slice(start, end).map((genre) => (
        <Genre genre={genre} key={genre} />
      ))}

      <span className="d-flex justify-content-center w-100" style={{gap: 4}}>
        <Button disabled={start === 0} onClick={() => setPage(page - 1)}>Previous</Button>
        <Button disabled={end - genres.length >= 0} onClick={() => setPage(page + 1)}>Next</Button>
      </span>
    </div>
  );
}
