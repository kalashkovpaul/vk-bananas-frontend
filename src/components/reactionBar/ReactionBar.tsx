import React, { useEffect, useRef } from "react";
import './reactionBar.css';

type ReactionBarProps = {
    emotions: {
        like: number;
        love: number;
        laughter: number;
        surprise: number;
        sad: number;
    }
}
const ReactionBar = (props: ReactionBarProps) => {
    const {emotions} = props;

    const usePreviousEmotions = (value: any) => {
        const indexRef = useRef({
            like: 0,
            love: 0,
            laughter: 0,
            surprise: 0,
            sad: 0,
        });
        useEffect(() => {
            indexRef.current = value;
        });
        return indexRef.current
    }

    const prevEmotions = usePreviousEmotions(emotions);

    const animate = (emotion: string) => {
        const directions = ["toLeft", "toLeftCenter", "toRightCenter", "toRight"];
        const chosenDirection = directions[Math.floor(Math.random()*directions.length)]
        const newEmotion = document.createElement("div");
        newEmotion.classList.add("emotionIcon", `${emotion}Icon`, "iconForAnimation", chosenDirection);
        const parentEmotion = document.querySelector(`.${emotion}Emotion`);
        parentEmotion?.appendChild(newEmotion);
        setTimeout(() => {
            newEmotion.remove();
        }, 3000);
    }


    const animateTimes = (emotion: string, times: number) => {
        if (times <= 0) return;
        let i = 0;
        const oneTime = () => {
            animate(emotion);
            i++;
            if (i < times) {
                setTimeout(oneTime, 1000 / times);
            }
        }
        setTimeout(oneTime, 1000 / times);
    }

    useEffect(() => {
        if (emotions.like !== prevEmotions.like) {
            const delta = emotions.like - prevEmotions.like
            animateTimes("like", delta);
        } else if (emotions.love > prevEmotions.love) {
            const delta = emotions.love - prevEmotions.love
            animateTimes("love", delta);
        } else if (emotions.laughter > prevEmotions.laughter) {
            const delta = emotions.laughter - prevEmotions.laughter
            animateTimes("laughter", delta);
        } else if (emotions.surprise > prevEmotions.surprise) {
            const delta = emotions.surprise - prevEmotions.surprise
            animateTimes("surprise", delta);
        } else if (emotions.sad > prevEmotions.sad) {
            const delta = emotions.sad - prevEmotions.sad
            animateTimes("sad", delta);
        }
    }, [emotions]);


    return (
        <div className="reactionBar">
            <div className="emotion likeEmotion">
                <div className="emotionIcon likeIcon"/>
                <div className="emotionIcon likeIcon iconForAnimation"/>
                {emotions?.like}
            </div>
            <div className="emotion loveEmotion">
                <div className="emotionIcon loveIcon"/>
                <div className="emotionIcon loveIcon iconForAnimation"/>
                {emotions?.love}
            </div>
            <div className="emotion laughterEmotion">
                <div className="emotionIcon laughterIcon"/>
                <div className="emotionIcon laughterIcon iconForAnimation"/>
                {emotions?.laughter}
            </div>
            <div className="emotion surpriseEmotion">
                <div className="emotionIcon surpriseIcon"/>
                <div className="emotionIcon surpriseIcon iconForAnimation"/>
                {emotions?.surprise}
            </div>
            <div className="emotion sadEmotion">
                <div className="emotionIcon sadIcon"/>
                <div className="emotionIcon sadIcon iconForAnimation"/>
                {emotions?.sad}
            </div>
        </div>
    );
}

export default ReactionBar;