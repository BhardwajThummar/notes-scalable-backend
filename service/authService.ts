import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET } = process.env;

export const signup = async (email: string, username: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!username) username = email.split('@')[0];

        const user = new User({
            email: email,
            username: username,
            password: hashedPassword,
        });

        return await user.save();

    } catch (error) {
        console.error("error signupService:>>", error);
        return error;
    }
}

export const login = async (email: string, username: string, password: string) => {
    try {
        let query = {};

        if (email) query = Object.assign(query, { email });
        if (username) query = Object.assign(query, { username });

        const user = await User.findOne(query).exec();

        if (!user) {
            return { error: 'Incorrect username or password' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { error: 'Incorrect username or password' };
        }

        const token = jwt.sign({
            username: user.username,
            email: user.email,
        }, JWT_SECRET as string, { expiresIn: '1h' });

        return { token };

    } catch (error) {
        console.error("error loginService:>>", error);
        return error;
    }
}