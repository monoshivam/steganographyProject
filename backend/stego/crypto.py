import base64
import hashlib
import os
from cryptography.fernet import Fernet

def get_key() -> bytes:
    secret = os.getenv("BACKEND_SECRET", "gottagrindforit")
    return base64.urlsafe_b64encode(hashlib.sha256(secret.encode()).digest())

def encrypt_text(text: str) -> bytes:
    key = get_key()
    f = Fernet(key)
    return f.encrypt(text.encode())

def decrypt_text(token: bytes) -> str:
    try:
        key = get_key()
        f = Fernet(key)
        decrypted_bytes = f.decrypt(token)
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        if "InvalidToken" in str(type(e)):
            raise ValueError("Invalid or corrupted encrypted data - this file may not contain hidden information or was encrypted with a different key")
        elif "decode" in str(e).lower():
            raise ValueError("Decrypted data is not valid text")
        else:
            raise ValueError(f"Decryption failed: {str(e)}")
