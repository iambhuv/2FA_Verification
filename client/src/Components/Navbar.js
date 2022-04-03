import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const RenderMyNavs = () => {
  const location = useLocation();
  const k = ["Home", "Register", "Login"];

  // eslint-disable-next-line no-extend-native
  String.prototype.capitalize = function () {
    return `${this[0].toUpperCase()}${this.slice(1)}`;
  };

  let myPath = location.pathname === "/" ? `Home` : `${location.pathname.slice(1).capitalize()}`;

  return (
    <>
      {k.map((i) => {
        return (
          <Link key={k.indexOf(i)} to={i === "Home" ? `/` : `/${i.toLowerCase()}`} className={myPath === i ? "nav-item active" : "nav-item"}>
            {i}
          </Link>
        );
      })}
    </>
  );
};

const Navbar = () => {
  const [toggled, setToggled] = useState(false);
  return (
    <div className="navbar">
      <div className="upper">
        <div className="logo">
          <h1>2FA Verificator</h1>
        </div>
        <div className="menu_icon" onClick={() => setToggled(!toggled)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={toggled ? "navs opened" : "navs"}>
        <RenderMyNavs />
      </div>
    </div>
  );
};

export default Navbar;
