export type MiniSlideData = {
    i: number;
    src: string;
}

export type SideBarData = {
    slides: Array<MiniSlideData>;
}

export type OptionProps = {
    index: number;
    key: number;
    withColor?: boolean;
    value?: string;
    color?: string;
    onChange: Function;
}

export type OptionData = {
    idx: number;
    option: string;
    votes: number;
    color: string;
}

export type SingleSlideData = {
    idx: number;
    name: string;
    quizId: number;
    width: number;
    height: number;
    kind: "slide" | "question";
    questionKind: "" | BarKind;
    question: string;
    vote: Array<OptionData>;
    background: string;
    fontColor: string;
    graphColor: string;
    fontSize: 16;
}

export type PresData = {
    url: string,
    slideNum: number,
    quizNum: number,
    slides: Array<SingleSlideData>;
};

type ColorPickerProps = {
    background: string;
    onChange: Function;
    position?: "left" | "right" |"up";
}

type ColorPickerState = {
    background: string;
    visibility: boolean;
    isShown: boolean;
}

type BarKind = "horizontal"|"vertical"|"pie"|"cloud"|"doughnut";

type CustomBarProps = {
    slide: SingleSlideData,
    kind: BarKind,
};

type UpdateModeType = "default" | "resize" | "reset" | "none" | "hide" | "show" | "active" | undefined;