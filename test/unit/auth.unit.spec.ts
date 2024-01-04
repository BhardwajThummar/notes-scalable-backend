import chai from 'chai';
import { describe, it, before } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Authentication API - Unit Tests', () => {
  before(async () => {
    // Clear the User collection before running the tests
    await User.deleteMany({});
  });

  it('should register a new user with valid data', async () => {
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
  });

  it('should not register a new user with invalid data', async () => {
    const response = await chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        // Invalid data, missing required fields
      });

    expect(response.status).to.equal(400);
    // Add more assertions based on your validation criteria
  });

  it('should not register a duplicate user', async () => {
    // Register a user first
    await chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        email: 'testuser1@example.com',
        password: 'testpassword',
      });

    // Attempt to register the same user again
    const response = await chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        email: 'testuser1@example.com',
        password: 'testpassword',
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('Email is already registered');
  });

  it('should log in an existing user with valid credentials', async () => {
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

  it('should not log in with invalid credentials', async () => {
    // Log in with invalid credentials
    const response = await chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'invalidpassword',
      });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('Incorrect username or password');
  });

});
