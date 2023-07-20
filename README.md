# 2FA Demo

This is a demo project showcasing two-factor authentication (2FA) implementation using Next.js and Koa.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the project dependencies.
4. Make a `.env` file at root directory and supply a Postgres database for the environment variable `DATABASE_URL`.
5. Run `db:push` to apply the prisma schema to the Postgres database.

## Usage

1. Run `npm run server` to start the backend server on port 3500.
2. Run `npm run dev` to start the development server for Next.js on port 5500.
3. Access the demo application in your web browser at `http://localhost:5500`.

## Project Structure

- `root directory`: Contains the client-side code and Next.js pages.
- `authServer`: Contains the server-side code for authentication.
- `prisma`: Contains the Prisma schema for database configuration.

## Scripts

- `dev`: Starts the development server on port 5000.
- `build`: Builds the Next.js application.
- `start`: Starts the Next.js production server.
- `lint`: Lints the project files using ESLint.
- `server`: Starts the authentication server using TypeScript and Koa.
- `db:migrate`: Creates a new Prisma migration for the user entity.
- `db:push`: Pushes the Prisma schema changes to the database.
- `format`: Formats the project files using Prettier.

## Dependencies

- `@koa/cors`: Cross-origin resource sharing middleware for Koa.
- `@prisma/client`: Prisma client for database access.
- `@simplewebauthn/browser`: Browser library for WebAuthn support.
- `@simplewebauthn/server`: Server library for WebAuthn support.
- `@types/node`: TypeScript type definitions for Node.js.
- `@types/react`: TypeScript type definitions for React.
- `@types/react-dom`: TypeScript type definitions for ReactDOM.
- `autoprefixer`: CSS post-processing tool.
- `dotenv`: Loads environment variables from a `.env` file.
- `eslint`: ESLint for code linting.
- `eslint-config-next`: ESLint configuration for Next.js projects.
- `koa`: Web framework for Koa.
- `koa-bodyparser`: Middleware for parsing request bodies in Koa.
- `koa-router`: Router middleware for Koa.
- `next`: Next.js library.
- `postcss`: CSS post-processing tool.
- `react`: React library.
- `react-dom`: ReactDOM library.
- `tailwindcss`: CSS utility framework.
- `typescript`: TypeScript language support.
- `zustand`: State management library.

## Development Dependencies

- `@types/koa`: TypeScript type definitions for Koa.
- `@types/koa__cors`: TypeScript type definitions for Koa CORS.
- `@types/koa-bodyparser`: TypeScript type definitions for Koa body parser.
- `@types/koa-router`: TypeScript type definitions for Koa router.
- `nodemon`: Monitor for changes in the development environment.
- `prettier`: Code formatting tool.
- `prettier-plugin-tailwindcss`: Prettier plugin for Tailwind CSS formatting.
- `prisma`: Prisma migration and database management tool.
- `ts-node`: TypeScript execution and REPL for Node.js.
