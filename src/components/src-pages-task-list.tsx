'use client'
import { Badge } from "@/components/ui/badge"
import { useState, useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import { motion, Reorder } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useTaskStore } from "@/store/taskDataStore"
import { $Enums } from "@prisma/client"

type Task = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
}

type FilterType = {
  status: Task['status'] | 'all'
  priority: Task['priority'] | 'all'
  dueDate: string
}


const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

export function TaskListComponent() {
  const taskStore = useTaskStore()
  const initialTasks = taskStore.taskData;
  const [tasks, setTasks] = useState<Task[]>(initialTasks.map(task => ({
      ...task,
      status: task.status.replace('_', '-') as Task['status'],
      description: task.description || ""
    })))
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [filter, setFilter] = useState<FilterType>({ status: 'all', priority: 'all', dueDate: '' })
  const [sort, setSort] = useState<keyof Task | 'none'>('none')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const addTask = useCallback(() => {
    if (newTask.title) {
      // console.log(newTask)
      taskStore.createTask(newTask.title, newTask?.description || "desc unavailable", newTask.priority || 'medium', newTask.status as $Enums.Status, newTask?.dueDate )
      taskStore.setTaskData([...taskStore.taskData, { ...newTask, id: Date.now().toString(), status: 'todo', priority: newTask.priority || 'medium', description: newTask.description || "desc unavailable", title: newTask.title || "unknown title" } ] )
      // taskStore.setTaskData([...taskStore.taskData, { ...newTask, id: Date.now().toString(), status: 'todo', priority: newTask.priority || 'medium', description: newTask.description || "desc unavailable" } ] )
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: Date.now().toString(), status: 'todo', priority: newTask.priority || 'medium' } as Task])
      setNewTask({})
    }
  }, [newTask])

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    taskStore.editTask(updatedTask.id, updatedTask.title, updatedTask.description || "", updatedTask.priority, updatedTask.status as $Enums.Status , updatedTask?.dueDate )
    taskStore.setTaskData(taskStore.taskData.map(task => task.id === updatedTask.id ? { ...updatedTask, description: updatedTask.description || "" } : task) )
    setEditingTask(null)
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    taskStore.setTaskData(taskStore.taskData.filter(task => task.id !== id) )
    taskStore.deleteTask(id)
  }, [])

  const filteredAndSortedTasks = useMemo(() => {
    const result = tasks.filter(task =>
      (filter.status === 'all' || task.status === filter.status) &&
      (filter.priority === 'all' || task.priority === filter.priority) &&
      (!filter.dueDate || (task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === filter.dueDate))
    )

    if (sort !== 'none') {
      result.sort((a, b) => {
        if (a[sort] === b[sort]) return 0
        if (a[sort] === undefined) return 1
        if (b[sort] === undefined) return -1
        return a[sort] < b[sort] ? -1 : 1
      })

      if (sortDirection === 'desc') {
        result.reverse()
      }
    }

    return result
  }, [tasks, filter, sort, sortDirection])

  const handleSort = useCallback((value: keyof Task | 'none') => {
    if (value === sort) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(value)
      setSortDirection('asc')
    }
  }, [sort])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>

      {/* Task creation form */}
      <Card className="mb-4 hidden">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              placeholder="Task Title"
              value={newTask.title || ''}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newTask.description || ''}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <Select onValueChange={value => setNewTask({ ...newTask, priority: value as Task['priority'] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {newTask.dueDate ? format(new Date(newTask.dueDate), 'PP') : 'Set Due Date'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Due Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={newTask.dueDate}
                  onSelect={date => setNewTask({ ...newTask, dueDate: date })}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and sorting */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters and Sorting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select onValueChange={value => setFilter({ ...filter, status: value as Task['status'] | 'all' })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={value => setFilter({ ...filter, priority: value as Task['priority'] | 'all' })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              onChange={e => setFilter({ ...filter, dueDate: e.target.value })}
              placeholder="Filter by Due Date"
            />
            <Select onValueChange={handleSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sorting</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {sort !== 'none' && (
            <Button 
              className="mt-2" 
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              Sort {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Task list with drag and drop */}
      <Reorder.Group axis="y" values={filteredAndSortedTasks} onReorder={setTasks}>
        {filteredAndSortedTasks.map(task => (
          <Reorder.Item key={task.id} value={task}>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="mb-2">
                <CardContent className="p-4">
                  {editingTask?.id === task.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingTask.title}
                        onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                      />
                      <Input
                        value={editingTask.description || ''}
                        onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                      />
                      <Select onValueChange={value => setEditingTask({ ...editingTask, priority: value as Task['priority'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder={editingTask.priority} />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={value => setEditingTask({ ...editingTask, status: value as Task['status'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder={editingTask.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            {editingTask.dueDate ? format(new Date(editingTask.dueDate), 'PP') : 'Set Due Date'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Due Date</DialogTitle>
                          </DialogHeader>
                          <Calendar
                            mode="single"
                            selected={editingTask.dueDate}
                            onSelect={date => setEditingTask({ ...editingTask, dueDate: date })}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => updateTask(editingTask)}>Save</Button>
                      <Button variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">{task.title}</h2>
                        <p>{task.description}</p>
                        <p className="text-sm text-gray-500">Status: {task.status}</p>
                        <p className="text-sm text-gray-500">Priority: <Badge>{task.priority}</Badge></p>
                        <p className="text-sm text-gray-500">{task.dueDate ? format(new Date(task.dueDate), 'PP') : 'No due date'}</p>
                      </div>
                      <div>
                        <Button variant="outline" onClick={() => setEditingTask(task)}>Edit</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {filteredAndSortedTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No tasks match the current filters.</p>
      )}
    </div>
  )
}