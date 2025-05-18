from PIL import Image
import numpy as np
from .crypto import encrypt_text, decrypt_text

def embed_text_in_image(image_path: str, text: str, output_path: str) -> None:
    img = Image.open(image_path)
    img = img.convert("RGB")
    data = np.array(img).astype(np.uint8)
    flat_data = data.flatten().copy()

    encrypted = encrypt_text(text)
    binary_data = ''.join(format(byte, '08b') for byte in encrypted)

    if len(binary_data) > len(flat_data):
        raise ValueError("Image not large enough to hold data")

    for i in range(len(binary_data)):
        flat_data[i] = (flat_data[i] & 0b11111110) | int(binary_data[i])

    print("Modified data min/max:", flat_data.min(), flat_data.max())

    data = flat_data.reshape(data.shape).astype(np.uint8)
    new_img = Image.fromarray(data, 'RGB')
    new_img.save(output_path)


def extract_text_from_image(image_path: str) -> str:
    img = Image.open(image_path)
    data = np.array(img).flatten()

    bits = [str(pixel & 1) for pixel in data]
    byte_chunks = [''.join(bits[i:i+8]) for i in range(0, len(bits), 8)]

    bytes_list = []
    for b in byte_chunks:
        byte = int(b, 2)
        if byte == 0:
            break
        bytes_list.append(byte)
    encrypted = bytes(bytes_list)
    return decrypt_text(encrypted)
