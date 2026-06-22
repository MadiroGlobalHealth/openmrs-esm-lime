# esm-home-app

A Homepage microfrontend for [OpenMRS 3.x](https://openmrs.org/), providing a customizable home page with metrics, navigation, and widget dashboards. Designed for integration into the OpenMRS SPA ecosystem.

## Features

- **Home Dashboard**: Configurable home page served at the `/home` route.
- **Metrics Widget**: Displays key patient or facility metrics on the home dashboard.
- **Navigation Menu**: Side menu component rendered in the home sidebar.
- **Page Header**: Header component for the home dashboard.
- **OpenMRS 3.x Integration**: Seamlessly integrates as an extension in the OpenMRS SPA.

## Installation

This package is in active development. For the latest features and fixes, use the `next` version:

```sh
npm install @madiro/esm-home-app@next
# or
yarn add @madiro/esm-home-app@next
```

## Usage & Integration

Register the app as an extension in your OpenMRS SPA configuration. The app provides the following extensions (see `src/routes.json`):

- `home-nav-menu` (slot: `home-sidebar-slot`) — side navigation menu
- `home-widget-db-link` (slot: `homepage-dashboard-slot`) — dashboard link
- `page-header` (slot: `home-dashboard-slot`) — page header
- `metrics-slot` (slot: `home-dashboard-slot`) — metrics widget
- `home-widget-dashboard` (slot: `home-dashboard-slot`) — home widget dashboard

Example (in your OpenMRS config):

```json
{
  "extensions": [
    {
      "name": "home-widget-dashboard",
      "slot": "home-dashboard-slot"
    }
  ]
}
```

## Development

Clone the repository and install dependencies:

```sh
git clone https://github.com/MadiroGlobalHealth/openmrs-esm-lime.git
cd openmrs-esm-lime/packages/esm-home-app
yarn install
```

### Scripts

- `yarn start` – Start in OpenMRS dev mode
- `yarn serve` – Start local dev server
- `yarn build` – Build for production
- `yarn lint` – Lint source files
- `yarn test` – Run unit tests
- `yarn coverage` – Test coverage report

### TypeScript

The app is written in TypeScript. Config extends the root `tsconfig.json`.

## Testing

Unit tests are written with Vitest.

```sh
yarn test
# or
npm test
```

## Contributing

Contributions are welcome! Please open issues or pull requests via [GitHub](https://github.com/MadiroGlobalHealth/openmrs-esm-lime).

- Follow the OpenMRS SPA module conventions.
- Ensure code is linted and tests pass before submitting PRs.

## License

[Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/)

## Links

- [OpenMRS SPA Documentation](https://openmrs.github.io/openmrs-esm-core/)
- [Madiro Global Health](https://github.com/MadiroGlobalHealth)
- [OpenMRS](https://openmrs.org/)
