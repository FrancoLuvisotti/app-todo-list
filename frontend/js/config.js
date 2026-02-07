//window.API_URL = 'https://app-todo-list-backend.onrender.com';
window.API_URL = location.hostname.includes('localhost')
    ? 'http://localhost:5000'
    : 'https://app-todo-list-backend.onrender.com';
