# Planning Poker
![CI](https://github.com/philipphermes/planning-poker/actions/workflows/ci.yml/badge.svg)

## Setup

#### Install dependencies
```sh
yarn install
```

#### Create `.env` file / Copy over `.env.dist`
```
DATABASE_URL="local.db"
SECRET="s3cr3t"
```

#### Generate migration
```sh
npx drizzle-kit generate
```

#### Migrate
```sh
npx drizzle-kit migrate
```

## Development

#### Run the dev server
```sh
yarn dev
```

#### Drizzle Studio
```sh
yarn drizzle-kit studio --port=3000
```

## Testing

#### Lint
```sh
yarn lint
```

#### Type check
```sh
yarn typecheck
```

#### Vitest
```sh
yarn vitest run
```

#### Playwright
```sh
npx playwright test
```