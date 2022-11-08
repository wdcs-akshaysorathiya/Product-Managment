import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


function Adminlogin() {
   let navigate = useNavigate();
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const { register, handleSubmit, formState: { errors } } = useForm();

   const adminLogin = async (data) => {
      console.log(data);
      const result = await axios.post(`http://localhost:5000/admin-login`, {
         email: email,
         password: password
      })
      console.log(result.data);
      if (result.data.user === "not found") {
         alert('please enter valid entry')
      } else if (result.data.auth) {
         localStorage.setItem('email', result.data.user.name);
         localStorage.setItem('token', result.data.auth);
         navigate('/home')
      }
      else {
         // alert('Please enter valid entry');
      }
   };
   return (
      <div>
         <Container className="p-4">
            <h1 className="text-center">Login Here for admin</h1>
            <Row className="justify-content-center">
               <Col className="col-md-6">
                  <Form onSubmit={handleSubmit(adminLogin)}>
                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Enter email" {...register('email', { required: true })} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && errors.email.type === "required" && (
                           <p className="text-danger">Email is required.</p>
                        )}
                        <Form.Text className="text-muted">
                           We'll never share your email with anyone else.
                        </Form.Text>
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" {...register('password', { required: true })} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && errors.password.type === "required" && (
                           <p className="text-danger">Password is required.</p>
                        )}
                     </Form.Group>
                     <Button type="submit" variant="primary" >Sing IN</Button>
                  </Form>
               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default Adminlogin