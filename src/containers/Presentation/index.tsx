import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import './presentation.css';
import Sidebar from "../../components/sidebar/Sidebar";
import QuizEditor from "../../components/quizEditor/QuizEditor";
import { presData } from "./fakeData";
import type { OptionData, PresData, SingleSlideData } from "../../types";
import { getRouteMetaInfo } from '../../config/routes.config';
import { MetaInfo } from "../../components";

import { CustomBar } from "./CustomBar";
import PresentationBar from "../../components/presentationBar/PresentationBar";
import { api, domain } from "../../config/api.config";
import { useParams } from "react-router-dom";
import { calculateMiniScale, calculateScale } from "../../utils/utils";
import InvitationBar from "../../components/invitationBar/InvitationBar";
import ReactionBar from "../../components/reactionBar/ReactionBar";

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
}

const newSlide: SingleSlideData = {
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

const Presentation: FunctionComponent = () => {
    const params = useParams();
    const presId = params.id ? +params.id : 0;
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

    const [isDemonstration, setDemonstration] = useState(false);

    useEffect(() => {
        const {width, height} = calculateScale(isDemonstration, screenWidth, screenHeight, data.width, data.height);
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

    const onOptionChange = (index: number, value: string, color: string) => {
        // console.log(index, value, color);
        let newoptions;
        if (value || color) {
            newoptions = JSON.parse(JSON.stringify(cur.current?.votes));
            if (newoptions.length === 0) {
                onOptionCreate(0, currentSlide.quizId);
            }
            if (newoptions[index]) {
                newoptions[index].option = value;
                newoptions[index].color = color;
            } else if (value) {
                newoptions[index] = {
                    option: value,
                    votes: 2,
                    color: color,
                    idx: index,
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

    useEffect(() => {
        cur.current = currentSlide;
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.name) {
                slideRef.current.style.backgroundImage = `url(${domain}${data.url}${currentSlide.name})`;
                // slideRef.current.style.width = `${currentSlide.width}px`;
                // slideRef.current.style.height = `${currentSlide.height}px`;
            } else if (currentSlide.idx >=0) {
                slideRef.current.style.backgroundColor = "#CECECE";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }
        } else if (currentSlide?.kind === "question" && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            slideRef.current.style.backgroundImage = `none`;
            if (currentIndex === previousSlide.idx)
                onSlideChange();
        }
    }, [currentSlide]);

    useEffect(() => {
        fetch(`${api.getPres}/${presId}`, {
            method: 'GET',
            headers: {

            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((presdata) => {
            const newdata = presdata?.pres;
            if (newdata) {
                if (newdata.slides?.length) {
                    setPresData(newdata);
                    // setCurrentIndex(0);
                }
            }
        })
        .catch(e => {
            console.error(e);
        });

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

    const onSlideDelete = () => {
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

            }
        }).catch(e => {
            console.error(e);
        });

        setPresData({
            ...data,
            slides: newSlides
        });
    };

    const onOptionCreate = (index: number, quizId: number = currentSlide.quizId) => {
        fetch(`${api.voteCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: quizId,
                idx: index,
                option: "",
                votes: 0,
                color: "#0FD400"
            }),
            headers: {

            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onOptionDelete = (index: number) => {
        fetch(`${api.voteDelete}`, {
            method: 'POST',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                idx: index,
            }),
            headers: {

            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onOptionUpdate = (newoptions: Array<OptionData>) => {
        fetch(`${api.voteUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                quizId: currentSlide.quizId,
                votes: newoptions,
            }),
            headers: {

            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onSlideChange = () => {
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
            }),
            headers: {

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


    const onCreateSlide = () => {
        let newSlides: Array<SingleSlideData> = [];
        data.slides.forEach((slide) => {
            if (slide.idx < currentIndex) {
                newSlides.push(slide);
            } else if (slide.idx === currentIndex) {
                newSlides.push(slide);
                newSlides.push({...newSlide, idx: currentIndex + 1})
            } else {
                newSlides.push({...slide, idx: slide.idx + 1});
            }
        });

        fetch(`${api.quizCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                creatorId: 1,
                presId: presId,
                idx: currentIndex + 1,
                type: newSlide.type, // ???
                question: newSlide.question,
                votes: [],
                background: newSlide.background,
                fontColor: newSlide.fontColor,
                fontSize: newSlide.fontSize, //???
                graphColor: newSlide.graphColor
            }),
            headers: {

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
        showGo();
    }

    const showGo = () => {
        if (isDemonstration) {
            fetch(`${api.showGo}/${presId}/show/go/${currentIndex}`, {
                method: 'PUT',
            })
            .catch(e => {
                console.error(e);
            });
        }
    }

    const showStop = () => {
        fetch(`${api.showStop}/${presId}/show/stop`, {
            method: 'PUT',
        })
        .catch(e => {
            console.error(e);
        });
    }

    const screenChangeHandler = (e: any) => {
        if (!isDemonstration) {
            document.getElementById("popup-root")?.remove();
            window.screen.orientation.lock("landscape").then().catch(e => {});
        } else {
            window.screen.orientation.unlock();
            showStop();
            document.getElementById("popup-root")?.remove();
        }
        setDemonstration(o => !o);
    }

    useEffect(() => {
        document.addEventListener("fullscreenchange", screenChangeHandler)
        return () => {
            document.removeEventListener("fullscreenchange", screenChangeHandler)
        }
    }, [screenWidth, screenHeight]);


    return (
        <div className="presentation view-wrapper">
            <PresentationBar
                onDelete={onSlideDelete}
                onCreate={onCreateSlide}
                onDemonstrate={demonstrate}
                hash={data.hash}
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
                />
                <div className="slideBox">
                    <div className="slide" style={{
                        height: `${slideHeight}px`,
                        width: `${slideWidth}px`
                    }} ref={slideRef}>
                        {isDemonstration && currentSlide?.kind === "question" &&
                            <InvitationBar code={data.code} hash={data.hash}/>}
                        {/* TODO: reactionBar */}
                        {currentSlide?.kind === "question" && currentSlide.type ?
                            <CustomBar
                                width={slideWidth - 180}
                                height={slideHeight - 140}
                                kind={currentSlide.type}
                                slide={currentSlide}/>
                            : null}
                    </div>
                    {isDemonstration &&
                        <ReactionBar emotions={data.emotions}/>}
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