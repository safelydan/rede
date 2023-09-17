import express from 'express';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import bodyParser from 'body-parser';
import cors from 'cors'


const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.listen(8001, () =>{
    console.log('servidor rodando na porta 8001')
}) 