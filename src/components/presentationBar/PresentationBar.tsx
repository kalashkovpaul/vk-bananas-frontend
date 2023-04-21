import React, { useEffect, useState } from "react";
import './presentationBar.css';
import Popup from 'reactjs-popup';
// import QRCode from "react-qr-code";
// import { useQRCode } from 'react-qrcodes';
import { QRCode } from 'react-qrcode-logo';
import { copyLink, copyQR } from "../../utils/utils";
import { domain, site } from "../../config/api.config";

type PresBarProps = {
    onDelete: Function;
    onCreatePoll: Function;
    onCreateQuiz: Function;
    onDemonstrate: Function;
    hash: string;
    code: string;
}

const PresentationBar = (props: PresBarProps) => {
    const {onDelete, onCreatePoll, onCreateQuiz, onDemonstrate, hash, code} = props;
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const closeDropdown = (e: any) => {
        const dropdown = document.querySelector(".secCenter");
        if (dropdown && !dropdown.contains(e.target)) {
            (document.getElementById("dropdown") as HTMLInputElement).checked = false;
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeDropdown);

        return () => {
            document.removeEventListener("click", closeDropdown);
        }
    }, []);

    return (
        <div className="presentationBar">
            <div className="secCenter">
                <input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                <label htmlFor="dropdown" className="for-dropdown bar-button addSlide">
                    <div className="addSlidePlus"/>
                    Добавить слайд
                </label>
                <div className="section-dropdown">
                    <div className="dropdownOption addPoll" onClick={() => {
                        onCreatePoll();
                        (document.getElementById("dropdown") as HTMLInputElement).checked = false;
                    }}>
                        Добавить опрос</div>
                    {/* <div className="dropdownOption addPoll" onClick={() => {
                        onCreateQuiz();
                        (document.getElementById("dropdown") as HTMLInputElement).checked = false;
                    }}>Добавить квиз</div> */}
                </div>

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
                    <div className="copyLink">
                        <div className="bar-button copyButton" onClick={(e) => {
                            copyLink(code);
                            (e.currentTarget.firstChild?.childNodes[1] as any).data = "Ссылка скопирована!";
                        }}>
                            Скопировать код
                        </div>
                        <div className="bar-button copyButton" onClick={(e) => {
                            copyLink(`${site}/demonstration/${hash}`);
                            (e.currentTarget.firstChild?.childNodes[1] as any).data = "Ссылка скопирована!";
                        }}>
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