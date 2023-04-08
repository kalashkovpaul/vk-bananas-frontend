import React, { useEffect, useRef, useState, type FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import PollForm from "../../components/pollForm/PollForm";
import { api, domain } from "../../config/api.config";
import { type Emotions, type SingleSlideData } from "../../types";
import { calculateDemonstrationScale, } from "../../utils/utils";
import { useWindowSize } from "../Presentation";
import { CustomBar } from "../Presentation/CustomBar";
import './demonstration.css';
import QuestionPanel from "../../components/questionPanel/QuestionPanel";
import { CSSTransition } from "react-transition-group";

const demEmptySlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "slide",
    type: "",
    quizId: 0,
    fontSize: "",
    question: "",
    votes: [],
    background: "",
    fontColor: "",
    graphColor: "",
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

    const [isQuestionsPage, setQuestionsPage] = useState(false);
    const isQuestionRef = useRef(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const panelRef = useRef(null);

    const getInfo = () => {
        fetch(`${api.getDemonstration}/${hash}`, {
            method: 'GET',
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((slidedata) => {
            if (!isQuestionRef.current) {
                setWidth(slidedata.width);
                setHeight(slidedata.height);
                setUrl(slidedata.url);
                setViewMode(slidedata.viewMode)
                setEmotions(slidedata.emotions);
                setCurrentSlide(slidedata.slide);
                setQuestions(slidedata.questions);
            }
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
        } else if (currentSlide?.kind === "question" && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            slideRef.current.style.backgroundImage = `none`;
        }
    }, [currentSlide]);

    const updateReactions = (reactions: Emotions) => {
        fetch(`${api.reactionUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                hash: hash,
                emotions: reactions
            }),
            headers: {

            }
        }).catch(e => {
            console.error(e);
        });
    }

    const askQuestion = (idx: number, question: string) => {
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

            }
        }).catch(e => {
            console.error(e);
        });
    }

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
                    <CSSTransition
                        in={!isQuestionsPage && currentSlide?.kind !== "question" && viewMode}
                        timeout={900}
                        classNames={"questionPanelAnimated"}
                    >
                        <div className="demonstrationSlide" style={{
                                height: `${slideHeight}px`,
                                width: `${slideWidth}px`
                            }} ref={slideRef}>
                        </div>
                    </CSSTransition>
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
                    {!isQuestionsPage && currentSlide?.kind === "question" && currentSlide.type ?
                        <PollForm currentSlide={currentSlide}/>
                        : null}
                    <div className="bottomArea">
                        <div className="reactions">
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon likeIcon clickable"
                                onClick={() => {
                                    const newEmotions = {...emotions, like: emotions.like + 1};
                                    setEmotions(newEmotions);
                                    updateReactions(newEmotions);
                                }}/>
                                {emotions?.like}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon loveIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, love: emotions.love + 1}
                                        setEmotions(newEmotions);
                                        updateReactions(newEmotions);
                                    }}/>
                                {emotions?.love}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon laughterIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, laughter: emotions.laughter + 1}
                                        setEmotions(newEmotions);
                                        updateReactions(newEmotions);
                                    }}/>
                                {emotions?.laughter}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon surpriseIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, surprise: emotions.surprise + 1}
                                        setEmotions(newEmotions);
                                        updateReactions(newEmotions);
                                    }}/>
                                {emotions?.surprise}
                            </div>
                            <div className="emotion emotionBtn">
                                <div className="emotionIcon sadIcon clickable"
                                    onClick={() => {
                                        const newEmotions = {...emotions, sad: emotions.sad + 1}
                                        setEmotions(newEmotions);
                                        updateReactions(newEmotions);
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
                                }}>
                                    <div className="goBackBtnIcon"/>
                                </div>
                                <div className="askQuestionBtn" onClick={() => {
                                if (isQuestionsPage) {
                                    const input = document.querySelector(".questionInputElement") as HTMLTextAreaElement;
                                    const newIdx = !questions.length ? 0 : Math.max(...(questions.map(q => {return q?.idx}))) + 1
                                    askQuestion(newIdx, input.value);
                                    window.localStorage.setItem(input.value, "liked");
                                }
                                setQuestionsPage(false);
                                isQuestionRef.current = !isQuestionRef.current;
                            }}>Спросить</div>
                            </div>
                        </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default Demonstration;