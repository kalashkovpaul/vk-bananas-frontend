import { createRoot } from "react-dom/client";
import { Alert } from "../components";

export function createError(title: string, subTitle: string) {
    let a =
        <Alert
            title={title}
            subTitle={subTitle}
            iconName="exclamation-circle"
            alertBackgroundColor="#e93e60"
            alertAnimation="rubberBand_animation 1s, 1s dissapear 1s"
        />;
    let el = document.getElementById("alertWrapper");
    if (el) {
        let root = createRoot(el);
        root.render(a);
    }
}

export function createSuccess(title: string, subTitle: string) {
    let a =
        <Alert
            title={title}
            subTitle={subTitle}
            iconName="circle-check"
            alertBackgroundColor="#50C878"
            alertAnimation="rubberBand_animation 1s, 4s dissapear 1.5s"
        />;
    let el = document.getElementById("alertWrapper");
    if (el) {
        let root = createRoot(el);
        root.render(a);
    }
}