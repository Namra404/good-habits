import React from "react";
import "./Footer.css";
import { ReactComponent as HomeIcon} from "@/assets/home.svg";
import { ReactComponent as ActivityIcon} from "@/assets/activity.svg";
import { ReactComponent as SettingsIcon} from "@/assets/settings.svg";
import {Link, useLocation} from "react-router-dom";


const Footer = () => {
    const {pathname} = useLocation();

    console.log(pathname);
    return (
        <footer className="footer">
            <Link className="footer-button" to={'/'}>
                <HomeIcon className={pathname === '/'? 'footer-active-button': 'footer-inactive-button'} alt="Home"/>
            </Link>
            <Link className="footer-button " to={'/progress'}>
                <ActivityIcon className={pathname === '/progress'? 'footer-active-button': 'footer-inactive-button'} alt="Activity"/>
            </Link>
            <Link className="footer-button" to={'/profile'}>
                <SettingsIcon className={pathname === '/profile'? 'footer-active-button': 'footer-inactive-button'} alt="Settings"/>
            </Link>
        </footer>
    );
};

export default Footer;
