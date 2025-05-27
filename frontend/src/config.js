const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Cyber Steganography Project',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Hide and reveal secret messages in images and documents'
};

export default config;