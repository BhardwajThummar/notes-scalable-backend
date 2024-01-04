import chai from 'chai';
import jwt from 'jsonwebtoken';
import { describe, it, before, after } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Note from '../../models/note';
import dotenv from 'dotenv';
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
} from '../../service/noteService';

dotenv.config();
chai.use(chaiHttp);

const expect = chai.expect;

describe('Note Service - Unit Tests', () => {
    let token: string;
    let noteId: string;
    let userId: string;

    before(async () => {
        // Clear the User and Note collections before running the tests
        await User.deleteMany({});
        await Note.deleteMany({});

        // Register a user and create a note
        const userResponse = await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

            token = userResponse?.body?.token;
            // decode the jwt token to get the userId
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
            userId = decodedToken._id;

        const noteResponse: any = await createNote(userId, 'Test Note', 'This is a test note.');
        noteId = noteResponse ? noteResponse?._id : '';
    });

    it('should get all notes for the authenticated user', async () => {
        const result: any = await getAllNotes(userId);

        expect(result.status).to.equal(200);
        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result?.data?.[0]?.title).to.equal('Test Note');
    });

    it('should get a specific note by ID for the authenticated user', async () => {
        const result = await getNoteById(userId, noteId);

        expect(result.status).to.equal(200);
        expect(result.data).to.not.be.null; // Add null check
        expect(result.data).to.have.property('title');
        expect(result?.data?.title).to.equal('Test Note');
    });

    it('should create a new note for the authenticated user', async () => {
        const result: any = await createNote(userId, 'New Test Note', 'This is another test note.');

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result?.title).to.equal('New Test Note');
    });

    it('should update a note for the authenticated user', async () => {
        const result = await updateNote(userId, noteId, 'Updated Note', 'This note has been updated.');

        expect(result.status).to.equal(200);
        expect(result.data).to.have.property('title');
        expect(result?.data?.title).to.equal('Updated Note');
    });

    it('should delete a note for the authenticated user', async () => {
        const result = await deleteNote(userId, noteId);

        expect(result.status).to.equal(200);
        expect(result.data).to.have.property('isDeleted');
        expect(result?.data?.isDeleted).to.be.true;
    });

    it('should share a note with another user', async () => {
        const otherUserResponse = await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'otheruser@example.com',
                password: 'otherpassword',
            });

        const sharedWithUserId = "";

        const result = await shareNote(userId, noteId, sharedWithUserId);

        expect(result.status).to.equal(200);
        expect(result.data).to.have.property('isShared');
        expect(result?.data?.isShared).to.be.true;
    });

});
