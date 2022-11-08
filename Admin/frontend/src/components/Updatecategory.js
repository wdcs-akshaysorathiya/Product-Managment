import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
function Updatecategory() {
    const navigate = useNavigate();
    const [categoryname, setCategoryName] = useState();
    const [setCatgoryUpdate] = useState([]);
    const params = useParams();
    const [fetchcategory, setFetchCategory] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            const url = `http://localhost:5000/get-one-category/${params.id}`;
            await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${(localStorage.getItem('token'))}`
                }
            }).then((responce) => setFetchCategory(responce.data))

        };
        fetchAssets();
    }, [params.id])

    const updatecategory = async () => {

        const url = `http://localhost:5000/update-category/${params.id}`;
        await axios.put(url, {
            "name": categoryname,
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${(localStorage.getItem('token'))}`
            }
        }
        ).then((responce) => setCatgoryUpdate(responce.data)).catch((err) => console.log('erroe', err))
        Swal.fire(
            'successfully!',
            'Category add successfully.',
            'success'
        )
        navigate('/category')
    };
    return (
        <div className="my-container">
            <Container className="p-4">
                <h1 className="text-center">Edit Product</h1>
                <Row className="justify-content-center">
                    <Col className="col-md-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="title" type="text"
                                    defaultValue={fetchcategory.name}
                                    placeholder="Title" onChange={(e) => setCategoryName(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={() => updatecategory()}> Update Products </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Updatecategory