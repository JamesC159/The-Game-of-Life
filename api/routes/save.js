const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res, next) => {
    const writeStream = fs.createWriteStream('board-state.json', {flag: 'w'});

    writeStream.write(JSON.stringify(req.body));

    writeStream.on('error', (err) => {
        console.log(err);
        res.status(404).send();
    });

    writeStream.on('finish', () => {
        console.log('board-state.json successfully written');
        res.status(200).send();
    });

    writeStream.end();
    res.end();
});

module.exports = router;