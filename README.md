# [Oca](https://oca.li)
Oca is a very simple URL shortener, designed to be simple for users, and simple to run. Links are shortened using base 36 encoding. This means that URLs are case-insensitve, unlike their base 62 counterpart.

### Requirements
- Node.js
- MySQL database, or any variant
- All required dependencies in the [package.json](package.json) file

### Configuration variables
This application will require you to set a few environment variables in order to function properly.
- `APP_DOMAIN`: Domain which the app will be hosted under, e.g. [oca.li](https://oca.li)
- `APP_NAME`: Name of the app, e.g. "Mini". This will be displayed on page titles, content, etc.
- `DATABASE_URL`: The URL that points to your database

### Setup
1. Make sure you have Node.js and NPM installed.
2. Run `npm install`, this will install all the dependencies required for the project.
3. Set up your environment variables: `APP_DOMAIN`, `APP_NAME`, and `DATABASE_URL`.
4. Find a short domain name to use for the app, and make sure it's not long. Because if it's long that ruins the point of shortening it.
5. Start using your tool to shorten your very long links. It will make them look neater, and ultimately make them easier to remember and type.

### License
[MIT](LICENSE.txt)