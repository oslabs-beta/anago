# Guide to Using Prometheus

### Contents:

1. [Introduction](#introduction)
2. [Configuration](#configuring-prometheus)
3. [PromQL](#promql-prometheus-querying-language)
4. [Metric Types and Query Examples](#prometheus-metric-types-and-query-examples)
5. [Alerting]($prometheus-alerting)

## Introduction

Prometheus is a powerful open-source systems monitoring and alerting toolkit
originally built at Soundcloud in 2012. It is widely used for collecting and
storing metrics as _time series data_ that provide insight into the
functionality and behavior of your application.

Prometheus's main features include:

- Multi-dimension data model with time-series data identified by metric name
  and key/value pairs
- PromQL, a flexible query language to leverage this dimensional data model
- Autonomous single server nodes (no reliance on distributed storage)
- Time series metric data collected via pull model over HTTP 
- Scraping target endpoints are found via service discovery or static configuration

Relevant Prometheus components:

- Main Prometheus server: scrapes and stores time-series data
- Client libraries: supports application code
- Prometheus Alertmanager: configuration and handling of alerts

### What is the pull model?

Prometheus uses a _pull model_ to collect metrics. This means it scrapes HTTP
endpoints where metrics are exposed either natively by the component being
monitored, or through the use of community-built Prometheus exporters. In
Kubernetes, the service exposes the endpoints for us, which allows for easy integration between the technologies. Prometheus expects the exposed metrics at the HTTP
endpoint in either a simple text-based, human readable format (more commonly used and widely supported) or a more efficient and robust protocol buffer format. Examples of the text-based format are seen below under the 'Prometheus Metric Types and Query Examples' heading.

## Configuring Prometheus

Fine-tuned configuration of Prometheus happens in the command line and with YAML
configuration files. Command line flags handle configuration of immutable system
parameters (storage locations, amount of data to keep on disk/in memory, etc.),
and the configuration YAML file defines everything related to _instances_
(endpoints you can scrape, corresponding to a single process) and _scraping
jobs_ (a collection of instances with the same purpose, a process replicated for
scalability/reliability). The configuration file also determines which rule
files to load. (See below). For an example configuration file, check out the
Prometheus docs
[here](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

### Configuring Rules

Prometheus supports two types of rules which may be configured and then
evaluated at regular intervals: _recording rules_ and _alerting rules_. To
include rules in Prometheus, create a YAML file containing the necessary rule
statements and have Prometheus load the file in the rule_files field in the
Prometheus configuration.

**Recording rules** allow you to precompute frequently needed or computationally
expensive expressions and cache their result as a new set of time series data.
Querying the precomputed result will then often be much faster than executing
the original expression every time it is needed. This is especially useful for
dashboards, which query the same expression repeatedly every time they refresh. When configured, the names of recording rules must be valid metric
names.

**Alerting rules** allow you to define conditions that trigger an alert (based on
Prometheus language expressions) and to send notifications about
currently firing alerts to an external service. If an alert expression triggers
an alert for multiple vector elements at a given point in time, the alert will
be active for each of those elements' label sets. Read more on alerting under
the 'Prometheus Alerting' heading below.

## PromQL, Prometheus Querying Language

Within Prometheus, you can query metrics using **PromQL**. It is a
domain-specific-language (DSL) built upon Go, and also a nested functional
language (NFL) where data appears as nested expressions within larger
expressions. The outermost expression defines the final value, while nested
expressions, or subqueries, produce values that serve as arguments or operands
for the larger expressions. PromQL is also useful for grouping and sorting
metrics by type or label.

PromQL data types: 
- Floats/Scalars: Literals that can be
integers or strings, and can be used with regex. For example, you can return all
values in the 200s or 400s by writing code=~"2._\4._" 
- Range vectors: select from a range within the instant that instant vectors select. 
- Instant vectors: simple queries made by identifying the metric name. They can be filtered by referring to labels within curly brackets.

Querying in Prometheus is made more sophisticated by PromQL's feature flags,
functions, and operators for more specific and relevant data. Each query returns
either a graph on the Prometheus URI, or metadata that can be exported using the
HTTP API, which can be accessed at the /api/v1 endpoint on the Prometheus
server. The HTTP API sends the requested metadata as a response in JSON format
(as seen below), with the successfully collected data returned in the data
field.

    `{
    "status": "success" | "error",
    "data": <data>,

    // Only set if status is "error". The data field may still hold additional data.
    "errorType": "<string>",
    "error": "<string>",

    // Only if there were warnings while executing the request.
    // There will still be data in the data field.
    "warnings": ["<string>"]
    }`

The
[Prometheus documentation](https://prometheus.io/docs/prometheus/latest/querying/api/#:~:text=foo%20%2F%20bar%22%20%7D-,Querying%20metadata,via%20the%20deletion%20API%20endpoint)
does a stellar job of reviewing the different types of HTTP requests to various
endpoints of the Prometheus API, including required parameters and providing
examples.

## Prometheus Metric Types and Query Examples

A metric data point is comprised of a metric name, a timestamp provided by the
Prometheus server when the data point was collected, and a measurement
represented by a numerical value. Dimensional metrics can also include a set of
labels (the 'dimensions') for additional context. These labels are useful for
easily aggregating and analyzing metrics, as returned results from a query for a
specific metric name can then be filtered and grouped by label.

1.  **Counter** A _cumulative_ metric that represents a single monotonically
    increasing (in other words, non-decreasing) counter _whose value can only
    increase or be reset to zero on restart_. For example, you can use a counter
    to represent the number of requests served, tasks completed, orders in an
    e-commerce site, and bytes sent and received over a network interface. On
    its own, a counter is not very useful, but is often used to compute the
    delta between two timestamps or the rate of change over time.

        Example of a counter metric as exposed on a Prometheus target:
        `# HELP http_requests_total Total number of http api requests
        # TYPE http_requests_total counter
        http_requests_total{api="add_product"} 4633433`

        Above, # HELP provides the metric's description, and # TYPE denotes it as a counter. The metric name is 'http_requests_total', it has one label named 'api' with a value of 'add_product' and the counter's value is 4633433.  This means that the add_product API has been called 4,633,433 times since the last service start or counter reset. By convention, counter metrics are usually suffixed with _total.

        Query examples for a counter metric:
        `rate(http_requests_total{api="add_product"}[5m])`
            PromQL's rate() function allows us to analyze the average requests per second that the API received over the last five minutes.
        `increase(http_requests_total{api="add_product"}[5m])`
            PromQL's increase() function is a delta function that allows us to calculate the absolute change over a time period. This query returns the total number of requests made in the last five minutes.  It evaluates to the same number as multiplying the per-second rate by the number of seconds in the interval as seen below.
        `rate(http_requests_total{api="add_product"}[5m]) * 5 * 60`

2.  **Gauge** A metric that represents a single numerical value that can
    arbitrarily increase and decrease. Gauges are typically used for measured
    values like temperatures or current memory usage, but also "counts" that can
    go up and down, like the number of concurrent requests. This metric type is
    useful on its own and does not require additional processing to provide
    meaning.

        Example of a gauge metric as exposed on a Prometheus target:
        `# HELP node_memory_used_bytes Total memory used in the node in bytes
        # TYPE node_memory_used_bytes gauge
        node_memory_used_bytes{hostname="host1.domain.com"} 943348382`

        This metric indicates that the memory used in the node 'host1.domain.com' at the time of measurement is around 900 megabytes.  Rate() and increase() don't make much sense here, but you can use PromQL functions avg_over_time(), max_over_time(), min_over_time(), and quantile_over_time() to manipulate the returned data.

3.  **Histogram** In general terms, a histogram is an approximate representation
    of the distribution of numerical data at a single point in time. The data is
    typically grouped into user-determined 'buckets', or ranges of data, that
    are chosen to give meaning to the data and assist in providing analysis.

In Prometheus, a histogram samples observations (i.e. request durations,
response sizes), and counts them in user-configurable buckets. It tracks the
number of observations and the sum of all observed values, which allows for the
calculation of averages. Prometheus histograms have some important differences
when compared to the general definition above:

- **The buckets are cumulative.** Each bucket is bigger than the one before and
  contains the count (sum) of all observations less than or equal to its upper
  threshold at that given timestamp. The user preconfigures the number of
  buckets and the maximum size of each bucket ahead of time in the client. There
  is no minimum size to the bucket.

Each bucket is stored internally in the Prometheus server in a separate metric
suffixed '\_bucket' and its maximum value ('le', representing 'less than or
equal to') (for example, `_bucket{le='100'}`). There is always a largest bucket
with infinite maximum threshold `{le = "Inf"}` which always has the same value
as '\_count'.

- **The histogram is a time-series.** Prometheus scrapes metrics from a target
  at specified intervals of time, each time receiving and storing a cumulative
  histogram that represents the distribution of observed values as recorded
  since the previous scrape. It is crucial to understand that when QUERYING a
  histogram, the histogram displays values that each represent one of these
  stored cumulative histograms. The histogram-of-histograms that the client
  receives is calculated within the Prometheus server at the query time.

- **The time-series itself is cumulative.** The buckets in the Prometheus
  histogram are always increasing, so that the most recent instance of the
  histogram shows the total values for each of the buckets since the metric was
  first recorded.

  A histogram with a base metric name of <basename> exposes multiple time series
  during a scrape:

  - <basename>\_bucket{le="<upper inclusive bound>"}: cumulative counters for
    the observation buckets
  - <basename>\_count (identical to <basename>\_bucket{le="+Inf"} above): the
    number of events that have been observed
  - <basename>\_sum: the total sum of all observed values

Importantly, histograms can be _aggregated_, which means that we can create
meaningful connections between data scraped from many endpoints.

Let's provide an example query for a Prometheus histogram: Consider the base
metric name 'http_request_duration_seconds'. You need to specify which of the
exposed time-series you want to query: 'http_request_duration_seconds_count' :
the total number of observations 'http_request_duration_seconds_sum' : the total
sum of observations 'http_request_duration_seconds_bucket' : the total count of
observations for a bucket in the histogram

![Alt text](image-2.png)

The value that is returned when the metric is queried is the instant vector,
meaning, the latest set of values scraped by Prometheus (as opposed to a range
of values over time). In other words, the instant vector is the most recent
cumulative histogram instance that shows the total values across all of the
previous buckets. With every scrape, Prometheus collects an instant vector.

After the metric name 'http_request_duration_seconds_bucket', the labels within
{} add dimensionality to the data and provide for the ability to filter values
based on label criteria. Note the 'le' label that signifies the cumulative count
of all the observed values less than or equal to the number assigned to 'le'.
(UPDATE THIS WITH BETTER VISUALS ONCE WE HAVE CONFIGURED BUCKETS!)

This cumulative count of http request durations doesn't tell us much. Let's come
up with something more interesting and useful. Usually, http requests are
happening at a high frequency and large volume. Prometheus can provide us
insights to how the duration of the http requests change over time and in
between scraping intervals through the histogram_quantile() function. Let's
examine some queries as they are written increasingly more specific:

    http_request_duration_seconds: the cumulative count of observations in each of our buckets.
    http_request_duration_seconds_bucket[1m]: the cumulative counts for each bucket, but over the last minute’s scrape intervals
    rate(http_request_duration_seconds_bucket[1m]): how frequently observations have been made in each of the buckets over the last minute
    histogram_quantile(0.9, rate(http_request_duration_seconds_bucket[1m])): the calculated 90th percentile of request durations over the last minute (Note, this expression will require modification if working with native histograms or if aggregating.)

The histogram_quantile function above allows Prometheus to calculate which
bucket label contains the given quantile (90th percentile), which means we can
now find out the approximate value at which a given quantile was represented in
the data.

4.  **Summary** Similar to a histogram, a summary samples observations. While it
    also provides a total count of observations and a sum of all observed
    values, it calculates configurable quantiles over a specified sliding time
    window. The number of quantiles chosen by the user results in the number of
    time series received when queried.

        A summary with a base metric name of <basename> exposes multiple time series during a scrape:

        - <basename>{quantile="<φ>"}: streaming φ-quantiles (0 ≤ φ ≤ 1) of observed events
        - <basename>_count: the number of events that have been observed
        - <basename>_sum: the total sum of all observed values

_Histograms vs. Summaries, a little more detail:_ You can use both summaries and
histograms to calculate estimated so-called φ-quantiles, where 0 ≤ φ ≤ 1. The
φ-quantile is the observation value that ranks at number φ\*N among the N
observations (in English, the 0.5-quantile is known as the median. The
0.95-quantile is the 95th percentile).

The essential difference between summaries and histograms is in how and where
the quantiles are calculated.  
Summaries calculate streaming φ-quantiles on the client side and expose them
directly. This makes observations expensive to calculate and reduce client
performance, but infer a low server-side cost. Histogram expose bucketed
observation counts, and quantiles are calculated server-side (as mentioned
above) from the buckets using the histogram_quantile() function.

Weaknesses of Prometheus histograms include:

- _Percentiles are approximate, not accurate_. The accuracy of your data is
  based mostly on the sizes of the buckets you preconfigure in the client. A
  greater number of smaller buckets allows for the greatest accuracy, but more
  data is then required to store and compute values.
- _Pre-configuration of buckets_: If your buckets are poorly-defined, you will
  be unable to compute and analyze the data that you need. For example, if you
  set your upper bound ('le') smaller than the size of the data, your buckets
  are useless. If your 'le' is too big, then your collected data will be less
  accurate, as mentioned above.
- _Server-side percentile computing can be expensive with a lot of data._ This
  can be partially mitigated through the use of recording rules to precompute
  required percentiles.

Summaries provide more accurate quantiles than histograms, but there are
drawbacks here as well:

- _Expensive quantile computing on client side_. The client library must keep a
  sorted list of data points over time to make calculations. The number of
  stored data points is limited, which reduces accuracy in exchange for
  efficiency.
- _Quantiles must be predefined by the client._ There is no way to calculate
  other quantiles at query time, so updating a new quantile requires modifying
  and reapplying the code. The metric will only be available from that time
  forward.
- _It is impossible to aggregate summaries across multiple series._ Summaries
  are inherently useless for most dynamic modern systems when you are interested
  in the metrics across all instances of a component.

## Prometheus Alerting

An essential aspect of Prometheus's functionality is its capability to provide
alerts for infrastructure and application monitoring. The alerts that Prometheus
send to the client allow a developer to respond immediately to critical
performance issues, often even before the issue impacts the user experience in a
production environment.

A fantastic tool for handling alerts in Prometheus is the open-source tool
**Alertmanager**. Alertmanager is simple, effective, highly available, and
streamlines alerting data as soon as it's generated to help development teams
determine which alerts actually matter and should be prioritized. It can send
notifications across platforms and via various third-party tools like email or
Slack. Alertmanager can be run both inside and outside of a cluster, and often
multiple instances of Alertmanager are necessary in production environments.

Alertmanager configures alerts in three ways:

1. Grouping: Alerts can be grouped by kind (e.g., node alerts, pod alerts) into
   a single notification. This is essential in larger system failures to prevent
   thousands of alerts from firing simulataneously.
2. Inhibition: Sometimes a notification will be suppressed by Alertmanager if
   redundant alerts are also firing. For example, if an alert fires that an
   entire cluster is unreachable, it is unnecessary to receive an alert that a
   pod within that cluster is unreachable, too.
3. Silencing: Alerts can be muted based on labels or regular expressions.

Alert States:

- Pending: The time elapsed since threshold breach is less than the recording
  interval
- Firing: The time elapsed since threshold breach is more than the recording
  interval and alertmanager is delivering notifications
- Resolved: The alert is no longer firing because the threshold is no longer
  exceeded; you can optionally enable resolution notifications using
  `[ send_resolved: <boolean> | default = true ]` in your config file

### Configuring Alertmanager

The Alertmanager YAML configuration file is important for numerous parameters.
Prometheus requires Alertmanager endpoints to be specified in the file, as all
alerts are sent to all endpoints to ensure high availability. Config parameters
tell Alertmanager how to group and route alerts, defines inhibition rules,
notification routing, and notification receivers.

Three essential components to Alertmanager configuration:

1. Clients: Alerts in Prometheus are forwarded from data sources referred to as
   'clients' (usually Prometheus server instances) to the Alertmanager. The
   Alertmanager can handle data incoming from multiple clients.
2. Alerting rules: While not part of the Alertmanager architecture, alerting
   rules are essential to determine how alerts should be processed prior to
   being routed. A configuration example for alerting rules is provided below.
3. Integrations: Define which third-party tools or platforms will receive alerts
   pushed by Alertmanager.

Various examples of Alertmanager configuration files can be reviewed in the
[Prometheus docs](https://prometheus.io/docs/alerting/latest/configuration/).
There are many recommended alerts to set up, some of them are provided in this
helpful link
[here](https://www.opsramp.com/guides/prometheus-monitoring/prometheus-alerting/).

Example alerting rules configuration in the Prometheus configuration's rule
file:

    `groups:
      - name: ElasticSearch Alerts
      rules:
      - alert: ElasticSearch Status RED
        annotations:
            summary: "ElasticSearch Status is RED (cluster {{ $labels.cluster }})"
            description: "ES Health is Critical\nCluster Name: {{$externalLabels.cluster}}"
      expr: elasticsearch_cluster_health_status{color="red"}==1
      for: 3m
      labels:
        team: devops`

      - alert: ElasticSearch Status YELLOW
        annotations:
            summary: "ElasticSearch Status is YELLOW (cluster {{ $labels.cluster }})"
            description: "ES Health is Critical\nCluster Name: {{$externalLabels.cluster}}"
      expr: elasticsearch_cluster_health_status{color="yellow"}==1
      for: 10m
      labels:
        team: slack`

    Groups: A collection of rules that are run sequentially at a regular interval
    Name:  Name of group
    Rules: The rules in the group
    Alert: A valid label name
    Expr: The condition required for the alert to trigger
    For: The **recording interval**, or minimum duration for an alert’s expression to be true (active) before updating to a firing status
    Labels: Additional labels attached to the alert
    Annotations: Any actionable or contextual information

Notice: The more severe alert has a lower recording interval than the less
critical alert.

### Sending Alert Notifications

https://www.groundcover.com/blog/prometheus-alert-manager



References: https://andykuszyk.github.io/2020-07-24-prometheus-histograms.html
https://www.timescale.com/blog/four-types-prometheus-metrics-to-collect/#:~:text=The%20histogram%20buckets%20are%20exposed,than%20or%20equal%20to%20N.
https://bryce.fisher-fleig.org/prometheus-histograms/
https://promlabs.com/blog/2020/12/17/promql-queries-for-exploring-your-metrics/
https://logz.io/blog/promql-examples-introduction/#func
https://www.opsramp.com/guides/prometheus-monitoring/prometheus-alerting/
