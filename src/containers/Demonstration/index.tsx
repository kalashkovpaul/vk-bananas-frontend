import React, { useEffect, useRef, useState, type FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import PollForm from "../../components/pollForm/PollForm";
import { api, domain } from "../../config/api.config";
import { type Emotions, type SingleSlideData } from "../../types";
import { calculateDemonstrationScale, } from "../../utils/utils";
import { useWindowSize } from "../Presentation";
import { CustomBar } from "../Presentation/CustomBar";
import './demonstration.css';

const demEmptySlide: SingleSlideData = {
    idx: 0,
    name: "",
    kind: "slide",
    type: "",
    quizId: 0,
    fontSize: "",
    question: "",
    votes: [],
    background: "",
    fontColor: "",
    graphColor: "",
}

const Demonstration: FunctionComponent = () => {
    const updateTime = 3000;
    const params = useParams();
    const hash = params.hash;
    const location = useLocation();
    const [currentSlide, setCurrentSlide] = useState<SingleSlideData>(demEmptySlide);
    const slideRef = useRef<HTMLDivElement>(null);
    const [screenWidth, screenHeight] = useWindowSize();
    const [slideWidth, setSlideWidth] = useState(0);
    const [slideHeight, setSlideHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [viewMode, setViewMode] = useState(false);
    const [url, setUrl] = useState("");
    const [emotions, setEmotions] = useState<Emotions>({
        like: 0,
        love: 0,
        laughter: 0,
        surprise: 0,
        sad: 0,
    });

    const getInfo = () => {
        fetch(`${api.getDemonstration}/${hash}`, {
            method: 'GET',
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((slidedata) => {
            setWidth(slidedata.width);
            setHeight(slidedata.height);
            setUrl(slidedata.url);
            setViewMode(slidedata.viewMode)
            setEmotions(slidedata.emotions);
            setCurrentSlide(slidedata.slide);
        })
        .catch(e => {
            console.error(e);
        });
    };

    const animateButton = (e: any) => {
        e.preventDefault();
        e.target.classList.remove('animate');
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },700);
    };


    useEffect(() => {
        getInfo();
        setInterval(getInfo, updateTime);
        const bubblyButtons = document.getElementsByClassName("clickable");

        for (var i = 0; i < bubblyButtons.length; i++) {
            bubblyButtons[i].addEventListener('click', animateButton, false);
        }
    }, []);

    useEffect(() => {
        const {sWidth, sHeight} = calculateDemonstrationScale(screenWidth, screenHeight, width, height);
        setSlideWidth(sWidth);
        setSlideHeight(sHeight);
    }, [screenWidth, screenHeight, width, height]);

    useEffect(() => {
        // cur.current = currentSlide;
        if (currentSlide?.kind === "slide" && slideRef.current) {
            if (currentSlide?.name) {
                // TODO show image
                slideRef.current.style.backgroundImage = `url(${domain}${url}${currentSlide.name})`;
                // slideRef.current.style.width = `${currentSlide.width}px`;
                // slideRef.current.style.height = `${currentSlide.height}px`;
            } else if (currentSlide.idx >=0) {
                slideRef.current.style.backgroundColor = "#CECECE";
            } else {
                slideRef.current.style.backgroundColor = "transparent";
                slideRef.current.style.boxShadow = "none";
            }
        } else if (currentSlide?.kind === "question" && slideRef.current) {
            slideRef.current.style.backgroundColor = currentSlide.background;
            slideRef.current.style.backgroundImage = `none`;
            // slideRef.current.style.width = null as any;
            // slideRef.current.style.height = null as any;
            // if (currentIndex === previousSlide.idx)
            //     onSlideChange();
        }
    }, [currentSlide]);

    return (
        // <button className="bubbly-button">Click me!</button>
        <div className="demonstration">
            <div className="demonstrationLogo invitationLogo">
                <NavLink className="invitationLogoImg" to="/"/>
                <div className="invitationLogoText">Kinda Slides</div>
            </div>
            {currentSlide?.kind !== "question" && viewMode &&
            <div className="demonstrationSlide" style={{
                        height: `${slideHeight}px`,
                        width: `${slideWidth}px`
                    }} ref={slideRef}>
            </div>}
            {!viewMode &&
            <div className="demonstrationSorry">
                Данная презетация сейчас не демонстрируется!
            </div>}
            {currentSlide?.kind === "question" && currentSlide.type ?
                // <CustomBar
                //     width={slideWidth - 180}
                //     height={slideHeight - 140}
                //     kind={currentSlide.type}
                //     slide={currentSlide}/>
                <PollForm currentSlide={currentSlide}/>
                : null}
            <div className="reactions">
                <div className="emotion emotionBtn">
                    <div className="emotionIcon likeIcon clickable"/>
                    {emotions?.like}
                </div>
                <div className="emotion emotionBtn">
                    <div className="emotionIcon loveIcon clickable"/>
                    {emotions?.love}
                </div>
                <div className="emotion emotionBtn">
                    <div className="emotionIcon laughterIcon clickable"/>
                    {emotions?.laughter}
                </div>
                <div className="emotion emotionBtn">
                    <div className="emotionIcon surpriseIcon clickable"/>
                    {emotions?.surprise}
                </div>
                <div className="emotion emotionBtn">
                    <div className="emotionIcon sadIcon clickable"/>
                    {emotions?.sad}
                </div>
            </div>
        </div>
    );
};

export default Demonstration;