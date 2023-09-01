# Anechoic Station Berlin

- Here is a side project related to Acoustic. I am currently building an anechoic chamber in a Soviet bunker somewhere in Berlin.
- This control room is focused on making electroacoustic measurements on sound systems.
- This application is going to process all data recorded from this room such as:
  - Impulse response
  - Frequency response
  - Impedance response
- The main focus of this project is learning and helping people having a better understanding on the balance between:
  - Loudspeaker driver characteristics choice
  - Loudspeaker enclosure design

This application architecture follows the Hexagonal pattern introduced by Alistair Cockburn in 2005, segregating the application & adapter throught different ports. This pattern helps applications to be more testable, decoupled, flexible, and more maintainable.

The mechanism of this application is driven by the IoC container provided by InversifyJS. This container is responsible for managing dependencies and orchestrating the flow of control. It allows you to decouple components by injecting dependencies into class constructors. This approach promotes loose coupling, improves testability, and enhances code modularity.

# Hexagonal Architecture

<p align="center">
  <img width="597" alt="Screenshot 2023-08-31 at 19 17 54" src="https://github.com/Hulow/asb-server/assets/62727580/38a48467-6961-4020-a210-4fd400da084c">
</p>

## 2 sides of the application

- `Input` (driving side): it drives your application and proceeds something
- `Output` (driven side): it is driven by the application itself

## Components

- `Application`: this is the hexagone where the core logic is
- `Port`: It's an abstration or a contract, this is the way for the application to interact with an outside system without knowing anything
- `Adapter`: It's a converter who takes the input or output of your application and converts into something...

## Hexagones

The application is decoupled into 8 hexagones:

- Cabinet
- Driver
- Frequency
- Impedance
- Impulse
- Measurement
- Owner
- Shared

# InversifyJS

- InversifyJS is a lightweight library providing a IoC container defined in `./src/di-container.ts`.
- This is the only place in which there is some coupling.
- It's where all classes resolve their own dependancies after setting up your intefaces and declaring your dependancies via `@injectable` & `@inject` decorators.
- The application then run by executing this container in `./src/index.ts`.

# Getting Started

## Install

Clone the repository and create the dotenv file:

```shell
cp example.env .env
```

Next, ensure that the project can build:

```shell
# Install packages
npm i

# Build
npm run build
```

## Running the app

### Start Docker container

```bash
docker-compose up
```

### Run the database migration

```shell
npm run mig:run
```

### Run the service

```shell
npm start
```

## Testing

### Run unit tests

```shell
npm run test:unit
```

### Run integration tests

`Note`: first shut down the server of the application

```shell
# shut down the previous container
docker-compose down

# setup database for testing and run the migration
sh run-postgres-test.sh

# run the integrations tests
npm run test:intg
```

## Commands overview

| Command                   | Action                                             |
| ------------------------- | -------------------------------------------------- |
| `npm run lint`            | Analyze the code with `ESLint`                     |
| `npm run lint:fix`        | Analyze the code with `ESLint` and fix problems    |
| `npm run build`           | Build the project with `tsc`                       |
| `npm start`               | Start the project using the transpiled code        |
| `npm run test:unit`       | Execute the unit tests                             |
| `npm run test:intg`       | Execute the integration tests                      |
| `npm run mig:run`         | Run the database migrations                        |
| `npm run mig:revert`      | Revert the last database migration                 |
| `npm run mig:test:revert` | Revert the last database migration for testing env |

# Notes

The documentaton of this project is going to be improved later because the priority at the moment is to finish building this room. More information is going to be displayed, such as a web application made by NextJS
