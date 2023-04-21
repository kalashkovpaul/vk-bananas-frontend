import React, { useEffect, useState } from "react";
import './questionPanel.css';
import type { userQuestion } from "../../types";
import { useParams } from "react-router-dom";
import { api } from "../../config/api.config";
import { csrf } from "../../utils/utils";

type QuestionPanelProps = {
    questions: userQuestion[];
}

const QuestionPanel = (props: QuestionPanelProps) => {
    const [questions, setQuestions] = useState(props.questions);
    const params = useParams();
    const hash = params.hash;

    useEffect(() => {
        setQuestions(props.questions);
    }, [props.questions])

    useEffect(() => {
        const likes = document.querySelectorAll(".questionLikeIcon");
        likes.forEach(like => {
            like.addEventListener("mouseover", () => {
                like.classList.add("animated");
                setTimeout(() => {
                    like.classList.remove("animated");
                }, 500);
            });
        })
    }, []);

    const likeQuestion = async (idx: number) => {
        const token = await csrf();
        fetch(`${api.likeQuestion}`, {
            method: 'PUT',
            body: JSON.stringify({
                hash: hash,
                idx: idx,
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
    }

    return (
        <div className="questionPanel">
            <div className="questionsTitle">Список заданных вопросов</div>
            <div className="questionsWrapper">
                {!questions.length && <div className="questionInvitation">Будьте первым!</div>}
                {questions.map(q => {
                    return (
                        <div key={q.idx} className="singleUserQuestion">
                            <div className="questionText">
                                {q.question}
                            </div>
                            <div className="likeNumber">
                                {q.likes}
                            </div>
                            <div className="questionLikeIcon" onClick={() => {
                                const check = window.localStorage.getItem(q.question);
                                if (check) return;
                                likeQuestion(q.idx);
                                window.localStorage.setItem(q.question, "liked");
                                let newquestions: userQuestion[] = JSON.parse(JSON.stringify(questions));
                                let i = newquestions.findIndex(q1 => q1.idx === q.idx);
                                newquestions[i].likes++;
                                setQuestions(newquestions);
                            }}/>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default QuestionPanel;