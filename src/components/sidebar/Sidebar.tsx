import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import type { MiniSlideData, PresData, SideBarData, SingleSlideData } from '../../types';
import { prefix } from '../../config/api.config';

type SidebarProps = {
    setCurrentIndex: Function;
    data: PresData
}

const Sidebar = (props: SidebarProps) => {
    const {data, setCurrentIndex} = props;
    const [curIndex, setLocalCurIndex] = useState<number>(0);
    let slides: Array<React.ReactElement> = [];

    const createMiniSlide = (slideData: SingleSlideData) => {
        // TODO src
        return (
            <div key={slideData.idx} className={`miniSlide `} onClick={() => {
                setCurrentIndex(slideData.idx);
                setLocalCurIndex(slideData.idx);
            }}>
                <div className="miniSlideNumber">{(slideData.idx + 1)}</div>
                <div className="miniSlideImage">
                    {slideData.name && <img src={`${prefix}${data.url}/${slideData.name}`} className="miniSlideImageImg"/>}
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
    }, [data])

    data.slides.forEach((slide) => {
        slides.push(createMiniSlide(slide))
    });

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