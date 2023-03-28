import React from "react";
import './presentationBar.css';
import Popup from 'reactjs-popup';

type PresBarProps = {
    onDelete: Function;
    onCreate: Function;
    screenWidth: number;
    screenHeight: number;
}

const PresentationBar = (props: PresBarProps) => {
    const {onDelete, onCreate, screenWidth, screenHeight} = props;
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
            <Popup trigger={
                <div className="bar-button shareButton">
                    <div className="shareButtonIcon"/>
                    Поделиться
                </div>}
                position={"bottom left"}
                offsetX={-0.45 * screenWidth}
            >
                <div className="copyLink">
                    <div className="bar-button copyButton">
                        <div className="showButtonIcon"/>
                        Скопировать ссылку
                    </div>
                </div>
                <div className="copyQr">
                    <div className="bar-button copyButton">
                        <div className="showButtonIcon"/>
                        Скопировать QR-код
                    </div>
                </div>
            </Popup>

            <div className="bar-button showButton">
                <div className="showButtonIcon"/>
                Демонстрировать
            </div>
        </div>
    );
}

export default PresentationBar;