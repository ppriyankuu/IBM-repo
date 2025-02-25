import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict", (req, res) => {
    const inputData = req.body; // Data from frontend form
    const python = spawn("python3", ["predict.py", JSON.stringify(inputData)]);

    let outputData = "";

    python.stdout.on("data", (data) => {
        outputData += data.toString();
    });

    python.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    python.on("close", (code) => {
        if (code === 0) {
            if (!res.headersSent) {
                res.json({ prediction: outputData.trim() });
            }
        } else {
            console.error(`Python process exited with code ${code}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));