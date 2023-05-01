import React, { useEffect, useRef, useState, type FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import PollForm from "../../components/pollForm/PollForm";
import { api, domain } from "../../config/api.config";
import { type Emotions, type SingleSlideData } from "../../types";
import { calculateDemonstrationScale, csrf, debounce, } from "../../utils/utils";
import { useWindowSize } from "../Presentation";
import './demonstration.css';
import QuestionPanel from "../../components/questionPanel/QuestionPanel";
import { CSSTransition } from "react-transition-group";

const demEmptySlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "empty",
    type: "",
    quizId: 0,
    fontSize: "",
    question: "",
    votes: [],
    background: "",
    fontColor: "",
    graphColor: "",
    answerTime: 0,
    answerAfter: false,
    cost: 0,
    extrapts: false,
}

const emptyEmotions = {
    like: 0,
    love: 0,
    laughter: 0,
    surprise: 0,
    sad: 0,
}

const Demonstration: FunctionComponent = () => {
    const updateTime = 3000;
    const questionMax = 100;
    const params = useParams();
    const hash = params.hash;
    const location = useLocation();
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>(demEmptySlide);
    const slideRef = useRef<HTMLDivElement>(null);
    const [screenWidth, screenHeight] = useWindowSize();
    const [slideWidth, setSlideWidth] = useState(0);
    const [slideHeight, setSlideHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [viewMode, setViewMode] = useState(true);
    const [url, setUrl] = useState("");
    const [emotions, setEmotions] = useState<Emotions>({
        like: 0,
        love: 0,
        laughter: 0,
        surprise: 0,
        sad: 0,
    });

    const emotionsRef = useRef(emptyEmotions);

    useEffect(() => {
        emotionsRef.current = emotions;
    }, [emotions]);

    const [isQuestionsPage, setQuestionsPage] = useState(false);
    const isQuestionRef = useRef(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const panelRef = useRef(null);


    const setNewEmotions = (receivedEmotions: Emotions) => {
        let newEmotions = {...emptyEmotions};
        newEmotions.like = Math.max(receivedEmotions.like, emotionsRef.current.like);
        newEmotions.love = Math.max(receivedEmotions.love, emotionsRef.current.love);
        newEmotions.surprise = Math.max(receivedEmotions.surprise, emotionsRef.current.surprise);
        newEmotions.laughter = Math.max(receivedEmotions.laughter, emotionsRef.current.laughter);
        newEmotions.sad = Math.max(receivedEmotions.sad, emotionsRef.current.sad);
        setEmotions(newEmotions);
    }

    const getInfo = async () => {
        const token = await csrf();
        fetch(`${api.getDemonstration}/${hash}`, {
            method: 'GET',
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((slidedata) => {
            if (!isQuestionRef.current) {
                setWidth(slidedata.width);
                setHeight(slidedata.height);
                setUrl(slidedata.url);
                setViewMode(slidedata.viewMode);
                setNewEmotions(slidedata.emotions);
                if (!slidedata.viewMode) {
                    setEmotions(emptyEmotions);
                }
                setCurrentSlide(slidedata.slide);
            }
            setQuestions(slidedata.questions);
        })
        .catch(e => {
            console.error(e);
        });
    };

    const animateButton = (e: any) => {
        e.preventDefault();
        e.target.classList.remove('animate');
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },500);
    };


    useEffect(() => {
        getInfo();
        const id = setInterval(getInfo, updateTime);
        const bubblyButtons = document.getElementsByClassName("clickable");

        for (var i = 0; i < bubblyButtons.length; i++) {
            bubblyButtons[i].addEventListener('click', animateButton, false);
        }
        return () => {
            clearInterval(id);
        }
    }, []);

    useEffect(() => {
        const {sWidth, sHeight} = calculateDemonstrationScale(screenWidth, screenHeight, width, height);
        setSlideWidth(sWidth);
        setSlideHeight(sHeight);
    }, [screenWidth, screenHeight, width, height]);

    useEffect(() => {
        if (isQuestionRef.current) {
            return;
        }
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.name) {
                slideRef.current.style.backgroundImage = `url(${domain}${url}${currentSlide.name})`;
            } else if (currentSlide.idx >=0) {
                slideRef.current.style.backgroundColor = "#CECECE";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }
        } else if ((currentSlide?.kind === "question" || currentSlide?.answerTime !== 0) && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            slideRef.current.style.backgroundImage = `none`;
        }
    }, [currentSlide]);

    const updateReactions = async (reactions: Emotions) => {
        const token = await csrf();
        fetch(`${api.reactionUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                hash: hash,
                emotions: reactions
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const debounced = debounce(updateReactions, 400);

    const askQuestion = async (idx: number, question: string) => {
        const token = await csrf();
        fetch(`${api.askQuestion}`, {
            method: 'PUT',
            body: JSON.stringify({
                hash: hash,
                question: {
                    question: question,
                    idx: idx,
                    likes: 1,
                }
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        if (!viewMode) {
            const user = window.localStorage.getItem("user");
            window.localStorage.clear();
            if (user)
                window.localStorage.setItem("user", user);
        }
    }, [viewMode]);

    return (
        <div className="demonstrationPage">
            <CSSTransition
                in={!isQuestionsPage}
                timeout={900}
                classNames={"questionPanelAnimated"}
            >
                <div className={`demonstration`}>
                    <div className="demonstrationLogo invitationLogo">
                        <NavLink className="invitationLogoImg" to="/"/>
                        <div className="invitationLogoText">Kinda Slides</div>
                    </div>
                    {currentSlide?.kind === "slide" &&  <CSSTransition
                        in={!isQuestionsPage && currentSlide?.kind === "slide" && viewMode}
                        timeout={900}
                        classNames={"questionPanelAnimated"}
                        unmountOnExit
                    >
                        <div className="demonstrationSlide" style={{
                                height: `${slideHeight}px`,
                                width: `${slideWidth}px`
                            }} ref={slideRef}>
                        </div>
                    </CSSTransition>}
                    {/* {!isQuestionsPage && currentSlide?.kind !== "question" && viewMode &&
                    <div className="demonstrationSlide" style={{
                                height: `${slideHeight}px`,
                                width: `${slideWidth}px`
                            }} ref={slideRef}>
                    </div>} */}
                    <CSSTransition
                        in={!viewMode}
                        timeout={900}
                        classNames={"questionPanelAnimated"}
                        unmountOnExit
                    >
                        <div className="demonstrationSorry">
                            Данная презентация сейчас не демонстрируется!
                        </div>
                    </CSSTransition>
                    <CSSTransition
                        in={!!(!isQuestionsPage && ((currentSlide?.kind === "question" && currentSlide.type) || currentSlide?.answerTime !== 0))}
                        timeout={900}
                        classNames={"questionPanelAnimated"}
                        unmountOnExit
                    >
                        <PollForm hash={hash as string} currentSlide={currentSlide}/>
                    </CSSTransition>
                    {/* {!isQuestionsPage && ((currentSlide?.kind === "question" && currentSlide.type) || currentSlide?.answerTime !== 0) ?
                        <PollForm currentSlide={currentSlide}/>
                        : null} */}
                    <div className="bottomArea">
                        <div className="reactions">
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon likeIcon clickable"
                                onClick={() => {
                                    const newEmotions = {...emotions, like: emotions.like + 1};
                                    const emotionsToSend = {...emptyEmotions, like: 1};
                                    setEmotions(newEmotions);
                                    debounced(emotionsToSend);
                                }}/>
                                {emotions?.like}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon loveIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, love: emotions.love + 1}
                                        const emotionsToSend = {...emptyEmotions, love: 1}
                                        setEmotions(newEmotions);
                                        debounced(emotionsToSend);
                                    }}/>
                                {emotions?.love}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon laughterIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, laughter: emotions.laughter + 1};
                                        const emotionsToSend = {...emptyEmotions, laughter: 1}
                                        setEmotions(newEmotions);
                                        debounced(emotionsToSend);
                                    }}/>
                                {emotions?.laughter}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon surpriseIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, surprise: emotions.surprise + 1}
                                        const emotionsToSend = {...emptyEmotions, surprise: 1}
                                        setEmotions(newEmotions);
                                        debounced(emotionsToSend);
                                    }}/>
                                {emotions?.surprise}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon sadIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, sad: emotions.sad + 1};
                                        const emotionsToSend = {...emptyEmotions, sad: 1}
                                        setEmotions(newEmotions);
                                        debounced(emotionsToSend);
                                    }}/>
                                {emotions?.sad}
                            </div>
                        </div>
                        <div className="invitationWrapper" onClick={() => {
                            if (isQuestionsPage) {
                                const input = document.querySelector(".questionInputElement") as HTMLTextAreaElement;
                                // TODO send value to server
                            }
                            setQuestionsPage(o => !o);
                            isQuestionRef.current = !isQuestionRef.current;
                        }}>
                            <div className="askQuestionBtn">Задать вопрос</div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                in={isQuestionsPage}
                timeout={900}
                classNames={"questionPanelAnimated"}
                unmountOnExit
            >
                <div className="questionPage">
                    <div className="demonstrationLogo invitationLogo">
                        <NavLink className="invitationLogoImg" to="/"/>
                        <div className="invitationLogoText">Kinda Slides</div>
                    </div>
                    <QuestionPanel questions={questions}/>
                    <div className="askQuestionWrapper">
                            <div className="askQuestionInvitation">Ваш вопрос:</div>
                            <div className="questionInputWrapper">
                                <textarea
                                    placeholder="Как вам удалось создать такую презентацию?"
                                    maxLength={questionMax}
                                    className="questionInputElement"
                                    onChange={(e) => {
                                        const left = document.querySelector(".questionCharLeft");
                                        (left?.firstChild as any).data = `${questionMax - e.target.value.length}`;
                                    }}
                                />
                                <div className="questionCharLeft">100</div>
                            </div>
                            <div className="invitationWrapper">
                                <div className="askQuestionBtn goBackBtn" onClick={() => {
                                    setQuestionsPage(false);
                                    isQuestionRef.current = false;
                                }}>
                                    <div className="goBackBtnIcon"/>
                                </div>
                                <div className="askQuestionBtn" onClick={() => {
                                if (isQuestionsPage) {
                                    const input = document.querySelector(".questionInputElement") as HTMLTextAreaElement;
                                    if (input.value) {
                                        const newIdx = !questions.length ? 0 : Math.max(...(questions.map(q => {return q?.idx}))) + 1
                                        askQuestion(newIdx, input.value);
                                        window.localStorage.setItem(input.value, "liked");
                                    }
                                }
                                setQuestionsPage(false);
                                isQuestionRef.current = false;
                            }}>Спросить</div>
                            </div>
                        </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default Demonstration;