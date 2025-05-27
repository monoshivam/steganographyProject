from PIL import Image
import numpy as np
from .crypto import encrypt_text, decrypt_text

def embed_text_in_image(image_path: str, text: str, output_path: str) -> None:
    img = Image.open(image_path)
    img = img.convert("RGB")
    data = np.array(img).astype(np.uint8)
    flat_data = data.flatten().copy()

    encrypted = encrypt_text(text)
    
    # Add length prefix (4 bytes) to know how many bytes to read
    data_length = len(encrypted)
    length_bytes = data_length.to_bytes(4, byteorder='big')
    
    # Combine length and encrypted data
    full_data = length_bytes + encrypted
    binary_data = ''.join(format(byte, '08b') for byte in full_data)

    print(f"Embedding text: '{text}'")
    print(f"Encrypted data length: {data_length} bytes")
    print(f"Total bits to embed: {len(binary_data)} bits")
    print(f"Image capacity: {len(flat_data)} pixels")

    if len(binary_data) > len(flat_data):
        raise ValueError("Image not large enough to hold data")

    # Embed the binary data
    for i in range(len(binary_data)):
        flat_data[i] = (flat_data[i] & 0b11111110) | int(binary_data[i])

    print("Modified data min/max:", flat_data.min(), flat_data.max())

    data = flat_data.reshape(data.shape).astype(np.uint8)
    new_img = Image.fromarray(data, 'RGB')
    new_img.save(output_path)
    print(f"Successfully saved encrypted image to: {output_path}")


def extract_text_from_image(image_path: str) -> str:
    print(f"Extracting from image: {image_path}")
    img = Image.open(image_path)
    data = np.array(img).flatten()
    print(f"Image has {len(data)} pixels")

    # Extract bits from LSB
    bits = [str(pixel & 1) for pixel in data]
    
    # First, read the length (first 32 bits = 4 bytes)
    length_bits = ''.join(bits[:32])
    length_bytes = []
    for i in range(0, 32, 8):
        byte_bits = length_bits[i:i+8]
        length_bytes.append(int(byte_bits, 2))
    
    data_length = int.from_bytes(bytes(length_bytes), byteorder='big')
    print(f"Extracted data length: {data_length} bytes")
    
    if data_length <= 0 or data_length > len(bits) // 8:
        raise ValueError(f"Invalid data length found in image: {data_length}")
    
    # Now read the actual encrypted data
    start_bit = 32  # Skip the length prefix
    end_bit = start_bit + (data_length * 8)
    
    if end_bit > len(bits):
        raise ValueError(f"Not enough data in image: need {end_bit} bits, have {len(bits)}")
    
    data_bits = ''.join(bits[start_bit:end_bit])
    print(f"Extracted {len(data_bits)} bits of encrypted data")
    
    # Convert bits to bytes
    encrypted_bytes = []
    for i in range(0, len(data_bits), 8):
        byte_bits = data_bits[i:i+8]
        if len(byte_bits) == 8:
            encrypted_bytes.append(int(byte_bits, 2))
    
    encrypted = bytes(encrypted_bytes)
    print(f"Decrypting {len(encrypted)} bytes...")
    result = decrypt_text(encrypted)
    print(f"Successfully decrypted text: '{result}'")
    return result
