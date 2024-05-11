## BE E-learning gamifikasi

### Environment Variables

Set in file `.env`

```bash
# Environment
# Set to 'production' in production environment.
PORT=4001
# Encryption key.
APP_KEY=

# CMS Build Path
CMS_BUILD_PATH=
CORS_ORIGIN=*
WEB_BASE_URL

# Database
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

#DB_SEED_USER={"name": "Admin", "email": "admin@gsc.id", "password": "password"}


FILE_S3_ACCESS_KEY =
FILE_S3_ACCESS_SECRET =
FILE_S3_REGION=
FILE_S3_BUCKET=


```

### Install dependencies

```bash
yarn install
```

### Migrate database

```bash
yarn sequelize-cli db:migrate
```

### Seed database

```bash
yarn sequelize-cli db:seed:all
```

### Start development server

```bash
yarn dev
```

### Start production server

```bash
yarn start
```
