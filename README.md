
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

## 🌐 Despliegue en Heroku

### Configuración Automática

El proyecto está configurado para despliegue automático en Heroku:

1. **Variables de entorno requeridas**:
   ```bash
   NODE_ENV=production
   ```

2. **Comandos de despliegue**:
   ```bash
   # Preparar para despliegue
   npm run build
   
   # Commit y push
   git add .
   git commit -m "Deploy to production"
   git push heroku main
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

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está sujeto a las políticas de la organización.

## 🆘 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Versión**: 0.0.0  
**Angular CLI**: 20.2.1  
**Node**: 20.x  
**Última actualización**: $(date)
