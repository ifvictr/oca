# wee

wee is a very simple URL shortener, with a user-first design, and simple to deploy.

## Features

- Analytics for all shortened URLs (planned)
- User accounts for managing URLs (planned)
- Custom aliases for short URLs

## Requirements

- Node.js
- MySQL database
- All required dependencies in the [package.json](package.json) file

## Configuration variables

This application will require you to set a few environment variables in order to function properly.

|Variable|Data type|Example|Description|
|--------|---------|-------|-----------|
|APP_DOMAIN|string|`w.ee`|Domain which the app will use|
|APP_NAME|string|`wee`|Name of the app. This will be displayed on page titles, content, etc.|
|DATABASE_HOST|string|`localhost`|Hostname at which the database is located|
|DATABASE_NAME|string|`wee`|Name of the database|
|DATABASE_PASSWORD|string|`password`|Database password|
|DATABASE_USER|string|`wee`|User that was granted privileges for the database|

## Setup

1. Run `npm install --production`, this will install all the dependencies.
2. Set up all the environment variables specified in the [Configuration variables](#configuration-variables) section.
3. Find a short domain to use for the app.
4. Start the server by running `npm start`.

## License

[MIT](LICENSE.txt)