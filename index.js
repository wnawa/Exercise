const http = require('http');
const url = require('url');

//Tasks Data To Display
const tasks = [
    { id: 1, name: 'shopping', completed: false },
    { id: 2, name: 'study', completed: false }
];
// //GET /tasks: Retrieve a list of tasks.
const handleGetTasks = (res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
}
const port = 2000;
//POST /tasks: Add a new task.
// N.B:Watch out for th e json formate you add douple quetes is a must in json
//  { "id": 3, "name": "wahsing", "completed": false }
const addPostTask = async (req, res) => {
    try {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        await new Promise((resolve, reject) => {
            req.on('end', () => {
                const task = JSON.parse(body);
                tasks.push(task);
                res.writeHead(201, { 'contexnt-Type': 'application/json' });
                res.end(JSON.stringify(task));
                resolve();
            });
            req.on('error', error => reject(error));
        });
    } catch (error) {
        res.writeHead(400, { 'content-Type': 'text/plain' });
        res.end('Invalid data');
    }

}
//PUT /tasks/:id/complete: Mark a task as completed.
const handleCompleteTask = (req, res, taskId) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
        //update task
        task.completed = true;
        //send response indicate success
        res.writeHead(200, { 'content-Type': 'application/json' });
        res.end(JSON.stringify(task));
    } else {
        //when task not found display msg
        res.writeHead(404, { 'content-Type': 'text/plain' });
        res.end('Task Not Found');
    }
}
//create server
const server = http.createServer(async (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    if (path == '/tasks' && req.method == 'GET') {

        handleGetTasks(res);
    }
    else if (path == '/tasks' && req.method == 'POST') {

        await addPostTask(req, res);

    } else if (path.startsWith('/tasks/') && req.method == 'PUT') {
        //Get the id from th url
        
        const taskId = parseInt(path.split('/')[2]);
        console.log(taskId);
        handleCompleteTask(req, res, taskId);
    }
    else {
        //Show Error id the Path not Found
        res.writeHead(404, { 'content-Type': 'text/plain' });
        res.end('Not Found');
    }
});




server.listen(port, () => {
    // The server object listens on port 3000
    console.log(`server start at port ${port}`);
}
);
