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

        const findUser = await User.findOne({ email: email }).exec();

        if (findUser) {
            return { message: 'Email is already registered', status: 400 };
        }

        const user = new User({
            email: email,
            username: username,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({
            username: user.username,
            email: user.email,
            _id: user._id,
        }, JWT_SECRET as string, { expiresIn: '1h' });

        return { message: 'User created successfully', status: 201, token };

    } catch (error) {
        console.error("error signupService:>>", error);
        return { message: 'Internal Server Error', status: 500 };
    }
}

export const login = async (email: string, username: string, password: string) => {
    try {
        let query = {};

        if (email) query = Object.assign(query, { email });
        if (username) query = Object.assign(query, { username });

        const user = await User.findOne(query).exec();

        if (!user) {
            return { error: 'Incorrect username or password', status: 401 };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { error: 'Incorrect username or password', status: 401 };
        }

        const token = jwt.sign({
            username: user.username,
            email: user.email,
            _id: user._id,
        }, JWT_SECRET as string, { expiresIn: '1h' });

        return { status: 200, token , message: 'Login successful' };

    } catch (error) {
        console.error("error loginService:>>", error);
        return { error: 'Internal Server Error', status: 500 };
    }
}