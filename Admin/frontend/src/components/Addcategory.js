import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from "query-string";
import Swal from "sweetalert2";

function Addcategory() {

    const navigate = useNavigate();
    let { search } = useLocation();
    let { id } = queryString.parse(search);

    //add category
    const [addcatogyname, setAddCategory] = useState();
    const [setCategoryData] = useState([]);
    const token = JSON.stringify(localStorage.getItem('token'));

    //update category
    const [setCatgoryUpdate] = useState([]);
    const [fetchcategory, setFetchCategory] = useState([]);
    const [error, setError] = useState();

    //fetch category data from id
    // useEffect(() => {
    //     const fetchAssets = async () => {
    //         const url = `http://localhost:5000/get-one-category/${id}`;
    //         await axios.get(url, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 authorization: `${(localStorage.getItem('token'))}`
    //             }
    //         }).then((responce) =>
    //             setFetchCategory(responce.data))
    //     };
    //     fetchAssets();
    // }, [id])

    // console.log('params', id);
    //edit category
    // const updatecategory = async () => {

    //     const url = `http://localhost:5000/update-category/${id}`;
    //     await axios.put(url, {
    //         "name": addcatogyname,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             authorization: `bearer ${(localStorage.getItem('token'))}`
    //         }
    //     }
    //     ).then((responce) => setCatgoryUpdate(responce.data)).catch((err) => console.log('erroe', err))
    //     Swal.fire(
    //         'successfully!',
    //         'Category add successfully.',
    //         'success'
    //     )
    //     navigate('/category')
    // };
    //add category
    const addcategory = async () => {
        if (!addcatogyname) {
            setError(true)
            return false
        } else {
            var postData = {
                "name": addcatogyname,
            };
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                }
            };
            const url = `http://localhost:5000/add-category`;
            axios.post(url, postData, axiosConfig).then((responce) => setCategoryData(responce.data))
            Swal.fire(
                'successfully!',
                'Product add successfully.',
                'success'
            )
            navigate('/category')
        }
    };


    return (
        <div className="my-container">
            <Container className="p-4">

                {/* <h1 className="text-center">Edit Category</h1> */}

                <h1 className="text-center">Add Category</h1>

                <Row className="justify-content-center">
                    <Col className="col-md-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="title" type="text"
                                    defaultValue={fetchcategory.name ? fetchcategory.name : ''} placeholder="Title" onChange={(e) => setAddCategory(e.target.value)} />
                                {error && !addcatogyname && (
                                    <p className="text-danger">Name is required.</p>
                                )}
                            </Form.Group>

                            {/* // <Button variant="primary" onClick={() => updatecategory()}> Update Products </Button> */}

                            <Button variant="primary" onClick={() => addcategory()}> Add category </Button>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Addcategory