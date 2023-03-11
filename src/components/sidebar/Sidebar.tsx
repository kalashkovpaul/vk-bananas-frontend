import React from 'react';
import './sidebar.css';

type MiniSlideData = {
    i: number;
    src: string;
}

type SideBarData = {
    slides: Array<MiniSlideData>;
}

const createMiniSlide = (data: MiniSlideData) => {
    // TODO src
    return (
        <div key={data.i} className={`miniSlide`}>
            <div className="miniSlideNumber">{data.i}</div>
            <div className="miniSlideImage">
                {data.src && <img src={data.src} className="miniSlideImageImg"/>}
            </div>
        </div>

    );
}

export const Sidebar = () => {
    const slideData: SideBarData = { slides: [{i: 1, src: ""},{i: 2, src: "./example.png"},{i: 3, src: ""},{i: 4, src: ""},{i: 5, src: ""},{i: 6, src: ""},{i: 7, src: ""},{i: 8, src: ""},{i: 9, src: ""},{i: 10, src: ""},]};
    let slides: Array<React.ReactElement> = [];
    slideData.slides.forEach((slide) => {
        slides.push(createMiniSlide(slide))
    });

    return (
        <div
            className="sidebar"
        >
            {slides}
        </div>
    );
};