"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleWare = (req, res, next) => {
    const header = req.headers["authorization"];
    console.log('token : ', header);
    if (!header)
        return res.json({ message: "Token is missing" });
    try {
        const user = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (e) {
        res.status(403).json({ message: "invalid or expired token" });
    }
};
exports.userMiddleWare = userMiddleWare;
