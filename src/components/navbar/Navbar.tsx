import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, type FunctionComponent } from 'react';
import { routes } from '../../config/routes.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as ReactSeoLogoSvg } from '../assets/img/ReactSeoLogo.svg';
import './navbar.css';
import { UserContext } from '../../App';
import { api } from '../../config/api.config';
import { authModule } from '../../modules/auth';
import { csrf } from '../../utils/utils';

const Navbar = () => {
    const {userData, setUserData} = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const removeLogoutButton = () => {
        const logoutBtn = [...Object.values(document.querySelectorAll('.navbar__vertical-menu__btn-container a'))]
            .find((elem) => elem.textContent?.includes('Выйти'));
        if (logoutBtn) {
            logoutBtn.remove();
        }
    };

    const addEventListenerToVerticalMenu = () => {
        const burgerButton = document.querySelector('.verticalMenuBtn');
        const burgerButtonList = document.querySelectorAll('.verticalMenuContainer');

        if (!burgerButton) { return; }
        const verticalMenu = document.querySelector('.verticalMenuContainer') as HTMLElement;
        if (!verticalMenu) { return; }
        burgerButton.addEventListener("click", () => {
            if (burgerButton.classList.contains('open')) {
                burgerButton.classList.remove("open");
                verticalMenu.style.display = "none";
            } else {
                burgerButton.classList.add("open");
                verticalMenu.style.display = "flex";
            }
        });
        burgerButtonList.forEach((button) => {
            button.addEventListener("click", () => {
                burgerButton.classList.remove("open");
                verticalMenu.style.display = "none";
            });
        });

    };

    useEffect(() => {
        addEventListenerToVerticalMenu();
        authModule.setUserFunction(setUserData);
    }, [])

    useEffect(() => {
        if (userData.username)
            addEventListenerToVerticalMenu();
    }, [userData.username]);

    const onJoin = async () => {
        const input = document.getElementById("joinInput") as HTMLInputElement;
        if (input) {
            const value = input.value;
            if (value && value.length === 4) {
                console.log("JOIN: ", value);
                const token = await csrf();
                fetch(`${api.getHash}/${value}`, {
                    method: 'GET',
                    // body: JSON.stringify({
                    //     code: value
                    // }),
                    headers: {
                        "X-CSRF-Token": token as string,
                    }
                    //     'content-type': 'application/json'
                    // }
                }).then((response) => {
                    console.log(response.status);
                    return response.status === 404 ? {} : response.json();
                }).then(response => {
                    if ((response as any).hash) {
                        navigate(`/demonstration/${(response as any).hash}`);
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }
        }
    }

    const onLogout = async () => {
        const token = await csrf();
        fetch(`${api.logout}`, {
            method: 'PUT',
            body: JSON.stringify({
            }),
            headers: {
                "X-CSRF-Token": token as string,
            }
        }).catch(e => {
            console.error(e);
        });
        authModule.user = {username: ""};
        window.localStorage.removeItem("user");
    }

    if (location.pathname.includes("demonstration")) {
        return null;
    }

    return (
        <nav
            role="navigation"
            className="my_navbar"
            aria-label="Main navigation"
        >
            {!location.pathname.includes("presentation") &&
            <div className="joinBlock">
                <div className="joinInvitation">Хотите присоединиться?</div>
                <div className="joinInputBlock">
                    <input
                        id="joinInput"
                        className="joinInput"
                        placeholder="4-значный код"
                        maxLength={4}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onJoin();
                            }
                        }}
                        autoComplete="off"
                        onInput={() => {
                            const input = document.getElementById("joinInput") as HTMLInputElement;
                            if (input) {
                                const value = input.value;
                                input.value = value.toUpperCase();
                            }
                        }}
                    />
                    <NavLink
                        className="joinButton"
                        to='/presentation'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onJoin();
                        }}
                    >
                        Присоединиться
                    </NavLink>
                </div>
            </div>}
            <div className="navbarWrapper">
                {userData?.username && <div className="verticalMenu">
                    <div className='verticalMenuBtn'>
                        <div className='burgerLeft' />
                        <div className='burgerRight' />
                    </div>
                    <div className='verticalMenuContainer'>
                        <NavLink className="menuBtn" to='/profile'> Профиль </NavLink>
                    </div>
                </div>}
                <NavLink className='ourLogo' to='/'>
                    <div className="logoImg"/>
                    KindaSlides
                </NavLink>
                {userData?.username && <div className="navbarMenu">
                    <div className="profileMenu">
                        <NavLink className="menuBtn" to='/profile'> Профиль </NavLink>
                    </div>
                </div>}

                {userData?.username ?
                    <div className="navbarLogin" onClick={(e) => {
                        e.preventDefault();
                        setUserData({username: ""});
                        onLogout();
                    }}>
                        <NavLink to="/" className="navbarLoginBtn">Выйти</NavLink>
                    </div> :
                    <div className="navbarLogin">
                        <NavLink className="navbarLoginBtn" to="/login">Войти</NavLink>
                    </div>
                }

                {/* <div className="navbar-routes">
                {routes.map(({ path, name }) => (
                    <NavLink
                    end
                    to={path}
                    key={path}
                    className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}
                    >
                    <span>{name}</span>
                    </NavLink>
                ))} */}
                {/* <div className="seperator" /> */}
                {/* <a
                    target="_blank"
                    aria-label="GitHub"
                    className="navbar-item"
                    rel="noopener noreferrer"
                    href="https://github.com/kalashkovpaul"
                >
                    <span>GitHub</span>
                    <FontAwesomeIcon icon="external-link-alt" />
                </a> */}
                {/* <div className="navbar-theme-toggle">
                    <ToggleTheme />
                </div> */}
                {/* </div> */}
            </div>
        </nav>
    );
}

export default Navbar;
