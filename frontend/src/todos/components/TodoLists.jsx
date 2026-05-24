import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { TodoListForm } from './TodoListForm'

const fetchTodoLists = async () => {
  const res = await fetch('/todo-lists')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [error, setError] = useState(null)

  const saveTodoList = async (id, { todos }) => {
    const res = await fetch(`/todo-lists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos }),
    })
    if (!res.ok) return setError(`Failed to save: HTTP ${res.status}`)
    const listToUpdate = todoLists[id]
    setTodoLists({ ...todoLists, [id]: { ...listToUpdate, todos } })
  }

  useEffect(() => {
    fetchTodoLists().then(setTodoLists).catch(err => setError(err.message))
  }, [])

  if (error) return <Typography color='error'>{error}</Typography>
  if (!Object.keys(todoLists).length) return <CircularProgress sx={{ margin: '2rem' }} />
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => {
              const list = todoLists[key]
              const isCompleted = list.todos.length > 0 && list.todos.every(todo => todo.completed)
              return (
                <ListItemButton key={key} onClick={() => setActiveList(key)}>
                  <ListItemIcon>
                    {isCompleted ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                  </ListItemIcon>
                  <ListItemText primary={list.title} />
                </ListItemButton>
              )
            })}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={saveTodoList}
        />
      )}
    </Fragment>
  )
}
