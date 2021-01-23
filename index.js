import express from 'express';
import bcrypt, { hash } from "bcrypt-nodejs";
import cors from 'cors';
import knex from 'knex';

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import {handleImage, handleApiCall} from './controllers/image.js';
import handleProfileGet from './controllers/profile.js';

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express(); 

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res)=> {res.send('it is working!')})
// this (making sure to change the controller file in the appropriate way)
// handleImage(db)
app.post('/signin', handleSignin(db, bcrypt))
app.get('/profile/:id', handleProfileGet(db))
// is the same as this
// (req, res) =>  {handleImage(req, res, db)
app.put('/image', (req, res) =>  {handleImage(req, res, db)})
app.put('/imageurl', (req, res) =>  {handleApiCall(req, res, db)})
app.post('/register', (req, res) =>  {handleRegister(req, res, db, bcrypt)} )

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT }`)
})
