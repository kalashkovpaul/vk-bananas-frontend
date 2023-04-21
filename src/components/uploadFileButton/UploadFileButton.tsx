import React, { useContext, useState } from "react";
import './uploadFileButton.css';
import styled from 'styled-components';
import Alert from "../Alert";
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import { createError, createSuccess, csrf } from "../../utils/utils";
import {BarLoader} from "react-spinners";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api.config";
import { UserContext } from "../../App";

const Button = styled.button`
    position: relative;
    border-radius: 9999px;
    height: 60px;
    margin: 0;
    align-items: center;
    appearance: none;
    background-color: rgba(52,142,246,1);
    color: #fff;    border: 0;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    box-shadow: 0 0 transparent,0 0 transparent,0 4px 0px #257adc;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    /* padding-left: 16px;
    padding-right: 16px; */
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
`;

const UploadFileButton = () => {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const {userData} = useContext(UserContext);

    const handleClick = () => {
      hiddenFileInput?.current?.click();
    };

    const upload = async (file: File) => {
        setLoading(true);
        if (!file) {
          return;
        }
        let fileType = (file.name.match(/\.[0-9a-z]+$/i) as any)[0];
        if (!userData) {
            createError("Вы авторизованы?", "Пожалуйста, войдите в аккаунт и зарегистрируйтесь");
            setTimeout(() => {
                navigate(`/login`);
            }, 4000);
            return;
        }
        if (fileType !== '.pptx' && fileType !== '.pdf') {
            createError("Ошибка", "Файлы презентации должны иметь расширение pptx или pdf");
            setLoading(false);
            return;
        }

        let formData = new FormData();
        formData.append('presentation', file);

        const token = await csrf();
        fetch(api.presCreate, {
            method: 'POST',
            body: formData,

            headers: {
                "X-CSRF-Token": token as string,
                // 'content-type': 'multipart/form-data',//file.type,
                // // 'boundary': 'presentation',
                // 'content-length': `${file.size}`,
            },
        }).then((res) => {
              return res.json()
            })
            .then((data) => {
                createSuccess("Успех", "Файл был успешно загружен");
                setLoading(false);
                setTimeout(() => {
                    navigate(`/presentation/${data?.presId}`);
                }, 2000);
          })
          .catch((err) => console.error(err));
      };


    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
      const fileUploaded = (event?.target as any).files[0];
      upload(fileUploaded);
    };
    return (
      <>
            <Button className="uploadFileButton addPresentation" onClick={handleClick}>
                <div className="addFileIcon"/>
            {isLoading ? <BarLoader color="#5468ff"/> : "Загрузить презентацию"}
            </Button>
            <input
                accept="pptx"
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{display: 'none'}}
            />
        </>
    );
}

export default UploadFileButton;