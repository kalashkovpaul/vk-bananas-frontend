import { useEffect, useState } from "react";
import type { OptionProps } from "../../types";
import ColorPicker from "../colorPicker/ColorPicker";
import './optionInput.css'

const OptionInput = (props: OptionProps) => {
    const {withColor=true, index, value, color='#0FD400', onChange, withCheckbox=false, checked=false} = props;
    const [option, setOption] = useState<string>(value ? value : "");
    const [curColor, setCurColor] = useState<string>(color ? color : "");
    const [trueIndex, setTrueIndex] = useState<number>(index);
    useEffect(() => {
        // console.log(value, color)
        setOption(value ? value : "");
        setCurColor(color ? color : color);
    }, [value, color]);

    useEffect(() => {
        let child = document.getElementById(`option-${index}`);
        let parent = child?.parentNode;
        let tIndex = Array.prototype.indexOf.call(parent?.children, child);
        setTrueIndex(tIndex);
    }, [index]);

    return (
        <div className="singleOption" id={`option-${index}`}>
            <input
                className="optionInput"
                type="text"
                name="option"
                onChange={(e) => {
                    setOption(e.target.value);
                    onChange(trueIndex, e.target.value, curColor);
                }}
                placeholder="Прекрасное!"
                value={option}
                />
            {withColor && <ColorPicker
                background={color}
                onChange={(newColor: string) => {
                    setCurColor(newColor);
                    onChange(trueIndex, option, newColor);
                }}
            />}
            {withCheckbox && <input
                type="radio"
                value={option}
                name={`option_${index}`}
                checked={checked}
                onClick={(e) => {
                    onChange(trueIndex, option, curColor, !checked);
                }}
                onChange={(e) => {}}
                className="pollSingleOptionInput inEditor"
            />}
            <div className="cross" onClick={() => {
                let child = document.getElementById(`option-${index}`);
                let parent = child?.parentNode;
                let tIndex = Array.prototype.indexOf.call(parent?.children, child);
                setTrueIndex(tIndex);
                child?.remove();
                onChange(tIndex, undefined, undefined)
            }}/>
        </div>
    );
}

export default OptionInput;