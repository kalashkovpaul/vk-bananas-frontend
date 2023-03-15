import React, { useEffect, useRef } from 'react';
import './quizEditor.css';
import type { BarKind, SingleSlideData,  } from '../../types';
import ColorPicker from '../colorPicker/ColorPicker';
import OptionInput from '../optionInput/OptionInput';

type QuizEditorProps = {
    currentSlide: SingleSlideData;
    setCurrentSlide: Function;
    changeOption: Function;
}

const QuizEditor = (props: QuizEditorProps) => {
    const {currentSlide, setCurrentSlide, changeOption} = props;
    const [maxIndex, setMaxIndex] = React.useState(1);

    const usePreviousIndex = (value: any) => {
        const indexRef = useRef<number>(currentSlide?.index);
        useEffect(() => {
            indexRef.current = value;
        })
        return indexRef.current
    }

    const usePreviousQKind = (value: any) => {
        const questionKindRef = useRef<string>(currentSlide?.questionKind);
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
            questionKind: newkind
        })
    }

    const [optionElemList, setElemList] = React.useState([<OptionInput key={0} index={0} onChange={changeOption}/>]);

    const addVariant = () => {
        setElemList(optionElemList.concat(
        <OptionInput
            withColor={currentSlide.questionKind !== "cloud"}
            key={maxIndex}
            index={maxIndex}
            onChange={changeOption}
        />));
        setMaxIndex(maxIndex + 1);
    }

    const previousIndex = usePreviousIndex(currentSlide?.index);
    const previousQKind = usePreviousQKind(currentSlide?.questionKind);

    useEffect(() => {
        if (currentSlide?.index === previousIndex
            && currentSlide?.questionKind === previousQKind)
            return;
        if (currentSlide?.kind === "question") {
            let lst: Array<JSX.Element> = [];
            let i = 0;
            currentSlide.options.forEach((option) => {
                lst.push(<OptionInput
                    key={i}
                    index={i}
                    value={option.option}
                    color={option.color}
                    onChange={changeOption}
                    withColor={currentSlide.questionKind !== "cloud"}
                />)
                i++;
            });
            setMaxIndex(i);
            setElemList(lst);
        } else {
            setElemList([<OptionInput key={0} index={0} onChange={changeOption}/>]);
            setMaxIndex(1);
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
                <div className="optionsVariants" ref={optionsVariantsRef}>
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
                <div className="chartTypes">
                    <div
                        className={`chartType vertical-bar ${currentSlide.questionKind === "vertical" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("vertical");}}
                    />
                    <div
                        className={`chartType horizontal-bar ${currentSlide.questionKind === "horizontal" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("horizontal");}}
                    />
                    <div
                        className={`chartType pie ${currentSlide.questionKind === "pie" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("pie");}}
                    />
                    <div
                        className={`chartType doughnut ${currentSlide.questionKind === "doughnut" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("doughnut");}}
                    />
                    {/* <div
                        className={`chartType wordcloud ${currentSlide.questionKind === "cloud" ? "chosen" : ""}`}
                        onClick={() => {handleQuestionKindChange("cloud");}}
                    /> */}
                </div>
            </div>}
            {currentSlide?.kind === "question" && currentSlide?.questionKind !== "cloud" &&
            <div className="backgroundWrapper">
                <div className="questionTitle">
                    Цвет надписей результата:
                </div>
                <ColorPicker
                    background={currentSlide?.graphColor}
                    position={"right"}
                    onChange={handleGraphColorChange}
                />
            </div>}
        </div>
    );
};

export default QuizEditor;