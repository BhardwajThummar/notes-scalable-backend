import chai from 'chai';
import { describe, it, before } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Authentication API - Integration Tests', () => {
    before(async () => {
        // Clear the User collection before running the tests
        await User.deleteMany({});
    });

    it('should register a new user with valid data (database interaction)', async () => {
        const response = await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('User created successfully');

        // Verify that the user is stored in the database
        const user = await User.findOne({ email: 'testuser@example.com' });
        expect(user).to.exist;
    });

    it('should log in an existing user with valid credentials (database interaction)', async () => {
        // Register a user first
        await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

        // Log in with valid credentials
        const response = await chai
            .request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });
});
