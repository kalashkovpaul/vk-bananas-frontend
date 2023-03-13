import React from 'react';
import './sidebar.css';
import type { MiniSlideData, PresData, SideBarData, SingleSlideData } from '../../types';

type SidebarProps = {
    setCurrentIndex: Function;
    data: PresData
}

const Sidebar = (props: SidebarProps) => {
    const {data, setCurrentIndex} = props;
    let slides: Array<React.ReactElement> = [];

    const createMiniSlide = (data: SingleSlideData) => {
        // TODO src
        return (
            <div key={data.index} className={`miniSlide `} onClick={() => {
                setCurrentIndex(data.index);
            }}>
                <div className="miniSlideNumber">{(data.index + 1)}</div>
                <div className="miniSlideImage">
                    {data.src && <img src={data.src} className="miniSlideImageImg"/>}
                </div>
            </div>

        );
    }

    data.slides.forEach((slide) => {
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

export default Sidebar;