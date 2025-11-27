# 🏨 API de Reservas de Hotel — NestJS + PostgreSQL

Esta es una API REST para la gestión de **Hoteles**, **Habitaciones** y **Reservas**, desarrollada como parte de un ejercicio técnico.  
El proyecto está construido con **NestJS**, **TypeORM**, **PostgreSQL**, **Docker** y documentado con **Swagger**.

Incluye:

- Operaciones esenciales de creación y consulta para **Hoteles**
- Operaciones esenciales de creación y consulta para **Habitaciones**
- Operaciones esenciales de creación y consulta para **Reservas**
- Validación de **solapamiento de reservas**
- Autenticación mediante **API Key**
- Migraciones
- Tests básicos con Jest
- Archivo `AGENTS.md` para trabajo asistido con IA

---

## 1. 📌 Requisitos Previos

### 🔧 Software necesario

| Herramienta | Versión recomendada |
|-------------|---------------------|
| **Node.js** | v18+ o v20 |
| **npm / npm** | npm 9+ / npm 1+ |
| **Docker** | Última versión |
| **Docker Compose** | Última versión |


---

## 2. ⚙️ Configuración del archivo `.env`

En el repositorio encontrarás un archivo:

```
.env.example
```

Debés copiarlo y renombrarlo a:

```
.env
```

Luego completar los valores necesarios:

```env
# App
APP_PORT=3000
API_KEY=supersecreta123

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=root
POSTGRES_PASSWORD=123456
POSTGRES_DB=hotel_db

# PGAdmin (opcional)
PGADMIN_EMAIL=root@admin.com
PGADMIN_PASSWORD=root
```

---

## 3. 🚀 Cómo levantar la aplicación en desarrollo

### ▶️ Opción A — Usando Docker (RECOMENDADA)

```bash
docker-compose up -d
```

Esto levanta:

- contenedor PostgreSQL  
- contenedor PGAdmin  
- API NestJS en modo desarrollo  

Luego podés ver logs:

```bash
docker-compose logs -f api
```

Para apagar los contenedores:

```bash
docker-compose down
```

---

### ▶️ Opción B — Levantar sin Docker

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar NestJS:

```bash
npm start:dev
```

Necesitás tener PostgreSQL corriendo localmente con los valores del `.env`.

---

## 4. 🗄️ Inicializar la Base de Datos

### 🧱 Ejecutar migraciones

```bash
npm migration:run
```

### 🧪 Revertir migraciones (opcional)

```bash
npm migration:revert
```

---

## 5. 🧪 Correr los Tests

```bash
npm test
```

Tests unitarios (verbose):

```bash
npm test:watch
```

---

## 6. 📘 Documentación de la API (Swagger)

Una vez levantado el proyecto, podés acceder a:

```
http://localhost:3000/docs
```

Swagger incluye:

- Descripción de todas las rutas  
- Parámetros, DTOs y respuestas  
- Ejemplos  
- Configuración de API Key  

---

## 7. 🔑 Cómo enviar la API Key en los requests

Todas las rutas con prefijo `/api/*` requieren la API Key.

### Ejemplo usando **cURL**:

```bash
curl -H "x-api-key: supersecreta123" http://localhost:3000/api/hotels
```

### Ejemplo en **Postman / Insomnia**:

Header:

```
x-api-key: supersecreta123
```

### Ejemplo en **Swagger**:

1. Abrí `/docs`
2. Clic en **Authorize**
3. Ingresá tu API Key

---

## 📦 Scripts útiles

```bash
npm start          # Inicia la app
npm start:dev      # Inicia en modo watcher
npm build          # Compila
npm test           # Tests unitarios
npm typeorm migration:run   # Correr migraciones
```

---

## 🧠 Archivo AGENTS.md

El proyecto contiene un archivo `AGENTS.md` para que herramientas de IA como Cursor, Copilot o Claude Code entiendan la arquitectura del proyecto, reglas de negocio y convenciones internas.

---

## 📄 Licencia

Proyecto desarrollado como ejercicio técnico. Uso libre para fines educativos o demostrativos.

