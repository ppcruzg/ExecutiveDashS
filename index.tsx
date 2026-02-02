console.log('Index.tsx starting at absolute top...');
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Imports done');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  document.body.innerHTML += '<h1 style="color:white">Root element missing!</h1>';
} else {
  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React render called');
}
