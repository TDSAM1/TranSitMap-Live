const http = require('http');
const fs = require('fs');
const path = require('path'); // Cambié "ruta" por 'path' que es el nombre correcto del módulo

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
    } else if (req.method === 'GET' && req.url === '/data') {
        // Leer el archivo data.json
        fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al leer el archivo data.json' }));
                return;
            }
            // Si no hay errores, devolver el contenido del archivo data.json
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        // Recibir los datos del formulario
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const { name, email, password } = userData;

                // Verificar que todos los campos estén completos
                if (name && email && password) {
                    // Carpeta del usuario en la ruta /users
                    const userFolder = path.join(__dirname, 'users', email);

                    // Verificar si la carpeta ya existe
                    if (!fs.existsSync(userFolder)) {
                        fs.mkdirSync(userFolder, { recursive: true });

                        // Crear el archivo de información del usuario (user-info.txt)
                        const userInfo = `Nombre: ${name}\nEmail: ${email}\nContraseña: ${password}`;

                        // Guardar el archivo dentro de la carpeta del usuario
                        fs.writeFile(path.join(userFolder, 'user-info.txt'), userInfo, (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Error al guardar la información del usuario' }));
                                return;
                            }

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '¡Registro Exitoso!' }));
                        });
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'El usuario ya está registrado' }));
                    }
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Faltan datos' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al procesar los datos del formulario' }));
            }
        });
    } else {
        // Responder con un 404 si la ruta no es válida
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
    }
}).listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
