import React, { useEffect, useRef } from 'react';
import './quizEditor.css';
import type { BarKind, SingleSlideData,  } from '../../types';
import ColorPicker from '../colorPicker/ColorPicker';
import OptionInput from '../optionInput/OptionInput';

type QuizEditorProps = {
    currentSlide: SingleSlideData;
    setCurrentSlide: Function;
    onOptionCreate: Function;
    onOptionUpdate: Function;
}

const QuizEditor = (props: QuizEditorProps) => {
    const {currentSlide, setCurrentSlide, onOptionUpdate, onOptionCreate} = props;
    const [maxIndex, setMaxIndex] = React.useState(1);

    const usePreviousIndex = (value: any) => {
        const indexRef = useRef<number>(currentSlide?.idx);
        useEffect(() => {
            indexRef.current = value;
        })
        return indexRef.current
    }

    const usePreviousQKind = (value: any) => {
        const questionKindRef = useRef<string>(currentSlide?.type);
        useEffect(() => {
            questionKindRef.current = value;
        })
        return questionKindRef.current
    }

    const optionsVariantsRef = React.useRef<HTMLDivElement>(null);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSlide({
            ...currentSlide,
            question: event.target.value
        });
    }

    const handleThemeChange = (color: string) => {
        setCurrentSlide({
            ...currentSlide,
            background: color
        });
    };

    const handleFontColorChange = (color: string) => {
        setCurrentSlide({
            ...currentSlide,
            fontColor: color
        })
    }

    const handleGraphColorChange = (color: string) => {
        setCurrentSlide({
            ...currentSlide,
            graphColor: color
        })
    }

    const handleQuestionKindChange = (newkind: BarKind) => {
        setCurrentSlide({
            ...currentSlide,
            type: newkind
        })
    }

    const handleTimerChange = (e: any) => {
        if (+e.target.value > 999) {return;}
        setCurrentSlide({
            ...currentSlide,
            answerTime: +e.target?.value ? +e.target.value : 1
        })
    }

    const handleAnswerAfter = (value: boolean) => {
        setCurrentSlide({
            ...currentSlide,
            answerAfter: value
        })
    }

    const handleCost = (e: any) => {
        setCurrentSlide({
            ...currentSlide,
            cost: +e.target?.value
        })
    }

    const handleExtrapts = (value: boolean) => {
        setCurrentSlide({
            ...currentSlide,
            extrapts: value
        })
    }

    const [optionElemList, setElemList] = React.useState([] as any);

    const addVariant = () => {
        let wrapper = document.getElementById(`optionsVariants`);
        let tIndex = wrapper?.children.length;
        if (tIndex) {
            setElemList(optionElemList.concat(
            <OptionInput
                withColor={currentSlide.answerTime === 0}
                key={maxIndex}
                index={maxIndex}
                onChange={onOptionUpdate}
                withCheckbox={currentSlide.answerTime !== 0}
                checked={false}
            />));
            setMaxIndex(maxIndex + 1);
            onOptionCreate(tIndex);
        }
    }

    const previousIndex = usePreviousIndex(currentSlide?.idx);
    const previousQKind = usePreviousQKind(currentSlide?.type);

    useEffect(() => {
        if (currentSlide?.idx === previousIndex
            && (currentSlide?.kind === "question" && currentSlide?.type === previousQKind))
            return;
        if ((currentSlide?.kind === "question" || currentSlide?.answerTime !== 0) && currentSlide?.votes.length) {
            let lst: Array<JSX.Element> = [];
            setElemList(lst);
            let i = 0;
            currentSlide.votes.forEach((option) => {
                lst.push(<OptionInput
                    key={i}
                    index={i}
                    value={option.option}
                    color={option.color}
                    onChange={onOptionUpdate}
                    withColor={currentSlide.answerTime === 0}
                    withCheckbox={currentSlide.answerTime !== 0}
                    checked={currentSlide.answerTime !== 0 && option?.correct}
                />)
                i++;
            });
            setMaxIndex(i);
            setElemList(lst);
        } else {
            if ((currentSlide?.kind === "question" || currentSlide?.answerTime !== 0)) {
                setElemList([
                    <OptionInput
                        key={100}
                        index={0}
                        onChange={onOptionUpdate}
                        withColor={currentSlide.answerTime === 0}
                        withCheckbox={currentSlide.answerTime !== 0}
                        // checked={currentSlide.answerTime !== 0 && option?.correct}
                        />
                ]);
                setMaxIndex(1);
            }
        }
    }, [currentSlide]);

    return (
        <div
            className="quizEditor"
        >
            {(currentSlide?.kind === "question" || currentSlide?.answerTime !== 0) && <div className="questionWrapper">
                <div className="questionTitle">
                    Ваш вопрос:
                </div>
                <div className="questionInputWrapper">
                    <input
                        className="questionInput"
                        type="text"
                        name="question"
                        onChange={handleNameChange}
                        placeholder="Как настроение?"
                        value={currentSlide?.question}
                        maxLength={currentSlide?.answerTime !== 0 ? 100 : 44}
                    />
                    <ColorPicker
                        background={currentSlide?.fontColor}
                        onChange={handleFontColorChange}
                    />
                </div>
            </div>}
            {(currentSlide?.kind === "question" || currentSlide?.answerTime !== 0) && <div className="optionsWrapper">
                <div className="optionsTitle">
                    {currentSlide?.kind === "question" ? "Варианты ответа:" : "Варианты ответа (и правильные ли они):"}
                </div>
                <div id="optionsVariants" ref={optionsVariantsRef}>
                    {optionElemList}
                </div>
                <button className="addVariant" onClick={addVariant}>
                    <div className="addVariantText">
                        Добавить
                    </div>
                </button>
            </div>}
            {(currentSlide?.kind === "question" || currentSlide?.answerTime !== 0) && <div className="backgroundWrapper">
                <div className="questionTitle">
                    Цвет слайда:
                </div>
                <ColorPicker
                    background={currentSlide?.background}
                    position={"right"}
                    onChange={handleThemeChange}
                />
            </div>}
            {currentSlide?.kind === "question" && <div className="chartTypeWrapper">
                <div className="questionTitle">
                    Представить результат в виде:
                </div>
                <div id="chartTypes" className="chartTypes">
                    <div
                        style={{height: document.getElementById("chartTypes")?.style.width}}
                        className={`chartType vertical-bar ${currentSlide.type === "vertical" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("vertical");}}
                    />
                    <div
                        className={`chartType horizontal-bar ${currentSlide.type === "horizontal" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("horizontal");}}
                    />
                    <div
                        className={`chartType pie ${currentSlide.type === "pie" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("pie");}}
                    />
                    <div
                        className={`chartType doughnut ${currentSlide.type === "doughnut" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("doughnut");}}
                    />
                    {/* <div
                        className={`chartType wordcloud ${currentSlide.questionKind === "cloud" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("cloud");}}
                    /> */}
                </div>
            </div>}
            {currentSlide?.kind === "question" && currentSlide?.type !== "cloud" &&
            <div className="backgroundWrapper">
                <div className="questionTitle">
                    Цвет текста результата:
                </div>
                <ColorPicker
                    background={currentSlide?.graphColor}
                    position={"up"}
                    onChange={handleGraphColorChange}
                />
            </div>}
            {currentSlide?.answerTime !== 0 &&
            <div className="timerWrapper">
                <div className="questionTitle">
                    Время (в секундах, запуск по нажатию):
                </div>
                <div className="timerInputWrapper">
                    <input
                        className="questionInput timerInput"
                        type="number"
                        min="1"
                        name="timer"
                        onChange={handleTimerChange as any}
                        placeholder="60"
                        value={currentSlide?.answerTime}
                        maxLength={2}
                    />
                </div>
            </div>}
            {currentSlide?.answerTime !== 0 &&
            <div className="leaderboardAfterWrapper">
                <div className="questionTitle">
                    Отображать доску результатов после опроса
                </div>
                <div className="leaderboardAfterToggle">
                    <input className="tgl tgl-ios" id="cb2" type="checkbox" defaultChecked={currentSlide.answerAfter} onChange={(e) => {
                        handleAnswerAfter(e.target.checked);
                    }}/>
                    <label className="tgl-btn" htmlFor="cb2"></label>
                </div>
            </div>}
            {currentSlide?.answerTime !== 0 &&
            <div className="costWrapper">
                <div className="questionTitle">
                    Количество очков за правильный ответ:
                </div>
                <div className="costInputWrapper">
                    <input
                        className="questionInput costInput"
                        type="number"
                        min="0"
                        name="cost"
                        onChange={handleCost as any}
                        placeholder="60"
                        value={currentSlide?.cost}
                        maxLength={3}
                    />
                </div>
            </div>}
            {currentSlide?.answerTime !== 0 &&
            <div className="leaderboardAfterWrapper">
                <div className="questionTitle">
                    Начислять больше очков за быстрый ответ
                </div>
                <div className="leaderboardAfterToggle">
                    <input className="tgl tgl-ios" id="cb3" type="checkbox" defaultChecked={currentSlide?.extrapts} onChange={(e) => {
                        handleExtrapts(e.target.checked);
                    }}/>
                    <label className="tgl-btn" htmlFor="cb3"></label>
                </div>
            </div>}
        </div>
    );
};

export default QuizEditor;