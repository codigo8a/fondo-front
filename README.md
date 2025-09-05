# Fondo Front - Sistema de Gestión de Inversiones

## 📋 Descripción

**Fondo Front** es una aplicación web desarrollada con Angular 20 que permite gestionar clientes, sucursales, productos de inversión e inscripciones. La aplicación proporciona un flujo completo para la selección aleatoria de clientes, apertura de productos de inversión y seguimiento de transacciones mediante un sistema de logs.

## 🚀 Funcionalidades Principales

### 🎲 Gestión de Clientes
- **Obtener Cliente Aleatorio**: Botón que carga aleatoriamente los datos de un cliente del sistema
- **Visualización de datos**: Muestra información completa del cliente seleccionado
- **Monto disponible**: Visualiza el saldo disponible para inversiones

### 🏢 Gestión de Sucursales y Productos
- **Modal de Sucursales**: Botón "Apertura" que abre un modal con todas las sucursales disponibles
- **Selección de Sucursal**: Al seleccionar una sucursal, se cargan automáticamente los productos asociados
- **Catálogo de Productos**: Visualización de productos de inversión disponibles por sucursal

### 💰 Sistema de Inversiones
- **Input Monto a Invertir**: Campo para ingresar el monto deseado de inversión
- **Validaciones**:
  - Monto mínimo requerido por producto
  - Verificación de monto disponible del cliente
  - Validación de inscripciones repetidas (evita duplicados)
- **Botón Invertir**: Crea un nuevo registro en la tabla de inscripciones

### 📊 Gestión de Inscripciones
- **Creación de Inscripciones**: Registro automático al confirmar inversión
- **Descuento Automático**: El monto invertido se descuenta del total disponible del cliente
- **Cancelación de Inscripciones**: 
  - Permite cancelar inscripciones existentes
  - Devuelve automáticamente el monto al saldo disponible del cliente
- **Prevención de Duplicados**: Validación que evita inscripciones repetidas del mismo cliente en el mismo producto

### 📝 Sistema de Logs
- **Registro de Actividades**: Genera logs automáticos para:
  - Creación de inscripciones
  - Cancelación de inscripciones
- **Visualización**: Muestra los últimos 4 registros de actividad
- **Trazabilidad**: Permite seguimiento completo de todas las transacciones

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 20.x
- npm 10.x
- Angular CLI 20.2.1

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd fondo-front
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (si es necesario):
   ```bash
   # Crear archivo .env para configuraciones locales
   ```

## 🚀 Comandos Disponibles

### Desarrollo

```bash
# Servidor de desarrollo
npm start
# o
ng serve
```

Navega a `http://localhost:4200/` para ver la aplicación.

### Construcción

```bash
# Build de producción
npm run build

# Build con SSR
npm run build:ssr
```

### Testing

```bash
# Ejecutar tests unitarios
npm test

# Tests en modo watch
npm run watch
```

### Servidor SSR

```bash
# Ejecutar servidor SSR local
npm run serve:ssr:fondo-front
```

### Archivos de Configuración

- **Procfile**: Define el comando de inicio para Heroku
- **server.js**: Servidor Express para producción
- **package.json**: Scripts de build automático (`heroku-postbuild`)

## 🏗️ Arquitectura

### Principios SOLID Implementados

- **SRP**: Cada componente tiene una responsabilidad específica
- **OCP**: Extensible mediante interfaces
- **LSP**: Implementaciones intercambiables
- **ISP**: Interfaces segregadas por funcionalidad
- **DIP**: Dependencias invertidas mediante inyección

### Componentes Principales

1. **DashboardComponent**: Componente principal que orquesta la aplicación
2. **ClienteComponent**: Gestión de datos de clientes
3. **InscripcionesComponent**: Manejo de inscripciones
4. **LogComponent**: Visualización de logs del sistema
5. **AlertDialogComponent**: Diálogos de confirmación

### Servicios

- **ClienteService**: API de clientes
- **InscripcionService**: API de inscripciones
- **ClienteStateService**: Estado global de clientes
- **ClienteValidatorService**: Validaciones de negocio
- **RandomSelectionService**: Selección aleatoria de datos

## 🔍 Rutas de la Aplicación

```typescript
- '/' → Redirige a '/dashboard'
- '/dashboard' → Componente principal
- '/**' → Redirige a '/dashboard' (fallback)
```

## 🎨 Estilos y Temas

- **Angular Material**: Tema principal
- **SCSS**: Preprocesador CSS
- **Responsive Design**: Adaptable a diferentes dispositivos
- **Prettier**: Formateo automático de código

## 📝 Configuración de Prettier

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

