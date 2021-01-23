import express from 'express';
import bcrypt, { hash } from "bcrypt-nodejs";
import cors from 'cors';
import knex from 'knex';

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import {handleImage, handleApiCall} from './controllers/image.js';
import handleProfileGet from './controllers/profile.js';

const db = knex({ // for connecting to PostgreSQL
  client: 'pg', // type of db
  connection: { 
    connectionString: process.env.DATABASE_URL, // dynamic database value for heroku    
    ssl: {
      rejectUnauthorized: false
    }
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
// app.put('/imageurl', (req, res) =>  {handleApiCall(req, res, db)})
app.post('/imageurl', (req, res) => { handleApiCall(req, res)}) 
app.post('/register', (req, res) =>  {handleRegister(req, res, db, bcrypt)} )

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT }`)
})
