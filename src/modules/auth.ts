import { api } from "../config/api.config";
import type { authcheckResponse, userData } from "../types";
import { csrf } from "../utils/utils";

class Auth {
    public user: userData | {username: ""};
    public setUser: Function = () => {};

    constructor() {
        this.user = {username: ""};
        if (navigator.onLine) {
            this.getUserFromServer().catch((e) => {
                console.log("Unexpected auth error: ", e);
            });
        }


        // this.eventBus.on(events.authPage.logRegSuccess, this.getUserFromSubmit);
        // this.eventBus.on(events.header.logout, this.logoutUser);
        // this.eventBus.on(events.profilePage.render.changedProfile, this.changeUser);
    }

    checkAuth = async () => {
        const token = await csrf();
        const response = await fetch(`${api.checkAuth}`, {
            method: 'GET',
            credentials: 'include',
            body: null,
            headers: {
                "X-CSRF-Token": token as string,
            }
        });
        try {
            return response.json();
        } catch {
            return null;
        }
    }


    getCurrentUser = async (id: string) => {
        const token = await csrf();
        const response = await fetch(`${api.getUser}/${id}`, {
            method: 'GET',
            credentials: 'include',
            body: null,
            headers: {
                "X-CSRF-Token": token as string,
            }
        });
        try {
            return response.json();
        } catch {
            return null;
        }
    }

    getUserFromServer = async () => {
        try {
            const responseCheckAuth = await this.checkAuth();
            if (!responseCheckAuth) {
                return null;
            }
            const parsed = responseCheckAuth as authcheckResponse;
            if (!parsed.status) {
                window.localStorage.removeItem("user");
                // this.eventBus.emit(events.auth.notLoggedIn);
                return null;
            }
            const responseCurrentUser = window.localStorage.getItem("user");
            if (!responseCurrentUser) {
                console.error("failed to retrieve user from localStorage :(");
                return;
            }
            this.user = JSON.parse(responseCurrentUser);
            this.setUser(this.user);
            // this.user = responseCurrentUser.parsedResponse as userData;
            // if (this.user) {
                window.localStorage.setItem("user", JSON.stringify(this.user));
                // this.eventBus.emit(events.auth.gotUser);
            // }
        } catch (err) {
            console.error("err");
            // this.eventBus.emit(events.app.errorPage);
        }
    };

    /**
     * @description Обрабатывает и записывает данные о пользователе,
     * полученные из обработанного ответа с сервера.
     * @param { object } parsedResponse Обработанный ответ с сервера
     */
    getUserFromSubmit = (parsedResponse: userData) => {
        if (!parsedResponse) {
            return;
        }
        this.user = parsedResponse;
        if (this.user) {
            window.localStorage.setItem("user", JSON.stringify(this.user));
            // this.eventBus.emit(events.auth.gotUser); TODO navbar
            // this.lastEvent = events.auth.gotUser;
        }
    };

    setUserFunction(f: Function) {
        this.setUser = f;
        this.setUser(this.user);
    }

    // logoutUser = () => {
    //     logout().then((response) => {
    //         if (!response) {
    //             this.eventBus.emit(events.app.errorPage);
    //         } else if (response.status === statuses.OK) {
    //             window.localStorage.removeItem("user");
    //             this.user = null;
    //             this.lastEvent = events.header.logout;
    //         }
    //     }).catch(() => {
    //         this.eventBus.emit(events.app.errorPage);
    //     });
    // };


    // changeUser = (user: userData) => {
    //     if (!user) {
    //         return;
    //     }
    //     this.user = user;
    //     window.localStorage.setItem("user", JSON.stringify(this.user));
    //     this.eventBus.emit(events.auth.changedUser);
    // };
}

export const authModule = new Auth();
