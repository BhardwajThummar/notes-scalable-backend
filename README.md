# Notes Scalable Backend

# Notes APIs

## Overview

This project is a secure and scalable RESTful API for managing notes. Users can perform CRUD operations on their notes, share notes with others, and search for notes based on keywords. The backend is implemented using Node.js, Express, and MongoDB.

## Features

- **Authentication:** Users can sign up and log in to manage their notes securely.
- **Note Operations:** Create, read, update, and delete notes.
- **Note Sharing:** Share notes with other users.
- **Search Functionality:** Search for notes based on keywords.
- **Rate Limiting and Throttling:** Implement rate limiting and request throttling for handling high traffic.

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Passport.js (for authentication)**
- **Joi (for validation)**
- **Mongoose (for MongoDB interactions)**

## Setup

1. Clone the repository.


2. Install dependencies.


3. Create a `.env` file in the project root and set environment variables.

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/notes-backend
    JWT_SECRET=your-secret-key


4. Run the application in development mode.


## Testing

Run tests using the following command:

npm test


## Contributing

Feel free to contribute by opening issues and pull requests. Follow the project's coding style and conventions.

## License

This project is licensed under the [MIT License](LICENSE).
