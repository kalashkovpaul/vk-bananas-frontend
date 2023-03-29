import React, { type FunctionComponent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../config/api.config";
import './demonstration.css';

const Demonstration: FunctionComponent = () => {
    const updateTime = 1000;
    const params = useParams();
    const hash = params.hash;
    const location = useLocation();

    const getInfo = () => {
        fetch(`${api.getDemonstration}/${hash}`, {
            method: 'GET',
            // body: JSON.stringify({
            //     creatorId: 1
            // }),

            headers: {

            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((presdata) => {
            
        })
        .catch(e => {
            console.error(e);
        });
    };

    return (
        <div className="demonstration view-wrapper">


        </div>
    );
};

export default Demonstration;