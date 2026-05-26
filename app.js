const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// CRITICAL: This middleware parses your form submissions so req.body works!
app.use(express.urlencoded({ extended: true }));

// Track IDs globally so every new task gets a unique ID number
let currentId = 3;

const myCards = [
    { 
        id: "1", 
        title: "Fix database connection", 
        text: "The main MongoDB connection pool keeps dropping under heavy loads. Need to update configuration variables.",
        deadline: "2026-06-01",
        completed: false
    },
    { 
        id: "2", 
        title: "Review C237 Assignment", 
        text: "Check through the rubric criteria for Lesson 12 and ensure all template layout configurations load flawlessly.",
        deadline: "2026-05-30",
        completed: false
    }
];

// 1. GET Dashboard Route
app.get('/dash', (req, res) => {
    res.render('dash', { cardsData: myCards });
});

// 2. POST Route to Create a New Task
app.post('/add-card', (req, res) => {
    const newTask = {
        id: String(currentId++), // Generate unique string id
        title: req.body.title,
        text: req.body.text,
        deadline: req.body.deadline,
        completed: false // All new tasks start out uncompleted
    };
    
    myCards.push(newTask);
    res.redirect('/dash'); // Redirects straight back to dashboard
});

// 3. GET Single Task Details Route
app.get('/task/:id', (req, res) => {
    const taskId = req.params.id;
    const foundTask = myCards.find(t => t.id === taskId); 

    if (foundTask) {
        res.render('task', { task: foundTask }); 
    } else {
        res.status(404).send("Task not found");
    }
});

// 4. POST Route to MARK TASK AS COMPLETE
app.post('/task/:id/complete', (req, res) => {
    const taskId = req.params.id;
    const foundTask = myCards.find(t => t.id === taskId); 

    if (foundTask) {
        foundTask.completed = true; // Update the state inside the array
        res.redirect('/dash'); // Redirect straight back to dashboard
    } else {
        res.status(404).send("Task not found");
    }
});

// 5. POST Route to DELETE a Task
app.post('/task/:id/delete', (req, res) => {
    const taskId = req.params.id;
    const taskIndex = myCards.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        myCards.splice(taskIndex, 1);
        res.redirect('/dash'); // Redirect straight back to dashboard
    } else {
        res.status(404).send("Task not found");
    }
});

app.listen(port, () => { console.log(`Server is running at http://localhost:${port}`); });