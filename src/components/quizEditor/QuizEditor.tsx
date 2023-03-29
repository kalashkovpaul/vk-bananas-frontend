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

    const [optionElemList, setElemList] = React.useState([] as any);

    const addVariant = () => {
        let wrapper = document.getElementById(`optionsVariants`);
        let tIndex = wrapper?.children.length;
        if (tIndex) {
            setElemList(optionElemList.concat(
            <OptionInput
                withColor={currentSlide.type !== "cloud"}
                key={maxIndex}
                index={maxIndex}
                onChange={onOptionUpdate}
            />));
            setMaxIndex(maxIndex + 1);
            onOptionCreate(tIndex);
        }
    }

    const previousIndex = usePreviousIndex(currentSlide?.idx);
    const previousQKind = usePreviousQKind(currentSlide?.type);

    useEffect(() => {
        if (currentSlide?.idx === previousIndex
            && currentSlide?.type === previousQKind)
            return;
        if (currentSlide?.kind === "question" && currentSlide?.votes.length) {
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
                    withColor={currentSlide.type !== "cloud"}
                />)
                i++;
            });
            setMaxIndex(i);
            setElemList(lst);
        } else {
            if (currentSlide?.kind === "question") {
                setElemList([<OptionInput key={100} index={0} onChange={onOptionUpdate}/>]);
                setMaxIndex(1);
            }
        }
    }, [currentSlide]);

    return (
        <div
            className="quizEditor"
        >
            {currentSlide?.kind === "question" && <div className="questionWrapper">
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
                        maxLength={44}
                    />
                    <ColorPicker
                        background={currentSlide?.fontColor}
                        onChange={handleFontColorChange}
                    />
                </div>
            </div>}
            {currentSlide?.kind === "question" && <div className="optionsWrapper">
                <div className="optionsTitle">
                    Варианты ответа:
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
            {currentSlide?.kind === "question" && <div className="backgroundWrapper">
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
        </div>
    );
};

export default QuizEditor;