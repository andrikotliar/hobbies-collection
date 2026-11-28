# Hobbies Collection

A personal list of films, books and board games with manually collected data.

## Frontend

### Tech stack

- React
- Vite
- TypeScript
- TanStack Router
- TanStack Query
- React Hook Form
- Zod

### API contracts

The `@hobbies-collections/contract` package provides the API contracts and the fetch wrapper. The client is generated at runtime from contracts and is fully type-safe and reflects the backend API routes.

### Images

The `image_path` column in tables contains object keys. To display them on the frontend put images in any storage that can serve public URLs and support folders.

Define `VITE_IMAGES_URL` in the `.env` file at the root of the `apps/web`. The variable should be a base public URL.

Name images in a way they are defined in the seed data:

```json
{
  "title": "Avatar",
  "image_path": "posters/avatar.webp",
}
```

### Color schema

Primary - `*-sky-600`
Border - `*-slate-300`

## Backend

### Tech stack

- Fastify
- PostgreSQL
- TypeScript
- Docker
- Drizzle
- Zod

### Routers

To build a type safe router, use the `createRouter` helper. Before creating a router, create a router contract in the `packages/api-contracts` package. The contract should contain URL, method and schema. To define a correct, type-safe contract, use the `defineContracts` helper.

## Development server

### Prerequisites

1. Node 20+
2. Docker
3. AWS account

### Start dev server

1. In the project root, run `pnpm install` to install dependencies for both the frontend and backend.
2. Create `.env` file in the `apps/api` directory following the `./apps/api/.env.sample`.
3. In the project's root run `pnpm dev` to start the application. It automatically run all necessary commands for the DEV server:
- spin up a database in the docker container;
- run pending migrations;
- build the API client;
- start frontend and backend;

## Build project

Run `pnpm build` in the project's root. The script builds the backend to the `./apps/api/dist` directory and frontend to the `./apps/web/dist`


## Database

### Data

The `apps/api/data` directory contains JSON data with all essential information to seed the database. The data reflects current state of the hobbies collection app and data is update once a week.

To populate the database with the data, run the following command from the project's root:

```shell
pnpm db:init
```

To initialize the empty database without data, run the command:

```shell
pnpm db:init:empty
```

### Backup database

```shell
docker run --rm \
  -v "$PWD:/dump" \
  postgres:17-bookworm \
  pg_dump "postgresql://USER:PASSWORD@HOST:5432/DBNAME" \
  -F c \
  -f /dump/db.dump
```

### Restore database

```shell
docker run --rm \
  -v "$PWD:/dump" \
  postgres:17-bookworm \
  pg_restore \
    -d "postgresql://USER:PASSWORD@HOST:5432/DATABASE" \
    -v /dump/db.dump
```

### Migrations

1. Update `apps/api/src/database/schema.ts` file.
2. Navigate to the `apps/api` folder.
3. Run `pnpm db:gen --name specify_migration_name` to create migration file from the latest changes.
4. Run `pnpm db:migrate` to apply changes to the database.

### Localstack

Start the localstack container

```shell
docker compose up s3_local -d
```

Create a bucket (AWS CLI should be installed):

```shell
aws --endpoint-url=http://localhost:45661 s3 mb s3://hobbies-collection-assets
```

List bucket objects:

```shell
aws --endpoint-url=http://localhost:45661 s3 ls s3://hobbies-collection-assets
```

Copy posters to the bucket

```shell
aws --endpoint-url=http://localhost:45661 s3 sync _LOCAL_PATH_ s3://hobbies-collection-assets/posters
```

Public URL example: `http://localhost:45661/hobbies-collection-assets/avatar.webp`