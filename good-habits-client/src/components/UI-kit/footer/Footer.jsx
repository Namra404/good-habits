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
            <Link className="footer-button" to={'/goal-added'}>
                <HomeIcon className={pathname === '/goal-added'? 'footer-active-button': 'footer-inactive-button'} alt="Home"/>
            </Link>
            <Link className="footer-button " to={'/goal'}>
                <ActivityIcon className={pathname === '/goal'? 'footer-active-button': 'footer-inactive-button'} alt="Activity"/>
            </Link>
            <Link className="footer-button" to={'/settings'}>
                <SettingsIcon className={pathname === '/settings'? 'footer-active-button': 'footer-inactive-button'} alt="Settings"/>
            </Link>
        </footer>
    );
};

export default Footer;
