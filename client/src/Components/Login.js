import React, { useState } from "react";

const Login = () => {
  const [twoFactorMode, setTwoFactorMode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [data, setData] = useState({ username: "", password: "" });

  const error = (err) => {
    const elem = document.querySelector(".form-error-container");
    if (elem) {
      if (global.error_timout) {
        clearTimeout(global.error_timout);
      }
      elem.innerHTML = `<span class="form-error">${err}</span>`;
    }

    global.error_timout = setTimeout(() => (elem.innerHTML = ``), 10000);
  };

  const handle2faInput = (event) => {
    const getFirstNonEmptyValue = (arr) => {
      return arr.filter((e) => !!e?.trim())[0];
    };
    const pressedKey = getFirstNonEmptyValue(event.target.value.split(twoFactorCode));
    if (!pressedKey ? true : !isNaN(parseInt(pressedKey))) {
      setTwoFactorCode(event.target.value.trim());
    }
  };

  const finishLogin = async () => {
    const { username, password } = data;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, username, twofactor_code: twoFactorCode, twofatoken: twoFactorMode }),
    });

    const jsonData = await res.json();

    if (res.status !== 200) {
      return error(jsonData.msg);
    }

    const elem = document.querySelector(".form");
    if (elem) {
      elem.innerHTML = `<h1>Hello ${jsonData.user.name}</h1><h2 class="form-message">You Successfully Logged in...</h2>`;
    }

    // console.log(jsonData);
  };

  const handleLogin = async () => {
    const { username, password } = data;
    if (!password.trim() || !username.trim()) {
      return error("Invalid Login");
    }

    if (password.trim().length < 5) {
      return error("Invalid Login");
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, username }),
    });

    const jsonData = await res.json();

    if (res.status !== 200) {
      return error(jsonData.msg);
    }

    setTwoFactorMode(jsonData["2fa_token"]);
  };

  return (
    <>
      <div className="form-container">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="form-title">2FA Login</h1>
          {twoFactorMode ? (
            <>
              <div className="input-group">
                <span className="placeholder">Two Factor Code</span>
                <input type="text" className="form-input twofactor" value={twoFactorCode} onChange={handle2faInput} placeholder="2FA Code" inputMode="numeric" pattern="\d*" maxLength={6} autoCapitalize="false" autoComplete="false" spellCheck="false" />
              </div>
              <div className="form-error-container"></div>
              <button className={twoFactorCode.trim().length < 6 ? "form-submit disabled" : "form-submit"} disabled={twoFactorCode.trim().length < 6 ? !0 : !1} onClick={finishLogin}>
                Login
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <span className="placeholder">Username</span>
                <input type="text" className="form-input" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
              </div>
              <div className="input-group">
                <span className="placeholder">Password</span>
                <input type="password" className="form-input" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
              </div>
              <div className="form-error-container"></div>
              <button type="submit" className="form-submit" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
