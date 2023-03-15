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
    option: string;
    votes: number;
    color: string;
}

export type SingleSlideData = {
    index: number;
    src: string;
    kind: "slide" | "question";
    questionKind: "" | BarKind;
    question: string;
    options: Array<OptionData>;
    background: string;
    fontColor: string;
    graphColor: string;
}

export type PresData = {
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