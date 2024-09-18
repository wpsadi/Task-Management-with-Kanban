"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle,  } from "@/components/ui/dialog"
import { PlusIcon, Edit2Icon, TrashIcon } from 'lucide-react'
import { useTaskStore } from '@/store/taskDataStore'
import { $Enums } from '@prisma/client'

type Task = {
  id: string
  title: string
  description: string
  status: $Enums.Status
  priority: $Enums.Priority
  dueDate?: Date
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

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-green-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'high':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}



export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const taskStore = useTaskStore();
  const initialTasks = taskStore.taskData;

  useEffect(() => {
    setTasks(initialTasks)
    setIsClient(true)
  }, [])

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const addTask = (status: $Enums.Status) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      status: status,
      priority: 'medium',
      dueDate: new Date()
    }
    setEditingTask(newTask)
    setIsAddingTask(true)
  }

  const updateTask = (updatedTask: Task) => {
    if (isAddingTask) {
      if (updatedTask.title.trim() === '') {
        setEditingTask(null)
        setIsAddingTask(false)
        return
      }
      taskStore.createTask(updatedTask.title, updatedTask.description, updatedTask.priority as $Enums.Priority, updatedTask.status as $Enums.Status, updatedTask?.dueDate  )

      taskStore.setTaskData([...tasks, updatedTask] )
      setTasks([...tasks, updatedTask])
    } else {
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
      // console.log(("u dfg"),updatedTask)
      // const editedTaskData = 
      taskStore.editTask(updatedTask.id, updatedTask.title, updatedTask.description, updatedTask.priority as $Enums.Priority, updatedTask.status as $Enums.Status, updatedTask?.dueDate )
      taskStore.setTaskData(updatedTasks)
      setTasks(updatedTasks)
    }
    setEditingTask(null)
    setIsAddingTask(false)
  }

  const deleteTask = (taskId: string) => {
    // console.log(taskId)
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    taskStore.deleteTask(taskId)
    taskStore.setTaskData(updatedTasks )
    setTasks(updatedTasks)
  }

  const onDragEnd = (task: Task, newStatus: $Enums.Status) => {
    const updatedTask = { ...task, status: newStatus }
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t)
    taskStore.editTask(updatedTask.id, updatedTask.title, updatedTask.description, updatedTask.priority as $Enums.Priority, updatedTask.status as $Enums.Status, updatedTask?.dueDate )
    taskStore.setTaskData(updatedTasks)
    setTasks(updatedTasks)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex space-x-4">
        {statusOptions.map(status => (
          <div key={status.value} className="flex-1 " data-status={status.value}>
            <h2 className="text-lg font-semibold mb-2">{status.label}</h2>
            <div
              ref={el => {
                columnRefs.current[status.value] = el;
              }}
              className="space-y-2 min-h-[200px] bg-gray-100 p-2 rounded-md"
            >
              <Reorder.Group
                axis="y"
                values={getTasksByStatus(status.value)}
                onReorder={(newOrder) => {
                  const updatedTasks = tasks.map(task => 
                    task.status === status.value ? newOrder.find(newTask => newTask.id === task.id) || task : task
                  )
                  setTasks(updatedTasks)
                }}
              >
                {getTasksByStatus(status.value).map((task) => (
                  <Reorder.Item key={task.id} value={task}>
                    <TaskCard
                      task={task}
                      deleteTask={deleteTask}
                      setEditingTask={setEditingTask}
                      onDragEnd={onDragEnd}
                      // columnRef={columnRefs.current[status.value as $Enums.Status]}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
            <Button className="w-full mt-2" variant="outline" onClick={() => addTask(status.value)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!editingTask} onOpenChange={(open) => {
        if (!open) {
          setEditingTask(null)
          setIsAddingTask(false)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingTask ? 'Add Task' : 'Edit Task'}</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <Input
                placeholder="Task Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
              />
              <Textarea
                placeholder="Task Description"
                value={editingTask.description}
                onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
              />
              <Select
                value={editingTask.status}
                onValueChange={(value) => setEditingTask({...editingTask, status: value as $Enums.Status})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={editingTask.priority}
                onValueChange={(value) => setEditingTask({...editingTask, priority: value as $Enums.Priority})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value ? new Date(e.target.value) : undefined})}
              />
              <Button onClick={() => updateTask(editingTask)}>
                {isAddingTask ? 'Add Task' : 'Update Task'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskCard({ task, deleteTask, setEditingTask, onDragEnd,  }: { 
  task: Task, 
  deleteTask: (id: string) => void, 
  setEditingTask: (task: Task) => void,
  onDragEnd: (task: Task, newStatus: $Enums.Status) => void,
  // columnRef: HTMLDivElement | null // Still receiving the column reference
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item value={task} dragListener={false} dragControls={controls}>
      <motion.div
        drag
        dragConstraints={undefined} // No constraints to allow free movement across columns
        dragElastic={0.2} // You can adjust this for how "snappy" or "elastic" the drag is
        dragControls={controls}
        onDragEnd={(event, info) => {
          const elements = document.elementsFromPoint(info.point.x, info.point.y)
          const newStatusElement = elements.find(el => el.getAttribute('data-status'))
          if (newStatusElement) {
            const newStatus = newStatusElement.getAttribute('data-status') as $Enums.Status
            if (newStatus && newStatus !== task.status) {
              onDragEnd(task, newStatus)
            }
          }
        }}
        whileDrag={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }} // For visual feedback during dragging
      >
        <Card className="mb-2 cursor-move" onPointerDown={(e) => controls.start(e)}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {task.title}
              <div>
                <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                  <Edit2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Due: {task.dueDate ? new Date(task!.dueDate).toLocaleDateString() : "No due date"}</p>
          </CardContent>
          <CardFooter>
            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
    </Reorder.Item>
  )
}
