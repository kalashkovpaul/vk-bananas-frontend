import React from 'react';
import './quizEditor.css';

let options: Map<number, string> = new Map();

type OptionProps = {
    index: number;
    key: number;
}

export const QuizEditor = () => {
    const [maxIndex, setMaxIndex] = React.useState(1);
    const [question, setQuestion] = React.useState("");

    const optionsVariantsRef = React.useRef<HTMLDivElement>(null);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setQuestion(event.target.value);
    }

    const OptionInput = (props: OptionProps) => {
        const {index} = props;
        return (
            <div className="singleOption" id={`option-${index}`}>
                <input
                    className="optionInput"
                    type="text"
                    name="option"
                    onChange={(e) => {
                        console.log(index, e.target.value);
                        options.set(index, e.target.value);
                        console.log(options);
                    }}
                    placeholder="Прекрасное!"
                />
                <div className="cross" onClick={() => {
                    document.getElementById(`option-${index}`)?.remove();
                    options.delete(index);
                }}/>
            </div>
        );
    }

    const [optionElemList, setElemList] = React.useState([<OptionInput key={0} index={0}/>]);

    const addVariant = () => {
        setElemList(optionElemList.concat(<OptionInput key={maxIndex} index={maxIndex}/>));
        setMaxIndex(maxIndex + 1);
        console.log(optionElemList);
    }

    return (
        <div
            className="quizEditor"
        >
            <div className="questionWrapper">
                <div className="questionTitle">
                    Ваш вопрос:
                </div>
                <input
                    className="questionInput"
                    type="text"
                    name="question"
                    onChange={handleNameChange}
                    placeholder="Как настроение?"
                />
            </div>
            <div className="optionsWrapper">
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
            </div>

        </div>
    );
};