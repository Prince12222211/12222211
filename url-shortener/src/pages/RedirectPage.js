import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logEvent from '../utils/loggingMiddleware';

const STORAGE_KEY = 'shortUrlMappings';

const RedirectPage = () => {
    const { shortcode } = useParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const idx = mappings.findIndex(m => m.shortcode === shortcode);
        if (idx === -1) {
            setError('Short URL not found.');
            logEvent('REDIRECT_FAIL', { shortcode, reason: 'not_found' });
            return;
        }
        const mapping = mappings[idx];
        const now = new Date();
        const expiresAt = new Date(mapping.expiresAt);
        if (now > expiresAt) {
            setError('This short URL has expired.');
            logEvent('REDIRECT_FAIL', { shortcode, reason: 'expired' });
            return;
        }
        // Increment redirect count
        mapping.redirectCount = (mapping.redirectCount || 0) + 1;
        mappings[idx] = mapping;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
        logEvent('REDIRECT_SUCCESS', { shortcode, url: mapping.url });
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = mapping.url;
        }, 1000);
    }, [shortcode]);

    if (error) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
    }
    return <div style={{ padding: 40, textAlign: 'center' }}>Redirecting...</div>;
};

export default RedirectPage; 