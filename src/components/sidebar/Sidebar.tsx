import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import type { MiniSlideData, PresData, SideBarData, SingleSlideData } from '../../types';
import { domain, prefix } from '../../config/api.config';

type SidebarProps = {
    setCurrentIndex: Function;
    data: PresData;
    currentSlide: SingleSlideData;
}

const Sidebar = (props: SidebarProps) => {
    const {data, setCurrentIndex, currentSlide} = props;
    const [curIndex, setLocalCurIndex] = useState<number>(0);
    const[slides, setSlides]= useState<Array<React.ReactElement>>([]);

    const createMiniSlide = (slideData: SingleSlideData) => {
        // TODO src
        return (
            <div key={slideData.idx} className={`miniSlide `} onClick={() => {
                setCurrentIndex(slideData.idx);
                setLocalCurIndex(slideData.idx);
            }}>
                <div className="miniSlideNumber">{(slideData.idx + 1)}</div>
                <div className="miniSlideImage"
                    style={slideData.kind === "question" ? {backgroundColor: slideData.background} : {}}>
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
        s[currentSlide.idx] = createMiniSlide(currentSlide);
        setSlides(s);
    }, [currentSlide]);

    useEffect(() => {
        let s: Array<React.ReactElement> = [];
        data.slides.forEach((slide) => {
            s.push(createMiniSlide(slide))
        });
        setSlides(s);
    }, [data]);


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