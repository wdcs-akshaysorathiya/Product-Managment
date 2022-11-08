import React, { useEffect, useState } from 'react'
import Template from './Template';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/esm/Col';

function Cart() {
    let allqty = JSON.parse(localStorage.getItem('product'));
    const [cartdetails, setCartDetails] = useState(allqty)

    useEffect(() => {
        setCartDetails(JSON.parse(localStorage.getItem('product')))
    }, [])

    const deleteCartIteam = (id) => {
        const filtered = cartdetails.findIndex(item => item.id === id);
        if (filtered >= -1) {
            cartdetails.splice(filtered, 1);
            localStorage.product = JSON.stringify(cartdetails);
            window.location.reload();
        }
    }

    const increceCartIteam = (cartParameter) => {
        let cartqty = [...cartdetails]
        cartqty[cartParameter].qty += 1;
        localStorage.setItem('product', JSON.stringify(cartqty));
        setCartDetails(cartqty);
    }

    const decreceCartIteam = (cartParameter) => {
        let cartqty = [...cartdetails]
        if (cartqty[cartParameter].qty <= 1) {
            cartqty[cartParameter].qty = 1
            setCartDetails(cartqty);
        } else {
            cartqty[cartParameter].qty -= 1;
            localStorage.setItem('product', JSON.stringify(cartqty));
            setCartDetails(cartqty);
        }
    }
    return (
        <div>
            <Template />
            <div className="my-container">
                <Container>
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartdetails && cartdetails.length > 0 ? cartdetails.map((post, cartParameter) =>
                                        <tr key={post._id}>
                                            <td>{cartParameter}</td>
                                            <td>{post.name}</td>
                                            <td>{post.price}</td>
                                            <td><button className='btn btn-primary me-2' onClick={() => decreceCartIteam(cartParameter)}>-</button>
                                                {post.qty}   <button className='btn btn-primary' onClick={() => increceCartIteam(cartParameter)}>+</button></td>
                                            <td>{post.price * post.qty}</td>
                                            <td><button className='btn btn-danger' onClick={() => deleteCartIteam(post.id)}>Delete</button></td>
                                        </tr>
                                    )
                                        : <h1>There is no product in cart </h1>
                                }
                            </tbody>
                        </Table>
                    </Row>
                    <Row className='col-md-6'>
                        <Col className='justify-content-end'>
                            <button className='btn btn-primary' onClick={() => alert('Thank You')}>Buy Now - {cartdetails && cartdetails.reduce((total, item) => total + (item.price * item.qty), 0)}</button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div >
    )
}

export default Cart