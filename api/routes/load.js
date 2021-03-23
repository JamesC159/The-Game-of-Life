const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res, next) => {
    const readStream = fs.createReadStream('board-state.json', {flag: 'r'});
    let chunks = '';

    readStream.read('board-state.json');

    readStream.on('data', (chunk) => {
        chunks += chunk;
    });

    readStream.on('error', (err) => {
        console.log(err);
        res.status(404).send();
    });

    readStream.on('end', () => {
        console.log('board-state.json successfully read');
        res.status(200).json(chunks);
    });
});

module.exports = router;