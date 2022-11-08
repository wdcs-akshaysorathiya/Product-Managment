import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';


function Singup() {
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [setSingupData] = useState([]);
    const [image, setImage] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const singup = async () => {
        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        data.append('image', image);
        data.append('role', 'user');
        data.append('isActive', 'true');

        console.log(data);
        const url = 'http://localhost:5000/singup';
        const result = await axios.post(url, data)
        console.log(result.data);


        if (result.data === 'not valid') {
            alert('Please enter valid entry.');
        }
        else {
            if (result.data === 'user is exist') {
                alert('user is exist')
            } else {
                alert('Successfully')
                setSingupData(result.data);
            }
            navigate('/login')
        }

    };
    return (
        <div>
            <Container className="p-4">
                <h1 className="text-center">SingUp Here</h1>
                <Row className="justify-content-center">
                    <Col className="col-md-6">
                        <Form onSubmit={handleSubmit(singup)}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Enter name"  {...register('name', { required: true })} onChange={(e) => setName(e.target.value)} />
                                {errors.email && errors.email.type === "required" && (
                                    <p className="text-danger">Name is required.</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <label for="myfile">Upload Photo:</label>
                                <input type="file" id="myfile" name="myfile" required onChange={(e) => setImage(e.target.files[0])} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email"  {...register('email', { required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ })} onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && errors.email.type === "required" && (
                                    <p className="text-danger">Email is required.</p>
                                )}
                                {errors.email && errors.email.type === "pattern" && (
                                    <p className="text-danger">Email is not valid.</p>
                                )}
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" {...register('password', { required: true, minLength: 6 })} onChange={(e) => setPassword(e.target.value)} />
                                {errors.password && errors.password.type === "required" && (
                                    <p className="text-danger">Password is required.</p>
                                )}
                                {errors.password && errors.password.type === "minLength" && (
                                    <p className="text-danger">Password minlength is 6</p>
                                )}
                            </Form.Group>
                            <Button type="submit" variant="primary" onClick={() => singup()}>
                                Sing IN
                            </Button>
                        </Form>
                        <br />
                        <a clasname='mt -3' href="/login" >alredy regestered</a>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Singup