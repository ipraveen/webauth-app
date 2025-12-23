import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

// optional: import './tracing'; // enable if you want backend traces

const app = express();

// app.use(cors()); // enable CORS for all origins
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// Accept protobuf body from browser forwarded as raw
app.use('/otlp/v1/traces', bodyParser.raw({ type: 'application/x-protobuf', limit: '10mb' }));

app.post('/otlp/v1/traces', async (req, res) => {
    console.log('POST: /otlp/v1/traces ');
    try {
        // forward raw protobuf to Collector
        const result = await fetch('http://127.0.0.1:4318/v1/trace', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
        });
        res.status(result.status).send(await result.text());
    } catch (err) {
        console.error('Error forwarding OTLP:', err);
        res.status(500).send('forward error');
    }
});

// simple API for demo
app.get('/api/hello', (req, res) => {
    res.json({ hello: 'world' });
});

app.listen(3000, () => console.log('Backend listening on http://localhost:3000'));
