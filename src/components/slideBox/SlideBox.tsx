import React, { Component } from "react";
import './slideBox.css';
import {Slide} from '../slide/Slide';

type SlideBoxProps = {

}

class SlideBox extends Component {
    
    render() {
        return (
            <div
                className="slideBox"
            >
                <Slide/>
            </div>
        );
    }
}

export default SlideBox;