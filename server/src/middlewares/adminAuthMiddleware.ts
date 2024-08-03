import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!authHeader || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided.", admin : false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== "superadmin") {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be an admin.", admin : false });
    }
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
