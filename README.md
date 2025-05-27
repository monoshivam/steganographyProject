# Cyphers - Steganography Application

A modern steganography application that allows you to hide secret messages in images and PDF files using advanced encryption techniques.

## Features

- **Image Steganography**: Hide text messages in PNG and JPEG images using LSB (Least Significant Bit) technique
- **PDF Steganography**: Embed encrypted text in PDF metadata
- **Encryption**: All hidden text is encrypted using Fernet symmetric encryption
- **Modern UI**: Clean, responsive React interface with drag-and-drop functionality
- **Dual Mode**: Both encryption and decryption interfaces
- **File Validation**: Automatic file type and size validation
- **Secure**: Uses cryptographic libraries for secure text encryption

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Cryptography** - Fernet encryption for secure text storage
- **PIL (Pillow)** - Image processing for steganography
- **PyPDF2** - PDF manipulation
- **NumPy** - Numerical operations for image data
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd cyberProject/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd cyberProject/frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Encrypting Messages

1. Switch to the **Encrypt** tab
2. Drag and drop or select an image (PNG/JPEG) or PDF file
3. Enter your secret message in the text area
4. Click **Send** to encrypt and embed the message
5. Download the encrypted file using the provided link

### Decrypting Messages

1. Switch to the **Decrypt** tab
2. Upload a file that contains hidden information
3. Click **Decrypt** to extract the hidden message
4. Copy the revealed text using the **Copy** button

## API Endpoints

- `POST /encrypt` - Embed encrypted text in a file
- `POST /decrypt` - Extract hidden text from a file
- `GET /download/{filename}` - Download encrypted files

## Security

- All hidden text is encrypted using Fernet symmetric encryption
- Files are temporarily stored and should be cleaned up regularly
- CORS is configured for local development

## File Support

- **Images**: PNG, JPEG (up to 10MB)
- **Documents**: PDF (up to 10MB)

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you comply with local laws and regulations when using steganography techniques.

## Troubleshooting

### Common Issues

1. **Import errors in backend**: Make sure all dependencies are installed with `pip install -r requirements.txt`
2. **CORS errors**: Ensure the frontend is running on `http://localhost:5173`
3. **File upload fails**: Check file size (max 10MB) and format (PNG, JPEG, PDF only)

### Environment Variables

For production deployment, consider setting:
- `BACKEND_SECRET` - Custom encryption key
- `UPLOAD_DIR` - Custom upload directory
- `MAX_FILE_SIZE` - Custom file size limit

## Architecture

```
cyberProject/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── stego/
│   │   ├── image_stego.py   # Image steganography
│   │   ├── pdf_stego.py     # PDF steganography
│   │   └── crypto.py        # Encryption utilities
│   └── uploads/             # Temporary file storage
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.jsx         # Main application
    │   └── main.jsx        # Entry point
    └── public/             # Static assets
```