# [Oca](https://oca.li)
Oca is a very simple URL shortener, with a user-first design, and simple to deploy.

### Features
- Analytics for all shortened URLs (TODO)
- Custom aliases for short URLs

### Requirements
- Node.js
- MySQL database, or any variant
- All required dependencies in the [package.json](package.json) file

### Environment variables
This application will require you to set a few environment variables in order to function properly.
|Variable|Data type|Example|Description|
|--------|---------|-------|-----------|
|APP_ALLOW_ALIASES|boolean|`true`|Toggles creation of URL aliases (aka custom URLs)|
|APP_DOMAIN|string|`oca.li`|Domain which the app will use|
|APP_NAME|string|`Oca`|Name of the app, e.g. "Mini". This will be displayed on page titles, content, etc.|
|APP_TAGLINE|string|`A URL shortener`|Shows next to the app icon, leave blank to hide tagline|
|DATABASE_URL|string|`mysql://root@localhost/db`|URL that points to your database|

### Setup
1. Run `npm install`, this will install all the dependencies.
2. Set up all the environment variables specified in the [Configuration variables](#configuration-variables) section.
3. Find a short domain to use for the app.
4. Start the server by running `npm start`.

### License
[MIT](LICENSE.txt)