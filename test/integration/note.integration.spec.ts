import chai from 'chai';
import jwt from 'jsonwebtoken';
import { describe, it, before, after } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Note from '../../models/note';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);

const expect = chai.expect;

describe('Note API - Integration Tests', () => {
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

        const noteResponse: any = await chai
            .request(app)
            .post(`/api/notes`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Note',
                content: 'This is a test note.',
            });

        noteId = noteResponse.body._id;
    });

    it('should get all notes for the authenticated user', async () => {
        const response = await chai
            .request(app)
            .get(`/api/notes`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('array');
        expect(response.body.data).to.have.length.greaterThan(0);
    });

    it('should get a specific note by ID for the authenticated user', async () => {
        const response = await chai
            .request(app)
            .get(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data._id).to.equal(noteId);
    });

    it('should update a specific note for the authenticated user', async () => {
        const response = await chai
            .request(app)
            .put(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Note Title',
                content: 'This is the updated content of the note.',
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data.title).to.equal('Updated Note Title');
    });

    it('should delete a specific note for the authenticated user', async () => {
        const response = await chai
            .request(app)
            .delete(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data._id).to.equal(noteId);

        // Ensure the note is deleted
        const deletedNote = await Note.findOne({_id: noteId, isDeleted: false});
        expect(deletedNote).to.be.null;
    });

    it('should not allow empty title or content when creating a note', async () => {
        const response = await chai
            .request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: '',
                content: '',
            });
    
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal("\"title\" is not allowed to be empty");
    });

    after(async () => {
        // Close the MongoDB connection after all tests
        await User.deleteMany({});
        await Note.deleteMany({});
    });
});
