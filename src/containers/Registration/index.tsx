import React from "react";
import AuthForm from "../../components/authForm/AuthForm";
import './registration.css';

const Registration = () => {
    return (
        <div className="signupPage view-wrapper">
            <AuthForm kind="signup"/>
        </div>
    );
};

export default Registration;