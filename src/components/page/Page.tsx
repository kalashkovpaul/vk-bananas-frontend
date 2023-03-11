import React from "react";
import './page.css';

type Props = {
    children: React.ReactElement[];
}

export const Page: React.FunctionComponent<Props> = (props: Props) => {
    const {children} = props;
    return (
        <div
            className="page"
        >
            {children}
        </div>
    )
};