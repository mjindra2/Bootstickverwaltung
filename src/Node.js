const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const jsonFilePath = './Test.json';

app.get('/stickGroups', (req, res) => {
    const data = fs.readFileSync(jsonFilePath);
    res.json(JSON.parse(data));
});

app.post('/stickGroups', (req, res) => {
    const data = req.body;
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    res.status(200).send('JSON updated');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));