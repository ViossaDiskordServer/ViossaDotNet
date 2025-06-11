# Viossa.net

bråtula viossa.net måde! We're here to build an informational website about Viossa.

## The Stack
**What will we be using to build this site?**

### Core
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Turborepo](https://turborepo.com/)

### Frontend
- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)

Additionally, we will be following [**atomic design principles**](https://bradfrost.com/blog/post/atomic-web-design/) to organize the components of the project.

### Styling
- [Bulma](https://bulma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sass](https://sass-lang.com/)

### Backend
- [Node.js](https://nodejs.org/)

### Linting
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

## Setup/Installation
**How do we install this project?**

1. Download and install NodeJS and pnpm
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
1. Ensure you're in the root directory of the project (`ViossaDotNet`)
1. Move into the app's directory: `cd apps/vdn-static`
1. Now, to run the site, use `turbo dev`. This will set up watchers to build all libraries used by the frontend, as well as hot-refreshing the site as changes are made to it.
1. To view the website running locally, visit http://localhost:1224/ in your browser!

### Backend (Viossa DB)
1. Ensure you're in the root directory of the project (`ViossaDotNet`)
2. Move into the app's directory: `cd apps/vdb-backend`
3. Now, to run the site, use `turbo start`. This will build all of the app's dependencies and then start the application.
   1. **NOTE:** Backend apps are not watched/hot-refreshed like frontend apps! If you make changes, you must kill the app by spamming Ctrl+C in the terminal it is running in, before rerunning it with the changes applied.
4. To view a sample response from the backend API, visit visit http://localhost:1225/ in your browser!

## The Content

**What will be in the site?**

[Visit the GitHub Issues page for this repository.](https://github.com/ViossaDiskordServer/ViossaDotNet/issues)
