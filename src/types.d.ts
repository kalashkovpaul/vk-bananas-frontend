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
    kind: "slide" | "question" | "userQuestion";
    type: "" | BarKind;
    question: string;
    votes: Array<OptionData>;
    background: string;
    fontColor: string;
    graphColor: string;
    fontSize: string;
}

export type Emotions = {
    like: number;
    love: number;
    laughter: number;
    surprise: number;
    sad: number;
}

export type PresData = {
    name: string;
    emotions: {
        like: number;
        love: number;
        laughter: number;
        surprise: number;
        sad: number;
    }
    url: string,
    code: string,
    hash: string,
    slideNum: number,
    quizNum: number,
    width: number,
    height: number,
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
    width: number,
    height: number,
    top: number,
    left: number,
};

type UpdateModeType = "default" | "resize" | "reset" | "none" | "hide" | "show" | "active" | undefined;

export type authInputs = {
    emailInput: input,
    nameInput: input,
    passwordInput: input,
    repeatePasswordInput: input
}

export type input = {
    type: string,
    name: string,
    placeholder: string,
    title: string,
}

export type authInputElements = {
    emailInput: JSX.Element,
    nameInput: JSX.Elementut,
    passwordInput: JSX.Elementut,
    repeatePasswordInput: JSX.Elementput
}

export type loginData = {
    email: string,
    password: string,
}

export type registerData = {
    email: string,
    password: string,
    repeatpassword: string,
    username: string,
    img: string,
}

export type authcheckResponse = {
    status: boolean;
}

export type userData = {
    id: string,
    username: string,
    email: string,
    imgsrc: string,
}

export type userQuestion = {
    idx: number;
    question: string;
    likes: number;
}

export type shortPres = {
    name: string,
    id: number,
    code: string,
    hash: string,
}

