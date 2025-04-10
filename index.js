import express from 'express';
import mongoose, { mongo } from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

mongoose.connect('<db_connection_string>');

const Task = mongoose.model('Task', { title: String, description: String, status: String, createtedAt: Date, updatedAt: Date });
// const User = mongoose.model('User', { name: String, email: String });

app.get('/tasks', async (req, res) => {
  res.json(await Task.find({}));
});

app.post('/tasks', (req, res) => {
  const task = new Task({ title: req.body.title, description: req.body.description, status: req.body.status, createtedAt: new Date(), updatedAt: new Date() });
  res.send('Task created!');
});

app.put('/tasks/:id', (req, res) => {
  res.send(`Task with ID ${req.params.id} updated!`);
});

app.delete('/tasks/:id', (req, res) => {
  res.send(`Task with ID ${req.params.id} deleted!`);
});

app.listen(3000);