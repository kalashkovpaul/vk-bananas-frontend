import React, { useEffect, useRef, useState } from "react";
import './questionSlide.css';
import type { SingleSlideData, userQuestion } from "../../types";
import { CSSTransition } from "react-transition-group";
import Popup from "reactjs-popup";

type QuestionSlideProps = {
    width: number,
    height: number,
    questions: userQuestion[],
    slide: SingleSlideData,
};

const QuestionSlide = (props: QuestionSlideProps) => {
    const {width, height, questions, slide} = props;
    let type = "";//"columns";
    const brightColors = ["#9C0D38", "#72B01D", "#791E94", "#E71D36", "#072AC8", "#E94F37", "#53DD6C", "#FF206E", "#F86624", "#0AD3FF", "#E40066", "#E94F37", "#A60067", "#162521", "#9E0031", ];
    const [curQuestionIndex, setQIndex] = useState(0);
    const [toggle, setToggle] = useState(false);
    const [isPopup, setIsPopup] = useState(false);

    const popupTime = 2000;
    const [qstate, setQstate] = useState(questions);
    const [popupTimeout, setPopupTimeout] = useState(0);

    const strikeTime = 1000;
    const [isStrike, setIsStrike] = useState(false);
    const [strikeTimeout, setStrikeTimeout] = useState(0);

    useEffect(() => {
        setToggle(false);
        setTimeout(() => {
            setToggle(true);
        }, 100);
    }, [curQuestionIndex]);

    return (
        <div className="questionSlide">
            <div className="slideQuestion" style={{color: slide.fontColor,}}>{slide.question}</div>
            {type === "columns" ?
            <>
            <div
                className="questionBoxes"
                style={{
                    maxHeight: `${height}px`
                }}
            >
                <div className="row0">
                    {questions.map((q, i) => {
                        if (i % 3 !== 0) return null;
                        return (
                            <div key={q.idx}
                                className={`singleQuestionBox row${Math.floor(i % 3)}`}
                                style={{
                                    borderColor: brightColors[i % brightColors.length],
                                }}
                            >
                                {q.question}
                            </div>
                        );
                    })}
                </div>
                <div className="row1">
                    {questions.map((q, i) => {
                        if (i % 3 !== 1) return null;
                        return (
                            <div key={q.idx}
                                className={`singleQuestionBox row${Math.floor(i % 3)}`}
                                style={{
                                    borderColor: brightColors[i % brightColors.length],
                                }}
                            >
                                {q.question}
                            </div>
                        );
                    })}
                </div>
                <div className="row2">
                    {questions.map((q, i) => {
                        if (i % 3 !== 2) return null;
                        return (
                            <div key={q.idx}
                                className={`singleQuestionBox row${Math.floor(i % 3)}`}
                                style={{
                                    borderColor: brightColors[i % brightColors.length],
                                }}
                            >
                                {q.question}
                            </div>
                        );
                    })}
                </div>
            </div>
            </>
            :
            <>
            <CSSTransition
                in={toggle}
                timeout={500}
                classNames={"questionPanelAnimated"}
                unmountOnExit
                // onEnter={() => setToggle(true)}
                // onExited={() => setToggle(false)}
            >
                <div
                    className="singleUserQuestionBig"
                    onMouseEnter={() => {
                        setPopupTimeout(window.setTimeout(() => {
                            setIsPopup(true);
                        }, popupTime));
                        setStrikeTimeout(window.setTimeout(() => {
                            setIsStrike(true);
                        }, strikeTime));
                    }}
                    onMouseLeave={() => {
                        if (popupTimeout) {
                            window.clearTimeout(popupTimeout);
                            setPopupTimeout(0);
                        }
                        if (strikeTimeout) {
                            window.clearTimeout(strikeTimeout);
                            setStrikeTimeout(0);
                        }
                        setIsPopup(false);
                        setIsStrike(false);
                    }}
                >
                    <a
                        href=""
                        className={`singleUserQuestionBigText ${isStrike ? "strike" : ""}`}
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isStrike && qstate.length) {
                                setQstate(qstate.filter((q, i) => {
                                    return i !== curQuestionIndex;
                                }));
                                setIsPopup(false);
                                if (curQuestionIndex === qstate.length - 1)
                                    setQIndex(curQuestionIndex - 1);
                                setToggle(false);
                                setTimeout(() => {
                                    setToggle(true);
                                }, 100);
                            }
                        }}
                    >
                        {toggle && (qstate.length ? curQuestionIndex < qstate.length ?
                            qstate[curQuestionIndex]?.question : "Вопросов больше нет" : "Вопросов больше нет")}
                    </a>
                </div>
            </CSSTransition>
            <div
                className="prevArrow"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (curQuestionIndex > 0) {
                        setQIndex(curQuestionIndex - 1);
                    }
                }}
                style={curQuestionIndex > 0 ? {
                    opacity: 1
                } : {}}
            />
            <div
                className="nextArrow"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (curQuestionIndex < qstate.length - 1) {
                        setQIndex(curQuestionIndex + 1);
                    }
                }}
                style={curQuestionIndex < qstate.length - 1 ? {
                    opacity: 1
                } : {}}
            />
            <div className={`clue ${isPopup ? "visible" : ""}`}>
                Нажмите, чтобы пометить вопрос отвеченным
            </div>
            </>
            }
        </div>
    );
}

export default QuestionSlide;