import React, { useState } from 'react'
import Template from './Template'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
function Users() {
    const [userdata, setUserData] = useState([]);

    useEffect(() => {
        fetchUserData();
    }, [])

    const fetchUserData = async () => {
        const products = await axios.get('http://localhost:5000/getallusers', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${(localStorage.getItem('token'))}`
            }
        })
        setUserData(products.data);
    }

    const blockuser = async (id) => {
        await axios.put(`http://localhost:5000/getoneusers/${id}`, {
            isActive: 'false',
        });
        fetchUserData();
    }

    const unblockuser = async (id) => {
        await axios.put(`http://localhost:5000/getoneusers/${id}`, {
            isActive: 'true',
        });
        fetchUserData();
    }


    return (
        <div>
            <Template />
            <div className="my-container">
                <Container>
                    <Row>
                        {
                            userdata.map((post) =>
                                <Col>
                                    {console.log(post)}
                                    <Card className='m-2' style={{ width: '18rem' }}>
                                        <Card.Img variant="top" src={`http://localhost:5000/${post.image}`} />
                                        <Card.Body>
                                            <Card.Text>ID : {post._id}</Card.Text>
                                            <Card.Title>Name : {post.name}</Card.Title>
                                            <Card.Text>Email : {post.email}</Card.Text>
                                            <Card.Text>isActive : {post.isActive}</Card.Text>
                                            <Button variant="primary" onClick={() => blockuser(post._id)}>Block</Button>
                                            <Button className='m-2' variant="primary" onClick={() => unblockuser(post._id)}>UnBlock</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        }
                    </Row>
                </Container>
            </div>
        </div >

    )
}

export default Users