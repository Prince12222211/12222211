import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'shortUrlMappings';

const StatisticsPage = () => {
    const [mappings, setMappings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setMappings(stored);
    }, []);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    URL Shortener Statistics
                </Typography>
                <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/')}>Back to Shortener</Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Short URL</TableCell>
                                <TableCell>Original URL</TableCell>
                                <TableCell>Expires At</TableCell>
                                <TableCell>Redirect Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No URLs shortened yet.</TableCell>
                                </TableRow>
                            ) : (
                                mappings.map((m, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{window.location.origin + '/' + m.shortcode}</TableCell>
                                        <TableCell>{m.url}</TableCell>
                                        <TableCell>{new Date(m.expiresAt).toLocaleString()}</TableCell>
                                        <TableCell>{m.redirectCount || 0}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default StatisticsPage; 