// 1. Flocos de Neve Guns.lol (Canvas Background)
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const flakes = [];
const flakeCount = 70;

for (let i = 0; i < flakeCount; i++) {
    flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.7 + 0.3
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        f.y += f.speed;
        f.x += f.wind;

        if (f.y > canvas.height) {
            f.y = -5;
            f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
    });

    requestAnimationFrame(drawSnow);
}
drawSnow();

// 2. Data dos Horários do 8º Ano
const scheduleData = {
    seg: [
        { time: "08:05", subject: "Matemática (Álgebra)" },
        { time: "08:55", subject: "Português (Gramática)" },
        { time: "09:45", subject: "Ciências" },
        { time: "10:05", subject: "☕ Intervalo / Recreio", isBreak: true },
        { time: "10:55", subject: "História" },
        { time: "11:45", subject: "Geografia" },
        { time: "12:35", subject: "Inglês" }
    ],
    ter: [
        { time: "08:05", subject: "Português (Redação)" },
        { time: "08:55", subject: "Matemática (Geometria)" },
        { time: "09:45", subject: "História" },
        { time: "10:05", subject: "☕ Intervalo / Recreio", isBreak: true },
        { time: "10:55", subject: "Ciências" },
        { time: "11:45", subject: "Educação Física" },
        { time: "12:35", subject: "Artes" }
    ],
    qua: [
        { time: "08:05", subject: "Ciências" },
        { time: "08:55", subject: "Geografia" },
        { time: "09:45", subject: "Matemática (Álgebra)" },
        { time: "10:05", subject: "☕ Intervalo / Recreio", isBreak: true },
        { time: "10:55", subject: "Português" },
        { time: "11:45", subject: "Inglês" },
        { time: "12:35", subject: "Filosofia" }
    ],
    qui: [
        { time: "08:05", subject: "História" },
        { time: "08:55", subject: "Ciências" },
        { time: "09:45", subject: "Português" },
        { time: "10:05", subject: "☕ Intervalo / Recreio", isBreak: true },
        { time: "10:55", subject: "Matemática (Geometria)" },
        { time: "11:45", subject: "Geografia" },
        { time: "12:35", subject: "Educação Física" }
    ],
    sex: [
        { time: "08:05", subject: "Matemática (Álgebra)" },
        { time: "08:55", subject: "Português" },
        { time: "09:45", subject: "Inglês" },
        { time: "10:05", subject: "☕ Intervalo / Recreio", isBreak: true },
        { time: "10:55", subject: "História" },
        { time: "11:45", subject: "Ciências" },
        { time: "12:35", subject: "Artes" }
    ]
};

// Renderizar Grade
function setDay(day) {
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
    if(event && event.target) {
        event.target.classList.add('active');
    }

    const grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';

    scheduleData[day].forEach(item => {
        const card = document.createElement('div');
        card.className = `glass-card time-card stumble-bounce ${item.isBreak ? 'break' : ''}`;
        card.innerHTML = `
            <div class="time-info">
                <span class="time-badge">${item.time}</span>
                <span class="subject-name">${item.subject}</span>
            </div>
            ${item.isBreak ? '<i class="fa-solid fa-mug-hot" style="color: var(--break-color)"></i>' : '<i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.8rem;"></i>'}
        `;
        grid.appendChild(card);
    });
}

// 3. Gerenciador de Tarefas
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskSubject = document.getElementById('taskSubject');
const taskList = document.getElementById('taskList');
let tasks = [
    { title: "Exercícios de Geometria pág 45", subject: "Matemática", done: false },
    { title: "Resumo sobre Revolução Industrial", subject: "História", done: false }
];

function renderTasks() {
    taskList.innerHTML = '';
    let pending = 0;

    tasks.forEach((task, index) => {
        if(!task.done) pending++;
        const li = document.createElement('li');
        li.className = `task-item stumble-bounce ${task.done ? 'completed' : ''}`;
        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
                <span>${task.title}</span>
            </div>
            <span class="task-tag">${task.subject}</span>
        `;
        taskList.appendChild(li);
    });

    document.getElementById('pendingTasksCount').innerText = pending;
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tasks.push({
        title: taskInput.value,
        subject: taskSubject.value,
        done: false
    });
    taskInput.value = '';
    renderTasks();
});

// 4. Pomodoro Timer
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    const btn = document.getElementById('startTimerBtn');
    if (isRunning) {
        clearInterval(timer);
        btn.innerHTML = '<i class="fa-solid fa-play"></i> Continuar';
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                alert("Tempo finalizado!");
            }
        }, 1000);
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    document.getElementById('startTimerBtn').innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
}

function setTimerMode(minutes, btn) {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timeLeft = minutes * 60;
    resetTimer();
}

// 5. Calculadora de Médias
function calcularMedia() {
    const b1 = parseFloat(document.getElementById('b1').value) || 0;
    const b2 = parseFloat(document.getElementById('b2').value) || 0;
    const b3 = parseFloat(document.getElementById('b3').value) || 0;
    const b4 = parseFloat(document.getElementById('b4').value) || 0;

    const media = (b1 + b2 + b3 + b4) / 4;
    const finalElem = document.getElementById('finalAverage');
    const badge = document.getElementById('statusBadge');

    finalElem.innerText = media.toFixed(1);

    if (media >= 6.0) {
        badge.innerText = "Aprovado";
        badge.className = "status-badge approved";
    } else {
        badge.innerText = "Atenção / Recuperação";
        badge.className = "status-badge reproved";
    }
}

// 6. Cursor Glow FX
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
});

// 7. Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Inicializar
setDay('seg');
renderTasks();