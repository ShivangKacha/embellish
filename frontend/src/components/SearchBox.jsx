// import React, { useState } from "react";
// import { Form, Button } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const SearchBox = () => {
//   const navigate = useNavigate();
//   const { keyword: urlKeyword } = useParams();
//   const [keyword, setKeyword] = useState(urlKeyword || "");

//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (keyword) {
//       navigate(`/search/${keyword.trim()}`);
//       setKeyword("");
//     } else {
//       navigate("/");
//     }
//   };

//   return (
//     <Form onSubmit={submitHandler} className="d-flex">
//       <Form.Control
//         type="text"
//         name="q"
//         onChange={(e) => setKeyword(e.target.value)}
//         value={keyword}
//         placeholder="Search Products..."
//         className="mr-sm-2 ml-sm-5"
//       ></Form.Control>
//       <Button type="submit" variant="outline-light" className="p-2 mx-2">
//         Search
//       </Button>
//     </Form>
//   );
// };

// export default SearchBox;

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      style={{ display: "flex", alignItems: "center" }}
    >
      <TextField
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        variant="outlined"
        style={{ marginRight: "10px", borderRadius: "20px" }}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        style={{
          padding: "10px 20px",
          borderRadius: "20px",
          backgroundColor: "#b79cc5",
          color: "#fff",
        }}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
