import React, { useState } from "react";
import './uploadFileButton.css';
import styled from 'styled-components';
import Alert from "../Alert";
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import { createSuccess } from "../../utils/utils";
import {BarLoader} from "react-spinners";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
    position: relative;
    border-radius: 8px;
    height: 60px;
    margin: 4px;
    align-items: center;
    appearance: none;
    background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
    border: 0;
    box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
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

    const handleClick = () => {
      hiddenFileInput?.current?.click();
    };

    const upload = (file: File) => {
        setLoading(true);
        if (!file) {
          return;
        }

        // 👇 Uploading the file using the fetch API to the server
        fetch('https://httpbin.org/post', {
          method: 'POST',
          body: file,
          // 👇 Set headers manually for single file upload
          headers: {
            'content-type': file.type,
            'content-length': `${file.size}`, // 👈 Headers need to be a string
          },
        })
          .then((res) => {
              return res.json()
            })
            .then((data) => {
                console.log(data)
                createSuccess("Успех", "Файл был успешно загружен");
                setLoading(false);
                setTimeout(() => {
                    navigate("/presentation");
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
            <Button className="uploadFileButton bar-button addPresentation" onClick={handleClick}>
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