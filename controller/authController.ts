import { Request, Response, NextFunction } from 'express';
import { signupSchema, loginSchema } from '../validate/authValidation';
import { login, signup } from '../service/authService';

export const signupController = async (req: Request, res: Response) => {
  try {
    const { error, value } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let { email, username, password } = value;

    const user = await signup(email, username, password);

    if (user instanceof Error) {
      return res.status(409).json({ error: user.message });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("error signupController :>>",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, username, password } = value;

    const isLoggedIn : any = await login(email, username, password);

    if (isLoggedIn.error) {
      return res.status(401).json({ error: isLoggedIn.error });
    }

    res.cookie('jwt', isLoggedIn.token, { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Login successful', token: isLoggedIn.token });

  }
  catch (error) {
    console.error("error loginController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout(done => console.log('User logged out'));
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logout successful' });
};

export const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({ username: req.user });
};
