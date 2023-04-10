import React, { useState } from "react";
import './presentationBar.css';
import Popup from 'reactjs-popup';
// import QRCode from "react-qr-code";
// import { useQRCode } from 'react-qrcodes';
import { QRCode } from 'react-qrcode-logo';
import { copyLink, copyQR } from "../../utils/utils";
import { domain, site } from "../../config/api.config";

type PresBarProps = {
    onDelete: Function;
    onCreate: Function;
    onDemonstrate: Function;
    hash: string;
}

const PresentationBar = (props: PresBarProps) => {
    const {onDelete, onCreate, onDemonstrate, hash} = props;
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <div className="presentationBar">
            <div className="bar-button addSlide" onClick={() => {
                onCreate();
            }}>
                <div className="addSlidePlus"/>
                Добавить слайд
            </div>
            <div className="bar-button deleteSlide" onClick={() => {
                onDelete();
            }}>
                Удалить слайд
            </div>
            <div className="bar-button showButton" onClick={() => {
                onDemonstrate();
            }}>
                <div className="showButtonIcon"/>
                Демонстрировать
            </div>
            <div className="bar-button shareButton" onClick={() => {
                setOpen(o => !o);
            }}>
                <div className="shareButtonIcon"/>
                Поделиться
            </div>
            <Popup
                position={"center center"}
                // offsetX={-0.45 * screenWidth}
                modal={true}
                open={open}
                onClose={closeModal}
            >
                <div className="popupWrapper invitationPopupWrapper">
                    <div className="crossWrapper" onClick={() => {
                        setOpen(o => !o);
                    }}>
                        <div className="crossIcon"/>
                    </div>
                    <div className="copyLink" onClick={(e) => {
                        copyLink(`${site}/demonstration/${hash}`);
                        (e.currentTarget.firstChild?.childNodes[1] as any).data = "Ссылка скопирована!";
                    }}>
                        <div className="bar-button copyButton">
                            <div className="copyLinkIcon"/>
                            Скопировать ссылку
                        </div>
                    </div>
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
        </div>
    );
}

export default PresentationBar;