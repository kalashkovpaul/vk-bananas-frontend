import { authConfig } from "../../config/auth.config";
import type { authInputElements } from "../../types";

export const inputElements: authInputElements = {
    emailInput: <div className={`authInput ${authConfig.emailInput.name}`}>
        <div className="authInputHead">
            <label htmlFor={authConfig.emailInput.name}
                className={"authInputHeadLabel"}>
                {authConfig.emailInput.title}
            </label>
        </div>
        <input
            type={authConfig.emailInput.type}
            name={authConfig.emailInput.name}
            id={authConfig.emailInput.name}
            placeholder={authConfig.emailInput.placeholder}
            className="textInput"
        />
        <div className={`authInputHeadError ${authConfig.emailInput.name}`}/>
    </div>,
    nameInput: <div className={`authInput ${authConfig.nameInput.name}`}>
        <div className="authInputHead">
            <label htmlFor={authConfig.nameInput.name}
                className={"authInputHeadLabel"}>
                {authConfig.nameInput.title}
            </label>
        </div>
        <input
            type={authConfig.nameInput.type}
            name={authConfig.nameInput.name}
            id={authConfig.nameInput.name}
            placeholder={authConfig.nameInput.placeholder}
            className="textInput"
        />
        <div className={`authInputHeadError ${authConfig.nameInput.name}`}/>
    </div>,
    passwordInput: <div className={`authInput ${authConfig.passwordInput.name}`}>
        <div className="authInputHead">
            <label htmlFor={authConfig.passwordInput.name}
                className={"authInputHeadLabel"}>
                {authConfig.passwordInput.title}
            </label>
        </div>
        <input
            type={authConfig.passwordInput.type}
            name={authConfig.passwordInput.name}
            id={authConfig.passwordInput.name}
            placeholder={authConfig.passwordInput.placeholder}
            className="textInput"
        />
        <div className={`authInputHeadError ${authConfig.passwordInput.name}`}/>
    </div>,
    repeatePasswordInput: <div className={`authInput ${authConfig.repeatePasswordInput.name}`}>
        <div className="authInputHead">
            <label htmlFor={authConfig.repeatePasswordInput.name}
                className={"authInputHeadLabel"}>
                {authConfig.repeatePasswordInput.title}
            </label>
        </div>
        <input
            type={authConfig.repeatePasswordInput.type}
            name={authConfig.repeatePasswordInput.name}
            id={authConfig.repeatePasswordInput.name}
            placeholder={authConfig.repeatePasswordInput.placeholder}
            className="textInput"
        />
        <div className={`authInputHeadError ${authConfig.repeatePasswordInput.name}`}/>
    </div>,
}