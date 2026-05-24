import React, { useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  const getDueLabel = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.round((new Date(dueDate) - today) / (1000 * 60 * 60 * 24))
    if (diff === 0) return { label: 'Due today', color: 'warning.main' }
    if (diff > 0) return { label: `${diff} day${diff === 1 ? '' : 's'} remaining`, color: 'success.main' }
    return { label: `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} overdue`, color: 'error.main' }
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem', textDecoration: todo.completed ? 'line-through' : 'none' }}
                label='What to do?'
                value={todo.text}
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { ...todo, text: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
                onBlur={() => saveTodoList(todoList.id, { todos })}
              />
              {(() => {
                const due = getDueLabel(todo.dueDate)
                return (
                  <TextField
                    sx={{ marginTop: '1rem', marginLeft: '1rem' }}
                    type='date'
                    label='Due date'
                    InputLabelProps={{ shrink: true }}
                    value={todo.dueDate || ''}
                    helperText={due?.label}
                    FormHelperTextProps={{ sx: { color: due?.color } }}
                    onChange={(event) => {
                      const newTodos = [
                        ...todos.slice(0, index),
                        { ...todo, dueDate: event.target.value || null },
                        ...todos.slice(index + 1),
                      ]
                      setTodos(newTodos)
                      saveTodoList(todoList.id, { todos: newTodos })
                    }}
                  />
                )
              })()}
              <Checkbox
                sx={{ alignSelf: 'center' }}
                checked={todo.completed}
                onChange={() => {
                  const newTodos = [
                    ...todos.slice(0, index),
                    { ...todo, completed: !todo.completed },
                    ...todos.slice(index + 1),
                  ]
                  setTodos(newTodos)
                  saveTodoList(todoList.id, { todos: newTodos })
                }}
              />
              <Button
                sx={{ margin: '8px', alignSelf: 'center' }}
                size='small'
                color='secondary'
                onClick={() => {
                  const newTodos = [
                    // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ]
                  setTodos(newTodos)
                  saveTodoList(todoList.id, { todos: newTodos })
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', completed: false, dueDate: null }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
