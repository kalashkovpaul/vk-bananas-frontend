import React, { useContext, useEffect, useRef, useState } from "react";
import './profile.css'
import { UserContext } from "../../App";
import { api, domain, site } from "../../config/api.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { copyLink, createError } from "../../utils/utils";
import UploadFileButton from "../../components/uploadFileButton/UploadFileButton";
import { NavLink } from "react-router-dom";
import Popup from "reactjs-popup";
import type { shortPres } from "../../types";

const Profile = () => {
    const {userData, setUserData} = useContext(UserContext);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(userData?.imgsrc || "");
    const hiddenFileInput = React.useRef<HTMLButtonElement>(null);
    const [presentations, setPres] = useState<any[]>([]);
    const copyTime = 1000;
    const [isCodeCopied, setCodeCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const [curPres, setCurPres] = useState<shortPres>({
        name: "",
        idx: 0,
        code: "",
        hash: "",
    })

    useEffect(() => {
        fetch(`${api.getProfile}`, {
            method: 'GET',
            headers: {

            }
        }).then(data => {
            return data ? data.json() : {} as any
        })
        .then((data) => {
            setPres(data.presentations);
        })
        .catch(e => {
            console.error(e);
        });
    }, []);

    const onImageSubmit = () => {};

    const upload = (file: File) => {
        if (!file) {
          return;
        }

        let formData = new FormData();
        formData.append('avatar', file);

        fetch(api.setAvatar, {
            method: 'POST',
            body: formData,

            headers: {
                // 'content-type': 'multipart/form-data',//file.type,
                // // 'boundary': 'presentation',
                // 'content-length': `${file.size}`,
            },
        }).then((res) => {
            return res.json()
        })
        .then((data) => {
            setUserData({...userData, img: data.path});
        })
        .catch((err) => console.error(err));
    };


    useEffect(() => {
        if (userData?.imgsrc)
            setImagePreviewUrl(`${domain}${userData.imgsrc}`);
    }, [userData])

    const ImgUpload =({imageSrc=""}) =>
        <label htmlFor="photo-upload" className="customFileUpload fas">
          <div className="imgWrap imgUpload" >
            <FontAwesomeIcon className="uploadIcon" icon={["fas", "upload"]} />
            <img className="profileImg" src={imageSrc}/>
          </div>
          <input id="photo-upload" type="file" onChange={(e: any) =>{
                e.preventDefault();
                const reader = new FileReader();
                const file = e.target.files[0];
                let fileType = (file.name.match(/\.[0-9a-z]+$/i) as any)[0];
                if (fileType !== '.png' && fileType !== '.jpg') {
                    createError("Ошибка", "Изображение должно иметь расширение png или jpg");
                    return;
                }
                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result as string);
                    upload(file);
                }
                reader.readAsDataURL(file);
            }}/>
        </label>

    return (
        <div className="profilePage view-wrapper">
            <div className="profileData">
                <form className="avatar" onSubmit={onImageSubmit}>
                    <ImgUpload imageSrc={imagePreviewUrl}/>
                    <button ref={hiddenFileInput} id="profileSubmit" type="submit"/>
                </form>
                <div className="userData">
                    <div className="userDataName">Имя: {userData?.username}</div>
                    <div className="userDataEmail">Email: {userData?.email}</div>
                    <UploadFileButton/>
                </div>
            </div>
            <div className="profilePresentationData">
                <div className="presentationsTitle">Мои презентации:</div>
                <div className="explanation">
                    <div className="explanationName">Название</div>
                    <div className="explanationCode">Код доступа</div>
                    <div className="explanationCreationDate">Дата создания</div>
                </div>
                {presentations?.map(pres => {
                    return (
                        <div key={pres.idx} className="presItem" onClick={() => {
                            const link = document.getElementById(`hiddenLink${pres.idx}`);
                            link?.click();
                        }}>
                            <NavLink className="hiddenLink" id={`hiddenLink${pres.idx}`} to={`/presentation/${pres.idx}`}/>
                            <div className="presItemName">{pres.name}</div>
                            <Popup
                                on="hover"
                                trigger={open => (
                                    // <div/>
                                    <div className="presItemCode" onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        copyLink(pres.code);
                                        setCodeCopied(true);
                                        setTimeout(() => {
                                            setCodeCopied(false);
                                        }, copyTime);
                                    }}>
                                        {pres.code}
                                    </div>
                                )}
                                position="bottom center"
                            >
                                <div className="copyCodeInvitation">{isCodeCopied ? "Скопировано!" : "Нажмите, чтобы скопировать!"}</div>
                            </Popup>
                            <div className="presItemCreationDate">{pres.creationDate || "Недавно"}</div>
                            <NavLink
                                to={{
                                    pathname: `/presentation/${pres.idx}`,
                                    search: "?isDemonstration=1"
                                }}
                                className="presItemDemonstrate"
                            >
                                <div className="playIconSmall"/>
                                Демонстрировать
                            </NavLink>
                            <div className="presItemKebab" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(o => !o);
                                console.log(pres);
                                setCurPres({...pres});
                            }}/>
                        </div>
                    );
                })}
            </div>
            <Popup
                position={"center center"}
                // offsetX={-0.45 * screenWidth}
                modal={true}
                open={open}
                onClose={closeModal}
            >
                <div className="popupWrapper" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}>
                    <div className="crossWrapper" onClick={() => {
                        setOpen(o => !o);
                    }}>
                        <div className="crossIcon"/>
                    </div>

                    <form className="changePresForm">
                        <label className="changePresLabel">
                            Название:
                            <input
                                className="changePresInput"
                                type="text"
                                value={curPres.name}
                                onChange={(e) => {
                                    setCurPres({...curPres, name: e.target.value})
                                }}
                            />
                        </label>
                        <div className="buttonsArea">
                            <div
                                className="deletePresButton"
                                onClick={(e) => {
                                    // TODO sendDelete
                                    setPres(presentations.filter(pres => {
                                        return pres.idx !== curPres.idx;
                                    }));
                                    setOpen(o => !o);
                                }}
                            >Удалить презентацию</div>
                            <button
                                type="submit"
                                className="savePresButton"
                                onClick={(e) => {
                                    // TODO sendChange
                                    setPres(presentations.map(pres => {
                                        if (pres.idx === curPres.idx)
                                            return curPres;
                                        return pres;
                                    }));
                                    setOpen(o => !o);
                                }}
                            >Сохранить</button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>
    );
}

export default Profile;