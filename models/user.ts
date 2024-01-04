import { Document, Schema, Model, model } from 'mongoose';

interface IUser {
  username: string;
  password: string;
  email: string;
}

export interface IUserDocument extends IUser, Document { }

export interface IUserModel extends Model<IUserDocument> { }

const userSchema = new Schema<IUserDocument, IUserModel>({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true },
  password: { type: String, required: true },
});

const User: IUserModel = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
