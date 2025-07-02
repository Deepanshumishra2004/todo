"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
const pgClient = new pg_1.Client({
    user: "neondb_owner",
    password: "npg_K0Qbu3EymSNj",
    port: 5432,
    host: "ep-cool-snowflake-a16il54x-pooler.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    ssl: true
});
pgClient.connect();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const userpassword = req.body.password;
    const password = yield bcrypt_1.default.hash(userpassword, 5);
    console.log("hash password :", password);
    const query = `INSERT INTO users (username, email, password) VALUES ($1,$2,$3);`;
    yield pgClient.query(query, [username, email, password]);
    res.json({
        message: "you have signed up"
    });
}));
// @ts-ignore
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const query1 = `SELECT * FROM users WHERE email=$1;`;
        const result = yield pgClient.query(query1, [email]);
        if (result.rows.length === 0) {
            return res.status(403).json({ message: "incorrect credentials" });
        }
        const users = result.rows[0];
        const isMatch = yield bcrypt_1.default.compare(password, users.password);
        if (!isMatch) {
            return res.status(403).json({ message: "invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: users.id, email: users.email }, config_1.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ message: "successfully signed in", token });
    }
    catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({ message: "Internal system error" });
    }
}));
//@ts-ignore
app.post("/todo", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tittle, decription, completed } = req.body;
    const user_id = req.user.id;
    console.log("user_id : ", user_id);
    try {
        const query = `INSERT INTO todos (user_id, tittle, decription, completed) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = yield pgClient.query(query, [user_id, tittle, decription, completed]);
        console.log("todo is :", result.rows[0]);
        res.json({
            data: result.rows[0]
        });
    }
    catch (e) {
        console.error("Error inserting todo:", e.message);
        res.status(403).json({ message: "Failed to creaete todo", error: e.message });
    }
}));
// @ts-ignore
app.get("/todo", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user.id;
    const query = `SELECT * FROM todos WHERE user_id = $1`;
    const result = yield pgClient.query(query, [user_id]);
    res.json({
        data: result.rows
    });
}));
// @ts-ignore
app.put("/todo/:id", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user.id;
    const todo_id = req.params.id;
    try {
        const { tittle, decription, completed } = req.body;
        const query = `UPDATE todos SET tittle=$1 , decription = $2, completed = $3 
                WHERE id = $4 AND user_id = $5
                RETURNING *;`;
        const result = yield pgClient.query(query, [tittle, decription, completed, todo_id, user_id]);
        res.json({ message: "Todo is updated", data: result.rows[0] });
    }
    catch (e) {
        console.error("Error updating todo : ", e);
        res.status(500).json({ message: "Failed to update todo" });
    }
}));
// @ts-ignore
app.delete("/todo/:id", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo_id = req.params.id;
    const user_id = req.user.id;
    try {
        const query = `DELETE FROM todos WHERE id = $1 AND user_id = $2;`;
        const result = yield pgClient.query(query, [todo_id, user_id]);
        res.json({ message: "Todo is deleted" });
    }
    catch (e) {
        console.error("Error deleting todo : ", e);
        res.status(500).json({ message: "Failed to delete todo" });
    }
}));
app.listen(3000);
