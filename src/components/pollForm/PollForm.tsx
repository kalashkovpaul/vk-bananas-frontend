import React, { useEffect, useRef, useState } from "react";
import type { SingleSlideData } from "../../types";
import './pollForm.css';
// import Poll from './poll';//'react-polls';//'./poll';
import { LeafPoll } from 'react-leaf-polls'
import { api } from "../../config/api.config";
import { csrf } from "../../utils/utils";

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
    const [isDisabled, setIsDisabled] = useState(false);

    const handleOptionChange = (e: any) => {
        console.log(e.target.disabled);
        setChoice(+e.target.value);
    }

    const checkLocalStorage = () => {
        const json = window.localStorage.getItem(`${currentSlide.question}`);
        if (json) {
            const value = JSON.parse(json).value;
            setChoice(value);
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
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
        checkLocalStorage();
    }, []);

    useEffect(() => {
        if (prevCurrentSlide.idx !== currentSlide.idx) {
            setChoice(-1);
            checkLocalStorage();
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

    useEffect(() => {
        if (isDisabled) {
            disable();
        } else {
            enable();
        }
    }, [isDisabled]);

    const voteHandler = async () => {
        const token = await csrf();
        fetch(`${api.votePoll}`, {
            method: 'PUT',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                idx: choice,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const disable = () => {
        const button = document.querySelector(".submitBtn") as HTMLButtonElement;
        button.classList.add("disabledBtn");
        const poll = document.querySelector(".poll") as HTMLFormElement;
        poll.classList.add("disabledPoll");
        const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
        options.forEach((option) => {
            option.disabled = true;
        });
    }

    const enable = () => {
        const button = document.querySelector(".submitBtn") as HTMLButtonElement;
        button.classList.remove("disabledBtn");
        const poll = document.querySelector(".poll") as HTMLFormElement;
        poll.classList.remove("disabledPoll");
        const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
        options.forEach((option) => {
            option.disabled = false;
        });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (choice < 0 || isDisabled) return;
        voteHandler();
        window.localStorage.setItem(`${currentSlide.question}`, JSON.stringify({
            value: choice
        }));
        setIsDisabled(true);
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
                {isDisabled && <div className="thanksText">
                    Спасибо! Ваш голос будет учтён
                </div>}
            </div>
        </div>
    );
}

export default PollForm