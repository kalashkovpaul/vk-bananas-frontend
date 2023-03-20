import { useCallback, useEffect, useRef, useState } from "react";
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
import { api } from "../../config/api.config";

const emptySlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "slide",
    questionKind: "",
    quizId: 0,
    width: 600,
    height: 300,
    fontSize: 16,
    question: "",
    vote: [],
    background: "",
    fontColor: "",
    graphColor: "",
}

const newSlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "question",
    questionKind: "vertical",
    quizId: 0,
    width: 600,
    height: 300,
    fontSize: 16,
    question: "",
    vote: [],
    background: "white",
    fontColor: "black",
    graphColor: "black",
}

const Presentation: FunctionComponent = () => {
    const presId = 121; // TODO parse from url
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>(emptySlide);
    const [data, setPresData] = useState<PresData>({
        url: "",
        slideNum: 0,
        quizNum: 0,
        slides: []
    });
    const slideRef = useRef<HTMLDivElement>(null);
    const cur = useRef<SingleSlideData>();

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
            newoptions = JSON.parse(JSON.stringify(cur.current?.vote));
            if (newoptions[index]) {
                newoptions[index].option = value;
                newoptions[index].color = color;
            } else if (value) {
                newoptions[index] = {
                    option: value,
                    votes: 2,
                    color: color,
                }
            }
            onOptionUpdate(newoptions);
        } else {
            newoptions = [];
            cur.current?.vote.forEach((option, i) => {
                if (i !== index) {
                    newoptions.push(option);
                }
            });
            onOptionDelete(index);
        }

        setCurrentSlide({
            ...(cur.current as SingleSlideData),
            vote: newoptions,
        });
    };

    useEffect(() => {
        cur.current = currentSlide;
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.name) {
                // TODO show image
                slideRef.current.style.backgroundColor = "green";
            } else if (currentSlide.idx >=0) {
                slideRef.current.style.backgroundColor = "#CECECE";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }
        } else if (currentSlide?.kind === "question" && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            if (currentIndex === previousSlide.idx)
                onSlideChange();
        }
    }, [currentSlide]);

    useEffect(() => {
        fetch(`${api.getPres}/${presId}`, {
            method: 'GET',
            // body: JSON.stringify({
            //     creatorId: 0
            // }),

            headers: {

            }
        }).then((res) => res.json())
        .then((presdata) => {
            // console.log("ONCE???");
            const newdata = presdata;
            if (newdata) {
                if (newdata.slides?.length) {
                    setPresData(newdata);
                    setCurrentIndex(0);
                }
            }
        });

    }, []);

    useEffect(() => {
        if (currentIndex >= 0 && currentIndex <= data.slides.length) {
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
                creatorId: 0,
                presId: presId,
                quizId: data.slides[currentIndex].quizId
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            setPresData({
                ...data,
                slides: newSlides
            });
        })
    };

    const onOptionCreate = (index: number) => {
        fetch(`${api.voteCreate}`, {
            method: 'POST',
            body: JSON.stringify({
                creatorId: 0,
                quizId: data.slides[currentIndex].quizId,
                idx: index,
                option: "",
                votes: 0,
                color: "#0FD400"
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            console.log(response);
        });
    }

    const onOptionDelete = (index: number) => {
        fetch(`${api.voteDelete}`, {
            method: 'POST',
            body: JSON.stringify({
                creatorId: 0,
                quizId: data.slides[currentIndex].quizId,
                idx: index,
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            console.log(response);
        });
    }

    const onOptionUpdate = (newoptions: Array<OptionData>) => {
        fetch(`${api.voteUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                creatorId: 0,
                quizId: data.slides[currentIndex].quizId,
                vote: newoptions,
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            console.log(response);
        });
    }

    const onSlideChange = () => {
        fetch(`${api.quizUpdate}`, {
            method: 'PUT',
            body: JSON.stringify({
                creatorId: 0,
                quizId: data.slides[currentIndex].quizId,
                presId: presId,
                idx: currentIndex,
                type: data.slides[currentIndex].questionKind,
                question: data.slides[currentIndex].question,
                background: data.slides[currentIndex].background,
                fontColor: data.slides[currentIndex].fontColor,
                fontSize: data.slides[currentIndex].fontSize,
                graphColor: data.slides[currentIndex].graphColor,
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            console.log(response);
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
                creatorId: 0,
                presId: presId,
                idx: currentIndex + 1,
                type: newSlide.kind, // ???
                question: newSlide.question,
                vote: [],
                background: newSlide.background,
                fontColor: newSlide.fontColor,
                fontSize: newSlide.fontSize, //???
                graphColor: newSlide.graphColor
            }),
            headers: {

            }
        }).then(data => data.json())
        .then((response) => {
            newSlides[currentIndex + 1].quizId = response?.quizId;
            setPresData({
                ...data,
                slides: newSlides
            });
        })
    }


    return (
        <div className="presentation view-wrapper">
            <PresentationBar
                onDelete={onSlideDelete}
                onCreate={onCreateSlide}
            />
            <div className="contents">
                <MetaInfo {...getRouteMetaInfo('About')} />
                <Sidebar data={data} setCurrentIndex={setCurrentIndex}/>
                <div className="slideBox">
                    <div className="slide" ref={slideRef}>
                        {currentSlide?.kind === "question" && currentSlide.questionKind ?
                            <CustomBar kind={currentSlide.questionKind} slide={currentSlide}/>
                            : null}
                    </div>
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