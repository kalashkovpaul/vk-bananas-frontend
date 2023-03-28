import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import type { MiniSlideData, PresData, SideBarData, SingleSlideData } from '../../types';
import { domain, prefix } from '../../config/api.config';

type SidebarProps = {
    setCurrentIndex: Function;
    data: PresData;
    currentSlide: SingleSlideData;
    width: number;
    height: number;
}

const Sidebar = (props: SidebarProps) => {
    const {data, setCurrentIndex, currentSlide, width, height} = props;
    const [curIndex, setLocalCurIndex] = useState<number>(0);
    const [slides, setSlides]= useState<Array<React.ReactElement>>([]);

    const addControlListeners = () => {
        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                if (curIndex < data.slides.length - 1) {
                    setCurrentIndex(curIndex + 1);
                    setLocalCurIndex(curIndex + 1);
                }
            }
        });
        document.addEventListener("click", (e) => {
            // const slide = document.querySelector(".slide") as HTMLDivElement;
            // let isFullscreen = window.innerWidth - slide.offsetWidth < 100;
            // console.log(isFullscreen);
            // if (isFullscreen) {
            //     if (e.offsetX < window.innerWidth / 2 && curIndex > 0) {
            //         setCurrentIndex(curIndex - 1);
            //         setLocalCurIndex(curIndex - 1);
            //     } else if (e.offsetX > window.innerWidth / 2 &&
            //         curIndex < data.slides.length - 1) {
            //             setCurrentIndex(curIndex + 1);
            //             setLocalCurIndex(curIndex + 1);
            //         }
            // }
        });
        // document.addEventListener("keypress", (e) => {
        //     if
        // });
    }

    addControlListeners();

    const createMiniSlide = (slideData: SingleSlideData, w: number, h: number) => {
        // TODO src
        return (
            <div
                key={slideData.idx}
                className={`miniSlide`}
                onClick={() => {
                    setCurrentIndex(slideData.idx);
                    setLocalCurIndex(slideData.idx);
                }}
                style={{
                    height: `${h + 20}px`
                }}
            >
                <div className="miniSlideNumber">{(slideData.idx + 1)}</div>
                <div className="miniSlideImage"
                    style={slideData.kind === "question" ?
                    {
                        backgroundColor: slideData.background,
                        width: `${w}px`,
                        height: `${h}px`,
                    } :
                    {
                        width: `${w}px`,
                        height: `${h}px`,
                    }}>
                    {slideData.kind === "question" ?  <div className="miniSlideQuestion">{slideData.question}</div> :
                    slideData.name ? <img src={`${domain}/${data.url}${slideData.name}`} className="miniSlideImageImg"/> : null}
                </div>
            </div>

        );
    }

    const usePreviousData = (value: any) => {
        const dataRef = useRef<any>(value);
          useEffect(() => {
              dataRef.current = value;
          })
          return dataRef.current
    };

    const previousData = usePreviousData(data);

    useEffect(() => {
        if (data.slides.length < previousData.slides.length) {
            if (curIndex >= 0 &&
                data.slides.length > 0 &&
                curIndex === data.slides.length) {
                    setCurrentIndex(curIndex - 1);
                    setLocalCurIndex(curIndex - 1);
            }
        } else if (previousData.slides.length &&
                data.slides.length > previousData.slides.length) {
            setCurrentIndex(curIndex + 1);
            setLocalCurIndex(curIndex + 1);
        }
    }, [data]);

    useEffect(() => {
        let s = slides.slice(0);
        s[currentSlide.idx] = createMiniSlide(currentSlide, width, height);
        setSlides(s);
    }, [currentSlide, width, height]);

    useEffect(() => {
        let s: Array<React.ReactElement> = [];
        data.slides.forEach((slide) => {
            s.push(createMiniSlide(slide, width, height))
        });
        setSlides(s);
    }, [data, width, height]);


    useEffect(() => {
        const previousActive = document.getElementsByClassName("activeSlide");
        if (previousActive && previousActive[0]) {
            previousActive[0].classList.remove("activeSlide");
        }
        const sidebar = document.getElementById("sidebar");
        if (sidebar && sidebar.children[curIndex]) {
            sidebar.children[curIndex].classList.add("activeSlide");
        }
    }, [curIndex, slides]);

    return (
        <div
            id="sidebar"
            className="sidebar"
        >
            {slides}
        </div>
    );
};

export default Sidebar;