from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from stego.image_stego import embed_text_in_image, extract_text_from_image
from stego.pdf_stego import embed_text_in_pdf, extract_text_from_pdf
import os
import uuid
import requests;


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload(file: UploadFile) -> str:
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
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
    input_path = save_upload(file)

    try:
        if file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            text = extract_text_from_image(input_path)
        elif file.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(input_path)
        else:
            return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    return {"message": text}
