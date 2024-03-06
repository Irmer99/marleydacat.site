## Deployment

To build the entire application (frontend and backend), docker images with docker compose templates are provided and are generally considered the preferred method of deployment. To build the frontend individually, see the `Frontend Deployment` section

### Docker Deployment

### Dev Deployment

To build and start:
`docker compose -f docker-compose-dev.yml up --build`

To stop all containers and destroy the database volume:
`docker compose -f docker-compose-dev.yml down -v`

## Frontend Deployment

To deploy the frontend ReactJS application on its own change directories to the frontend folder (`cd frontend`), and see the [frontend README](./frontend/README.md)