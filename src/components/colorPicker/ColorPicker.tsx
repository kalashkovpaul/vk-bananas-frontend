import React, { useRef } from "react";
import './colorPicker.css';
import { SketchPicker } from 'react-color';
import type { ColorPickerProps, ColorPickerState } from "../../types";

class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
    constructor(props: ColorPickerProps) {
        super(props);
        this.state = {
            background: props.background,
            visibility: false,
            isShown: false,
        };
    }

    handleChange = (color: any) => {
        if (this.state.background !== color.hex) {
            this.setState({ background: color.hex });
            this.props.onChange(color.hex);
        }
    };



    render() {
        return (
            <div
                className="colorPicker"
                onMouseEnter={() => {this.setState({isShown: true})}}
                onMouseLeave={() => {this.setState({isShown: false})}}
            >
                {!this.state.isShown && <div
                    className="preview"
                    style={{
                        backgroundColor: this.state.background
                    }}
                />}
                {this.state.isShown && <SketchPicker
                    color={ this.state.background }
                    onChange={ this.handleChange }
                    className={this.props.position === "right" ? "sketchPickerRight" :
                        this.props.position === "up" ? "sketchPickerUp" : "sketchPicker"}
                    disableAlpha={true}
                />}
            </div>
        );
    }
}

export default ColorPicker;