require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index.js');
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.all('*', (req, res) => {
  res.status(404).json({ message: 'API Not Found' })
});

app.listen(PORT, () =>{
  console.log(`App running on port ${PORT}`);
})
