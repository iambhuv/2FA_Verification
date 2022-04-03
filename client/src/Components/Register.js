import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Form from "./Form";

const Register = () => {
  const navigate = useNavigate();
  const [qrLoaded, setQrLoaded] = useState(false);
  const [data, setData] = useState({ name: "", username: "", password: "" });
  const [twoFactorMode, setTwoFactorMode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const { name, password, username } = data;

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

  const finishRegistration = async () => {
    const res = await fetch("/api/register/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password, username, twofactor_token: twoFactorMode.secret, twofactor_code: twoFactorCode }),
    });

    const data = await res.json();

    if (res.status !== 200) {
      return error(data.msg);
    }

    const elem = document.querySelector(".form");
    if (elem) {
      elem.innerHTML = `<h1>Registeration Success</h1><h2 class=" form-message">Redirecting...</h2>`;
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  const handle2faInput = async (event) => {
    const getFirstNonEmptyValue = (arr) => {
      return arr.filter((e) => !!e?.trim())[0];
    };
    const pressedKey = getFirstNonEmptyValue(event.target.value.split(twoFactorCode));
    if (!pressedKey ? true : !isNaN(parseInt(pressedKey))) {
      setTwoFactorCode(event.target.value.trim());
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !password.trim() || !username.trim()) {
      return error("Fill Proper Credentials");
    }

    if (password.trim().length < 5) {
      return error("Password must be more than 5 in length");
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password, username }),
    });

    const jsonData = await res.json();

    if (res.status !== 200) {
      return error(jsonData.msg);
    }

    if (jsonData?.status === 101) {
      setTwoFactorMode(jsonData.twofactor);
    }
  };

  const fetchQR = async (url) => {
    const res = await fetch(url);
    const rawData = await res.arrayBuffer();

    function convertToBase64(input) {
      const uInt8Array = new Uint8Array(input);
      const count = uInt8Array.length;

      // Allocate the necessary space up front.
      const charCodeArray = new Array(count);

      // Convert every entry in the array to a character.
      for (let i = count; i >= 0; i--) {
        charCodeArray[i] = String.fromCharCode(uInt8Array[i]);
      }

      // Convert the characters to base64.
      const base64 = btoa(charCodeArray.join(""));
      return base64.toString();
    }

    console.log(convertToBase64(rawData));
    setQrLoaded(`data:image/png;base64,${convertToBase64(rawData)}`);
  };

  if (twoFactorMode) {
    fetchQR(twoFactorMode.qr.replace(/166/g, "240"));
  }

  return (
    <>
      <div className="form-container">
        <div className="form">
          <h1 className="form-title">2FA Registration</h1>
          {twoFactorMode ? (
            <>
              <div className="form-qr">{qrLoaded ? <img src={qrLoaded} alt="Authenticator QR" /> : <h1>Loading...</h1>}</div>
              <div className="instructions">
                <h3>Instructions: </h3>
                <p>
                  1. Scan the QR Code with any Authenticator App <br />
                  &nbsp;&nbsp;&nbsp;(for eg. Google Authenticator, Microsoft Authenticator).
                </p>
                <p>2. Enter the Code here To Finish Registration.</p>
                <p>Note: The Code is Refreshed Every Minute.</p>
              </div>
              <div className="input-group">
                <span className="placeholder">Two Factor Code</span>
                <input type="text" className="form-input twofactor" value={twoFactorCode} onChange={handle2faInput} placeholder="2FA Code" inputMode="numeric" pattern="\d*" maxLength="6" autoCapitalize={false} autoComplete={false} spellCheck={false} />
              </div>
              <div className="form-error-container"></div>
              <button className={twoFactorCode.trim().length < 6 ? "form-submit disabled" : "form-submit"} onClick={finishRegistration}>
                Register
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <span className="placeholder">Full Name</span>
                <input type="text" className="form-input" defaultValue={name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              </div>
              <div className="input-group">
                <span className="placeholder">Username</span>
                <input type="text" className="form-input" defaultValue={username} onChange={(e) => setData({ ...data, username: e.target.value })} />
              </div>
              <div className="input-group">
                <span className="placeholder">Password</span>
                <input type="password" className="form-input" defaultValue={password} onChange={(e) => setData({ ...data, password: e.target.value })} />
              </div>
              <div className="form-error-container"></div>
              <button className="form-submit" onClick={handleRegister}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
