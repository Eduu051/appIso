# 🎮 Gestor de Videojocs (LowDB + Express)

**Gestor simple de inventario de videojuegos con interfaz web**. Añade juegos, gestiona el stock y asigna plataformas (PC, PS5, Switch...) usando una pequeña API REST y una UI ligera.

---

## ✨ Características

- Añadir videojuegos con **título**, **stock** y **plataformas** (lista). ✅
- Incrementar / decrementar stock desde la UI. ➕➖
- Editar plataformas y eliminar juegos. ✏️🗑️
- Persistencia local con **LowDB** (archivo `db.json`). 💾

---

## 🧰 Tecnologías

- Node.js + Express
- LowDB (JSON como base de datos)
- HTML/CSS/Vanilla JS (front-end sencillo)

---

## 🚀 Quick Start

Requisitos: Node.js (v14+ recomendado)

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor:

```bash
node server.js
```

3. Abre la UI en tu navegador:

```
http://localhost:3000
```

---

## 🧩 API Principal

- GET /api/games
  - Devuelve la lista de juegos.

- POST /api/games
  - Crea un nuevo juego.
  - Body JSON ejemplo:

```json
{
  "title": "Halo Infinite",
  "stock": 5,
  "platforms": ["PC", "Xbox Series X"]
}
```

- PUT /api/games/:id
  - Actualiza campos (acepta `stock` y/o `platforms`).
  - `platforms` puede ser array o string separada por comas.

- GET /api/games/platform/:platform
  - Filtra juegos por plataforma (case-insensitive).

- DELETE /api/games/:id
  - Elimina un juego.

---

## 💡 Uso desde la UI

- Rellena **Títol**, **Stock** y **Plataformes** (separadas por comas) y pulsa *Afegir Videojoc*.
- Usa **+ / -** para ajustar stock rápidamente.
- Pulsa **Modificar** para editar plataformas (entrada por diálogo).
- Los cambios se guardan automáticamente en `db.json`.

---

## 📝 Notas y mejoras posibles

- Añadir validación más avanzada en el servidor y la UI.
- Añadir búsqueda y paginación en la UI.
- Permitir edición inline del título.
- Añadir tests y automatizar el despliegue.

---

Si quieres, puedo:
- Añadir un script `npm start` al `package.json` ✅
- Crear un pequeño conjunto de pruebas o mejorar la UI
- Incluir un ejemplo de `curl` o Postman para pruebas

Hecho con ❤️ por tu asistente. ¡Dime cómo quieres que lo adelante! 👇
