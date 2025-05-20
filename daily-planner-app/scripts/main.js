const taskListEl = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const searchInput = document.getElementById('search-input');
    const backToTopBtn = document.getElementById('back-to-top');
    const tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];

    const saveTasks = () => localStorage.setItem('dailyTasks', JSON.stringify(tasks));

    const renderTasks = (taskArray) => {
      taskListEl.innerHTML = '';
      taskArray.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.textContent = `${task.text} [${task.category}]`;
        span.className = `task-text${task.completed ? ' done' : ''}`;
        span.addEventListener('click', () => {
          task.completed = !task.completed;
          saveTasks();
          renderTasks(tasks);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(tasks);
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskListEl.appendChild(li);
      });
    };

    document.getElementById('add-task-btn').addEventListener('click', () => {
      const text = taskInput.value.trim();
      const category = taskCategory.value;
      if (text) {
        tasks.push({ text, completed: false, category });
        saveTasks();
        renderTasks(tasks);
        taskInput.value = '';
      }
    });

    document.getElementById('clear-all-btn').addEventListener('click', () => {
      tasks.length = 0;
      saveTasks();
      renderTasks(tasks);
    });

    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    };

    const throttle = (func, limit) => {
      let inThrottle;
      return (...args) => {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase();
      const filtered = tasks.filter(task => task.text.toLowerCase().includes(query));
      renderTasks(filtered);
    }, 300));

    window.addEventListener('scroll', throttle(() => {
      backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    }, 200));

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    renderTasks(tasks);