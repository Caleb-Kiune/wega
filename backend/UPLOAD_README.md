# Image Upload Functionality

This document describes the image upload functionality implemented in the Flask backend for the Wega Kitchenware e-commerce admin dashboard.

## Overview

The backend now supports direct image uploads via the browser, allowing administrators to upload product images directly from the admin dashboard.

## Features

- **Secure File Uploads**: Uses Werkzeug's `secure_filename()` to sanitize filenames
- **File Type Validation**: Only allows `.jpg`, `.jpeg`, `.png`, `.gif`, and `.webp` files
- **File Size Limits**: Maximum file size of 5MB
- **Unique Filenames**: Generates unique filenames to prevent conflicts
- **MIME Type Validation**: Additional security through MIME type checking
- **Automatic Directory Creation**: Creates upload directory if it doesn't exist
- **Public URL Generation**: Returns public URLs for uploaded images
- **CORS Support**: Configured for cross-origin requests from the frontend

## API Endpoints

### POST `/api/upload`

Uploads an image file and returns the public URL.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with a `file` field containing the image

**Response:**
```json
{
  "success": true,
  "url": "http://localhost:5000/static/uploads/20250619_062804_2cb34e25.jpeg",
  "filename": "20250619_062804_2cb34e25.jpeg",
  "original_name": "appliances1.jpeg",
  "size": 1043615
}
```

**Error Response:**
```json
{
  "error": "Invalid file type. Allowed types: png, jpg, jpeg, gif, webp"
}
```

### GET `/static/uploads/<filename>`

Serves uploaded files from the uploads directory.

## Configuration

### Environment Variables

- `FLASK_ENV`: Set to `production` for production environment
- `BASE_URL`: Production domain URL (used for generating public URLs)

### Upload Settings

- **Upload Directory**: `backend/static/uploads/`
- **Allowed Extensions**: `png`, `jpg`, `jpeg`, `gif`, `webp`
- **Maximum File Size**: 5MB
- **Filename Generation**: `{timestamp}_{uuid}.{extension}`

## Security Features

1. **Filename Sanitization**: Uses `secure_filename()` to prevent path traversal attacks
2. **File Type Validation**: Checks both file extension and MIME type
3. **File Size Limits**: Prevents large file uploads
4. **Unique Filenames**: Prevents filename conflicts and overwrites
5. **Directory Traversal Protection**: Files are saved in a controlled directory

## Frontend Integration

The frontend (Next.js) has been updated to use the Flask backend for uploads:

### Create Product Page (`app/admin/create/page.tsx`)
```javascript
const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData,
});
```

### Edit Product Page (`app/admin/[id]/edit/product-form.tsx`)
```javascript
const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData,
});
```

## File Storage

- **Development**: Files are stored in `backend/static/uploads/`
- **Production**: Files are stored in the same location but may not persist across deployments
- **Note**: For production, consider using cloud storage (AWS S3, Google Cloud Storage, etc.)

## Error Handling

The upload endpoint includes comprehensive error handling:

- Missing file validation
- File type validation
- File size validation
- MIME type validation
- File save verification
- Exception handling with detailed logging

## Testing

You can test the upload functionality using:

1. **cURL**:
   ```bash
   curl -X POST http://localhost:5000/api/upload \
     -F "file=@path/to/image.jpg"
   ```

2. **Frontend**: Use the admin dashboard upload functionality

3. **Browser**: Test the served files by accessing the returned URL

## Production Considerations

1. **File Persistence**: Files won't persist across Railway deployments
2. **Cloud Storage**: Consider migrating to cloud storage for production
3. **CDN**: Use a CDN for serving images in production
4. **Environment Variables**: Set `FLASK_ENV=production` and `BASE_URL` for production
5. **Monitoring**: Add logging and monitoring for upload failures

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured for your frontend domain
2. **File Not Found**: Check that the upload directory exists and is writable
3. **Large File Errors**: Verify file size is under 5MB
4. **Invalid File Type**: Ensure file extension is in the allowed list

### Debugging

The upload endpoint includes detailed logging. Check the Flask console output for:
- Request details
- File validation results
- File save operations
- Error messages and stack traces 