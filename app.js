const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const filename="file.txt"


// Endpoint to save text to a local text file
app.post('/save', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Use fs.appendFile to append text to the file
  fs.appendFile(filename, text, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to append text' });
    }

    return res.status(200).json({ message: 'Text appended successfully' });
  });
});

// Endpoint to download the saved text file
app.get('', (req, res) => {
  const filePath = filename;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.delete('/remove/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = __dirname + '/' + filename;

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }

    res.json({ message: 'File deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
