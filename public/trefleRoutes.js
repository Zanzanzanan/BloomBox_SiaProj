const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/plants', async (req, res) => {
    try {
        const response = await axios.get('https://trefle.io/api/v1/plants', {
            params: { token: 'Hu1TWujSfTRyA1zQtf178TN-Ojw4tK1euhPxOWO9y7k' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Trefle data' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
