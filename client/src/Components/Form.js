import React from "react";

const Form = () => {
  // const [code, setCode] = useState("");
  // /**
  //  *
  //  * @param {InputEvent} event
  //  */
  // const handleTwoFactorInput = (event) => {
  //   // event.preventDefault();
  //   // console.log(event.target.value);
  //   // event.target.value = event.target.value
  //   console.log(event.key);
  //   if (!isNaN(parseInt(event.key))) {
  //     console.log(code);
  //     console.log(event.key);
  //     console.log(code + event.key);
  //     setCode(code + event.key);
  //   }
  //   // if (event.target.value.length < 6) {
  //   //   setCode(event.target.value);
  //   // }
  // };

  return (
    <>
      <div className="form-container">
        <div className="form">
          <h1 className="form-title">2FA Registration</h1>
          {/* <div className="form-qr">
            <img src="https://chart.googleapis.com/chart?chs=240x240&chld=L|0&cht=qr&chl=otpauth://totp/2fa_Verification%3Abhuvnesh%3Fsecret=55MH5EGYCZXTUUSB2CUMVCBTPUM72J6J%26issuer=2fa_Verification" alt="" />
          </div>
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
            <input type="text" className="form-input twofactor" placeholder="Two Factor Code" inputMode="numeric" type="text" pattern="\d*" maxLength="6" autoCapitalize={false} autoComplete={false} spellCheck={false} />
          </div> */}
          <div className="input-group">
            <span className="placeholder">Full Name</span>
            <input type="text" className="form-input" />
          </div>
          <div className="input-group">
            <span className="placeholder">Username</span>
            <input type="text" className="form-input" />
          </div>
          <div className="input-group">
            <span className="placeholder">Password</span>
            <input type="password" className="form-input" />
          </div>
          <button className="form-submit">Register</button>
        </div>
      </div>
    </>
  );
};

export default Form;
