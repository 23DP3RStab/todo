document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');
    const tasksContainer = document.getElementById('tasksContainer');
    const allTasksBtn = document.getElementById('allTasks');
    const activeTasksBtn = document.getElementById('activeTasks');
    const completedTasksBtn = document.getElementById('completedTasks');
    
    const API_BASE_URL = 'http://localhost:3000';
    
    let currentFilter = 'all';
    
    taskForm.addEventListener('submit', handleFormSubmit);
    allTasksBtn.addEventListener('click', () => filterTasks('all'));
    activeTasksBtn.addEventListener('click', () => filterTasks('active'));
    completedTasksBtn.addEventListener('click', () => filterTasks('completed'));
    
    fetchTasks();
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const newTask = {
            title: titleInput.value,
            description: descriptionInput.value,
            status: statusInput.value
        };
        
        addTask(newTask);
        
        taskForm.reset();
    }
    
    async function fetchTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            tasksContainer.innerHTML = '<div class="no-tasks">Error loading tasks. Please try again later.</div>';
        }
    }
    
    async function addTask(task) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    }
    
    async function updateTaskStatus(taskId, newStatus) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    }
    
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }
    
    function renderTasks(tasks) {
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => task.status === 'active');
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.status === 'completed');
        }
        
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = '<div class="no-tasks">No tasks found. Add a new task to get started!</div>';
            return;
        }
        
        tasksContainer.innerHTML = '';
        
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description || 'No description'}</div>
                    <div class="task-meta">
                        <small>Created: ${formatDate(task.createdAt)}</small>
                        ${task.updatedAt ? `<small> | Updated: ${formatDate(task.updatedAt)}</small>` : ''}
                    </div>
                </div>
                <div class="task-status ${task.status}">${task.status}</div>
                <div class="task-actions">
                    <button class="toggle-status" data-id="${task._id}" data-status="${task.status}">
                        <i class="fas fa-${task.status === 'active' ? 'check' : 'undo'}"></i>
                    </button>
                    <button class="delete" data-id="${task._id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            tasksContainer.appendChild(taskElement);
        });
        
        document.querySelectorAll('.toggle-status').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = this.getAttribute('data-id');
                const currentStatus = this.getAttribute('data-status');
                const newStatus = currentStatus === 'active' ? 'completed' : 'active';
                updateTaskStatus(taskId, newStatus);
            });
        });
        
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(taskId);
                }
            });
        });
    }
    
    function filterTasks(filter) {
        currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (filter === 'all') {
            allTasksBtn.classList.add('active');
        } else if (filter === 'active') {
            activeTasksBtn.classList.add('active');
        } else if (filter === 'completed') {
            completedTasksBtn.classList.add('active');
        }
        
        fetchTasks();
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
});