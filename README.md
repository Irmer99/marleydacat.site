## Deployment

### Dev Deployment

To build and start:
`docker compose -f docker-compose-dev.yml up --build`

To stop all containers and destroy the database volume:
`docker compose -f docker-compose-dev.yml down -v`