import base64
import hashlib
from cryptography.fernet import Fernet

BACKEND_SECRET = "jaatrajpootbhaichara"

def get_key() -> bytes:
    return base64.urlsafe_b64encode(hashlib.sha256(BACKEND_SECRET.encode()).digest())

def encrypt_text(text: str) -> bytes:
    key = get_key()
    f = Fernet(key)
    return f.encrypt(text.encode())

def decrypt_text(token: bytes) -> str:
    key = get_key()
    f = Fernet(key)
    return f.decrypt(token).decode()
