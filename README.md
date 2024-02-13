# Anago

![Anago-Banner](client/assets/images/abg3.png)

Anago is a tool to help developers monitor and visualize their Kubernetes clusters. Team Anago is equipped for monitoring Kubernetes clusters hosted both on local servers and on cloud-based platforms. Anago provides out-of-the-box support for Prometheus and Prometheus’ Alertmanager for scraping metrics and alerts and integrates with Chart.JS for the dashboard graphs.

The name Anago, originates from Greek, meaning to lead to a higher place, to uplift, and to take to sea. In this spirit, Anago serves as a perfect compass to help you manage your containerized application deployments on the Kubernetes platform.

Let’s dive into how the features of Anago’s platform can simplify and streamline managing your Kubernetes clusters.

<div align= "center">

[![Kubernetes](https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/) [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) [![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/) [![Prometheus](https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=000000)](https://prometheus.io/) [![Chart.js](https://img.shields.io/badge/Chart%20js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/) [![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=Helm&labelColor=0F1689)](https://helm.sh/) [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) [![VitesT](https://img.shields.io/badge/Vitest-86b91a?style=for-the-badge&logo=vitest&logoColor=edd532)](https://vitest.dev/) [![ts-node](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)](https://www.npmjs.com/package/ts-node) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/) [![ReactRouter](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/en/main) [![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5) [![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) [![Eslint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

</div>

## Table of Contents

1. [Anago](#Anago)
2. [Features](#features)
3. [Getting Started with Anago](#Getting-Started-with-Anago)
4. [Contributing](#Contributing)
5. [Progress](#Progress)
6. [Scripts](#Scripts)
7. [Our Team](#our-team)
8. [License](#license)

## Features

Anago is a Kubernetes cluster monitoring and visualization tool providing relevant, richly detailed insights into the health of your application deployments with the following useful features:

1. **Real-time Data Monitoring**: Anago seamlessly integrates with your cloud-based and/or locally hosted Kubernetes clusters to allow for a real-time analysis of cluster performance.
   ![data-monitoring](/client/assets/gifs/MonitorVid.gif)
2. **Customizable Metrics**: Anago harnesses the power of Prometheus to scrape time-series data from your Kubernetes clusters. We offer customized query-building to configure your dashboard to display cluster metrics and data insights relevant to you. We provide the tools for your cluster management, and you decide which direction you want to take them.
   ![data-monitoring](/client/assets/gifs/AddMetric.gif)
3. **Alerts**: Anago displays relevant real-time alerts relating to cluster health concerns, allowing you to address issues with your deployments proactively to combat downtime in production.
   ![data-monitoring](/client/assets/gifs/AlertVid.gif)
4. **Horizontal Pod Autoscaler Monitoring**: Anago allows you to monitor actively deployed Horizontal Pod Autoscalers in real time or connect to your test application to see isolated test results before the rollout of new features or deployment configurations. Anago stores logs of notable historical timestamps for you to reference to not miss meaningful warning signs and/or longer-term trends, diminishing the abstraction of your HPA usage by providing insights into areas lacking efficiency alongside any bottlenecks that can slow your deployed applications and also drive up the cost of your clusters astronomically. Anago will act as an additional set of eyes and devise tailored recommendations on how to optimize your current HPA configurations.
   ![data-monitoring](/client/assets/gifs/HPAVid.gif)
5. **Cluster Visualization**: Anago provides flexible and detailed visualization of your Kubernetes clusters on our ClusterView dashboard. See your clusters in their entirety with all of their nested components, or filter to display specific clusters, nodes, and namespaces that are relevant to your needs. ClusterView provides extremely detailed insights into each component in your cluster with real-time data from Prometheus and the Kubernetes API. Alerts are displayed visually so you can see which parts of your cluster require your attention.
   ![data-monitoring](/client/assets/gifs/ClusterVid.gif)
6. **Platform-agnostic**: Anago supports clusters hosted on cloud-computing platforms and local servers. We are flexible and adaptable for your scale and configuration needs and provide tools to help you integrate your clusters with our technology seamlessly. Anago is for everyone.

## Getting Started with Anago

Let’s walk through how to get your cluster [setup with Anago](/SetupREADME.md)

## Contributing

Contributions are part of the foundation of the Open Source Community. They create a space for developers to share, collaborate, learn, and inspire! Any contributions you choose to make are greatly appreciated.

If you wish to contribute, please follow these guidelines:

1. Fork and clone the repository
2. Branch off of the dev branch to create your own feature branch
   - The Feature branch name should start with feat, fix, bug, docs, test, wip, or merge (e.g. feat/database)
   - see the [Scripts](##Scripts) section below for additional details
3. Commit your changes (git commit -m '(feat/bugfix/style/etc.): [commit message here]')
   - Please review [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) standards for more information
4. Once your new feature is built out, you can submit a pull request to dev

## Progress

| Feature                                          | Status |
| ------------------------------------------------ | ------ |
| HPA Recommendations                              | ⏳     |
| Integrate CI/CD pipeline                         | ⏳     |
| Automated Monitoring Tool Deployment & Config    | ⏳     |
| Increase Test Coverage                           | 🙏🏻     |
| Historical data page                             | 🙏🏻     |
| Ability to export metric data in-app             | 🙏🏻     |
| OAuth2.0 with cloud-hosting providers (i.e. AWS) | 🙏🏻     |
| Stress-Test page                                 | 🙏🏻     |

- ✅ = Ready to use
- ⏳ = In progress
- 🙏🏻 = Looking for contributors

## Scripts

Below are descriptions of each npm script:

- `npm run dev`: Starts the development server using Nodemon
- `npm run dev:front`: Starts the development for the frontend using Vite
- `npm run dev:back`: Starts the development server for the backend using Nodemon
- `npm run build`: Starts the build mode
- `npm run lint`: Applies standardized linting
- `npm run preview`: Runs a vite preview
- `npm vitest`: Runs tests with vitest

## Our Team

  <table>
  <tr>
    <td align="center">
      <img src="client/assets/Anago-Members/alexandra.png" alt= “Alexandra” width="150px;" alt=""/>
      <br />
      <sub><b>Alexandra Ashcraft</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/alexandra-ashcraft1"><img src="https://ssl.gstatic.com/atari/images/sociallinks/linkedin_black_28dp.png" height="30px"/></a>
      <a href="https://github.com/AlexandraAshcraft"><img src="https://ssl.gstatic.com/atari/images/sociallinks/github_black_28dp.png" height="30px"/></a>
    </td>
    <td align="center">
      <img src="client/assets/Anago-Members/halia2.jpg" alt= "Halia" width="150px"/>
      <br />
      <sub><b>Halia Haynes</b></sub>
      <br />
    <a href="https://www.linkedin.com/in/haliahaynes/"><img src="https://ssl.gstatic.com/atari/images/sociallinks/linkedin_black_28dp.png" height="30px"/></a>
      <a href="https://github.com/hhaynes4"><img src="https://ssl.gstatic.com/atari/images/sociallinks/github_black_28dp.png" height="30px"/></a>
    </td>
    <td align="center">
      <img src="client/assets/Anago-Members/Rylie.jpg" alt= "Rylie" width="150px;" />
      <br />
      <sub><b>Rylie Pereira</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/rylie-pereira-524711225/"><img src="https://ssl.gstatic.com/atari/images/sociallinks/linkedin_black_28dp.png" height="30px"/></a>
      <a href="https://github.com/ryliep"><img src="https://ssl.gstatic.com/atari/images/sociallinks/github_black_28dp.png" height="30px"/></a>
    </td>
     <td align="center">
      <img src="client/assets/Anago-Members/Steve.jpeg" alt= "Steve" width="150px"/>
      <br />
      <sub><b>Steve Schlepphorst</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/schlepphorst/"><img src="https://ssl.gstatic.com/atari/images/sociallinks/linkedin_black_28dp.png" height="30px"/></a>
      <a href="https://github.com/schlepphorst"><img src="https://ssl.gstatic.com/atari/images/sociallinks/github_black_28dp.png" height="30px"/></a>
    </td>
  <tr>
  </tr>
</table>

## License

By contributing, you agree that your contributions will be licensed under Anago's MIT License.
