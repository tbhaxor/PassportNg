# @passport-ng/clickup

This package provides a [ClickUp](https://clickup.com/) OAuth2 strategy for Passport, allowing you to authenticate users using their ClickUp accounts.

## Installation

You can install the package using npm, yarn, or pnpm:

```console
# npm
npm install @passport-ng/clickup

# yarn
yarn add @passport-ng/clickup

# pnpm
pnpm add @passport-ng/clickup
```

## Quick Start

Save the environment variables:

```bash
export CLICKUP_CLIENT_ID=your_client_id
export CLICKUP_CLIENT_SECRET=your_client_secret
export CLICKUP_REDIRECT_URI=your_redirect_uri
```

> [!NOTE]
> You can also set the environment variables in a `.env` file, and use the `dotenv` package to load them.

### Express Example

```ts
import express from 'express';
import passport from 'passport';
import { Strategy } from '@passport-ng/clickup';

const app = express();

passport.use('clickup', new Strategy((accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
app.use(passport.initialize());

app.get('/auth/clickup', passport.authenticate('clickup'));
app.get('/auth/clickup/callback', passport.authenticate('clickup', { failureRedirect: '/' }), (req, res) => {
    return res.json(req.user);
});

app.listen(3000, () => {

console.log('Server is running on http://localhost:3000');
});
```

### Fastify Example

```ts
import Fastify from 'fastify';
import fastifyPassport from 'fastify-passport';
import { Strategy } from '@passport-ng/clickup';

const fastify = Fastify();

fastifyPassport.use('clickup', new Strategy((accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
fastify.register(fastifyPassport.initialize());

fastify.get('/auth/clickup', { preValidation: fastifyPassport.authenticate('clickup') });
fastify.get('/auth/clickup/callback', { preValidation: fastifyPassport.authenticate('clickup', { failureRedirect: '/' }) }, (request, reply) => {
    return request.user;
});

fastify.listen(3000, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on ${address}`);
});
```


## Environment Variables

Ensure you have the following environment variables set in your application:

| Variable | Description |
|----------|-------------|
| `CLICKUP_CLIENT_ID` | Your ClickUp app's client ID. |
| `CLICKUP_CLIENT_SECRET` | Your ClickUp app's client secret. |
| `CLICKUP_REDIRECT_URL` | The URL to which ClickUp will redirect after authentication. |

## License

This project is licensed under the MIT License.