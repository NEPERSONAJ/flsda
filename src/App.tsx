import React from 'react';
import { ImageGenerator } from './components/ImageGenerator';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto py-12">
        <ImageGenerator />
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4C1D95',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#4C1D95',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#991B1B',
            },
            style: {
              background: '#991B1B',
            },
          },
        }}
      />
    </div>
  );
}

export default App;