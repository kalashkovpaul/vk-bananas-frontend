import { useEffect, useRef, useState } from "react";
import type { FunctionComponent, ReactElement } from "react";
import './presentation.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SlideBox from "../../components/slideBox/SlideBox";
import QuizEditor from "../../components/quizEditor/QuizEditor";
import { presData } from "./fakeData";
import type { PresData, SingleSlideData } from "../../types";
import { getRouteMetaInfo } from '../../config/routes.config';
import { MetaInfo } from "../../components";

import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createBar } from "./createBar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    //   title: {
    //     display: true,
    //     text: 'Chart.js Bar Chart',
    //   },
    },
  };

const labels = [''];

export const barData = {
    labels,
    datasets: [
      {
        label: 'Хорошее',
        data: [3],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Отличное',
        data: [5],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };


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
    });
    const [data, setPresData] = useState<PresData>({
        slides: []
    });
    const slideRef = useRef<HTMLDivElement>(null);

    let onQuestionChange: Function;

    const setOnQuestionChange = (f: Function) => {
        onQuestionChange = f;
    }

    useEffect(() => {
        console.log(currentIndex, currentSlide, data);
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
                    {currentSlide?.kind === "question" ? createBar(currentSlide) : null}
                    {/* <div className="slideQuestion">Как настроение?</div>
                    <Bar className="chart" options={options} data={barData} /> */}
                </div>
            </div>
            <QuizEditor setCurrentSlide={setCurrentSlide} currentSlide={currentSlide}/>
        </div>
    );
}

export default Presentation;