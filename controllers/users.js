import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { OAuth2Client } from 'google-auth-library';

const oAuth2Client = new OAuth2Client(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	'postmessage',
  );

import UserMessage from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
			const users = await UserMessage.find();

			return res.status(200).json(users);
		} catch (error) {
			return res.status(404).json({ message: error.message });
		}
};


export const googleAuthenticate = async (req, res) => {

    const { code } = req.body;

    try{
		const { tokens } = await oAuth2Client.getToken(code); // exchange code for tokens

        //const link = "https://www.googleapis.com/oauth2/v3/userinfo";
        //const info = { headers: { authorization: `Bearer ${tokens.access_token}` } }; 
		//const { data } = await axios.get(link, info);

		const data = jwt.decode(tokens.id_token);

		return res.status(200).json({result: data, token: tokens.id_token})
		
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
};

export const localAuthenticate = async (req,res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await UserMessage.findOne({ email });

		if (!existingUser)
			return res.status(404).json({ message: "User doesn't exist." });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect)
			return res.status(400).json({ message: "Wrong Password" });

		const token = jwt.sign(
			{ email: existingUser.email, id: existingUser._id },
			"test",
			{ expiresIn: "1h" }
		);

		return res.status(200).json({ result: existingUser, token });

	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}


export const signin = async (req,res) => {
	if ('code' in req.body){
		await googleAuthenticate(req,res);
	}
	else{
		await localAuthenticate(req,res);
	}


};

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword} = req.body;
    try{
        const existingUser = await UserMessage.findOne({email});

        if (existingUser) return res.status(400).json({ message: "User already exists"});

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords dont match!"});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserMessage.create({email: email, password: hashedPassword, name: `${firstName} ${lastName}`});

        const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: "1h"});

		return res.status(200).json({ result: result, token });
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
};
