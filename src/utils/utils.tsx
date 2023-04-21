import { createRoot } from "react-dom/client";
import { Alert } from "../components";
import { api } from "../config/api.config";

let el = document.getElementById("alertWrapper");
let root = el ? createRoot(el) : null;

export function createError(title: string, subTitle: string) {
    setTimeout(() => {
        root?.unmount();
        root = null;
    }, 4000);

    let a =
        <Alert
            title={title}
            subTitle={subTitle}
            iconName="exclamation-circle"
            alertBackgroundColor="#e93e60"
            alertAnimation="rubberBand_animation 1s, 2s dissapear 2s"
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

export function calculateScale(isFullscreen=false, sw: number, sh: number, w: number, h: number) {
    const screenPercent = isFullscreen ? 1 : sw > 1000 ? 0.5 : (sw - 200)/sw;
    const aspectRatio = w / h;
    let width = isFullscreen ? screenPercent * sw : screenPercent * sw - 40;
    let height = width / aspectRatio;
    return {
        width: width,
        height: height
    }
}

export function calculateDemonstrationScale(sw: number, sh: number, w: number, h: number) {
    const screenPercent = sw > 1000 ? 0.6 : (window.innerHeight < window.innerWidth) ? 0.6 : 0.8;
    const aspectRatio = w / h;
    let width = true ? screenPercent * sw : screenPercent * sw - 40;
    let height = width / aspectRatio;
    return {
        sWidth: width,
        sHeight: height
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

export function copyLink(link: string) {
    navigator.clipboard.writeText(link);
}

export function copyQR() {
    const canvas = document.getElementById("react-qrcode-logo") as HTMLCanvasElement;
    if (canvas) {
        canvas.toBlob((blob) => {
            if (blob) {
                const item = new ClipboardItem({"image/png": blob});
                navigator.clipboard.write([item]);
            }
        });
    }
}

export function debounce(func: Function, timeout = 300){
    let timer = 0;
    return (args: any) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => { func(args); }, timeout);
    };
}

let CSRFToken: string | undefined = undefined;

export const csrf = async () => {
    if (CSRFToken === undefined) {
        const headers = {
            "Content-Type": 'application/json',
        }
        const response = await fetch(api.csrf, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: headers,
        });
        CSRFToken = (response.headers.get('X-Csrf-Token') || undefined) as string;
        // console.log(CSRFToken, response.headers.get('X-Csrf-Token'));
    }
    return CSRFToken;
};