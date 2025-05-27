import requests
import io
from PIL import Image

def test_encrypt_decrypt_flow():
    """Test the full encrypt/decrypt flow through the API"""
    
    # Create a test image
    test_img = Image.new('RGB', (200, 200), color='blue')
    img_buffer = io.BytesIO()
    test_img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    test_message = "This is a secret message for API testing!"
    
    print("=== Testing Encrypt/Decrypt API Flow ===")
    print(f"Test message: '{test_message}'")
    
    # Step 1: Encrypt
    print("\n1. Testing encryption...")
    files = {
        'file': ('test_image.png', img_buffer, 'image/png')
    }
    data = {
        'text': test_message
    }
    
    try:
        response = requests.post('http://127.0.0.1:8000/encrypt', files=files, data=data)
        print(f"Encrypt response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            download_url = result.get('download_url', '')
            print(f"Download URL: {download_url}")
            
            if download_url:
                # Step 2: Download encrypted file
                print("\n2. Downloading encrypted file...")
                download_response = requests.get(f"http://127.0.0.1:8000{download_url}")
                
                if download_response.status_code == 200:
                    print(f"Downloaded {len(download_response.content)} bytes")
                    
                    # Step 3: Decrypt
                    print("\n3. Testing decryption...")
                    encrypted_file = io.BytesIO(download_response.content)
                    
                    decrypt_files = {
                        'file': ('encrypted_image.png', encrypted_file, 'image/png')
                    }
                    
                    decrypt_response = requests.post('http://127.0.0.1:8000/decrypt', files=decrypt_files)
                    print(f"Decrypt response status: {decrypt_response.status_code}")
                    print(f"Decrypt response: {decrypt_response.text}")
                    
                    if decrypt_response.status_code == 200:
                        decrypt_result = decrypt_response.json()
                        extracted_message = decrypt_result.get('message', '')
                        print(f"Extracted message: '{extracted_message}'")
                        
                        if extracted_message == test_message:
                            print("✅ SUCCESS: Full encrypt/decrypt cycle works!")
                        else:
                            print("❌ FAILED: Messages don't match")
                    else:
                        print(f"❌ FAILED: Decrypt failed with status {decrypt_response.status_code}")
                        print(f"Error response: {decrypt_response.text}")
                else:
                    print(f"❌ FAILED: Download failed with status {download_response.status_code}")
            else:
                print("❌ FAILED: No download URL in response")
        else:
            print(f"❌ FAILED: Encrypt failed with status {response.status_code}")
            print(f"Error response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ FAILED: Could not connect to server. Make sure the backend is running on port 8000")
    except Exception as e:
        print(f"❌ FAILED: Unexpected error: {e}")

def test_decrypt_only():
    """Test decryption with a simple image to see what happens"""
    print("\n=== Testing Decrypt Only ===")
    
    # Create a simple test image (no hidden data)
    test_img = Image.new('RGB', (100, 100), color='red')
    img_buffer = io.BytesIO()
    test_img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    files = {
        'file': ('plain_image.png', img_buffer, 'image/png')
    }
    
    try:
        response = requests.post('http://127.0.0.1:8000/decrypt', files=files)
        print(f"Decrypt response status: {response.status_code}")
        print(f"Decrypt response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_encrypt_decrypt_flow()
    test_decrypt_only()