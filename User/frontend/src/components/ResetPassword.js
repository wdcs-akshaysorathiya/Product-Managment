import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import queryString from "query-string";
import Swal from 'sweetalert2'



function ResetNewPassword() {
   let navigate = useNavigate();
   let { search } = useLocation();
   let { token } = queryString.parse(search);
   const [password, setNewPassword] = useState();

   useEffect(() => {
      (async () => {
         const result = await axios.post('http://localhost:5000/savenewPassword/', {
            token: token
         })
         if (result.data === 'Link is not Valid') {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Link is not Valid',
            })
            navigate('/login');
         }
      })()
   })


   const resetNewPassword = async () => {
      const url = 'http://localhost:5000/savenewPassword';
      await axios.post(url, {
         "password": password,
         "token": token,
      })

      Swal.fire({
         position: 'top-end',
         icon: 'success',
         title: 'Password Reset Succesfully...',
         showConfirmButton: false,
         timer: 1500
      })
      navigate('/login');
   }

   return (
      <div>
         <Container>
            <h1 className="text-center">Forgot Password</h1>
            <Row>
               <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control name="password" type="password" placeholder="Password" onChange={(e) => setNewPassword(e.target.value)} />
                  </Form.Group>
                  <Button type="submit" variant="primary" onClick={() => resetNewPassword()}>Reset Password</Button>
               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default ResetNewPassword