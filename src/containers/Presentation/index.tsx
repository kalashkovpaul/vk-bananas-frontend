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

const emptySlide: SingleSlideData = {
    index: -1,
    src: "",
    kind: "slide",
    questionKind: "",
    question: "",
    options: [],
    background: "",
    fontColor: "",
    graphColor: "",
}

const Presentation: FunctionComponent = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>(emptySlide);
    const [data, setPresData] = useState<PresData>({
        slides: []
    });
    const slideRef = useRef<HTMLDivElement>(null);
    const cur = useRef<SingleSlideData>();

    // Надо ли?
    // const onUndo = (e: KeyboardEvent) => {
    //     console.log(e);
    //     if (e.keyCode === 90 && e.metaKey) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         console.log("UNDO");
    //     }
    // }
    // document.addEventListener("keydown", onUndo);


    const onOptionChange = (index: number, value: string, color: string) => {
        // console.log(index, value, color);
        let newoptions;
        if (value && color) {
            newoptions = JSON.parse(JSON.stringify(cur.current?.options));
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
        } else {
            newoptions = [];
            cur.current?.options.forEach((option, i) => {
                if (i !== index) {
                    newoptions.push(option);
                }
            });
        }

        setCurrentSlide({
            ...(cur.current as SingleSlideData),
            options: newoptions,
        });
    };

    useEffect(() => {
        cur.current = currentSlide;
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.src) {
                // TODO show image
                slideRef.current.style.backgroundColor = "green";
            } else if (currentSlide.index >=0) {
                slideRef.current.style.backgroundColor = "#CECECE";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }
        } else if (currentSlide?.kind === "question" && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
        }
    }, [currentSlide])

    useEffect(() => {
        // TODO fetch data about presentation
        const newdata = presData;
        if (newdata) {
            if (newdata.slides?.length) {
                setPresData(newdata);
                setCurrentIndex(0);
            }
        }
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
        // debugger;
        data.slides.forEach((slide) => {
            if (slide.index < currentIndex) {
                newSlides.push(slide);
            } else if (slide.index > currentIndex) {
                newSlides.push({...slide, index: slide.index - 1});
            }
        });

        console.log(newSlides, currentIndex);

        setPresData({
            slides: newSlides
        });
        // setCurrentIndex(currentIndex);
        // if (currentIndex + 1 < presData.slides.length)
        //     setCurrentIndex(currentIndex + 1);
        // else
        //     setCurrentIndex(currentIndex);
    };

    useEffect(() => {
        // debugger;
        if (currentIndex < data.slides.length) {
            setCurrentSlide(data.slides[currentIndex]);
        } else if (data.slides.length === 0) {
            setCurrentSlide(emptySlide);
        }
    }, [data]);


    return (
        <div className="presentation view-wrapper">
            <PresentationBar onDelete={onSlideDelete}/>
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
                    changeOption={onOptionChange}
                />
            </div>
        </div>
    );
}

export default Presentation;