import React, { useState } from 'react'
import Template from './Template'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';


function Category() {
    let navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchdata();
    }, [])

    const fetchdata = async () => {
        const category = await axios.get('http://localhost:5000/get-category', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${(localStorage.getItem('token'))}`
            }
        })
        setData(category.data);
    }
    const deletecategory = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/delete-category/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${(localStorage.getItem('token'))}`
                    }
                })
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                fetchdata();
            }
        })
    }

    return (
        <div>
            <div>
                <Template />
                <div className="my-container">
                    <Button className='m-3' onClick={() => navigate('/addcategory')} variant="primary">Add Category</Button>
                    <Container>
                        <Row>
                            {
                                data.map((post) =>
                                    <Col>
                                        <Card className='m-2' style={{ width: '18rem' }}>
                                            <Card.Body>
                                                <Card.Title>Name : {post.name}</Card.Title>
                                                <Button variant="primary" onClick={() => navigate(`/updatecategory/${post._id}`)}>Update</Button>
                                                <Button className='m-2' variant="primary" onClick={() => deletecategory(post._id)}>Delete</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            }
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default Category