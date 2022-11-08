import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";



function Updateproduct() {
    const navigate = useNavigate();
    const [updateproductprice, setUpdateProductPrice] = useState();
    const [updateproductname, setUpdateProductName] = useState();
    const [updateproductcategory, setUpdateProductCategory] = useState([]);
    const [updateproductcategoryid, setUpdateProductCategoryid] = useState();
    const [updateproductcompany, setUpdateProductCompany] = useState();
    const [setUpdate] = useState([]);
    const params = useParams();
    const [productfetch, setProductFetch] = useState([]);
    const [error, setError] = useState();


    useEffect(() => {
        const fetchAssets = async () => {
            const url = `http://localhost:5000/get-one-product/${params.id}`;
            await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${(localStorage.getItem('token'))}`
                }
            }).then((responce) => setProductFetch(responce.data))

        };
        fetchAssets();
    }, [params.id])

    const updateproducts = async () => {

        const url = `http://localhost:5000/update-category/${params.id}`;
        await axios.put(url, {
                "name": updateproductname,
                "price": parseInt(updateproductprice),
                "category": updateproductcategoryid,
                "company": updateproductcompany,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${(localStorage.getItem('token'))}`
                }
            }
            ).then((responce) => setUpdate(responce.data)).catch((err) => console.log('erroe', err))
        Swal.fire(
            'successfully!',
            'Product add successfully.',
            'success'
        )
        navigate('/products')

    };

    useEffect(() => {
        getcategory();
    }, [])

    const getcategory = async () => {
        let categories = await axios.get('http://localhost:5000/get-category')
        setUpdateProductCategory(categories.data);
    }
    return (
        <div>
            <div className="my-container">
                <Container className="p-4">
                    <h1 className="text-center">Edit Product</h1>
                    <Row className="justify-content-center">
                        <Col className="col-md-6">
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name="title" type="text"
                                        defaultValue={productfetch.name}
                                        placeholder="Title" onChange={(e) => setUpdateProductName(e.target.value)} />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control name="price" type="number"
                                        defaultValue={productfetch.price}
                                        placeholder="Price" onChange={(e) => setUpdateProductPrice(e.target.value)} />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Category</Form.Label>
                                    <select name="category" id="category" onChange={(e) => setUpdateProductCategoryid(e.target.value)}>
                                        {
                                            updateproductcategory.map(cat =>
                                                <option value={cat._id}> {cat.name}</option>
                                            )
                                        }
                                    </select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control name="categoryId" type="text"
                                        defaultValue={productfetch.company}
                                        placeholder="CategoryId" onChange={(e) => setUpdateProductCompany(e.target.value)} />

                                </Form.Group>
                                <Button variant="primary" onClick={() => updateproducts()}> Update Products </Button>

                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Updateproduct