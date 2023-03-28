import { createRoot } from "react-dom/client";
import { Alert } from "../components";

let el = document.getElementById("alertWrapper");
let root = el ? createRoot(el) : null;

export function createError(title: string, subTitle: string) {
    setTimeout(() => {
        root?.unmount();
        root = null;
    }, 2000);

    let a =
        <Alert
            title={title}
            subTitle={subTitle}
            iconName="exclamation-circle"
            alertBackgroundColor="#e93e60"
            alertAnimation="rubberBand_animation 1s, 1s dissapear 1s"
        />;
    let el = document.getElementById("alertWrapper");
    if (root) {
        root.render(a);
    } else {
        el = document.getElementById("alertWrapper");
        if (el) {
            root = createRoot(el);
            root.render(a);
        }
    }
}

export function createSuccess(title: string, subTitle: string) {
    setTimeout(() => {
        root?.unmount();
        root = null;
    }, 2000);

    let a =
        <Alert
            title={title}
            subTitle={subTitle}
            iconName="circle-check"
            alertBackgroundColor="#50C878"
            alertAnimation="rubberBand_animation 1s, 4s dissapear 1.5s"
        />;
        if (root) {
            root.render(a);
        } else {
            el = document.getElementById("alertWrapper");
            if (el) {
                root = createRoot(el);
                root.render(a);
            }
        }
}

export function calculateScale(sw: number, sh: number, w: number, h: number) {
    const screenPercent = sw > 1000 ? 0.5 : (sw - 200)/sw;
    const aspectRatio = w / h;
    let width = screenPercent * sw - 40;
    let height = width / aspectRatio;
    return {
        width: width,
        height: height
    }
}

export function calculateMiniScale(sw: number, sh: number, w: number, h: number) {
    let screenPercent = sw < 600 ? 0.86 : 0.15 * sw > 200 ? 0.115 : 154/sw;
    const aspectRatio = w / h;
    let width = screenPercent * sw;
    let height = width / aspectRatio;
    return {
        mWidth: width,
        mHeight: height
    }
}