import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import queryString from "query-string";
import { useForm } from 'react-hook-form';


function AddProducts() {
    const navigate = useNavigate();
    let { search } = useLocation();
    let { id } = queryString.parse(search);
    const [addproductname, setAddProductName] = useState();
    const [addproductprice, setAddProductPrice] = useState();
    const [category, setCategory] = useState([]);
    const [addproductcategoryid, setAddProductCategoryid] = useState();
    const [addproductimage, setAddProductImage] = useState();
    const [addproductcompany, setAddProductCompany] = useState();
    const [setProductAdded] = useState([]);
    const token = JSON.stringify(localStorage.getItem('token'));
    const { register, handleSubmit, formState: { errors } } = useForm();


    //update product
    // const [updateproductprice, setUpdateProductPrice] = useState();
    // const [updateproductname, setUpdateProductName] = useState();
    // const [updateproductcategory, setUpdateProductCategory] = useState([]);
    // const [updateproductcategoryid, setUpdateProductCategoryid] = useState();
    // const [updateproductcompany, setUpdateProductCompany] = useState();
    const [setUpdate] = useState([]);
    const [productfetch, setProductFetch] = useState([]);
    const [error, setError] = useState();

    // useEffect(() => {
    //     const fetchAssets = async () => {
    //         const url = `http://localhost:5000/get-one-product/${id}`;
    //         await axios.get(url, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 authorization: `${(localStorage.getItem('token'))}`
    //             }
    //         }).then((responce) => setProductFetch(responce.data))

    //     };
    //     fetchAssets();
    //     getcategory();
    // }, [id])

    // const updateproducts = async () => {
    //     const url = `http://localhost:5000/update-products/${id}`;
    //     await axios.put(url, {
    //         "name": addproductname,
    //         "price": parseInt(addproductprice),
    //         "category": addproductcategoryid,
    //         "company": addproductcompany,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             authorization: `bearer ${(localStorage.getItem('token'))}`
    //         }
    //     }
    //     ).then((responce) => setUpdate(responce.data)).catch((err) => console.log('erroe', err))
    //     Swal.fire(
    //         'successfully!',
    //         'Product add successfully.',
    //         'success'
    //     )
    //     navigate('/products')
    // };

    const getcategory = async () => {
        let categories = await axios.get('http://localhost:5000/get-category')
        setCategory(categories.data);
    }

    const addproducts = async () => {

        if (!addproductname || !addproductprice || !addproductcategoryid
            || !addproductimage || !addproductcompany) {
            setError(true)
            return false
        } else {

            const data = new FormData();
            data.append('name', addproductname);
            data.append('price', parseInt(addproductprice));
            data.append('category', addproductcategoryid);
            data.append('image', addproductimage);
            data.append('company', addproductcompany);

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `${token}`,
            }
        };
        const url = `http://localhost:5000/add-product`;
            axios.post(url, data, axiosConfig)
                .then((response) => setProductAdded(response.data));
        Swal.fire(
            'successfully!',
            'Product add successfully.',
            'success'
            )
            navigate('/products')
        }
    };




    return (
        <div className="my-container" >
            <Container className="p-4">

                <h1 className="text-center">Add Product</h1>
                <Row className="justify-content-center">
                    <Col className="col-md-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="title" type="text"
                                    defaultValue={productfetch.name ? productfetch.name : ''} placeholder="Title" {...register('title', { required: true })} onChange={(e) => setAddProductName(e.target.value)} />
                                {error && !addproductname && (
                                    <p className="text-danger">Name is required.</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Price</Form.Label>
                                <Form.Control name="price" type="number"
                                    defaultValue={productfetch.price ? productfetch.price : ''}
                                    placeholder="Price" {...register('price', { required: true })} onChange={(e) => setAddProductPrice(e.target.value)} />
                                {error && !addproductprice && (
                                    <p className="text-danger">Price is required.</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Category</Form.Label>
                                <select name="category" id="category" required onChange={(e) => setAddProductCategoryid(e.target.value)}>
                                    {
                                        category.map(cat =>
                                            <option value={cat._id}> {cat.name}</option>
                                        )
                                    }
                                </select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <label for="image">Select a file:</label>
                                <input type="file" id="image" name='image' {...register('image', { required: true })} onChange={(e) => setAddProductImage(e.target.files[0])} />
                                {error && !addproductimage && (
                                    <p className="text-danger">Image is required.</p>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Company</Form.Label>
                                <Form.Control name="categoryId" type="text"
                                    defaultValue={productfetch.company ? productfetch.company : ''}
                                    placeholder="CategoryId" {...register('categoryId', { required: true })} onChange={(e) => setAddProductCompany(e.target.value)} />
                                {error && !addproductcompany && (
                                    <p className="text-danger">Company is required.</p>
                                )}
                            </Form.Group>

                            <Button variant="primary" onClick={() => addproducts()}> Add Products </Button>

                        </Form>

                        {/* <Form onSubmit={handleSubmit(addproducts)}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="title" type="text"
                                    defaultValue={productfetch.name ? productfetch.name : ''} placeholder="Title" {...register('title', { required: true })} onChange={(e) => setAddProductName(e.target.value)} />
                                {!addproductname && (
                                    <p className="text-danger">Name is required.</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Price</Form.Label>
                                <Form.Control name="price" type="number"
                                    defaultValue={productfetch.price ? productfetch.price : ''}
                                    placeholder="Price" {...register('price', { required: true })} onChange={(e) => setAddProductPrice(e.target.value)} />
                                {!addproductprice && (
                                    <p className="text-danger">Price is required.</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Category</Form.Label>
                                <select name="category" id="category" required onChange={(e) => setAddProductCategoryid(e.target.value)}>
                                    {
                                        category.map(cat =>
                                            <option value={cat._id}> {cat.name}</option>
                                        )
                                    }
                                </select>
                            </Form.Group>
                            {!id &&
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <label for="image">Select a file:</label>
                                    <input type="file" id="image" name='image' {...register('image', { required: true })} onChange={(e) => setAddProductImage(e.target.files[0])} />
                                    {!addproductimage && (
                                        <p className="text-danger">Image is required.</p>
                                    )}
                                </Form.Group>
                            }
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Company</Form.Label>
                                <Form.Control name="categoryId" type="text"
                                    defaultValue={productfetch.company ? productfetch.company : ''}
                                    placeholder="CategoryId" {...register('categoryId', { required: true })} onChange={(e) => setAddProductCompany(e.target.value)} />
                                {!addproductcompany && (
                                    <p className="text-danger">Company is required.</p>
                                )}
                            </Form.Group>
                            {id ? <Button variant="primary" onClick={() => updateproducts()}> Update Products </Button>
                                :
                                <Button variant="primary" onClick={() => addproducts()}> Add Products </Button>
                            }
                        </Form> */}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AddProducts