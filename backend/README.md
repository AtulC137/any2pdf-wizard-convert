
# Any2PDF Backend

This is the backend service for the Any2PDF application, which converts various file types to PDF format.

## Setup Instructions

1. Install Node.js (v14 or later) if it's not already installed
2. Navigate to the backend directory in your terminal/command prompt
3. Run `npm install` to install all dependencies
4. Start the server with `npm start` or `npm run dev` for development mode with auto-reload

## API Endpoints

- **POST /convert-to-pdf**: Accepts file uploads and returns a converted PDF
  - Request: multipart/form-data with files field containing one or more files
  - Response: PDF file

## Supported File Types

- Word Documents (.doc, .docx)
- Excel Spreadsheets (.xls, .xlsx)
- Images (.png, .jpg, .jpeg)
- HTML files (.html)
- Text files (.txt)

## Production Considerations

For a production environment, you should consider:

1. Adding authentication to protect the API
2. Implementing proper error handling and logging
3. Using a more robust file conversion library (e.g., LibreOffice or a commercial PDF conversion API)
4. Setting up a proper file storage solution (e.g., AWS S3)
5. Deploying to a production-ready server or cloud platform
