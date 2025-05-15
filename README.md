# Document Management System

A professional document management system built with Node.js, Express, MongoDB, and modern frontend technologies.

## Features

- Document upload and storage
- Document viewing and downloading
- Document management (delete, search)
- User profile management
- Modern and responsive UI
- Secure file handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/document-management
JWT_SECRET=your_jwt_secret_key_here
```

4. Start MongoDB:
```bash
# On Windows
mongod

# On macOS/Linux
sudo service mongod start
```

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
document-management-system/
├── public/              # Static files
│   ├── uploads/         # Uploaded documents
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Custom styles
│   └── script.js        # Frontend JavaScript
├── server.js            # Backend server
├── package.json         # Project dependencies
└── .env                 # Environment variables
```

## API Endpoints

- `POST /api/documents` - Upload a new document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get a specific document
- `DELETE /api/documents/:id` - Delete a document
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Security Considerations

- All file uploads are validated
- Documents are stored securely
- User authentication is implemented
- API endpoints are protected
- CORS is properly configured

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 