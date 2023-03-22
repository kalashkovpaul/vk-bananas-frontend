import React from "react";
import AuthForm from "../../components/authForm/AuthForm";
import './login.css';

const Login = () => {
    return (
        <div className="loginPage view-wrapper">
            <AuthForm kind="login"/>
        </div>
    );
};

export default Login;