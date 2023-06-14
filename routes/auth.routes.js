const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = Router();

//Endpoint (register) /api/auth/register
router.post(
  "/register",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Мин кол-во символов: 6").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      console.log("Body:", req.body);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      console.log(user);

      await user.save();

      res.status(201).json({ message: "Пользователь создан" });

      //то, что отправляем с фронтенд
    } catch (err) {
      res.status(500).json({ message: "Что-то пошло не так" });
    }
  }
);

//Endpoint (login) /api/auth/login
router.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему",
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Неверный пароль, попробуйте снова!" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });

      //то, что отправляем с фронтенд
    } catch (err) {
      res.status(500).json({ message: "Что-то не так пошло" });
    }
  }
);

module.exports = router;
