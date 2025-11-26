# 🤖 Guía para agentes de IA y futuros desarrolladores

Bienvenido/a al repositorio.  
Este archivo sirve como guía para herramientas de IA (Cursor, Copilot, Claude Code, etc.) y para cualquier desarrollador que vaya a contribuir al proyecto.  
Define el contexto, reglas y convenciones necesarias para trabajar de forma segura y consistente.

---

## 1. 📌 Contexto del Proyecto

Este repositorio contiene una **API REST para la gestión de reservas de hotel**, desarrollada con **NestJS** y persistencia en **PostgreSQL** mediante **TypeORM**.

La API permite gestionar:

- Hoteles  
- Habitaciones  
- Reservas  

Requisitos clave:

- Validación de solapamiento de reservas  
- Autenticación por API Key  
- Documentación Swagger  
- Migraciones con TypeORM  
- Código modular estructurado en NestJS  

---

## 2. 🧱 Stack Tecnológico

- NestJS v10+  
- TypeScript  
- TypeORM  
- PostgreSQL  
- Docker + docker-compose  
- class-validator & class-transformer  
- Swagger (@nestjs/swagger)  
- Jest para tests  

---

## 3. 📂 Estructura del Proyecto

```
src/
  hotels/
    hotels.controller.ts
    hotels.service.ts
    dto/
    entities/hotel.entity.ts

  rooms/
    rooms.controller.ts
    rooms.service.ts
    dto/
    entities/room.entity.ts

  bookings/
    bookings.controller.ts
    bookings.service.ts
    dto/
    entities/booking.entity.ts

  common/
    guards/api-key.guard.ts
    exceptions/
    utils/

main.ts
```

---

## 4. 🧠 Reglas del Negocio (MUY IMPORTANTE)

### 🔹 4.1 Solapamiento de reservas  
Dos reservas para la misma habitación **no pueden superponerse**:

Debe cumplirse:

```
new.checkIn < existing.checkOut
AND
new.checkOut > existing.checkIn
```

Si existe un cruce, debe lanzarse un error 400.

---

### 🔹 4.2 Validación de existencia  
Antes de crear cualquier entidad:

- Si el hotel no existe → error 404  
- Si la habitación no existe → error 404  
- Si la reserva no existe → error 404  

---

### 🔹 4.3 Relaciones
- Un hotel tiene muchas habitaciones (cascade delete).  
- Una habitación tiene muchas reservas.  

---

### 🔹 4.4 Autenticación por API Key
Todas las rutas con prefijo `/api` deben requerir:

```
x-api-key: <API_KEY>
```

Controlado por un **ApiKeyGuard** registrado globalmente.

---

## 5. 🤖 Sugerencias para uso de IA

### ✔ La IA puede generar sin riesgo:
- CRUD completos  
- DTOs con validaciones  
- Documentación Swagger  
- Tests unitarios básicos  
- Migraciones basadas en entidades  
- Refactors simples y ordenamiento de código  

### ⚠ Partes sensibles — requieren revisión humana
- Lógica de solapamiento de reservas  
- Consultas TypeORM complejas  
- Migraciones generadas automáticamente  
- Cualquier lógica de fechas  
- Guard de autenticación  

---

## 6. 💬 Prompts recomendados para IA

### 📌 Para entender el proyecto
```
Explicá la arquitectura del proyecto, cada módulo y sus relaciones.
```

### 📌 Para crear un CRUD
```
Generá un CRUD para la entidad X siguiendo las convenciones del proyecto,
incluyendo DTOs, validaciones y documentación Swagger.
```

### 📌 Para validar solapamiento
```
Verificá la función de validación de solapamiento de reservas y corregila si no cumple las reglas del negocio.
```

### 📌 Para tests
```
Generá tests unitarios del bookings.service con Jest usando mocks.
```

---

## 7. 📝 Convenciones del Repositorio

- **Código y comentarios en inglés.**  
- Rutas en plural: `/hotels`, `/rooms`, `/bookings`  
- Entidades en singular: `Hotel`, `Room`, `Booking`  
- DTOs: `CreateXDto`, `UpdateXDto`  
- Validación siempre con `class-validator`  
- Documentar cada endpoint con Swagger  

---

## 8. 🐳 Docker

El proyecto utiliza:

- PostgreSQL  
- PGAdmin  
- API NestJS  

Si la IA genera cambios en `docker-compose.yml`, debe respetar variables del `.env`.

---

## 9. 📚 Notas finales

Este documento debe respetarse para mantener coherencia dentro del proyecto.  
Cualquier cambio crítico debe revisarse manualmente antes de aprobarse.

---

