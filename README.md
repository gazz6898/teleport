# Teleport

## Setup

### MySQL

First, install MySQL (Community; version 8.0), setting the root user's password as "root".

Once installed, execute the following query in MYSQL Workbench:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
```

### Node.js & npm

[Download the current LTS version of Node.js](https://nodejs.org/en/download/) and install it.

To verify that everything's installed correctly, run `npm -v` and `node -v` in the command line.

_(If either of those doesn't just print out a version, something's wrong. Darn!)_

### Utilities

Run the following command (doesn't matter where; `npm i -g` installs packages globally):

```
npm i -g lerna gulp
```

### Dependencies

Finally, in the root of this project, run this command:

```
npm run setup
```

This should install all dependencies and do an initial build.

## Running the App

You'll need at least two terminals: one for the backend and one for the frontend.

### Running the Backend

You can start the backend in dev mode by running the following command in the root of the project:

```
npm run start:dev:backend
```

After which, the backend will be available for use by the frontend.

You can stop the backend by sending an interrupt with Ctrl+C (or just closing the terminal).

_(You can also start it with `npm run start:backend`, but it's less useful for development.)_

### Running the Frontend

You can start the frontend in dev mode by running the following command in the root of the project:

```
npm run start:dev:frontend
```

After which, the frontend will be accessible at `http://localhost:8080`.

You can stop the frontend by sending an interrupt with Ctrl+C (or just closing the terminal).

_(You can also start it with `npm run start:frontend`, but it's less useful for development.)_

## Questions?

That's rough, pal.