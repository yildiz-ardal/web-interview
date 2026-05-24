import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

const todoLists = {
  '0000000001': { id: '0000000001', title: 'First List', todos: [{ text: 'First todo of first list!', completed: true, dueDate: null }] },
  '0000000002': { id: '0000000002', title: 'Second List', todos: [{ text: 'First todo of second list!', completed: false, dueDate: null }] },
}

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/todo-lists', (req, res) => res.json(todoLists))
app.put('/todo-lists/:id', (req, res, next) => {
    try {
        const { id } = req.params
        const list = todoLists[id]
        if (!list) return res.status(404).json({ error: 'List not found' })
        todoLists[id] = { ...list, todos: req.body.todos }
        res.json(todoLists[id])
    } catch (err) {
        next(err)
    }
 })

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
    .on('error', (err) => {
        console.error('Server failed to start:', err.message)
        process.exit(1)
    })
