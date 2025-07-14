import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Alert } from '@mui/material';
import logEvent from '../utils/loggingMiddleware';
import { useNavigate } from 'react-router-dom';

const MAX_URLS = 5;
const DEFAULT_VALIDITY = 30; // minutes

const STORAGE_KEY = 'shortUrlMappings';

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]*$/.test(str);
}

function generateShortcode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const ShortenerPage = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(
        Array.from({ length: MAX_URLS }, () => ({ url: '', validity: '', shortcode: '' }))
    );
    const [errors, setErrors] = useState([]);
    const [results, setResults] = useState([]);
    const [allMappings, setAllMappings] = useState([]);

    // Load mappings from localStorage on mount
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setAllMappings(stored);
        setResults(stored);
    }, []);

    // Helper to check global uniqueness
    const isShortcodeUnique = (shortcode) => {
        return !allMappings.some(m => m.shortcode === shortcode);
    };

    const handleInputChange = (idx, field, value) => {
        const newInputs = [...inputs];
        newInputs[idx][field] = value;
        setInputs(newInputs);
    };

    const validateInputs = () => {
        const errs = [];
        const shortcodes = new Set();
        inputs.forEach((input, idx) => {
            if (!input.url && !input.validity && !input.shortcode) return; // skip empty rows
            if (!input.url) {
                errs.push(`Row ${idx + 1}: URL is required.`);
            } else if (!isValidUrl(input.url)) {
                errs.push(`Row ${idx + 1}: Invalid URL format.`);
            }
            if (input.validity && (!/^[0-9]+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
                errs.push(`Row ${idx + 1}: Validity must be a positive integer.`);
            }
            if (input.shortcode) {
                if (!isAlphanumeric(input.shortcode)) {
                    errs.push(`Row ${idx + 1}: Shortcode must be alphanumeric.`);
                } else if (shortcodes.has(input.shortcode) || !isShortcodeUnique(input.shortcode)) {
                    errs.push(`Row ${idx + 1}: Shortcode must be unique.`);
                }
                shortcodes.add(input.shortcode);
            }
        });
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        setResults([]);
        const validationErrors = validateInputs();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Shorten URLs
        const usedShortcodes = new Set(allMappings.map(m => m.shortcode));
        const newResults = inputs.map((input, idx) => {
            if (!input.url) return null;
            let shortcode = input.shortcode;
            // Generate unique shortcode if not provided
            if (!shortcode) {
                do {
                    shortcode = generateShortcode();
                } while (usedShortcodes.has(shortcode));
            }
            usedShortcodes.add(shortcode);
            const validity = input.validity ? parseInt(input.validity) : DEFAULT_VALIDITY;
            const createdAt = new Date();
            const expiresAt = new Date(createdAt.getTime() + validity * 60000);
            // Log the event
            logEvent('SHORTEN_URL', {
                url: input.url,
                shortcode,
                validity,
                createdAt: createdAt.toISOString(),
                expiresAt: expiresAt.toISOString(),
            });
            return {
                url: input.url,
                shortcode,
                validity,
                createdAt,
                expiresAt,
                redirectCount: 0,
            };
        }).filter(Boolean);
        // Save to localStorage
        const updatedMappings = [...allMappings, ...newResults];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMappings));
        setAllMappings(updatedMappings);
        setResults(newResults);
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/stats')}>View Statistics</Button>
                <Typography variant="h4" gutterBottom>
                    URL Shortener
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {inputs.map((input, idx) => (
                            <React.Fragment key={idx}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="Long URL"
                                        value={input.url}
                                        onChange={e => handleInputChange(idx, 'url', e.target.value)}
                                        fullWidth
                                        required={idx === 0}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <TextField
                                        label="Validity (min)"
                                        value={input.validity}
                                        onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <TextField
                                        label="Shortcode"
                                        value={input.shortcode}
                                        onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                    {errors.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            {errors.map((err, i) => (
                                <Alert severity="error" key={i}>{err}</Alert>
                            ))}
                        </Box>
                    )}
                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Shorten URLs
                        </Button>
                    </Box>
                </form>
                {results.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Shortened URLs</Typography>
                        {results.map((res, i) => (
                            <Paper key={i} sx={{ p: 2, my: 1 }}>
                                <Typography><b>Original:</b> {res.url}</Typography>
                                <Typography><b>Short URL:</b> <span style={{ color: '#1976d2' }}>{window.location.origin + '/' + res.shortcode}</span></Typography>
                                <Typography><b>Expires At:</b> {new Date(res.expiresAt).toLocaleString()}</Typography>
                                <Typography><b>Redirect Count:</b> {res.redirectCount || 0}</Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ShortenerPage; 