import React from "react";
import './presentationBar.css';

const PresentationBar = () => {

    return (
        <div className="presentationBar">
            <div className="bar-button addSlide">
                <div className="addSlidePlus"/>
                Добавить слайд
            </div>
            <div className="bar-button deleteSlide">
                Удалить слайд
            </div>
            <div className="bar-button shareButton">
                <div className="shareButtonIcon"/>
                Поделиться
            </div>
            <div className="bar-button showButton">
                <div className="showButtonIcon"/>
                Демонстрировать
            </div>
        </div>
    );
}

export default PresentationBar;