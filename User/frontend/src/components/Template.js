import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
// import '../Components/css/Template.css';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import Swal from "sweetalert2";
import { GlobalContext } from '../context/Globalcontext';

function Template() {
    const navigate = useNavigate();
    const { cartcounter } = useContext(GlobalContext);

    const logout = () => {
        Swal.fire(
            'Logout!',
            'logout successfully.',
            'success'
        )
        localStorage.removeItem('token')
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const loginUserName = localStorage.getItem('email');






    return (
        <div>
            <Navbar className="fixed-top" bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="/home">Product Managment - USer</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as : <span className="text-white"> {loginUserName}</span>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
                <button className="me-5 btn btn-warning m-2" onClick={() => navigate('/cart')}>Cart - {cartcounter > 0 ? cartcounter : ' '}</button>
                <button className="ms-5 btn btn-danger m-2" onClick={() => logout()}>Logout</button>
            </Navbar>

            <div className='sidebar'>
                <CDBSidebar textColor="#fff" backgroundColor="#0d6efd">
                    <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                        <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                            Sidebar
                        </a>
                    </CDBSidebarHeader>
                    <CDBSidebarContent className="sidebar-content">
                        <CDBSidebarMenu>
                            {/* <NavLink to="/" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                            </NavLink> */}
                            {/* <NavLink exact to="/users" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="user" >Users</CDBSidebarMenuItem>
                            </NavLink> */}
                            <NavLink to="/userProfile" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="chart-line">Profile</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink to="/home" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="table">Products</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink to="/cart" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="table">Cart</CDBSidebarMenuItem>
                            </NavLink>
                            {/* <NavLink exact to="/hero404" target="_blank" activeclassname="activeClicked">
                                <CDBSidebarMenuItem icon="exclamation-circle">404 page</CDBSidebarMenuItem>
                            </NavLink> */}
                        </CDBSidebarMenu>
                    </CDBSidebarContent>

                    <CDBSidebarFooter style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                padding: '20px 5px',
                            }}
                        >
                            Sidebar Footer
                        </div>
                    </CDBSidebarFooter>
                </CDBSidebar>
            </div>
        </div>
    )
}

export default Template