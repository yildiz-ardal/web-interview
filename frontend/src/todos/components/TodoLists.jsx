import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
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
      method: 'PUT',
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
  if (!Object.keys(todoLists).length) return null // show spinner instead?
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItemButton key={key} onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
              </ListItemButton>
            ))}
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
