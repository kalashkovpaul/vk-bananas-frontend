import React from "react";
import { authConfig } from "../../config/auth.config";
import type { authInputElements, input } from "../../types";
import './authForm.css';
import { inputElements } from "./inputs";

type AuthProps = {
    kind: "login" | "signup"
}



const AuthForm = (props: AuthProps) => {
    const {kind} = props;

    const onSubmit = () => {

    }

    const onChange = () => {

    }


    return (
        <div className={kind === "login" ? "loginWrapper" : "signupWrapper"}>
            <div className={`${kind}Invitation`}>{kind === "login" ? "Войти" : "Зарегистрироваться"}</div>
            <form className={`${kind}Form`} name="authForm">
                {inputElements.emailInput}
                {kind === "signup" && inputElements.nameInput}
                {inputElements.passwordInput}
                {kind === "signup" && inputElements.repeatePasswordInput}
                <div className="authBtn">
                    <div className="authBtnError">
                        <input
                            className="authBtnInput"
                            name="submitBtn"
                            type="button"
                            value={kind === "login" ? "Войти" : "Создать аккаунт"}
                        />
                    </div>
                </div>
            </form>
            {kind === "login" && <a className="authInvitation" href="/register">Нет аккаунта? Зарегистрироваться!</a>}
            {kind === "signup" && <a className="authInvitation" href="/login">Уже есть аккаунт? Войти!</a>}
        </div>
    );
};

export default AuthForm