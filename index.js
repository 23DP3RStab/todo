import express from 'express';
import mongoose, { mongo } from 'mongoose';
import bodyParser from 'body-parser';
// import cors from 'cors';
// app.use(cors());

const app = express();
app.use(express.json());

mongoose.connect('<db_connection_string>');

const Task = mongoose.model('Task', { title: String, description: String, status: String, createtedAt: Date, updatedAt: Date });
// const User = mongoose.model('User', { name: String, email: String });

app.get('/tasks', async (req, res) => {
  res.json(await Task.find({}));
});

app.post('/tasks', async (req, res) => {
  const task = new Task({ title: req.body.title, description: req.body.description, status: req.body.status, createtedAt: new Date(), updatedAt: new Date() });
  await task.save();
  res.send('Task created!');
});

app.put('/tasks/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: new Date() });
  res.send(`Task with ID ${req.params.id} updated!`);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send(`Task with ID ${req.params.id} deleted!`);
});

app.listen(3000);