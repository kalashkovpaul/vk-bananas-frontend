import React from "react";
import './invitationBar.css';

type InvitationBarProps = {
    code: string;
}

const InvitationBar = (props: InvitationBarProps) => {
    const {code} = props;

    return (
        <div className="invitationBar">
            <div className="invitationText">Чтобы присоединиться, введите код: </div>
            <div className="invitationCode">{code}</div>
            <div className="invitationLogo">
                <div className="invitationLogoImg"/>
                <div className="invitationLogoText">Kinda Slides</div>
            </div>
        </div>
    );
}

export default InvitationBar;