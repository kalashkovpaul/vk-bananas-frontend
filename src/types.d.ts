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
    questionKind: "" | "verticalbar";
    question: string;
    options: Array<OptionData>;
    background: string;
}

export type PresData = {
    slides: Array<SingleSlideData>;

};