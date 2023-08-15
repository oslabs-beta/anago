Background:
Alerting with Prometheus is separated into two parts:

1. Alerting rules in Prometheus servers send alerts to an Alertmanager.
2. The Alertmanager then manages those alerts.

the main steps of set up:

1. Setup and configure AlertManager.
2. Configure the config file on Prometheus so it can talk to the AlertManager.
3. Define alert rules in Prometheus server configuration.
4. Define alert mechanism in AlertManager to send alerts via Slack and Mail
   ![Alt text](https://miro.medium.com/v2/resize%3Afit%3A1120/format%3Awebp/1%2AwWz5vwHcBeTATvBFKGqRkA.png)
   sources:
   https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
   https://itnext.io/prometheus-with-alertmanager-f2a1f7efabd6
   https://devopscube.com/alert-manager-kubernetes-guide/

the alertManager manages alerts through:

1. silencing (mute alerts for a given time)
2. inhibition (suppress notifications for certain alerts if other alerts are already fired)
3. grouping (into a single notification)
4. sending out notifications
