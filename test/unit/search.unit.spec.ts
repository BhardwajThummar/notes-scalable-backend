
import chai from 'chai';
import { describe, it, before } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Note from '../../models/note';
import jwt from 'jsonwebtoken';
import { createNote } from '../../service/noteService';
import { searchNotes } from '../../service/searchService';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Note Service - Search Unit Tests', () => {
    let userId: string;
    let token: string;
    let noteId: string;

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

        const noteResponse : any = await createNote(userId, 'Search Test Note', 'This is a test note for searching.');
        noteId = noteResponse ? noteResponse?._id : '';
    });

    it('should search notes by title', async () => {
        const result = await searchNotes(userId, 'Search Test Note');

        expect(result.status).to.equal(200);
        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result?.data?.[0]?.title).to.equal('Search Test Note');
    });

    it('should search notes by content', async () => {
        const result = await searchNotes(userId, 'test note for searching');

        expect(result.status).to.equal(200);
        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result?.data?.[0]?.title).to.equal('Search Test Note');
    });

    it('should handle no matching notes during search', async () => {
        const result = await searchNotes(userId, 'Non-Existent Note');

        expect(result.status).to.equal(200);
        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(0);
    });

});
