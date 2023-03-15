import React from "react";
import './presentationBar.css';

type PresBarProps = {
    onDelete: Function;
}

const PresentationBar = (props: PresBarProps) => {
    const {onDelete} = props;
    return (
        <div className="presentationBar">
            <div className="bar-button addSlide">
                <div className="addSlidePlus"/>
                Добавить слайд
            </div>
            <div className="bar-button deleteSlide" onClick={() => {
                onDelete();
            }}>
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