# CLAUDE.md - Jornadas Misioneras

## 🎯 Contexto del Proyecto

Este es un proyecto de migración y desarrollo de la plataforma "Jornadas Misioneras" (actualmente en Webflow) a una arquitectura moderna con **Next.js 14+ (App Router)**.

**Sitio actual:** https://www.jornadasmisioneras.org/
**Objetivo:** Transformar el sitio informativo en una plataforma de gestión de eventos misioneros con autenticación, roles y un dashboard administrativo.

## 🧠 Metodología de Trabajo con Claude

Sigue estos principios estrictamente durante todo el desarrollo:

### 1. 📋 Análisis Previo Obligatorio
- **Antes de escribir CUALQUIER código**, debes analizar la solicitud en profundidad.
- Identifica dependencias, impacto en otras partes del sistema y posibles alternativas.
- Pregunta siempre si falta información crítica (estructura de datos, relaciones entre entidades, requisitos no funcionales, etc.).

### 2. 🔄 Ciclo de Trabajo
```text
1. Recibir solicitud
2. Hacer preguntas aclaratorias (si aplica)
3. Proponer enfoque/arquitectura
4. Esperar confirmación del usuario
5. Implementar en pequeñas iteraciones
6. Solicitar feedback después de cada componente/feature

3. 🧹 Principios de Código
DRY (Don't Repeat Yourself): Extrae lógica repetida en hooks, utils, componentes genéricos o middleware.

SOLID:

S: Componentes y funciones con una única responsabilidad.

O: Abierto a extensión (props, children, render props) cerrado a modificación.

L: Sustituibilidad en componentes y servicios.

I: Interfaces pequeñas y específicas (especialmente en TypeScript).

D: Depende de abstracciones, no de implementaciones concretas (usa servicios/inyección).

🏗️ Arquitectura del Proyecto

Monorepo Estructura

packages/
├── apps/
│   ├── web/          # Landing page + Dashboard (Next.js)
│   └── api/          # Backend API routes (Next.js API routes)
├── packages/
│   ├── ui/           # Componentes MUI reutilizables
│   ├── config/       # Configuraciones compartidas (eslint, typescript)
│   ├── database/     # Esquemas Prisma, migraciones, seeds
│   └── types/        # Tipos TypeScript compartidos
└── tooling/          # Scripts de build, deploy, etc.

# 🚀 Stack Tecnológico Principal

| Categoría           | Tecnología                               | Notas                                                |
|---------------------|------------------------------------------|------------------------------------------------------|
| Framework           | Next.js 14 (App Router)                  | Usar React Server Components por defecto             |
| Backend             | API Routes de Next.js                    | Endpoints RESTful                                    |
| ORM                 | Prisma                                   | Para PostgreSQL                                      |
| Base de Datos       | PostgreSQL                               | Usar Supabase (recomendado) o Neon.tech              |
| Autenticación       | Clerk                                    | Middleware para proteger rutas                       |
| Frontend UI         | Material UI (MUI) v5                     | Usar @mui/material, @emotion/react, @emotion/styled  |
| Estado Global       | Zustand o React Query                    | Preferir React Query para server state               |
| Formularios         | React Hook Form + Zod                    | Validación consistente                               |
| Testing             | Vitest + React Testing Library           | Unitarios e integración                              |

// Esquema inicial (debes confirmar antes de implementar)
model User {
  id           String    @id @default(cuid())
  clerkId      String    @unique // ID de Clerk
  email        String    @unique
  name         String?
  role         Role      @default(USER)
  events       Event[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Country {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  provinces Province[]
  events    Event[]
  createdAt DateTime   @default(now())
}

model Province {
  id        Int      @id @default(autoincrement())
  name      String
  countryId Int
  country   Country  @relation(fields: [countryId], references: [id])
  locations Location[]
  events    Event[]
}

model Location {
  id         Int      @id @default(autoincrement())
  name       String
  provinceId Int
  province   Province @relation(fields: [provinceId], references: [id])
  events     Event[]
}

model Event {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  locationId  Int
  location    Location  @relation(fields: [locationId], references: [id])
  countryId   Int
  country     Country   @relation(fields: [countryId], references: [id])
  provinceId  Int
  province    Province  @relation(fields: [provinceId], references: [id])
  createdBy   String    // clerkId del usuario
  user        User      @relation(fields: [createdBy], references: [clerkId])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Role {
  ADMIN
  USER
}

### 🔐 Sistema de Permisos (Middleware + API)

#### Reglas de Acceso

| Acción                                    | ADMIN | USER (propio evento) | USER (evento ajeno) |
|-------------------------------------------|-------|----------------------|---------------------|
| CRUD Países/Provincias/Localidades        | ✅    | ❌                   | ❌                  |
| Crear Evento                              | ✅    | ✅                   | N/A                 |
| Listar Eventos                            | ✅ (todos) | ✅ (solo propios) | ✅ (solo propios) |
| Ver detalle evento                        | ✅ (todos) | ✅ (solo propio)  | ❌ (403)            |
| Editar evento                             | ✅ (todos) | ✅ (solo propio)  | ❌ (403)            |
| Eliminar evento                           | ✅ (todos) | ✅ (solo propio)  | ❌ (403)            |

## IMplementación del frontend

// middleware.ts - Protección de rutas
// lib/permissions.ts - Funciones de verificación
// API routes - Verificar ownership antes de modificar

🎨 Estructura del Frontend (App Router)

app/
├── (landing)/          # Rutas públicas (marketing)
│   ├── page.tsx       # Home (migrar contenido de Webflow)
│   ├── eventos/
│   └── (auth)/        # Clerk maneja login/register
├── (dashboard)/       # Layout con sidebar protegido
│   ├── dashboard/
│   │   ├── events/    # CRUD eventos
│   │   ├── countries/ # Solo admin
│   │   ├── provinces/ # Solo admin
│   │   └── locations/ # Solo admin
│   └── layout.tsx     # Verifica rol y permissions
└── api/               # API Routes (backend)

### 🚦 Roadmap de Desarrollo (Sugerido)

#### Fase 1: Setup e Infraestructura
- Configurar monorepo con Turborepo
- Next.js + TypeScript + MUI
- Integrar Clerk
- Configurar Prisma + PostgreSQL
- Middleware de autenticación básico

#### Fase 2: Dashboard - CRUDs Base
- CRUD Países (solo admin)
- CRUD Provincias (solo admin)
- CRUD Localidades (solo admin)
- Sistema de permisos (server-side)

#### Fase 3: Dashboard - Eventos
- CRUD Eventos con relaciones (país, provincia, localidad)
- Filtros por ubicación/fecha
- Lógica de ownership (ver/editar/borrar solo eventos propios)
- Listado para admin (todos los eventos)

#### Fase 4: Landing Page Pública
- Migrar contenido visual de Webflow
- Consumir API para mostrar eventos públicos (array)
- SEO optimizado (metadata, sitemap)
- Responsive design con MUI

#### Fase 5: Features Adicionales
- Inscripción a eventos (usuarios logueados)
- Panel de "Mis inscripciones"
- Dashboard con métricas básicas
- Tests (unitarios + e2e con Playwright)

### 📝 Reglas de Estilo y Convenciones

#### Nomenclatura

- **Componentes:** PascalCase (ej: `EventCard.tsx`)
- **Hooks:** useCamelCase (ej: `useEvents.ts`)
- **Utils:** camelCase (ej: `formatDate.ts`)
- **API Routes:** kebab-case (ej: `api/events/by-location.ts`)

### 🔍 Antes de Implementar CUALQUIER Cosa

**SIEMPRE PREGUNTA:**

- "¿Confirman este modelo de datos antes de crear las migraciones?"

- "¿Qué campos adicionales necesita el modelo Event además de los listados?"

- "¿La landing page debe mantener exactamente el mismo diseño visual que Webflow o hay libertad creativa?"

- "¿Los eventos pueden tener imágenes? ¿Cómo se manejará el almacenamiento (Cloudinary, S3)?"

- "¿Necesitamos paginación en el listado de eventos del dashboard?"

- "¿Hay algún requisito de internacionalización (múltiples idiomas) a futuro?"

- "¿Confirmas que Clerk es la opción definitiva para auth o podría cambiar?"

### 📦 Variables de Entorno (Necesarias)

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
DATABASE_URL="postgresql://..."

# (Opcional) Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

### ⚠️ Nota para Claude

Nunca asumas datos o requerimientos. Siempre confirma antes de crear modelos de base de datos, nuevas rutas API o cambios estructurales. Usa comentarios en el código para explicar decisiones que violen DRY/SOLID (con justificación).

Mantén este documento actualizado cada vez que se agregue una tecnología, cambie la arquitectura o se descubra una nueva regla de negocio.