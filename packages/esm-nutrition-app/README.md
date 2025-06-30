# esm-nutrition-app

A Nutrition frontend module for [OpenMRS 3.x](https://openmrs.org/), providing nutrition summary and feeding form management for patient charts. Built with the Carbon Design System and designed for integration into the OpenMRS SPA ecosystem.

## Features

- **Nutrition Summary Dashboard**: View and manage patient nutrition data directly from the patient chart.
- **Add/Edit Nutrition Feeding**: Launch forms to record or update nutrition feedings for a patient.
- **OpenMRS 3.x Integration**: Seamlessly integrates as an extension in the patient chart dashboard.
- **Configurable**: Uses OpenMRS SPA config schema for customization.
- **Modern UI**: Built with Carbon Design System components.

### Demo 
https://github.com/user-attachments/assets/3a3ee980-9a0d-49b3-a3a9-052f4b1cbbbe


## Installation

This package is in active development. For the latest features and fixes, use the `next` version:

```sh
npm install @madiro/esm-nutrition-app@next
# or
yarn add @madiro/esm-nutrition-app@next
```

## Usage & Integration

Register the app as an extension in your OpenMRS SPA configuration. The app provides the following extensions (see `src/routes.json`):

- `clinical-view-section` (divider in patient chart dashboard)
- `patient-nutrition-summary-dashboard` (dashboard link)
- `patientNutritionDetailsWidget` (nutrition summary widget)

Example (in your OpenMRS config):
```json
{
  "extensions": [
    {
      "name": "patient-nutrition-summary-dashboard",
      "slot": "patient-chart-dashboard-slot"
    }
  ]
}
```

## Configuration

- **Form Name**: `MSF Nutrition - Feeding Form`
- **Form UUID**: `9ed6d34e-1415-47a6-82e8-30070f859f38`
- **Encounter Type**: `Nutrition` (`efb1ee49-ed60-40f4-aa2e-c45143dc4d49`)
- **Concepts**: Meal amount and remark concepts are defined in `src/constants.ts`.

You can override these via the OpenMRS config schema if needed.

## Development

Clone the repository and install dependencies:

```sh
git clone https://github.com/MadiroGlobalHealth/openmrs-esm-lime.git
cd openmrs-esm-lime/packages/esm-nutrition-app
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

Unit tests are written with Jest. Example test file: `src/utils/helpers.test.ts`.

To run tests:

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
