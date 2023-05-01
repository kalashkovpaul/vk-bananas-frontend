import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import './presentation.css';
import './quiz.sass';
import Sidebar from "../../components/sidebar/Sidebar";
import QuizEditor from "../../components/quizEditor/QuizEditor";
import { OptionData, PresData, SingleSlideData, leaderboardData } from "../../types";
import { getRouteMetaInfo } from '../../config/routes.config';
import { MetaInfo } from "../../components";

import CustomBar from "./CustomBar";
import PresentationBar from "../../components/presentationBar/PresentationBar";
import { api, domain } from "../../config/api.config";
import { useParams, useSearchParams } from "react-router-dom";
import { calculateMiniScale, calculateScale, clearData, csrf } from "../../utils/utils";
import InvitationBar from "../../components/invitationBar/InvitationBar";
import ReactionBar from "../../components/reactionBar/ReactionBar";
import QuestionSlide from "../../components/questionSlide/QuestionSlide";
import { fakeQuestions } from "./fakeData";
import Timer from "../../components/timer/Timer";
import Leaderboard from "../../components/leaderbord/Leaderboard";
import { CSSTransition } from "react-transition-group";

const emptySlide: SingleSlideData = {
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
    answerTime: 0,
    answerAfter: false,
    cost: 0,
    extrapts: false,
}

const newQuestionSlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "userQuestion",
    type: "",
    quizId: 0,
    fontSize: "",
    question: "Вопросы:",
    votes: [],
    background: "white",
    fontColor: "black",
    graphColor: "black",
    answerTime: 0,
    answerAfter: false,
    cost: 0,
    extrapts: false,
}

const newPoll: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "question",
    type: "vertical",
    quizId: 0,
    fontSize: "",
    question: "",
    votes: [],
    background: "white",
    fontColor: "black",
    graphColor: "black",
    answerTime: 0,
    answerAfter: false,
    cost: 0,
    extrapts: false,
}

const newQuiz: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "quiz",
    type: "",
    quizId: 0,
    fontSize: "",
    question: "",
    votes: [],
    background: "white",
    fontColor: "black",
    graphColor: "black",
    answerTime: 60,
    answerAfter: true,
    cost: 100,
    extrapts: false,
}

export function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const Presentation: FunctionComponent = (props: any) => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const presId = params.id ? +params.id : 0;
    const updateTime = 1000;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>(emptySlide);
    const [data, setPresData] = useState<PresData>({
        url: "",
        name: "New presentation",
        emotions: {
            like: 0,
            love: 0,
            laughter: 0,
            surprise: 0,
            sad: 0,
        },
        slideNum: 0,
        quizNum: 0,
        width: 0,
        height: 0,
        slides: [],
        code: "",
        hash: ""
    });
    const slideRef = useRef<HTMLDivElement>(null);
    const cur = useRef<SingleSlideData>();
    const [screenWidth, screenHeight] = useWindowSize();
    const [slideWidth, setSlideWidth] = useState(0);
    const [slideHeight, setSlideHeight] = useState(0);
    const [miniSlideWidth, setMiniSlideWidth] = useState(0);
    const [miniSlideHeight, setMiniSlideHeight] = useState(0);
    const [timerId, setTimerId] = useState(0);
    const [emotions, setEmotions] = useState({
        like: 0,
        love: 0,
        laughter: 0,
        surprise: 0,
        sad: 0,
    });
    const [questions, setQuestions] = useState<any[]>(fakeQuestions);

    const [isDemonstration, setIsDemonstration] = useState(false);
    const [quizMap, setQuizMap] = useState(new Map());
    const [isShowResult, setShowResult] = useState(false);
    const [isLeaderboard, setLeaderboard] = useState(false);
    const currentLeaderboardData = useRef<leaderboardData>([]);

    useEffect(() => {
        const {width, height} = calculateScale(isDemonstration as any, screenWidth, screenHeight, data.width, data.height);
        setSlideWidth(width);
        setSlideHeight(height);
        const {mWidth, mHeight} = calculateMiniScale(screenWidth, screenHeight, data.width, data.height);
        setMiniSlideWidth(mWidth);
        setMiniSlideHeight(mHeight);
    }, [isDemonstration, screenWidth, screenHeight, data]);

    const usePreviousSlide = (value: any) => {
        const prevSlideRef = useRef<any>(value);
          useEffect(() => {
                prevSlideRef.current = value;
          })
          return prevSlideRef.current
    };

    const previousSlide = usePreviousSlide(currentSlide);

    const onOptionChange = (index: number, value: string, color: string, correct=false) => {
        let newoptions;
        if (value || color) {
            newoptions = JSON.parse(JSON.stringify(cur.current?.votes));
            if (newoptions.length === 0) {
                onOptionCreate(0, currentSlide.quizId);
            }
            if (newoptions[index]) {
                newoptions[index].option = value;
                newoptions[index].color = color;
                newoptions[index].correct = correct;
            } else if (value) {
                newoptions[index] = {
                    option: value,
                    votes: 1,
                    color: color,
                    idx: index,
                    correct: correct,
                }
            }
            onOptionUpdate(newoptions);
        } else {
            newoptions = [];
            cur.current?.votes.forEach((option, i) => {
                if (i !== index) {
                    newoptions.push(option);
                }
            });
            onOptionDelete(index);
        }

        setCurrentSlide({
            ...(cur.current as SingleSlideData),
            votes: newoptions,
        });
    };

    const checkDemonstration = async () => {
        const token = await csrf();
        fetch(`${api.getDemonstration}/${data.hash}`, {
            method: 'GET',
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((slidedata) => {
            if (slidedata.viewMode) {
                if ((cur.current?.kind === "question")
                    && cur.current?.idx === slidedata.slide.idx) {
                        setCurrentSlide(slidedata.slide);
                    }
                if ((cur.current?.answerTime !== 0)
                    && cur.current?.idx === slidedata.slide.idx
                    && slidedata.slide.answerAfter && slidedata.slide.runout) {
                        // setLeaderboard(true);
                        setShowResult(true);
                    }
                setQuestions(slidedata.questions);
                setEmotions(slidedata.emotions);
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        cur.current = currentSlide;
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.name) {
                slideRef.current.style.backgroundImage = `url(${domain}${data.url}${currentSlide.name})`;
            } else if (currentSlide.idx >=0) {
                slideRef.current.style.backgroundColor = "#fff";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }

        } else if ((currentSlide?.kind === "question" || currentSlide?.kind === "userQuestion" || currentSlide?.answerTime !== 0) && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            slideRef.current.style.backgroundImage = `none`;
            if (currentIndex === previousSlide.idx && !isDemonstration)
                onSlideChange();
        }
        setShowResult(false);
        setLeaderboard(false);
        if (isDemonstration && quizMap.get(currentSlide.quizId)) {
            // setLeaderboard(true);
            setShowResult(true);
        }
    }, [currentSlide]);

    const getPresentation = async() => {
        const token = await csrf();
        fetch(`${api.getPres}/${presId}`, {
            method: 'GET',
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((presdata) => {
            let newdata = presdata?.pres;
            if (newdata) {
                newdata?.slides.push({
                    ...newQuestionSlide,
                    idx: newdata.slides.length,
                });
                if (newdata.slides?.length) {
                    setPresData(clearData(newdata));
                    if (newdata.emotions)
                        setEmotions(newdata.emotions);
                }
                if (searchParams.get("isDemonstration")) {
                    window.history.replaceState(`/presentation/${presId}`, "", `/presentation/${presId}`);
                    demonstrate();
                }
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        getPresentation();
        clearVotes();
    }, []);


    useEffect(() => {
        if (currentIndex >= 0 && currentIndex <= data.slides.length) {
            let newslides = data.slides;
            if (newslides.length) {
                newslides[previousSlide.idx] = currentSlide;
                setPresData({
                    ...data,
                    slides: newslides,
                })
            }
            setCurrentSlide(data.slides[currentIndex]);
        } else {
            console.error("Current index error");
        }
    }, [currentIndex]);

    const onSlideDelete = async () => {
        const token = await csrf();
        let newSlides: Array<SingleSlideData> = [];
        data?.slides.forEach((slide) => {
            if (slide.idx < currentIndex) {
                newSlides.push(slide);
            } else if (slide.idx > currentIndex) {
                newSlides.push({...slide, idx: slide.idx - 1});
            }
        });

        fetch(`${api.quizDelete}`, {
            method: 'POST',
            body: JSON.stringify({
                creatorId: 1,
                presId: presId,
                quizId: currentSlide.quizId
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });

        setPresData({
            ...data,
            slides: newSlides
        });
    };

    const onOptionCreate = async (index: number, quizId: number = currentSlide.quizId) => {
        const token = await csrf();
        fetch(`${api.voteCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: quizId,
                idx: index,
                option: "",
                votes: 1,
                correct: false,
                color: "#0FD400"
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onOptionDelete = async (index: number) => {
        const token = await csrf();
        fetch(`${api.voteDelete}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                idx: index,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onOptionUpdate = async (newoptions: Array<OptionData>) => {
        const token = await csrf();
        fetch(`${api.voteUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                votes: newoptions,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onSlideChange = async () => {
        const token = await csrf();
        fetch(`${api.quizUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                presId: presId,
                idx: currentIndex,
                type: currentSlide.type,
                question: currentSlide.question,
                background: currentSlide.background,
                fontColor: currentSlide.fontColor,
                fontSize: currentSlide.fontSize,
                graphColor: currentSlide.graphColor,
                answerTime: currentSlide.answerTime,
                answerAfter: currentSlide.answerAfter,
                cost: currentSlide.cost,
                extrapts: currentSlide.extrapts,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        if (currentIndex < data.slides.length) {
            setCurrentSlide(data.slides[currentIndex]);
        } else if (data.slides.length === 0) {
            setCurrentSlide(emptySlide);
        }
    }, [data]);


    const onCreatePoll = async () => {
        let newSlides: Array<SingleSlideData> = [];
        data.slides.forEach((slide) => {
            if (slide.idx < currentIndex) {
                newSlides.push(slide);
            } else if (slide.idx === currentIndex) {
                newSlides.push(slide);
                newSlides.push({...newPoll, idx: currentIndex + 1})
            } else {
                newSlides.push({...slide, idx: slide.idx + 1});
            }
        });

        const token = await csrf();
        fetch(`${api.pollCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                presId: presId,
                idx: currentIndex + 1,
                type: newPoll.type,
                question: newPoll.question,
                votes: [],
                background: newPoll.background,
                fontColor: newPoll.fontColor,
                fontSize: newPoll.fontSize,
                graphColor: newPoll.graphColor,
                answerTime: 0,
                answerAfter: false,
                cost: 0,
                extrapts: false,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((response) => {
            newSlides[currentIndex + 1].quizId = response?.quizId;
            setPresData({
                ...data,
                slides: newSlides
            });
        }).catch(e => {
            console.error(e);
        });
    }

    const onCreateQuiz = async () => {
        let newSlides: Array<SingleSlideData> = [];
        data.slides.forEach((slide) => {
            if (slide.idx < currentIndex) {
                newSlides.push(slide);
            } else if (slide.idx === currentIndex) {
                newSlides.push(slide);
                newSlides.push({...newQuiz, idx: currentIndex + 1})
            } else {
                newSlides.push({...slide, idx: slide.idx + 1});
            }
        });

        const token = await csrf();
        fetch(`${api.quizCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                presId: presId,
                idx: currentIndex + 1,
                type: newQuiz.type,
                question: newQuiz.question,
                votes: [],
                background: newQuiz.background,
                fontColor: newQuiz.fontColor,
                fontSize: newQuiz.fontSize,
                graphColor: newQuiz.graphColor,
                answerTime: 60,
                answerAfter: true,
                cost: 100,
                extrapts: false,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((response) => {
            newSlides[currentIndex + 1].quizId = response?.quizId;
            setPresData({
                ...data,
                slides: newSlides
            });
        }).catch(e => {
            console.error(e);
        });
    }

    const demonstrate = () => {
        const slidebox = document.querySelector(".slideBox");
        if (slidebox) {
            slidebox.requestFullscreen();
        }
    }

    const showGo = async (index: number) => {
        const slide = document.querySelector(".slide") as HTMLDivElement;
        const isFullscreen = window.innerWidth - slide.offsetWidth < 100;
        if ((isFullscreen || isDemonstration) && data.slides[index]?.kind !== "userQuestion") {
            const token = await csrf();
            fetch(`${api.showGo}/${presId}/show/go/${index}`, {
                method: 'PUT',
                headers: {
                    "X-CSRF-Token": token as string,
                }
            })
            .catch(e => {
                console.error(e);
            });
        }
    }

    const showStop = async () => {
        const token = await csrf();
        fetch(`${api.showStop}/${presId}/show/stop`, {
            method: 'PUT',
            headers: {
                "X-CSRF-Token": token as string,
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    const createQuestionSlide = () => {
        let newslides = data.slides;
        newslides.push({
            ...newQuestionSlide,
            idx: data.slides.length,
        });
        setPresData({...data, slides: newslides});
    }

    const deleteQuestionSlide = () => {
        let newslides = data.slides;
        const last = newslides.pop() as SingleSlideData;
        if (last.kind !== "userQuestion")
            newslides.push(last);
        setPresData({...data, slides: newslides});
    }

    useEffect(() =>{
        setShowResult(false);
        if (isDemonstration) {
            setLeaderboard(false);
            window.screen.orientation.lock("landscape").then().catch(e => {});
            showGo(currentIndex);
            if (timerId === 0) {
                const id = window.setInterval(checkDemonstration, updateTime);
                setTimerId(id);
            }

        } else {
            window.screen.orientation.unlock();
            showStop();
            document.getElementById("popup-root")?.remove();
            window.clearInterval(timerId);
            setTimerId(0);
            setLeaderboard(false);
            setShowResult(false);
            clearVotes();
        }
    }, [isDemonstration]);

    const screenChangeHandler = (e: any) => {
        document.getElementById("popup-root")?.remove();
        setIsDemonstration(!!document.fullscreenElement);
    }

    useEffect(() => {
        document.addEventListener("fullscreenchange", screenChangeHandler)
        return () => {
            document.removeEventListener("fullscreenchange", screenChangeHandler)
        }
    }, [screenWidth, screenHeight]);

    const startTimer = async () => {
        const token = await csrf();
        fetch(`${api.timerStart}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                presId: presId,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const endTimer = async () => {
        const token = await csrf();
        fetch(`${api.timerEnd}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                presId: presId,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onTimerStart = () => {
        startTimer();
    }

    useEffect(() => {
        if (isShowResult) {
            // setTimeout(() => {
            //     setLeaderboard(true);
            // }, 1000);
        }
    }, [isShowResult]);

    const onTimerEnd = () => {
        endTimer();
        if (currentSlide.answerAfter && isDemonstration) {
            // setLeaderboard(true);
            console.log("Took");
            setShowResult(true);
        }
    }

    const getQuizResult = async() => {
        const token = await csrf();
        fetch(`${api.getQuizResult}/${presId}/result`, {
            method: 'GET',
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((parsed) => {
            if (parsed?.top) {
                setQuizMap(new Map(quizMap.set(currentSlide.quizId, parsed.top)));
                currentLeaderboardData.current = parsed.top;
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        if (isLeaderboard) {
            if (!quizMap.get(currentSlide.quizId)) {
                getQuizResult();
            }
        }
    }, [isLeaderboard]);

    const clearVotes = () => {
        setPresData({
            ...data,
            slides: data.slides.map((slide, i) => {
                return {
                    ...slide,
                    votes: (slide.votes === null) ? [] : slide.votes.map((vote, j) => {
                        return {
                            ...vote,
                            votes: 1,
                        }
                    }),
                }
            })
        })
    }


    return (
        <div className="presentation view-wrapper">
            <PresentationBar
                onDelete={onSlideDelete}
                onCreatePoll={onCreatePoll}
                onCreateQuiz={onCreateQuiz}
                onDemonstrate={demonstrate}
                hash={data.hash}
                code={data.code}
            />
            <div className="contents">
                <MetaInfo {...getRouteMetaInfo('About')} />
                <Sidebar
                    data={data}
                    setCurrentIndex={setCurrentIndex}
                    currentSlide={currentSlide}
                    width={miniSlideWidth}
                    height={miniSlideHeight}
                    showGo={showGo}
                    isDemonstration={isDemonstration}
                />
                <div className="slideBox" style={{
                        height: `${slideHeight + 50}px`,
                    }}>
                    {isDemonstration &&
                        <InvitationBar code={data.code} hash={data.hash}/>}
                    <div className="slide" style={{
                        height: `${slideHeight}px`,
                        width: `${slideWidth}px`
                    }} ref={slideRef}>
                        {/* TODO: reactionBar */}
                        {currentSlide?.kind === "question" && currentSlide.type ?
                            <CustomBar
                                width={slideHeight * 1.4 }
                                height={slideHeight * 0.7}
                                top={slideHeight*0.2}
                                left={(slideWidth - slideHeight*1.4) / 2}
                                kind={currentSlide.type}
                                slide={currentSlide}

                            />
                            : null}
                        {currentSlide?.kind === "userQuestion" &&
                            <QuestionSlide
                                width={slideWidth - 180}
                                height={isDemonstration ? slideHeight - 140 : slideHeight + 20}
                                questions={questions}
                                slide={currentSlide}
                            />}
                        {currentSlide?.answerTime !== 0 &&
                            <>
                                {!isLeaderboard && <div className="quizQuestion" style={{color: currentSlide.fontColor,}}>
                                    {currentSlide.question}
                                </div>}
                                {!isLeaderboard && <div
                                    className="quizVoteWrapper"
                                    style={{
                                        gridTemplateColumns: currentSlide.votes.length < 4 ? `repeat(auto-fill, minmax(75px, ${100 / currentSlide.votes.length}%))` : ""
                                    }}
                                >
                                    {
                                        currentSlide.votes.map((vote, i) => {
                                            return i < 8 ? (
                                                <div key={vote.idx} className="quizVote">
                                                    <div className="quizVoteText">{vote.option}</div>
                                                    {((isShowResult || !isDemonstration) && vote.correct) && <svg className="voteIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                                            <circle className="path circle" fill="none" stroke="#008F00" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                                            <polyline className="path check" fill="none" stroke="#008F00" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                                                        </svg>}
                                                    {!((isShowResult || !isDemonstration)) && <div style={{
                                                        width: "30px",
                                                        height: "30px",
                                                    }}/>}
                                                    {((isShowResult || !isDemonstration) && !vote.correct) && <svg className="voteIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                                        <circle className="path circle" fill="none" stroke="#FF1600" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                                        <line className="path line" fill="none" stroke="#FF1600" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                                                        <line className="path line" fill="none" stroke="#FF1600" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                                                    </svg>}
                                                </div>
                                            ) : null;
                                        })
                                    }
                                </div>}
                                {isShowResult && !isLeaderboard && <div className="toLeaderboard effect-underline" onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLeaderboard(true);
                                }}>
                                    К результатам
                                </div>}
                                {!isLeaderboard && <Timer
                                    limit={currentSlide.answerTime}
                                    isDemonstration={isDemonstration}
                                    onTimerStart={onTimerStart}
                                    onTimerEnd={onTimerEnd}
                                />}
                                <CSSTransition
                                    in={!!(isLeaderboard)}
                                    timeout={900}
                                    classNames={"questionPanelAnimated"}
                                    unmountOnExit
                                >
                                    <Leaderboard
                                        data={currentLeaderboardData.current}
                                        width={slideHeight * 1.6 }
                                        height={slideHeight * 0.8}
                                        top={slideHeight*0.1}
                                        left={(slideWidth - slideHeight*1.6) / 2}
                                    />
                                </CSSTransition>
                            </>
                        }
                    </div>
                    {isDemonstration &&
                        <ReactionBar emotions={emotions}/>}
                </div>
                <QuizEditor
                    setCurrentSlide={setCurrentSlide}
                    currentSlide={currentSlide}
                    onOptionUpdate={onOptionChange}
                    onOptionCreate={onOptionCreate}
                />
            </div>
        </div>
    );
}

export default Presentation;