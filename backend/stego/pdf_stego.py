from PyPDF2 import PdfReader, PdfWriter
from .crypto import encrypt_text, decrypt_text

def embed_text_in_pdf(pdf_path: str, text: str, output_path: str):
    encrypted = encrypt_text(text).decode()
    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.add_metadata({
        "/EncryptedNote": encrypted
    })

    with open(output_path, "wb") as f:
        writer.write(f)

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    meta = reader.metadata
    encrypted = meta.get("/EncryptedNote")
    if not encrypted:
        raise ValueError("No encrypted note found in this PDF.")
    return decrypt_text(encrypted.encode())
