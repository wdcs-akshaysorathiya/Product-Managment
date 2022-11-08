import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'



function Login() {
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [otp, setOTP] = useState();
    const [itotp, setItOTP] = useState(false);
    const [itforgot, setItForgot] = useState(false);
    const [forgotemail, setForgotEmail] = useState();
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const { handleSubmit } = useForm();
    const [error, setError] = useState();



    function countdown() {
        var seconds = 59;
        function tick() {
            var counter = document.getElementById("counter");
            seconds--;
            counter.innerHTML =
                "0:" + (seconds < 10 ? "0" : "") + String(seconds);
            if (seconds > 0) {
                setTimeout(tick, 1000);
            } else {
                document.getElementById("counter").innerHTML = "";
            }
        }
        tick();
    }

    const userLogin = async () => {
        if (!email || !password) {
            setError(true)
            return false
        } else {
            const url = 'http://localhost:5000/login';
            const result = await axios.post(url, {
                email: email,
                password: password,
            })
            console.log("result.data", result.data);
            if (result.data.auth) {
                localStorage.setItem('email', result.data.user.email);
                localStorage.setItem('token', result.data.auth);
                localStorage.setItem('userId', result.data.user._id);
                navigate('/home')
            } else {
                if (result.data.role === 'user') {
                    if (result.data.user === "not found") {
                        alert('Please enter valid entry');
                    } else if (result.data.isActive === 'false') {
                        alert('User is bloked');
                    } else {
                        setItOTP(true);
                        countdown();
                    }
                } else {
                    alert('Please enter a valid entry');
                }
            }
        }
    }

    const verifyotp = async () => {
        const url = 'http://localhost:5000/verifyotp';
        const result = await axios.post(url, {
            'email': email,
            'otp': otp
        })
        if (result.data === 'OTP is expire request new one') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'OTP is expire request new one',
            })
        } else if (result.data === 'invalid OTP') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'please Enter Valid OTP!',
            })
        } else {
            localStorage.setItem('email', result.data.user.email);
            localStorage.setItem('token', result.data.auth);
            localStorage.setItem('userId', result.data.user._id);
            navigate('/home')
        }
    }

    const resendotp = async () => {
        const url = 'http://localhost:5000/resendotp';
        await axios.post(url, {
            'email': email,
        })
        document.getElementById("counter").innerHTML = "0";
        countdown();
    }

    const sendForgotPasswordMail = async () => {
        const url = 'http://localhost:5000/sendforgotpasswordlink';
        const result = await axios.post(url, {
            'email': forgotemail,
        })
        if (result.data === 'enter flied entry') {
            alert('enter flied entry');
        } else {
            if (result.data === 'This is not a valid Email') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This is not a valid Email',
                })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Mail Send To Regestred Email address',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }






    return (
        <div>
            <Container className="p-4">
                {itforgot ? <h1 className="text-center">Reset Password Here</h1> : <h1 className="text-center">Login Here</h1>}
                <Row className="justify-content-center">
                    <Col className="col-md-6">
                        {!itforgot &&
                            <>
                                <Form onSubmit={handleSubmit()}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                    <Form.Control name="email" type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                                    {error && !email && (
                                        <p className="text-danger">Email is required.</p>
                                    )}
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                    {error && !password && (
                                        <p className="text-danger">Password is required.</p>
                                    )}
                            </Form.Group>

                                {itotp &&
                                <>
                                    <div className="btnGroup">
                                        <span className="timer">
                                            <span id="counter" className='text-danger'></span>
                                        </span>
                                        <span className="Btn m-3" id="verifiBtn">
                                            <button type="submit" variant="primary" onClick={() => resendotp()}>Resend OTP</button>
                                        </span>
                                    </div>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Enter OTP</Form.Label>
                                        <Form.Control name="otp" type="number" placeholder="OTP" required onChange={(e) => setOTP(e.target.value)} />
                                    </Form.Group>
                                </>
                            }

                                {!itotp ? <Button type="submit" variant="primary" onClick={() => userLogin()}>
                                Sing IN
                            </Button> : <Button type="submit" variant="primary" onClick={() => verifyotp()}>
                                Submit
                            </Button>}
                        </Form>
                                <button className='m-2' onClick={() => { setItForgot(true) }}>Forgot Password</button>
                            </>
                        }
                        {itforgot &&
                            <>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Enter Email</Form.Label>
                                    <Form.Control name="email" type="email" placeholder="Enter Email To Forgot Password" onChange={(e) => setForgotEmail(e.target.value)} />
                                </Form.Group>
                                <Button className='m-3' type="submit" variant="primary" onClick={() => sendForgotPasswordMail()}>Send Email</Button>
                                <br />
                                <a className='m-3' href="/login" >Login</a>
                            </>
                        }
                        {!itforgot &&
                            <>
                                <br />
                                <a className='m-3' href="/singup" >not a user regestration here</a>
                        <br />
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Login



