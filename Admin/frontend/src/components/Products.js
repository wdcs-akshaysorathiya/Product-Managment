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

function Products() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);


    useEffect(() => {
        fetchdata();
    }, [])

    const fetchdata = async () => {
        const products = await axios.get('http://localhost:5000/get-products', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${(localStorage.getItem('token'))}`
            }
        })
        setData(products.data);
    }


    const deleteProduct = async (id) => {
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
                await axios.delete(`http://localhost:5000/delete-products/${id}`, {
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



    // const serchhandle = async (event) => {
    //     let serchValue = event.target.value;
    //     if (serchValue) {
    //         let result = await axios.get(`http://localhost:5000/search/${serchValue}`);
    //         if (result) {
    //             setData(result.data)
    //         }
    //     } else {
    //         fetchdata();
    //     }
    // }
    return (
        <div>
            <Template />
            <div className="my-container">
                {/* <input type="text" className="m-3" placeholder="serch here" onChange={serchhandle} /> */}
                <br />
                <Button className='m-3' onClick={() => navigate('/addproduct')} variant="primary">Add Products</Button>
                <Container>
                    <Row>
                        {
                            data.length > 0 ? data.map((post) =>
                                <Col>
                                    {console.log('dataa', post.image)}
                                    <Card key={post._id} className='m-2' style={{ width: '18rem' }}>
                                        <Card.Img variant="top" src={post.image} />
                                        <Card.Body>
                                            <Card.Title>Name : {post.name}</Card.Title>
                                            <Card.Text>Price : {post.price}</Card.Text>
                                            <Card.Text>Category : {post.category.name}</Card.Text>
                                            <Card.Text>Company : {post.company}</Card.Text>
                                            <Button variant="primary" onClick={() => navigate(`/updateproduct/` + post._id)}>Update</Button>
                                            <Button className='m-2' variant="primary" onClick={() => deleteProduct(post._id)}>Delete</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                                : <h1>No Result Found</h1>
                        }
                    </Row>
                </Container>
            </div>
        </div >
    )
}

export default Products