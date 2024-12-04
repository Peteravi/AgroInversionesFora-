const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const tedious = require('tedious'); 
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/static/IMAGENES', express.static(path.join(__dirname, 'IMAGENES')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'IMAGENES');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); 
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error leyendo ${filePath}:`, error);
    return [];
  }
};

const writeJSON = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
};
const productosPath = path.join(__dirname, 'Productos.json');
const blogPostsPath = path.join(__dirname, 'blogPosts.json');
const infoPath = path.join(__dirname, 'info.json');
const chatbotResponsesPath = path.join(__dirname, 'chatbotResponses.json');
const nosotrosPath = path.join(__dirname, 'nosotros.json');
const typoCorrectionsPath = path.join(__dirname, 'typoCorrections.json');
app.get('/api/productos', (req, res) => {
    const productos = readJSON(productosPath);
    res.json(productos);
});

app.get('/api/blogPosts', (req, res) => {
  const blogPosts = readJSON(blogPostsPath);
  res.json(blogPosts);
});

app.get('/api/info', (req, res) => {
  const info = readJSON(infoPath);
  res.json(info);
});

app.get('/api/chatbotResponses', (req, res) => {
  const chatbotResponses = readJSON(chatbotResponsesPath);
  res.json(chatbotResponses);
});

app.get('/api/nosotros', (req, res) => {
  const nosotros = readJSON(nosotrosPath);
  res.json(nosotros);
});

app.get('/api/typoCorrections', (req, res) => {
  const typoCorrections = readJSON(typoCorrectionsPath);
  res.json(typoCorrections);
});


const config = {
  server: 'DESKTOP-DR6VP29\SQLEXPRESS',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'DESKTOP-DR6VP29',
      userName: 'DESKTOP-DR6VP29\\HP',
      password: ''
    },
  },
  options: {
    database: 'dbAgroInversionesFora',
    encrypt: true,
    trustServerCertificate: true,
  },
};

let connection = null;
let server = null; 

const connectToDatabase = () => {
  connection = new tedious.Connection(config);

  connection.on('connect', () => {
    console.log('Conectado a la base de datos MSSQL.');
    server = app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
    server.on('close', () => {
      if (connection) {
          connection.close();
          console.log('Conexión a la base de datos cerrada.');
      }
  });
  });

  connection.on('error', (err) => {
    console.error('Error CRÍTICO en la conexión MSSQL:', err.message);
    if (server) {
        server.close();
    }
    process.exit(1); 
  });
  connection.on('end', () => {
    console.log('Conexión a la base de datos cerrada.');
  });

  connection.connect(); 
};
connectToDatabase(); 