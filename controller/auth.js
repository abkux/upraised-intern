import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing values such as name, password." });
    }

    const existingUser = await prisma.userAccount.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already in use, Please log-in" });
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const result = await prisma.userAccount.create({
      data: {
        email: email,
        password: passwordHash,
      },
    });

    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: { id: result.id, email: result.email },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong, Error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing values such as email, password." });
    }

    const fetchUser = await prisma.userAccount.findUnique({
      where: {
        email,
      },
    });

    if (!fetchUser) {
      return res
        .status(404)
        .json({
          message: "No User found with that email. Please create an account.",
        });
    }

    const passwordMatch = await bcrypt.compare(password, fetchUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect Passowrd." });
    }

    const token = jwt.sign({ id: fetchUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ id: fetchUser.id, token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong, Error: ${error.message}` });
  }
};
