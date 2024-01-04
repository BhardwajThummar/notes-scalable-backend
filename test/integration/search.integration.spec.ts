import chai from 'chai';
import jwt from 'jsonwebtoken';
import { describe, it, before } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Note from '../../models/note';
import { createNote } from '../../service/noteService';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Search Controller - Integration Tests', () => {
    let token: string;
    let userId: string;

    before(async () => {
        // Clear the User and Note collections before running the tests
        await User.deleteMany({});
        await Note.deleteMany({});

        // Register a user, create a note, and get the JWT token
        const userResponse = await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

        token = userResponse?.body?.token;
        // Decode the JWT token to get the userId
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
        userId = decodedToken._id;

        // Create a test note
        await createNote(userId, 'Search Test Note', 'This is a test note for searching.');
    });

    it('should search notes by title', async () => {
        const response = await chai
            .request(app)
            .get('/api/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ q: 'Search Test Note' });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
        expect(response.body.data).to.have.lengthOf(1);
        expect(response.body.data[0]).to.have.property('title', 'Search Test Note');
    });

    it('should search notes by content', async () => {
        const response = await chai
            .request(app)
            .get('/api/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ q: 'test note for searching' });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
        expect(response.body.data).to.have.lengthOf(1);
        expect(response.body.data[0]).to.have.property('title', 'Search Test Note');
    });

    it('should handle no matching notes during search', async () => {
        const response = await chai
            .request(app)
            .get('/api/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ q: 'Non-Existent Note' });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
        expect(response.body.data).to.have.lengthOf(0);
    });

    it('should handle empty search query', async () => {
        const response = await chai
            .request(app)
            .get('/api/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ q: '' });

        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error', '"q" is not allowed to be empty');
    });

    it('should handle unauthorized search requests', async () => {
        const response = await chai
            .request(app)
            .get('/api/search')
            .query({ q: 'Search Test Note' });

        expect(response.status).to.equal(401);
    });

});
