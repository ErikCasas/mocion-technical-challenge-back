# Backend - Mocion Technical Challenge

Este es el servidor backend del proyecto **Mocion Technical Challenge**. A continuación, se describen los requisitos y los pasos para ejecutar el proyecto en tu máquina local.

## Requisitos

1. **Node.js** (v14 o superior): [Descargar Node.js](https://nodejs.org/)
2. **Yarn**: Instalación global si no lo tienes:
   ```bash
   npm install --global yarn
   ```
3. **MongoDB**: Necesitas tener una instancia de MongoDB corriendo, ya sea local o remota.
4. **Variables de entorno**: Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (ajustar según tu configuración): En caso de que no las proporciones, el sistema proporciona unas por defecto

   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   ```

## Instalación y Configuración

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/ErikCasas/mocion-technical-challenge.git
   cd mocion-technical-challenge
   ```

2. **Instala las dependencias**:
   ```bash
   yarn install
   ```

## Población de la Base de datos❗

Para poblar la base de datos con datos de prueba, ejecuta:

```bash
yarn populate
```

## Compilar y Ejecutar en Producción

1. **Compila el proyecto**:

   ```bash
   yarn build
   ```

2. **Inicia el servidor en producción**:
   ```bash
   yarn start
   ```

---

Con esto tendrás el backend corriendo y listo para ser usado.
