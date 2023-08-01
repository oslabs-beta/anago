Prometheus is a powerful open-source systems monitoring and alerting toolkit that was originally built at Soundcloud in 2012.  It is useful for collecting and storing metrics as time series data (i.e., metrics are stored with the timestamp at which it was recorded, alongside optional key-value pairs called labels).  This data is useful for understanding why your application is working a certain way.

Prometheus's main features are:
-a multi-dimension data model with time series data identified by metric name and key/value pairs
-PromQL, a flexible query language to leverage this dimensionality
-no reliance on distributed storage; single server nodes are autonomous
-time series collection happens via a pull model over HTTP
-pushing time series is supported via an intermediary gateway
-targets are discovered via service discovery or static configuration
-multiple modes of graphing and dashboarding support

Prometheus components:
-the main Prometheus server that scrapes and stores time-series data
-client libraries for instrumenting application code
-a push gateway for supporting short-lived jobs
-special-purpose exporters for services like HAProxy, StatsD, Graphite, etc.
-an alertmanager to handle alerts
-various support tools


Prometheus collects metrics from targets by scraping metrics HTTP endpoints



Configuring Rules
Prometheus supports two types of rules which may be configured and then evaluated at regular intervals: recording rules and alerting rules. To include rules in Prometheus, create a file containing the necessary rule statements and have Prometheus load the file via the rule_files field in the Prometheus configuration. Rule files use YAML.

Recording rules allow you to precompute frequently needed or computationally expensive expressions and save their result as a new set of time series. Querying the precomputed result will then often be much faster than executing the original expression every time it is needed. This is especially useful for dashboards, which need to query the same expression repeatedly every time they refresh.

Recording and alerting rules exist in a rule group. Rules within a group are run sequentially at a regular interval, with the same evaluation time. The names of recording rules must be valid metric names. The names of alerting rules must be valid label values.

Recording rules 






Alerting rules allow you to define alert conditions based on Prometheus expression language expressions and to send notifications about firing alerts to an external service. Whenever the alert expression results in one or more vector elements at a given point in time, the alert counts as active for these elements' label sets.








Metric Types













Quick Start with AWS EKS:
(These steps assume you have an existing VPC)

A Kubernetes namespace for Prometheus.
Node-exporter DaemonSet with a pod to monitor Amazon EKS nodes.
Pushgateway deployment with a pod to push metrics from short-lived jobs to intermediary jobs that Prometheus can scrape.
Kube-state-metrics DaemonSet with a pod to monitor the Kubernetes API server.
Server StatefulSet with a pod and attached persistent volume (PV) to scrape and store time-series data. The pod uses persistent volume claims (PVCs) to request PV resources.
Alertmanager StatefulSet with a pod and attached PV for deduplication, grouping, and routing of alerts.
Amazon Elastic Block Storage (Amazon EBS) General Purpose SSD (gp2) storage volume.


![](2023-08-01-09-02-36.png)



