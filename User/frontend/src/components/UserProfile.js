import React, { useState } from 'react'
import Template from './Template'
import Card from 'react-bootstrap/Card';
import { useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Swal from 'sweetalert2'

function UserProfile() {

   const [userData, setUserData] = useState([]);
   const [changepassword, setChangePassord] = useState(false);
   const [oldpassword, setOldPassword] = useState();
   const [newpassword, setNewPassword] = useState();
   const id = localStorage.getItem('userId');


   const checkauth = localStorage.getItem('two_step_auth_isChecked');
   useEffect(() => {
      (async () => {
         await axios.get(`http://localhost:5000/getoneusers/${id}`).then((response) => { setUserData(response.data) })


      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])


   const clickChangePassword = async () => {
      const result = await axios.post(`http://localhost:5000/changepassword`, {
         email: userData.email,
         newpassword: newpassword,
         oldpassword: oldpassword,
      })
      if (result.data === 'Enter all Details') {
         alert('Please Enter all Details');
      } else {
         if (result.data.response === 'Enter Wrong Password') {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Enter Wrong Password',
            })
         } else {
            Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: 'Password Change Successfully',
               showConfirmButton: false,
               timer: 1500
            })
            setChangePassord(false)
         }

      }
   }
   const loginUserName = localStorage.getItem('email');

   const twoStepAuthCheck = async (check) => {
      localStorage.setItem('two_step_auth_isChecked', check);
      if (check === true) {
         axios.post('http://localhost:5000/checkTwoStepAuth', {
            email: loginUserName,
            check: check,
         })
      } else {
         axios.post('http://localhost:5000/checkTwoStepAuth', {
            email: loginUserName,
            check: check,
         })
      }
   }


   return (
      <div>
         <div>
            <Template />
            <div className="my-container">
               <Container>
                  <Row>
                     <Col>
                        <Card key={userData._id} className='m-2' style={{ width: '18rem' }}>
                           <Card.Img variant="top" src={`http://localhost:5000/${userData.image}`} />
                           <Card.Body className='text-center'>
                              <Card.Text>ID : {userData._id}</Card.Text>
                              <Card.Title>Name : {userData.name}</Card.Title>
                              <Card.Text>Email : {userData.email}</Card.Text>
                              <Card.Text>isActive : {userData.isActive}</Card.Text>
                              <button className="btn btn-warning" id="otp">OTP verification
                                 <input className='ms-2 form-check-input' type="checkbox" id="authCheckbox" defaultChecked={checkauth} onClick={(e) => { twoStepAuthCheck(e.target.checked) }} ></input>
                              </button>
                              <button className='btn btn-success mt-2' onClick={() => { setChangePassord(true) }}>Change Password</button>
                           </Card.Body>
                        </Card>
                     </Col>
                     <Col>
                        {
                           changepassword &&
                           <>
                              <Form.Group className="mb-3" controlId="formBasicPassword">
                                 <Form.Label>Old Password</Form.Label>
                                 <Form.Control name="password" type="password" placeholder="Old Password" onChange={(e) => setOldPassword(e.target.value)} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="formBasicPassword">
                                 <Form.Label>New Password</Form.Label>
                                 <Form.Control name="password" type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
                              </Form.Group>
                              <button className='btn btn-success' onClick={() => { clickChangePassword() }}>Change Password</button>
                           </>
                        }
                     </Col>
                  </Row>
               </Container>
            </div>
         </div>
      </div>
   )
}

export default UserProfile