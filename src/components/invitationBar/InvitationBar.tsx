import React, { useState } from "react";
import './invitationBar.css';
import Popup from 'reactjs-popup';
import { QRCode } from "react-qrcode-logo";
import { copyQR, copyLink } from "../../utils/utils";
import { domain, site } from "../../config/api.config";

type InvitationBarProps = {
    code: string;
    hash: string;
}

const InvitationBar = (props: InvitationBarProps) => {
    const {code, hash} = props;
    const copyTime = 2000;
    const [isCodeCopied, setCodeCopied] = useState(false);

    return (
        <div className="invitationBar">
            <div id="popup-root"/>
            <div className="invitationText">Заходите на kindaslides.ru и вводите код: </div>
            <Popup
                on="hover"
                trigger={open => (
                    // <div/>
                    <div className="invitationCode" onClick={(e) => {
                        e.stopPropagation();
                        copyLink(code);
                        setCodeCopied(true);
                        setTimeout(() => {
                            setCodeCopied(false);
                        }, copyTime);
                    }}>
                        {code}
                    </div>
                )}
                position="bottom center"
            >
                <div className="copyCodeInvitation">{isCodeCopied ? "Скопировано!" : "Нажмите, чтобы скопировать!"}</div>
            </Popup>
            <Popup
                trigger={open => (
                    <div className="invitationQr"/>
                    )}
                on="hover"
            >
                <div className="copyQrInvitation">
                    <div className="copyQr" onClick={(e) => {
                        copyQR();
                        (e.currentTarget.firstChild?.childNodes[1] as any).data = "QR-код скопирован!";
                    }}>
                        <div className="bar-button copyButton">
                            <div className="copyQrIcon"/>
                            Скопировать QR-код
                        </div>
                        <QRCode value={`${site}/demonstration/${hash}`} />
                    </div>
                </div>
            </Popup>
            <div className="invitationLogo">
                <div className="invitationLogoImg"/>
                <div className="invitationLogoText">Kinda Slides</div>
            </div>
        </div>
    );
}

export default InvitationBar;