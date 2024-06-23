# Anechoic Station Berlin

- Here is a side project related to Acoustic. I am currently building an anechoic chamber in a Soviet bunker somewhere in Berlin.
- This control room is focused on making electroacoustic measurements on sound systems.
- This application is going to process all data recorded from this room such as:
  - Impulse response
  - Frequency response
  - Impedance response
- The main focus of this project is learning and helping people to have a better understanding of the balance between:
  - Loudspeaker driver characteristics choice
  - Loudspeaker enclosure design

This application architecture follows the Hexagonal pattern introduced by Alistair Cockburn in 2005, segregating the application & adapter throught different ports. This pattern helps applications to be more testable, decoupled, flexible, and more maintainable.

The mechanism of this application is driven by the IoC container provided by InversifyJS. This container is responsible for managing dependencies and orchestrating the flow of control. It allows you to decouple components by injecting dependencies into class constructors. This approach promotes loose coupling, improves testability, and enhances code modularity.

# Hexagonal Architecture

<p align="center">
  <img width="897" alt="Screenshot 2023-09-06 at 17 55 52" src="https://github.com/Hulow/asb-app/assets/62727580/f9b48610-57ad-4a45-93b6-7830366ecf86">
</p>

## 2 sides of the application

- `Input` (driving side): it drives your application and proceeds something
- `Output` (driven side): it is driven by the application itself

## Components

- `Application`: this is the hexagone where the core logic is, receiving commands from the port and sends request out via port as well.
- `Port`: this is an interface which allows foreign actors to communicate with the Application.
- `Adapter`: It's a converter who interact with the application through a port.

## Hexagones

The application is decoupled into 8 hexagones:

- Measurement
- Shared

# IoC Container from InversifyJS

- InversifyJS is a lightweight library providing a IoC container defined in `./src/di-container.ts`.
- This is the only place in which there is some coupling.
- It's where all classes associate & resolve their own dependancies.
- We use `@injectable` & `@inject` decorators to instruct InversifyJS where to inject dependencies.
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

### Run the service

```shell
npm start
```

## Testing

### Run unit tests

```shell
npm run test:unit
```

## Commands overview

| Command             | Action                                          |
| ------------------- | ----------------------------------------------- |
| `npm run lint`      | Analyze the code with `ESLint`                  |
| `npm run lint:fix`  | Analyze the code with `ESLint` and fix problems |
| `npm run build`     | Build the project with `tsc`                    |
| `npm start`         | Start the project using the transpiled code     |
| `npm run test:unit` | Execute the unit tests                          |
