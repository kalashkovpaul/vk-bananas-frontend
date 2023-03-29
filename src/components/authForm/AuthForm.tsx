import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { api } from "../../config/api.config";
import { authConfig } from "../../config/auth.config";
import { emptyField, errorInfo } from "../../config/errors.config";
import { authModule } from "../../modules/auth";
import type { authInputElements, input, loginData, registerData } from "../../types";
import './authForm.css';
import { inputElements } from "./inputs";

type AuthProps = {
    kind: "login" | "signup"
}

const authFormName = "authForm";

const AuthForm = (props: AuthProps) => {
    const {kind} = props;
    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();
    let errorMessages = new Map();

    const initErrorMessages = () => {
        Object.values(authConfig).forEach((value)=> {
            errorMessages.set(value.name, new Set());
        });
    };

    const getAuthDOMForm = () => {
        return document.forms.namedItem(authFormName);
    };

    const deleteSubmitError = () => {
        const error = document.querySelector('.authBtnError');
        if (error) {
          error.textContent = '';
        }
    };

    const addSubmitError = (message: string) => {
        deleteSubmitError();
        const error = document.querySelector('.authBtnError');
        if (error) {
          error.textContent = message;
        }
    };

    const deleteErrorMessage = (inputName: string) => {
        const authForm = getAuthDOMForm();
        const errorField = document.getElementsByClassName(`authInputHeadError ${inputName}`)[0];
        if (!inputName || !authForm || !errorField) {
          return;
        }
        const errorInput = authForm[inputName] as HTMLFormElement;
        errorInput.classList.remove('error');
        errorField.textContent = '';
    };

    const deleteError = (inputName: string, errorMessage: string) => {
        const inputErrors = errorMessages.get(inputName);
        if (inputErrors?.has(errorMessage)) {
            deleteErrorMessage(inputName);
            inputErrors?.delete(errorMessage);
        }
    };

    const deleteAllErrors = (inputName: string) => {
        if (!inputName) {
            return;
        }
        let inputErrors = errorMessages.get(inputName);
        if (!inputErrors) { return; }
        for (const errorMessage of inputErrors) {
            deleteError(inputName, errorMessage);
        }
        const repeatePasswordName = authConfig.repeatePasswordInput.name;
        if (inputName === authConfig.passwordInput.name) {
            inputErrors = errorMessages.get(repeatePasswordName);
            if (!inputErrors) { return; }
            for (const errorMessage of inputErrors) {
                deleteError(repeatePasswordName, errorMessage);
            }
        }
    }

    const addValidateListeners = () => {
        const authForm = getAuthDOMForm();
        const textInputs = authForm?.querySelectorAll('.textInput');
        if (!authForm || !textInputs?.length) {
            return;
        }
        Object.values(textInputs).forEach((input, i) => {
            const formInput = input as HTMLFormElement;
            if (i === 0) {
                formInput.focus();
            }
            input.addEventListener('input', () => {
                deleteAllErrors(formInput.name);
                deleteSubmitError();
            });
            input.addEventListener('change', () => {
                if (formInput.name === authConfig.repeatePasswordInput.name) {
                    // const passwordInput = getAuthDOMForm()?.[authConfig.passwordInput.name];
                  validateSingleInput(formInput.name, formInput.value);
                } else {
                    validateSingleInput(formInput.name, formInput.value);
                }
            });
            deleteAllErrors(formInput.name);
        });
    }

    const addErrorMessage = (inputName: string, errorMessage: string) => {
        const authForm = getAuthDOMForm();
        const errorField = document.getElementsByClassName(`authInputHeadError ${inputName}`)[0];
        if (!inputName || !errorMessage || !authForm || !errorField) {
            return;
        }
        const errorInput = authForm[inputName] as HTMLFormElement;
        errorInput.classList.add('error');
        errorField.textContent = errorMessage;
    };

    const addError = (inputName: string, errorMessage: string) => {
        const inputErrors = errorMessages.get(inputName);
        if (!inputErrors?.has(errorMessage)) {
            addErrorMessage(inputName, errorMessage);
            inputErrors?.add(errorMessage);
        }
    };

    const validateSingleInput = (inputName: string, inputValue: string) => {
        if (!inputName) { return; }
        if (!inputValue) {
            addError(inputName, emptyField.message);
            return;
        }
        deleteError(inputName, emptyField.message);
        for (const error of (errorInfo[inputName])) {
            if (error.regexp.toString() !== (/empty/).toString() && !inputValue.match(error.regexp)) {
                addError(inputName, error.message)
            } else if (error.regexp.toString() === (/empty/).toString() && inputName ===
                authConfig.repeatePasswordInput.name) {
                const authForm = document.forms.namedItem(authFormName);
                if (!authForm) { return; }
                let passwordValue = "";
                for (const input of Object.values(authForm)) {
                    const formInput = input as HTMLFormElement;
                    if (formInput.name === authConfig.passwordInput.name) {
                        passwordValue = formInput.value as string;
                    }
                }
                if (inputValue !== passwordValue) {
                    addError(inputName, error.message);
                } else {
                    deleteError(inputName, error.message)
                }
            } else {
                deleteError(inputName, error.message);
            }
        }
    };

    const hasErrors = (inputsData: loginData | registerData) => {
        if (!inputsData) {
            return true;
        }
        let result = false;
        Object.entries(inputsData).forEach(([inputName, inputValue]) => {
            validateSingleInput(inputName, inputValue);
            if (errorMessages.get(inputName)?.size) {
                // this.eventBus.emit(events.authPage.wrongInput, inputName);
                result = true;
            }
        });
        return result;
    };


    const submitLogin = (inputsData: loginData) => {
        if (!inputsData || hasErrors(inputsData)) {
            return;
        }

        fetch(`${api.login}`, {
            method: 'POST',
            body: JSON.stringify(inputsData),
            credentials: "include",
            headers: {
                'content-type': 'application/json'
            }
        }).then((response) => response.json())
        .then((response) => {
            if (response.username) {
                authModule.getUserFromSubmit(response);
                setUserData(response);
                navigate(`/`);
            } else {
                addSubmitError("Неправильный email или пароль!");
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    const submitRegister = (inputsData: registerData) => {
        if (!inputsData || hasErrors(inputsData)) {
            return;
        }

        fetch(`${api.register}`, {
            method: 'POST',
            body: JSON.stringify(inputsData),
            credentials: "include",
            headers: {
                'content-type': 'application/json'
            }
        }).then((response) => response.json())
        .then((response) => {
            if (response.username) {
                authModule.getUserFromSubmit(response);
                setUserData(response);
                navigate(`/`);
            } else {
                addSubmitError("Пользователь с таким email уже существует!");
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    const addSubmitListener = () => {
        const authForm = getAuthDOMForm();
        const submitBtn = document.querySelector('.authBtnInput') as HTMLInputElement;
        if (!authForm || !submitBtn) {
            return;
        }
        authForm.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
            submitBtn.click();
            }
        });
        submitBtn.addEventListener('click', () => {
            const textInputs = authForm.querySelectorAll('.textInput');
            if (!textInputs?.length) {
                return;
            }
            const regData: registerData = {
                email: "",
                username: "",
                password: "",
                repeatpassword: "",
                img: "",
            };
            const logData: loginData = {
                email: "",
                password: "",
            };
            let isLogin = true;
            const inputs = Object.values(textInputs);
            inputs.forEach((currentInput) => {
                const formInput = currentInput as HTMLFormElement;
                if (formInput.name === authConfig.repeatePasswordInput.name) {
                isLogin = false;
                }
            });
            Object.values(textInputs).forEach((input) => {
                const formInput = input as HTMLFormElement;
                if (formInput.name === authConfig.emailInput.name) {
                logData.email = formInput.value;
                regData.email = formInput.value;
                } else if (formInput.name === authConfig.nameInput.name) {
                regData.username = formInput.value;
                } else if (formInput.name === authConfig.passwordInput.name) {
                logData.password = formInput.value;
                regData.password = formInput.value;
                } else if (formInput.name === authConfig.repeatePasswordInput.name) {
                regData.repeatpassword = formInput.value;
                }
            });
            if (isLogin) {
                submitLogin(logData);
            } else {
                submitRegister(regData);
            }
        });
    };

    useEffect(() => {
        initErrorMessages();
        addValidateListeners();
        addSubmitListener();
    }, []);

    return (
        <div className={kind === "login" ? "loginWrapper" : "signupWrapper"}>
            <div className={`${kind}Invitation`}>{kind === "login" ? "Войти" : "Зарегистрироваться"}</div>
            <form className={`${kind}Form`} name={authFormName}>
                {inputElements.emailInput}
                {kind === "signup" && inputElements.nameInput}
                {inputElements.passwordInput}
                {kind === "signup" && inputElements.repeatePasswordInput}
                <div className="authBtn">
                    <input
                        className="authBtnInput"
                        name="submitBtn"
                        type="button"
                        value={kind === "login" ? "Войти" : "Создать аккаунт"}
                    />
                    <div className="authBtnError">
                    </div>
                </div>
            </form>
            {kind === "login" && <NavLink className="authInvitation" to="/register">Нет аккаунта? Зарегистрироваться!</NavLink>}
            {kind === "signup" && <NavLink className="authInvitation" to="/login">Уже есть аккаунт? Войти!</NavLink>}
        </div>
    );
};

export default AuthForm