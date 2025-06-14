// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: ['#00f0ff', '#ff007a', '#00ff9f'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2, direction: 'none', random: true }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' } }
    }
});

// Display current date
const dateElement = document.getElementById('current-date');
dateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Motivational quotes
const quotes = [
    "Hack your day, own the future!",
    "Every task is a mission completed.",
    "Code your destiny, one task at a time.",
    "Power up your productivity!",
    "Neon dreams, real results."
];
const quoteElement = document.getElementById('quote');
quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Load tasks and gamification data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let points = parseInt(localStorage.getItem('points')) || 0;
let lastDate = localStorage.getItem('lastDate') || null;
const today = new Date().toDateString();

// Update streak
if (lastDate !== today && tasks.length > 0) {
    streak = lastDate === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString() ? streak + 1 : 1;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastDate', today);
}
document.getElementById('streak').textContent = streak;
document.getElementById('points').textContent = points;

// DOM elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('tasks');
const voiceBtn = document.getElementById('voice-btn');
const shareBtn = document.getElementById('share-btn');
const exportBtn = document.getElementById('export-btn');

// Voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.onresult = (event) => {
    document.getElementById('task-desc').value = event.results[0][0].transcript;
};
voiceBtn.addEventListener('click', () => {
    recognition.start();
    voiceBtn.classList.add('animate-pulse');
});
recognition.onend = () => voiceBtn.classList.remove('animate-pulse');

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}`;
        li.dataset.index = index;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="task-time">${task.time}</span>
            <span class="task-desc">${task.description}</span>
            <button class="delete-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
        `;
        VanillaTilt.init(li, { max: 15, speed: 400, glare: true, 'max-glare': 0.3 });
        taskList.appendChild(li);
    });
    saveData();
}

// Add task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = document.getElementById('task-time').value;
    const description = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    tasks.push({ time, description, priority, completed: false });
    points += { low: 10, medium: 20, high: 30 }[priority];
    document.getElementById('points').textContent = points;
    taskForm.reset();
    renderTasks();
});

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        points += 50;
        document.getElementById('points').textContent = points;
    }
    renderTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', points);
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastDate', today);
}

// Share on X
shareBtn.addEventListener('click', () => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const text = `I completed ${completed}/${total} tasks today on Cyber Planner! 🚀 Streak: ${streak} | Points: ${points} #CyberPlanner`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
});

// Export as image
exportBtn.addEventListener('click', () => {
    html2canvas(document.querySelector('.container')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'cyber-planner.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Initial render
renderTasks();
