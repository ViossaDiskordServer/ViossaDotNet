# Viossa.net kotoba-tumam

bråtula viossa.net måde! We're here to build an informational website about Viossa.

## The Stack
**What will we be using to build this site?**

### Backend
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Turborepo](https://turborepo.com/)

### Frontend
- The ktb frontend is purely coded in HTML, CSS, and browser JS.
- [AlpineJS](https://alpinejs.dev/)


### Linting
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

## Setup/Installation
**How do we install this project?**

1. Download and install Node.js and pnpm
   - [Node.js installation instructions](https://nodejs.org/en/download)
   - [pnpm installation instructions](https://pnpm.io/installation)
1. Open your favourite command line terminal
1. Clone the repository: `git clone git@github.com:ViossaDiskordServer/ViossaDotNet.git`
1. Move into the project's root directory: `cd ViossaDotNet`
1. Install all project dependencies: `pnpm i`

## Running
**How do we run the project?**

### Turborepo
This project uses Turborepo for task management/caching. Install Turborepo globally on your machine to allow for executing turbo commands more easily: `pnpm i -g turbo` (this is needed to continue with the instructions below)

### Frontend (Viossa.net)
1. The frontend no longer requires a compilation step. Yippee!

### Backend (Viossa DB)
1. Ensure you're in the root directory of the project (`ViossaDotNet`)
1. Move into the app's directory: `cd apps/vdb-backend`
1. To run the API, use `turbo start`. This will build all of the app's dependencies and then start the application.
   1. **NOTE:** Backend apps are not watched/hot-refreshed like frontend apps! If you make changes, you must kill the app and re-run it to apply changes.
1. To view a sample response from the backend API, visit http://localhost:1225/sample in your browser!

[Visit the GitHub Issues page for this repository.](https://github.com/ViossaDiskordServer/ViossaDotNet/issues)
