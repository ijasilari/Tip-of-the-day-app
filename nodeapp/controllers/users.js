import {users} from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';
import * as dotenv from "dotenv";
dotenv.config({});

const getUsers = async (req, res) => {
    try {
        const response = await users.findAll();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
 
const signUpUser = async (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;

    let hashedPassword;

    try{
        hashedPassword = await bcrypt.hash(password, 12);
        
    } catch(Err) {
        return res.status(500).send('Could not create user, try again');
    }

    const newUser = {
        id: v4(),
        name,
        email,
        password: hashedPassword
    };
    //console.log(newUser);
    try{
        /*const exist = await users.findByEmail(newUser.email);
        if(exist.length > 0){
            return res.status(422).send('Could not create user, user exists');
        }*/
        const result = await users.create(newUser); 
        if(!result){
            return res.status(500).send('Something went wrong, could not create user');
        }
        console.log(result);
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


export {
  signUpUser,
  getUsers
};