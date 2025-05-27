// This is a diagnostic script to help debug issues with the application
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.error);
  
  // Try to show error on page if the app hasn't loaded
  const rootEl = document.getElementById('root');
  if (rootEl && (!rootEl.hasChildNodes() || rootEl.innerHTML.trim() === '')) {
    rootEl.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1>HPE Audit Portal - Error Detected</h1>
        <p>The application encountered an error while loading:</p>
        <pre style="background: #f5f5f5; padding: 15px; overflow: auto; border-radius: 4px;">${e.message || 'Unknown error'}</pre>
        <p>Check the browser console for more details.</p>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  }
});

console.log('Diagnostic script loaded successfully');
