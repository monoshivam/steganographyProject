import os
import sys
from stego.image_stego import embed_text_in_image, extract_text_from_image
from stego.crypto import encrypt_text, decrypt_text

def test_crypto():
    print("Testing crypto functions...")
    test_text = "Hello, this is a secret message!"
    
    # Test encryption
    encrypted = encrypt_text(test_text)
    print(f"Original text: {test_text}")
    print(f"Encrypted bytes: {len(encrypted)} bytes")
    
    # Test decryption
    decrypted = decrypt_text(encrypted)
    print(f"Decrypted text: {decrypted}")
    print(f"Crypto test passed: {test_text == decrypted}")
    print()

def test_image_stego():
    print("Testing image steganography...")
    
    # Create a simple test image
    from PIL import Image
    import numpy as np
    
    # Create a 100x100 test image
    test_img = Image.new('RGB', (100, 100), color='red')
    test_input = "test_input.png"
    test_output = "test_output.png"
    test_img.save(test_input)
    
    test_text = "Secret message for testing!"
    
    try:
        # Test embedding
        print(f"Embedding text: '{test_text}'")
        embed_text_in_image(test_input, test_text, test_output)
        print("Embedding completed")
        
        # Test extraction
        print("Extracting text...")
        extracted = extract_text_from_image(test_output)
        print(f"Extracted text: '{extracted}'")
        
        success = test_text == extracted
        print(f"Image steganography test passed: {success}")
        
        # Cleanup
        if os.path.exists(test_input):
            os.remove(test_input)
        if os.path.exists(test_output):
            os.remove(test_output)
            
    except Exception as e:
        print(f"Error in image steganography: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=== Steganography Debug Test ===")
    test_crypto()
    test_image_stego()
    print("=== Test Complete ===")