import {users} from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';
import Joi from 'joi';
import * as dotenv from "dotenv";
dotenv.config({});

const getUsers = async (req, res) => {
    try {
        const response = await users.findAll();
        res.send(response.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

const signUpUser = async (req, res) => {
    console.log(req.body);
    const {username, email, password} = req.body;

    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const {error} = schema.validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }


    let hashedPassword;

    try{
        hashedPassword = await bcrypt.hash(password, 12);

    } catch(Err) {
        return res.status(500).send('Could not create user, try again');
    }

    const newUser = {
        id: v4(),
        username,
        email,
        password: hashedPassword
    };
    //console.log(newUser);
    try{
        const exist = await users.findByEmail(newUser.email);
        console.log("LÖYTYYKÖ??", exist);
        if(exist[0]){
            return res.status(422).send('Could not create user, user exists');
        }
        const result = await users.create(newUser);
        if(!result){
            return res.status(500).send('Something went wrong, could not create user');
        }
        //console.log(result);
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email
            },
            process.env.JWT_KEY,
            { expiresIn: '1h'}
        )

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            token
        });

    }catch (err){
        return res.status(500).send('Signup failed, please try again');
    }

};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    let identifiedUser;
    try {
        const result = await users.findByEmail(email);
        console.log("LÖYTYYKÖ??!", result);
        if(!result[0]){
            return res.status(401).send('No user found, check your credentials');
        }
        identifiedUser = result[0];
        //console.log(identifiedUser.name);
    } catch(err){
        return res.status(500).send('Something went wrong');
    }

    let isValidPassword;
    try{
        isValidPassword = await bcrypt.compare(password, identifiedUser.password);
        if(!isValidPassword){
            return res.status(401).send('No valid password, check your credentials');
        }
    } catch (err) {
        return res.status(500).send('Something went wrong');
    }

    try{
        const token = jwt.sign(
            {
                id: identifiedUser.id,
                email: identifiedUser.email
            },
            process.env.JWT_KEY,
            { expiresIn: '1h'}
        )

        res.status(201).json({
            id: identifiedUser.id,
            email: identifiedUser.email,
            token
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send('Something went wrong');
    }

};

const updateUserWithId = async (req, res, next) => {

  const { username, password, email } = req.body
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  console.log(email, 'jeepp')
  const userId = req.params.uid

  const user = await users.findUserById(userId);
  // console.log(user.email, 'löytyykö!!')

  if (!user) {
    const error = new Error(`User with ID ${userId} not found`);
    error.statusCode = 404;
    return next(error);
  }

  if (email !== user.email) {
    const exist = await users.findRowCountByEmail(email)
    console.log(exist, 'löytyykö tämä')
    if (exist) {
      const error = new Error(`Email exists`);
      error.statusCode = 422;
      return next(error);
    }
  }
  if (password !== user.password) {
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
      const error = new Error(`Could not update`);
      error.statusCode = 500;
      return next(error);
    }

    const result = await users.updateUserById(userId, username, hashedPassword, email)
    // console.log(hashedPassword)

    if (!result) {
      const error = new Error(`Could not update user`);
      error.statusCode = 404;
      return next(error);
    }

    user.username = username
    user.password = hashedPassword
    user.email = email

    res.status(200).json({ user })
  } else {
    const result = await users.updateUserById(
      userId,
      username,
      password,
      email,
    )
    // console.log(password)

    if (!result) {
      const error = new Error(`Could not update user`);
      error.statusCode = 404;
      return next(error);
    }

    user.username = username
    user.password = password
    user.email = email

    res.status(200).json({ user })
}
};

const deleteUserWithId = async (req, res, next) => {
  const userId = req.params.uid;

  const user = await users.findUserById(userId);

  if (!user) {
    const error = new Error(`User with ID ${userId} not found`);
    error.statusCode = 404;
    return next(error);
  }
  const result = await users.deleteUserById(userId);
  if (!result) {
    const error = new Error(`Could not delete user`);
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: "Deleted the user." });
};

const getUserWithId = async (req, res, next) => {
  const userId = req.params.uid;
  // console.log(userId)
  const user = await users.findUserById(userId)

  if (!user) {
    const error = new Error(`User with ID ${userId} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.json({ user });
};



export {
  signUpUser,
  loginUser,
  getUsers,
  updateUserWithId,
  deleteUserWithId,
  getUserWithId
};