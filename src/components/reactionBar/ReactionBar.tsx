import React from "react";
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
    return (
        <div className="reactionBar">
            <div className="emotion">
                <div className="emotionIcon likeIcon"/>
                {emotions?.like}
            </div>
            <div className="emotion">
                <div className="emotionIcon loveIcon"/>
                {emotions?.love}
            </div>
            <div className="emotion">
                <div className="emotionIcon laughterIcon"/>
                {emotions?.laughter}
            </div>
            <div className="emotion">
                <div className="emotionIcon surpriseIcon"/>
                {emotions?.surprise}
            </div>
            <div className="emotion">
                <div className="emotionIcon sadIcon"/>
                {emotions?.sad}
            </div>
        </div>
    );
}

export default ReactionBar;