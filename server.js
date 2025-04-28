const express = require('express')
const multer = require('multer')
const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')

const app = express()
const upload = multer({ dest: 'uploads/' })

app.post('/transcribe', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.')
    }

    const audioPath = req.file.path

    execFile('python3', ['whisper_worker.py', audioPath], (error, stdout, stderr) => {
        fs.unlink(audioPath, () => {})

        if (error) {
            console.error('Ошибка Python скрипта:', error)
            console.error('stderr:', stderr)
            return res.status(500).send('Ошибка при расшифровке.')
        }

        res.send({ text: stdout.trim() })
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})
