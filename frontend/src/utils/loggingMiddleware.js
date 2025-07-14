// loggingMiddleware.js
// Replace this with your custom logging logic as required by the assessment

const logEvent = (eventType, details) => {
    // Example: send logs to a custom endpoint or store locally
    // For now, just store logs in localStorage for demonstration
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push({
        timestamp: new Date().toISOString(),
        eventType,
        details,
    });
    localStorage.setItem('appLogs', JSON.stringify(logs));
};

export default logEvent; 