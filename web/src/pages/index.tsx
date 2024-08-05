
import { useEffect, useState } from "react";
import { Black_And_White_Picture, Inter } from "next/font/google";
import {
  Button,Dialog,DialogActions,DialogContent,DialogTitle,Grid,TextField,Typography,Container,Box,Paper} from "@mui/material";
import { purple, red,green } from '@mui/material/colors';

import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";



export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [persona, setPersona] = useState("");
  const [group, setGroup] = useState<number>(0);
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    fetchTasks("all");
    fetchTasks("active");
    fetchTasks("completed");
    
  }, []);


 
  const fetchTasks = async (type: string) => {
    const res = await fetch(`/api/hello?type=${type}`);
    const tasks = await res.json();
    if (type === "active") {
      setActiveTasks(tasks);
    } else if(type === "completed") {
      setCompletedTasks(tasks);
    } else {
      setAllTasks(tasks);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, persona, group }),
    });
    if (res.ok) {
      fetchTasks("active");
      setTitle("");
      setDescription("");
      setPersona("");
      setGroup(0);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    const res = await fetch("/api/hello", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId, completed: true }),
    });
    if (res.ok) {
      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      fetchTasks("active");
      fetchTasks("completed"); 
    }
  };

  const handleUpdateTask = (task: Task) => {
    setUpdatingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPersona(task.persona);
    setGroup(task.group);
    setShowModal(true);
  };

  const handleSubmitUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingTask) {
      const res = await fetch("/api/hello", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatingTask.id,
          title,
          description,
          persona,
          group,
        }),
      });
      if (res.ok) {
        fetchTasks("active");
        setUpdatingTask(null);
        setTitle("");
        setDescription("");
        setPersona("");
        setGroup(0);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const res = await fetch(`/api/hello?id=${taskId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchTasks("active");
      fetchTasks("completed");
    }
  };

   return (
    <Container maxWidth="lg">
    <Typography variant="h4" color="white" align="center" gutterBottom mt={4}>
      Yo!! Hope you&#39;re doing well.
    </Typography>

    <Box display="flex" justifyContent="center" mb={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
      >
        Create Task
      </Button>
    </Box>

    <Grid container spacing={4} marginInlineEnd={2} >
      <Grid item xs={12} md={4} color="black" >
        <Typography variant="h4" color="White" gutterBottom align="center">
          To-Do
        </Typography>
        <Box gap={4} p={2} bgcolor="purple" borderRadius={0}>
          {allTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4"
             >
              <Typography variant="h6" align="center" padding={2}>{task.title}</Typography>
              <Typography padding={1}>{task.description}</Typography>
              <Typography paddingTop={0} paddingLeft={1}>{task.persona}</Typography>
              <Box mt={2} display="flex"  margin={3} marginBottom={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: '20px' }}
                  onClick={() => handleUpdateTask(task)}
                  className="mr-2"
                >
                  Update
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ margin: '20px' }}
                  onClick={() => handleDeleteTask(task.id)}
                  className="mr-2"
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h4" color="white" gutterBottom textAlign={"center"}>
          In-Progress
        </Typography>
        <Box gap={4} p={2} bgcolor="purple">
          {activeTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4">
              <Typography variant="h6" padding={2}>{task.title}</Typography>
              <Typography padding={1}>{task.description}</Typography>
              <Typography padding={1}>{task.persona}</Typography>
              <Box mt={2} display="flex" marginBottom={2}>
                <Button
                  variant="contained"
                  color="primary"
                  
                  sx={{ marginTop: '21px',marginLeft:'8px', width:'10',height:'36px' }}
                  onClick={() => handleCompleteTask(task.id)}
                  
                >
                  Complete
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ margin: '20px',marginLeft:'31px' }}
                  onClick={() => handleUpdateTask(task)}
                >
                  Update
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ margin: '20px' }}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={4} >
        <Typography variant="h4"  gutterBottom align="center">
          Completed Tasks
        </Typography>
        <Box bgcolor="purple">
          {completedTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4">
              <Typography variant="h6" align="center">{task.title}</Typography>
              <Typography align="center">{task.description}</Typography>
              <Typography align="center">{task.persona}</Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ margin: '20px' }}
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </Paper>
          ))}
        </Box>
      </Grid>
    </Grid>

    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>{updatingTask ? "Update Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={updatingTask ? handleSubmitUpdateTask : handleCreateTask}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Group"
            type="number"
            value={group}
            onChange={(e) => setGroup(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
          />
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              {updatingTask ? "Update Task" : "Create Task"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowModal(false);
                setUpdatingTask(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  </Container>
  ); 
}