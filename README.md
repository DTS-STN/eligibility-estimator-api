# Benefits Eligibility Estimator API

A proof-of-concept using the publicly-available legislation/logic to determine if a user is eligible for certain benefits given certain criteria.

The source for the logic to be implemented can be found here: <https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html>

You can interact with the API using the following link: <https://dts-stn.github.io/eligibility-estimator-api/>

---

## Setup

### Dependencies

#### Chocolatey

Chocolatey is a great package manager for Windows. If you install Chocolatey, you can do everything else with a few commands. Instructions on installing Chocolatey can be found [here](https://chocolatey.org/install).

##### Quick

Everything from below (except Node, as it's a special version):

```sh
choco install vscode git azure-functions-core-tools azure-cli python visualstudio2019-workload-vctools dotnet insomnia-rest-api-client
```

Special version of Node (max version is 14 for Azure Functions):

```sh
choco install nodejs --version=14.18.1
```

You can now proceed to the Configuration section.

##### Individual Commands

If you've done the "quick" commands above, you can skip to the Configuration section.

General environment:

```sh
choco install vscode git
```

Working with Azure Functions:

```sh
choco install azure-functions-core-tools azure-cli
```

Possible dependencies for Node:

```sh
choco install python visualstudio2019-workload-vctools
```

Possible dependencies for Azure Functions:

```sh
choco install dotnet
```

Preferred REST client, for debugging:

```sh
choco install insomnia-rest-api-client
```

#### Alternative

If you don't want to use Chocolatey, you still probably need everything above, you'll just have to install manually.

Link to latest version of Node 14: <https://nodejs.org/download/release/v14.18.1/node-v14.18.1-x64.msi>

---

## Configuration

### Git

Ensure you set your Git email for your local environment to your ESDC email:

```sh
git config user.email "first.last@hrsdc-rhdcc.gc.ca"
```

### VSCode

The Azure Functions Extension is a requirement, but should be recommended to you automatically upon opening VSCode.

### Insomnia

You can use the following link to open the Insomnia configuration in the app. It will pull whatever is on GitHub under the `develop` branch.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Eligibility%20Estimator%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDTS-STN%2Feligibility-estimator-api%2Fdevelop%2Fdocs%2Finsomnia.yaml)

You may also import the file manually, it is under `docs/insomnia.yaml`.

Note that whatever method you use, if the configuration is changed, it will not be reflected automatically. You will need to import again.

Alternatively, instead of using Insomnia, you may use the Swagger UI hosted on GitHub pages [here](https://dts-stn.github.io/eligibility-estimator-api/).

---

## Usage

Pressing `F5` in VSCode is the fastest way to get started. It will install all `npm` dependencies, build the TypeScript code, start the function host, and attach the debugger.

For a nicer development experience, however, it is recommended to run the automatic TypeScript builder with `npm run watch`, and then start the function host (which will pick up any updated files) with `npm run start`. This will allow you to make changes and automatically run the updated code.

The test suite can be run with `npm run test`.

_Hint_: VSCode has a decent integration with `npm` scripts. You can use `Terminal > Run Task` and select `npm` to see the available `npm` scripts. You may need the `npm` extension. You also may like to set a bind for the `Run Task` command.
