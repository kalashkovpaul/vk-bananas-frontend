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

const Presentation: FunctionComponent = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>({
        index: 0,
        src: "",
        kind: "slide",
        questionKind: "",
        question: "",
        options: [],
        background: "",
        fontColor: "",
        graphColor: "",
    });
    const [data, setPresData] = useState<PresData>({
        slides: []
    });
    const slideRef = useRef<HTMLDivElement>(null);
    const cur = useRef<SingleSlideData>();

    const onOptionChange = (index: number, value: string, color: string) => {
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
        if (currentSlide) {
            setPresData({
                slides: data.slides.map((slide, i) => {
                    if (i === currentIndex) {
                        return currentSlide;
                    }
                    return slide;
                })
            });
        }
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.src) {
                slideRef.current.style.backgroundColor = "green";
            } else {
                slideRef.current.style.backgroundColor = "#9A8873";
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
    }, [currentIndex, data]);

    return (
        <div className="presentation view-wrapper">
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
    );
}

export default Presentation;