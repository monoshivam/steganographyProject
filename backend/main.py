from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from stego.image_stego import embed_text_in_image, extract_text_from_image
from stego.pdf_stego import embed_text_in_pdf, extract_text_from_pdf
import os
import uuid


app = FastAPI(title="Cyber Steganography API", version="1.0.0")

# Configure CORS for production and development
origins = [
    "http://localhost:5173",  # Local development
    "http://localhost:3000",  # Alternative local port
    "https://*.vercel.app",   # Vercel deployments
]

# Add environment variable for custom frontend URL
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload(file: UploadFile) -> str:
    # Reset file pointer to beginning
    file.file.seek(0)
    content = file.file.read()
    
    # Use a unique filename to avoid conflicts
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(path, "wb") as f:
        f.write(content)
    return path

@app.post("/encrypt")
async def encrypt_file(file: UploadFile = File(...), text: str = Form(...)):
    input_path = save_upload(file)

    # encrypted output ke liye ek random filename generate karna
    unique_id = uuid.uuid4().hex
    encrypted_filename = f"encrypted_{unique_id}_{file.filename}"
    output_path = os.path.join(UPLOAD_DIR, encrypted_filename)

    try:
        if file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            embed_text_in_image(input_path, text, output_path)
        elif file.filename.lower().endswith(".pdf"):
            embed_text_in_pdf(input_path, text, output_path)
        else:
            return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    # download link return karna
    return {"download_url": f"/download/{encrypted_filename}"}

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')

@app.post("/decrypt")
async def decrypt_file(file: UploadFile = File(...)):
    input_path = None
    
    try:
        # Validate file type first
        if not file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".pdf")):
            return JSONResponse(content={"error": "Unsupported file type. Only PNG, JPEG, and PDF files are supported."}, status_code=400)
        
        input_path = save_upload(file)
        print(f"Processing file: {input_path}")
        
        if file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            text = extract_text_from_image(input_path)
        elif file.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(input_path)
            
    except ValueError as e:
        error_msg = str(e) if str(e) else "Invalid data format or corrupted file"
        print(f"ValueError in decryption: {error_msg}")
        return JSONResponse(content={"error": f"Decryption failed: {error_msg}"}, status_code=400)
    except Exception as e:
        error_msg = str(e) if str(e) else f"Unknown {type(e).__name__} error occurred"
        print(f"Unexpected error in decryption: {type(e).__name__}: {error_msg}")
        import traceback
        traceback.print_exc()
        return JSONResponse(content={"error": f"Decryption failed: {error_msg}"}, status_code=500)
    finally:
        # Clean up uploaded file
        if input_path and os.path.exists(input_path):
            try:
                os.remove(input_path)
                print(f"Cleaned up file: {input_path}")
            except Exception as cleanup_error:
                print(f"Failed to cleanup file {input_path}: {cleanup_error}")

    return {"message": text}
