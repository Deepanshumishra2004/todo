import express from "express";
import { Client } from "pg";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config";
import { userMiddleWare } from './middleware';
import bcrypt from "bcrypt";
import cors from "cors";



const app = express();
app.use(express.json())

app.use(cors());
app.use(cors({origin: "http://localhost:5173"}));

const pgClient = new Client({
    user:"neondb_owner",
    password:"npg_K0Qbu3EymSNj",
    port:5432,
    host:"ep-cool-snowflake-a16il54x-pooler.ap-southeast-1.aws.neon.tech",
    database:"neondb",
    ssl:true
})
pgClient.connect()

app.post("/signup",async (req,res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const userpassword = req.body.password;

    const password = await bcrypt.hash(userpassword,5);
    console.log("hash password :",password);

    const query = `INSERT INTO users (username, email, password) VALUES ($1,$2,$3);`
    await pgClient.query(query,[username,email,password]);

    res.json({
        message : "you have signed up"
    })
})
// @ts-ignore
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const query1 = `SELECT * FROM users WHERE email=$1;`;
        const result = await pgClient.query(query1, [email]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "incorrect credentials" });
        }

        const users = result.rows[0];

        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.status(403).json({ message: "invalid email or password" });
        }

        const token = jwt.sign({ id: users.id, email: users.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.json({ message: "successfully signed in", token });
    } catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({ message: "Internal system error" });
    }
});


//@ts-ignore
app.post("/todo",userMiddleWare,async(req,res)=>{
    const {tittle , decription, completed}=req.body;

    const user_id = (req as any).user.id;
    console.log("user_id : ",user_id);

    try{
        const query = `INSERT INTO todos (user_id, tittle, decription, completed) VALUES ($1, $2, $3, $4) RETURNING *`
        const result = await pgClient.query(query,[user_id ,tittle,decription,completed]);
    
        console.log("todo is :",result.rows[0])


        res.json({
            data: result.rows[0]
        })
    }catch(e:any){
        console.error("Error inserting todo:", e.message);
        res.status(403).json({message: "Failed to creaete todo", error: e.message});
    }

})
// @ts-ignore
app.get("/todo", userMiddleWare, async (req, res) => {
    const user_id = (req as any).user.id;

    const query = `SELECT * FROM todos WHERE user_id = $1`;
    const result = await pgClient.query(query, [user_id]);

    res.json({
        data: result.rows
    });
});
// @ts-ignore
app.put("/todo/:id", userMiddleWare,async (req,res)=>{
    const user_id = (req as any).user.id;
    const todo_id = req.params.id;

    try{
        const {tittle,decription,completed}=req.body;
        
        const query = `UPDATE todos SET tittle=$1 , decription = $2, completed = $3 
                WHERE id = $4 AND user_id = $5
                RETURNING *;`
        const result =await pgClient.query(query,[tittle,decription,completed,todo_id,user_id])
        
        res.json({message : "Todo is updated", data : result.rows[0]})
    }catch(e){
        console.error("Error updating todo : ",e)
        res.status(500).json({message : "Failed to update todo"})
    }
})
// @ts-ignore
app.delete("/todo/:id",userMiddleWare,async(req,res)=>{
    const todo_id = req.params.id;
    const user_id = (req as any).user.id;
    try{
        const query = `DELETE FROM todos WHERE id = $1 AND user_id = $2;`
        const result =await pgClient.query(query,[todo_id,user_id])
    
        res.json({message : "Todo is deleted"})
    }catch(e){
        console.error("Error deleting todo : ",e)
        res.status(500).json({message : "Failed to delete todo"})
    }

})

app.listen(3000);