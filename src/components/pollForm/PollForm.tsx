import React, { useEffect, useRef, useState } from "react";
import type { SingleSlideData } from "../../types";
import './pollForm.css';
// import Poll from './poll';//'react-polls';//'./poll';
import { LeafPoll } from 'react-leaf-polls'
import { api } from "../../config/api.config";
import { csrf, getQuizPlayer, setQuizPlayerToLocal } from "../../utils/utils";
import { CSSTransition } from "react-transition-group";

type PollFormProps = {
    hash: string;
    currentSlide: SingleSlideData;
}

const customTheme = {
  textColor: 'black',
  mainColor: '#00B87B',
  backgroundColor: 'rgb(255,255,255)',
  alignment: 'center'
}

const PollForm = (props: PollFormProps) => {
    const {currentSlide, hash} = props;
    const [choice, setChoice] = useState(-1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [quizPlayer, setQuizPlayer] = useState({
        quizPlayerId: 0,
        quizPlayerName: ""
    });
    const [isLogRequired, setLogRequired] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleOptionChange = (e: any) => {
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

    const updateUser = () => {
        if (currentSlide.answerTime !== 0 && !quizPlayer.quizPlayerName) {
            const localPlayer = getQuizPlayer();
            if (localPlayer?.quizPlayerName) {
                setQuizPlayer(localPlayer);
            } else {
                setLogRequired(true);
            }
        }
    }

    useEffect(() => {
        if (prevCurrentSlide.idx !== currentSlide.idx) {
            setChoice(-1);
            checkLocalStorage();
            const button = document.querySelector(".submitBtn") as HTMLButtonElement;
            button?.classList.remove("disabledBtn");
            const poll = document.querySelector(".poll") as HTMLFormElement;
            poll?.classList.remove("disabledPoll");
            const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
            options?.forEach((option) => {
                option.disabled = false;
            });
        }
        if (!quizPlayer.quizPlayerName && currentSlide.answerTime !== 0) {
            updateUser();
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
                user: quizPlayer.quizPlayerName,
                userId: quizPlayer.quizPlayerId,
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
        button?.classList.add("disabledBtn");
        const poll = document.querySelector(".poll") as HTMLFormElement;
        poll?.classList.add("disabledPoll");
        const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
        options?.forEach((option) => {
            option.disabled = true;
        });
    }

    const enable = () => {
        const button = document.querySelector(".submitBtn") as HTMLButtonElement;
        button?.classList.remove("disabledBtn");
        const poll = document.querySelector(".poll") as HTMLFormElement;
        poll?.classList.remove("disabledPoll");
        const options = document.querySelectorAll(".pollSingleOptionInput") as NodeListOf<HTMLInputElement>;
        options?.forEach((option) => {
            option.disabled = false;
        });
    }

    const registerQuizPlayer = async (playerName: string) => {
        const token = await csrf();
        fetch(`${api.registerQuizPlayer}`, {
            method: 'POST',
            body: JSON.stringify({
                name: playerName,
                hash: hash,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        }).then(parsed => {
            setQuizPlayer({
                quizPlayerId: parsed.id,
                quizPlayerName: playerName
            });
            setQuizPlayerToLocal(parsed.id,playerName);
            setInputValue("");
            setLogRequired(false);
        })
        .catch(e => {
            console.error(e);
        });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (isLogRequired ) {
            if (inputValue) {
                registerQuizPlayer(inputValue);
            }
            return;
        }
        if (choice < 0 || isDisabled) return;
        voteHandler();
        window.localStorage.setItem(`${currentSlide.question}`, JSON.stringify({
            value: choice
        }));
        setIsDisabled(true);
    }


    return (
        <div className="pollForm">
            <CSSTransition
                in={isLogRequired}
                timeout={0}
                classNames={"questionPanelAnimated"}
                unmountOnExit
            >
                <>
                <div className={`pollQuestion logTitle`}>Пожалуйста, введите своё имя</div>
                <div className="pollOptions">
                    <form className="poll" onSubmit={(e) => {
                        onSubmit(e);
                    }}>
                        <div className="quizPlayerInputBlock">
                            <input
                                type="text"
                                name="quizPlayerInput"
                                placeholder="Как Вас зовут?"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value.replace(new RegExp(`[^a-zA-Za-åa-ö-w-я 0-9/]`), ""));
                                }}
                                className="quizPlayerInput"
                                maxLength={20}
                            />
                            <div className="quizPlayerExplanation">
                                Данное имя будет использоваться для участия в опросах до конца демонстрации
                            </div>
                        </div>
                        <div className="submitArea">
                            <button className="submitBtn" type="submit">
                                Продолжить
                            </button>
                        </div>
                    </form>
                </div>
                </>
            </CSSTransition>
            <CSSTransition
                in={!isLogRequired}
                timeout={900}
                classNames={"questionPanelAnimated"}
                unmountOnExit
            >
                <>
                <div className={`pollQuestion`}>{currentSlide.question}</div>
                <div className="pollOptions">
                    <form className="poll" onSubmit={(e) => {
                        onSubmit(e);
                    }}>
                        <CSSTransition
                            in={isLogRequired}
                            timeout={900}
                            classNames={"questionPanelAnimated"}
                            unmountOnExit
                        >
                            <div className="quizPlayerInputBlock">
                                <input
                                    type="text"
                                    name="quizPlayerInput"
                                    placeholder="Как Вас зовут?"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value.replace(new RegExp(`[^a-zA-Za-åa-ö-w-я 0-9/]`), ""));
                                    }}
                                    className="quizPlayerInput"
                                    maxLength={20}
                                />
                                <div className="quizPlayerExplanation">
                                    Данное имя будет использоваться для участия в опросах до конца демонстрации
                                </div>
                            </div>
                        </CSSTransition>
                        {!isLogRequired && <CSSTransition
                            in={!isLogRequired}
                            timeout={900}
                            classNames={"questionPanelAnimated"}
                            unmountOnExit
                        >
                            <div className="scrollWrapper">
                                <div className="optionList">
                                    {(currentSlide.kind === "question" || (currentSlide.kind === "quiz" && !currentSlide.runout)) && currentSlide.votes?.map(vote => {
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
                        </CSSTransition>}
                        <div className="submitArea">
                            {(currentSlide.kind === "question" || (currentSlide.kind === "quiz" && !currentSlide.runout)) && <button className="submitBtn" type="submit">
                                {isLogRequired ? "Продолжить" : "Ответить"}
                            </button>}
                        </div>
                    </form>
                    {isDisabled && <div className="thanksText">
                        Спасибо! Ваш голос будет учтён
                    </div>}
                </div>
                </>
            </CSSTransition>
        </div>
    );
}

export default PollForm