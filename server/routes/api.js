const app = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
// const saltRounds = 10;
const twofactor = require("node-2fa");

app.get("/", (_req, res) => {
  res.json({ k: "k" });
});

app.post("/register", async (req, res) => {
  try {
    if (!req.body?.password?.trim() || !req.body?.username?.trim() || !req.body?.name?.trim()) {
      return res.status(400).json({ ok: false, msg: "Fill Proper Credentials!" });
    }
    const i = (o, ...s) => s.map((_) => o[_].trim());
    const [username, name, password] = i(req.body, "username", "name", "password");

    if (await User.findOne({ username })) {
      return res.status(400).json({ ok: false, msg: "Username Already Exists!" });
    }

    if (password.trim().length < 5) {
      return res.status(400).json({ ok: false, msg: "Password length must be more than 5" });
    }

    const newSecret = twofactor.generateSecret({ name: "2fa_Verification", account: username });

    return res.status(200).json({ ok: true, status: 101, msg: "Authentication Required!", twofactor: newSecret });
  } catch (err) {
    res.status(500).json({ msg: err.toString() });
  }
});
app.post("/register/finish", async (req, res) => {
  try {
    if (!req.body?.password?.trim() || !req.body?.username?.trim() || !req.body?.name?.trim() || !req.body?.twofactor_token || !req.body?.twofactor_code) {
      return res.status(400).json({ ok: false, msg: "Fill Proper Credentials!" });
    }
    const i = (o, ...s) => s.map((_) => o[_].trim());
    const [username, name, password, twofactor_token, twofactor_code] = i(req.body, "username", "name", "password", "twofactor_token", "twofactor_code");

    const matched = twofactor.verifyToken(twofactor_token, twofactor_code);

    if (await User.findOne({ username })) {
      return res.status(400).json({ ok: false, msg: "Username Already Exists!" });
    }

    if (password.trim().length < 5) {
      return res.status(400).json({ ok: false, msg: "Password length must be more than 5" });
    }

    if (!matched) {
      return res.status(400).json({ ok: false, msg: "Invalid Two factor Code" });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      password: hashed_password,
      username,
      name,
      twofactor: twofactor_token,
    });

    await newUser.save();

    return res.status(200).json({ ok: true, msg: "Successfully Registered" });
  } catch (err) {
    res.status(500).json({ msg: err.toString() });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username: username = null, password: password = null, twofactor_code: twofacode = null, twofatoken: token = null } = req.body;

    if (!password || !username) {
      return res.status(400).json({ ok: false, msg: "Invalid Login" });
    }

    if (token) {
      const matched = twofactor.verifyToken(token, twofacode);

      const verify = await User.findOne({ username });

      if (!verify) {
        return res.status(400).json({ ok: false, msg: "Invalid login" });
      }

      const check = await bcrypt.compare(password, verify.password);

      if (!check || !matched) {
        return res.status(400).json({ ok: false, msg: "Invalid login" });
      }

      let backup = { ...verify._doc };

      delete backup.password;
      delete backup.__v;
      delete backup._id;

      res.status(200).json({ ok: true, msg: "Successfully logged in!", user: backup });
    } else {
      const verify = await User.findOne({ username });

      if (!verify) {
        return res.status(400).json({ ok: false, msg: "Invalid login" });
      }

      const check = await bcrypt.compare(password, verify.password);

      if (!check) {
        return res.status(400).json({ ok: false, msg: "Invalid login" });
      }

      res.status(200).json({ msg: "need 2fa verification", "2fa_token": verify.twofactor });
    }
  } catch (err) {
    res.status(500).json({ msg: err.toString() });
  }
});

module.exports = app;
