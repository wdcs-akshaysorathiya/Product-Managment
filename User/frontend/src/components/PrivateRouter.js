import React, { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRouter() {
    let loginData = localStorage.getItem('token');
    let auth = { 'token': loginData }


    useEffect(() => {
        if (loginData === null && loginData === undefined && window.location.pathname !== 'login') {
            <Navigate to='/login' />
        }
    }, [window.location.pathname, loginData])

    return (auth.token ? <Outlet /> : <Navigate to='/login' />)
}

export default PrivateRouter