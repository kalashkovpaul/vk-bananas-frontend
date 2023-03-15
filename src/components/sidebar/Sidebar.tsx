import React, { useEffect, useState } from 'react';
import './sidebar.css';
import type { MiniSlideData, PresData, SideBarData, SingleSlideData } from '../../types';

type SidebarProps = {
    setCurrentIndex: Function;
    data: PresData
}

const Sidebar = (props: SidebarProps) => {
    const {data, setCurrentIndex} = props;
    const [curIndex, setLocalCurIndex] = useState<number>(0);
    let slides: Array<React.ReactElement> = [];

    const createMiniSlide = (data: SingleSlideData) => {
        // TODO src
        return (
            <div key={data.index} className={`miniSlide `} onClick={() => {
                setCurrentIndex(data.index);
                setLocalCurIndex(data.index);
            }}>
                <div className="miniSlideNumber">{(data.index + 1)}</div>
                <div className="miniSlideImage">
                    {data.src && <img src={data.src} className="miniSlideImageImg"/>}
                </div>
            </div>

        );
    }

    useEffect(() => {
        if (curIndex >= 0 &&
            data.slides.length > 0 &&
            curIndex === data.slides.length) {
                setCurrentIndex(curIndex - 1);
                setLocalCurIndex(curIndex - 1);
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