import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// Wait for DOM to be ready
function initApp() {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Fatal: Could not find root element. Creating one.');
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Ensure DOM is ready before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
