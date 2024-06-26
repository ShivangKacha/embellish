// import { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Form, Button } from "react-bootstrap";
// import Message from "../../components/Message";
// import Loader from "../../components/Loader";
// import FormContainer from "../../components/FormContainer";
// import { toast } from "react-toastify";
// import {
//   useGetProductDetailsQuery,
//   useUpdateProductMutation,
//   useUploadProductImageMutation,
// } from "../../slices/productsApiSlice";

// const ProductEditScreen = () => {
//   const { id: productId } = useParams();

//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState("");
//   const [brand, setBrand] = useState("");
//   const [category, setCategory] = useState("");
//   const [countInStock, setCountInStock] = useState(0);
//   const [description, setDescription] = useState("");

//   const {
//     data: product,
//     isLoading,
//     refetch,
//     error,
//   } = useGetProductDetailsQuery(productId);

//   const [updateProduct, { isLoading: loadingUpdate }] =
//     useUpdateProductMutation();

//   const [uploadProductImage, { isLoading: loadingUplaod }] =
//     useUploadProductImageMutation();

//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       await updateProduct({
//         productId,
//         name,
//         price,
//         image,
//         brand,
//         category,
//         description,
//         countInStock,
//       });
//       toast.success("product updated successfully");
//       refetch();
//       navigate("/admin/productlist");
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   useEffect(() => {
//     if (product) {
//       setName(product.name);
//       setPrice(product.price);
//       setImage(product.image);
//       setBrand(product.brand);
//       setCategory(product.category);
//       setCountInStock(product.countInStock);
//       setDescription(product.description);
//     }
//   }, [product]);

//   const uploadFileHandler = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("image", e.target.files[0]);
//     try {
//       const res = await uploadProductImage(formData).unwrap();
//       toast.success(res.message);
//       setImage(res.image);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   return (
//     <>
//       <Link to="/admin/productlist" className="btn btn-light my-3">
//         Go Back
//       </Link>
//       <FormContainer>
//         <h1>Edit Product</h1>
//         {loadingUpdate && <Loader />}
//         {isLoading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant="danger">{error?.data?.message}</Message>
//         ) : (
//           <Form onSubmit={submitHandler}>
//             <Form.Group controlId="name" className="mt-2">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="name"
//                 placeholder="Enter name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId="price" className="mt-2">
//               <Form.Label>Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 placeholder="Enter price"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId="image" className="mt-2">
//               <Form.Label>Image</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter image url"
//                 value={image}
//                 onChange={(e) => setImage}
//               ></Form.Control>
//               <Form.Control
//                 type="file"
//                 label="Choose File"
//                 onChange={uploadFileHandler}
//               ></Form.Control>
//             </Form.Group>
//             {loadingUplaod && <Loader />}

//             <Form.Group controlId="brand" className="mt-2">
//               <Form.Label>Brand</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter brand"
//                 value={brand}
//                 onChange={(e) => setBrand(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId="countInStock" className="mt-2">
//               <Form.Label>Count In Stock</Form.Label>
//               <Form.Control
//                 type="number"
//                 placeholder="Enter countInStock"
//                 value={countInStock}
//                 onChange={(e) => setCountInStock(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId="category" className="mt-2">
//               <Form.Label>Category</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId="description" className="mt-2">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Button
//               type="submit"
//               variant="primary"
//               style={{ marginTop: "1rem" }}
//               className="mt-3"
//             >
//               Update
//             </Button>
//           </Form>
//         )}
//       </FormContainer>
//     </>
//   );
// };

// export default ProductEditScreen;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Box
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      });
      toast.success('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container>
      <Button component={Link} to="/admin/productlist" variant="contained" color="primary" sx={{ my: 2, backgroundColor: "#b79cc5" }}>
        Go Back
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product
        </Typography>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message}</Message>
        ) : (
          <Box component="form" onSubmit={submitHandler} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="image"
              label="Image URL"
              name="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Button variant="contained" component="label" sx={{ my: 2, backgroundColor: "#b79cc5" }}>
              Upload File
              <input type="file" hidden onChange={uploadFileHandler} />
            </Button>
            {loadingUpload && <CircularProgress />}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="brand"
              label="Brand"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="countInStock"
              label="Count In Stock"
              name="countInStock"
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="category"
              label="Category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, backgroundColor: "#b79cc5" }}>
              Update
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductEditScreen;
