# Developer guides

## Serving/Deploying

We have four vscode tasks created to help for serving the applications:

- Client
  `Frontend app`
- Server
  `Backend app`
- Dev
  `Both Frontend and Backend apps`
- Sync Schema
  `Compiles all entity and migration files`

You can run them by following these steps (replacing `Dev` with the task you intend to run)
`CTRL+SHIFT+P` &rarr; `Tasks: Run Task` &rarr; `Dev`

- _We will be running `Dev` most of the time while we develop_
- _The `Sync Schema` should also be run after building/updating a migration or entity to allow the db schema to sync with the application code. This task is also implicitly called whenever the `Dev` or `Server` tasks are run to insure the schema is synced when we start the server._

## Git conventions

_...insert git conventions here..._

## Tech Stack

##### Development IDE

Recommended to use Visual Studio Code https://code.visualstudio.com/download
_...insert more information on prettier formatting we want to use to keep consistent formatting across devs..._

##### Database Information

We are using azure sql database from https://portal.azure.com

Azure Data Studio: [Download](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16&tabs=redhat-install%2Credhat-uninstall#download-azure-data-studio)

##### Node installations

First install node v18.12.1: https://nodejs.org/en/blog/release/v18.12.1

Then the following global packages will be useful to have:
`npm i -g typeorm`
`npm i -g @angular/cli`
`npm i -g nx`
`npm i -g @nestjs/cli`

## Frontend Guides

See the [frontend guides](./FrontendGuide.md) for more information

## Backend Guides

See the [backend guides](./BackendGuide.md) for more information
