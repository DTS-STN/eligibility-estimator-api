# Benefits Eligibility Estimator API

A work-in-progress proof-of-concept using the publicly-available legislation/logic to determine if a user is eligible for certain benefits given certain criteria.

The source for the logic to be implemented can be found here: <https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html>

## Dependencies

### Chocolatey

Chocolatey is a great package manager for Windows. If you install Chocolatey, you can do everything else with a few commands.

General environment:
`choco install vscode git`

Working with Azure Functions:
`choco install azure-functions-core-tools azure-cli`

Special version of Node (max version is 14 for Azure Functions):
`choco install nodejs --version=14.18.1`

Possible dependencies for Node:
`choco install python visualstudio2019-workload-vctools`

### Alternate

If you don't want to use Chocolatey, you still probably need everything above, you'll just have to install manually.

Link to latest version of Node 14: <https://nodejs.org/download/release/v14.18.1/node-v14.18.1-x64.msi>

## Setup

Ensure you set your Git email for your local environment to your ESDC email:
`git config user.email "first.last@hrsdc-rhdcc.gc.ca"`
