const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear servidor HTTP
http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Servir el archivo HTML
        fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar el archivo');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        // Recibir los datos del formulario
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const userData = JSON.parse(body);

            // Leer el archivo data.json y agregar los nuevos datos
            fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
                let users = [];
                if (err && err.code !== 'ENOENT') {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al leer el archivo de datos');
                    return;
                }
                if (data) {
                    users = JSON.parse(data);
                }

                // Agregar el nuevo usuario
                users.push(userData);

                // Escribir los datos actualizados en data.json
                fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(users, null, 2), err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error al guardar los datos');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '¡Registro Exitoso!' }));
                });
            });
        });
    } else {
        // Responder con un 404 si la ruta no es válida
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
}).listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
