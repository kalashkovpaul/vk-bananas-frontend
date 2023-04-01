import React, { useEffect, useRef, useState } from "react";
import type { SingleSlideData } from "../../types";
import './pollForm.css';
// import Poll from './poll';//'react-polls';//'./poll';
import { LeafPoll } from 'react-leaf-polls'

type PollFormProps = {
    currentSlide: SingleSlideData;
}

const customTheme = {
  textColor: 'black',
  mainColor: '#00B87B',
  backgroundColor: 'rgb(255,255,255)',
  alignment: 'center'
}

const PollForm = (props: PollFormProps) => {
    const {currentSlide} = props;
    const [choice, setChoice] = useState(-1);

    const handleOptionChange = (e: any) => {
        console.log(e.target.disabled);
        setChoice(+e.target.value);
    }

    const usePreviousSlide = (value: any) => {
        const prevSlideRef = useRef<any>(value);
          useEffect(() => {
              prevSlideRef.current = value;
          });
          return prevSlideRef.current
    };

    const prevCurrentSlide = usePreviousSlide(currentSlide);

    useEffect(() => {
        if (prevCurrentSlide.idx !== currentSlide.idx) {
            setChoice(-1);
            const button = document.querySelector(".submitBtn") as HTMLButtonElement;
            button.classList.remove("disabledBtn");
            const poll = document.querySelector(".poll") as HTMLFormElement;
            poll.classList.remove("disabledPoll");
            const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
            options.forEach((option) => {
                option.disabled = false;
            });
        }
    }, [currentSlide]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (choice < 0) return;
        // TODO fetch to server
        const button = document.querySelector(".submitBtn") as HTMLButtonElement;
        button.classList.add("disabledBtn");
        const poll = document.querySelector(".poll") as HTMLFormElement;
        poll.classList.add("disabledPoll");
        const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
        options.forEach((option) => {
            option.disabled = true;
        });
    }


    return (
        <div className="pollForm">
            <div className="pollQuestion">{currentSlide.question}</div>
            <div className="pollOptions">
                <form className="poll" onSubmit={(e) => {
                    onSubmit(e);
                }}>
                    <div className="scrollWrapper">
                        <div className="optionList">
                            {currentSlide.votes.map(vote => {
                                return (
                                    <div className={`pollSingleOption ${choice === vote.idx ? "active" : ""}`} key={vote.idx}>
                                        <label className="pollLabel">
                                            <input
                                                type="radio"
                                                value={vote.idx}
                                                name={`option_${vote.idx}`}
                                                checked={choice === vote.idx}
                                                onChange={(e) => {
                                                    handleOptionChange(e);
                                                }}
                                                className="pollSingleOptionInput"
                                            />
                                            {vote.option}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="submitArea">
                        <button className="submitBtn" type="submit">
                            Ответить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PollForm