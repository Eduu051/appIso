const express = require('express');
const path = require('path');
const { join } = path;
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node'); // Utilitzem lowdb/node per a Node.js

const app = express();
const port = 3000;
const dbFile = join(__dirname, 'db.json');

// --- Configuració de lowdb (Adaptador i Inicialització) ---
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { games: [] }); // Valor per defecte

// Middleware
app.use(express.json());
// Serveix fitxers estàtics des de la carpeta 'public'
app.use(express.static(join(__dirname, 'public'))); 

// **Funció d'inicialització de la base de dades**
// Llegeix el fitxer db.json i escriu els valors per defecte si està buit.
async function initializeDB() {
    await db.read();
    // Aquesta línia assegura que `db.data` tingui la propietat `games` si el fitxer és nou/buit.
    db.data ||= { games: [] }; 
    await db.write();
}

initializeDB().then(() => {
    console.log("✅ Base de dades LowDB inicialitzada.");
    
    // **Rutes API**
    
    // 1. Obtindre totes les tasques
    app.get('/api/games', async (req, res) => {
        await db.read(); // Sempre llegeix abans de llegir dades per obtenir l'últim estat
        const games = db.data.games;
        res.json(games);
    });

    // 2. Afegir una nova tasca (ID amb Timestamp)
    app.post('/api/games', async (req, res) => {
        const { title, stock = 0, platforms = [] } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'El títol del videojoc és obligatori.' });
        }

        // Normalitza les plataformes a un array de cadenes netes
        let normalizedPlatforms = [];
        if (Array.isArray(platforms)) {
            normalizedPlatforms = platforms.map(p => String(p).trim()).filter(Boolean);
        } else if (typeof platforms === 'string') {
            normalizedPlatforms = platforms.split(',').map(p => p.trim()).filter(Boolean);
        }

        const newGame = {
            // Utilitzem Date.now() com a ID (serà un nombre)
            id: Date.now(), 
            title: title,
            platforms: normalizedPlatforms,
            stock: Number(stock) || 0
        };

        await db.read();
        db.data.games.push(newGame);
        await db.write(); // Escriu la base de dades amb el nou videojoc

        res.status(201).json(newGame);
    });

    // 3. Editar stock d'un videojoc
    app.put('/api/games/:id', async (req, res) => {
        // L'ID és un número, assegura't de convertir-lo de la cadena de paràmetres
        const gameId = parseInt(req.params.id); 
        const { stock, platforms } = req.body;
        await db.read();
        const gameIndex = db.data.games.findIndex(g => g.id === gameId);
        
        if (gameIndex === -1) {
            return res.status(404).json({ error: 'Videojoc no trobat.' });
        }

        // Actualitza només els camps proporcionats
        if (typeof stock !== 'undefined') {
            db.data.games[gameIndex].stock = Number(stock) || 0;
        }

        if (typeof platforms !== 'undefined') {
            // Accepta array o string separada per comes
            if (Array.isArray(platforms)) {
                db.data.games[gameIndex].platforms = platforms.map(p => String(p).trim()).filter(Boolean);
            } else if (typeof platforms === 'string') {
                db.data.games[gameIndex].platforms = platforms.split(',').map(p => p.trim()).filter(Boolean);
            } else {
                db.data.games[gameIndex].platforms = [];
            }
        }

        await db.write();

        res.json(db.data.games[gameIndex]);
    });

    // 4. Filtrar jocs per plataforma
    app.get('/api/games/platform/:platform', async (req, res) => {
        const platform = req.params.platform.toLowerCase();
        await db.read();
        const filteredGames = db.data.games.filter(game => 
            game.platforms.some(p => p.toLowerCase() === platform)
        );
        res.json(filteredGames);
    });

    // 5. Eliminar un joc
    app.delete('/api/games/:id', async (req, res) => {
        const gameId = parseInt(req.params.id);

        await db.read();
        const initialLength = db.data.games.length;
        
        // Filtra el videojoc a eliminar
        db.data.games = db.data.games.filter(g => g.id !== gameId);

        if (db.data.games.length === initialLength) {
            return res.status(404).json({ error: 'Videojoc no trobat.' });
        }

        await db.write();
        res.status(204).send();
    });

    // Serveix l'index.html
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'index.html'));
    });

    // Inicia el servidor
    app.listen(port, () => {
        console.log(`🚀 Servidor en marxa a http://localhost:${port}`);
    });
});