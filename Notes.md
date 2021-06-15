# Notes

## Sign in

      {
      "email": "elliot@elliotreed.net",
      "password": "elliot@elliotreed.net"
      }

---

### Local Connection

    pgadmin masterPassword: 3lliot_d3v
    superuser: postgres
    password: 3llington

---

## Deployment

### Files & Folders to upload

    - api
    - bin
    - config
    - migrations
    - models
    - public
    - seeders
    - services
    - utils
    /app
    /package.json

### Use cPanel Setup Node.js App

- tool will create .htaccess for configuration and link to node_modules per node.js version

- sets NODE_ENV variable

### Database

- use hosting credentials

      "production": {
      "username": "elliotre",
      "password": "iyn5x6I10P",
      "database": [database name],
      "host": "127.0.0.1",
      "dialect": "postgres"

  }

- export local database in pgAdmin

      Right click database, select backup.
      Select/Create file from B:/data.
      Format "plain"
      Encoding utf-8?
      Role leave blank
      Backup

-

## Development

---
