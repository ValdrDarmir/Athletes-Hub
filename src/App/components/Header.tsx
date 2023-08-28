import React from 'react';
import {Link} from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
    return (
        <div className="flex items-center justify-between m-2">
            <Link to="/" className="w-1/6">
                <img src={logo} alt="Logo"/>
            </Link>
            <label htmlFor="my-drawer" className="btn btn-sm btn-circle btn-ghost">
                <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 512 512">
                    <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/>
                </svg>
            </label>
        </div>
    );
}

export default Header;
