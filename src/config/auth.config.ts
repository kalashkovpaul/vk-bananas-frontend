import type { authInputs } from "../types";

export const authConfig: authInputs = {
    emailInput: {
        type: "email",
        name: "email",
        placeholder: "Введите e-mail",
        title: "Email"
    },
    nameInput: {
        type: "text",
        name: "username",
        placeholder: "Введите имя",
        title: "Имя"
    },
    passwordInput: {
        type: "password",
        name: "password",
        placeholder: "Введите пароль",
        title: "Пароль"
    },
    repeatePasswordInput: {
        type: "password",
        name: "repeatpassword",
        placeholder: "Повторите пароль",
        title: "Повторите пароль"
    },
  };