# ✅ Pendify - App de Lista de Tareas

![Estado del proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Licencia MIT](https://img.shields.io/badge/licencia-MIT-green)
![Hecho con Node.js](https://img.shields.io/badge/backend-Node.js-blue)
![Hecho con Bootstrap](https://img.shields.io/badge/frontend-Bootstrap-purple)

**Pendify** es una aplicación web desarrollada para ayudarte a gestionar tus tareas de manera simple, ordenada e intuitiva. Permite registrar usuarios, iniciar sesión, agregar tareas, editarlas, marcarlas como completadas y filtrarlas por estado.

---

## ✨ Funcionalidades

| Función                             | Estado       |
|------------------------------------|--------------|
| Registro e inicio de sesión        | ✅ Completado |
| Crear, editar, eliminar tareas     | ✅ Completado |
| Filtrar tareas por estado          | ✅ Completado |
| Modificar usuario (nombre/clave)   | ⚙️ En desarrollo |

---

## 🧰 Tecnologías utilizadas

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB** con **Mongoose**

### Frontend:
- **HTML, CSS, JavaScript**
- **Bootstrap 5**

---

## 🖥️ Capturas de pantalla

- **Login**
  ![Login](assets/login.png)

- **Vista principal con tareas**
  ![Dashboard](assets/dashboard.png)

- **Formulario de edición**
  ![Editar tarea](assets/edit-task.png)

---

## 🌍 Demo en línea 
(Aún en desarrollo)

> Puede demorar unos segundos en cargar.

🔗 [https://app-todo-list-1.onrender.com](https://app-todo-list-1.onrender.com)

---

## 💻 Uso local

```bash
git clone https://github.com/tu-usuario/pendify.git
cd pendify
```

### Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/pendify
```

Iniciar servidor:

```bash
node server.js
```

### Frontend

```bash
cd ../frontend
# Abrí index.html en el navegador o usá Live Server
```

---

## 🧭 Interfaz de Usuario

- **Inicio de sesión y registro**
- **Gestión de tareas con formulario modal**
- **Filtrado por Todas / Pendientes / Completadas**
- **Edición y eliminación de tareas**
- **Cerrar sesión**

---

## 📌 Próximos pasos

- [ ] Modificar datos del usuario
- [ ] Validación avanzada de formularios
- [ ] Modo oscuro
- [ ] Panel de perfil

---

## 🗂️ Estructura del proyecto

```
pendify/
├── backend/
│   ├── routes/
│   ├── models/
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
├── assets/
└── README.md
```

---

## ✍️ Autor

- **Franco Daniel Luvisotti Junco**  

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
