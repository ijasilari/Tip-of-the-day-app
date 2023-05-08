import {users} from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';
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
        console.log("LÖYTYYKÖ??", result);
        if(!result){
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

export {
  signUpUser,
  loginUser,
  getUsers
};