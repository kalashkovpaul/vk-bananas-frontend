import React from "react";
import './questionSlide.css';
import type { SingleSlideData, userQuestion } from "../../types";

type QuestionSlideProps = {
    width: number,
    height: number,
    questions: userQuestion[],
    slide: SingleSlideData,
};

const QuestionSlide = (props: QuestionSlideProps) => {
    const {width, height, questions, slide} = props;
    const brightColors = ["#9C0D38", "#72B01D", "#791E94", "#E71D36", "#072AC8", "#E94F37", "#53DD6C", "#FF206E", "#F86624", "#0AD3FF", "#E40066", "#E94F37", "#A60067", "#162521", "#9E0031", ]
    return (
        <div className="questionSlide">
            <div className="slideQuestion" style={{color: slide.fontColor,}}>{slide.question}</div>
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
                                    borderColor: brightColors[i],
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
                                    borderColor: brightColors[i],
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
                                    borderColor: brightColors[i],
                                }}
                            >
                                {q.question}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default QuestionSlide;