# promQL Queries:

- CPU idle by cluster
  sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) -
  on (namespace,pod,container) group_left avg by
  (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) \*
  -1 >0)

- Memory idle by cluster
  sum((container_memory_usage_bytes{container!="POD",container!=""} - on
  (namespace,pod,container) avg by
  (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"}))
  -1 >0 ) / (1024\*1024\*1024)

--count pods per cluster by namespace: sum by (namespace) (kube_pod_info)

-- the number of seconds the CPU has been running in a particular mode
(excluding idle time) sum by (cpu)(node_cpu_seconds_total{mode!="idle"})

- total percentage of used memory
  node_memory_Active_bytes/node_memory_MemTotal_bytes\*100 (To obtain the
  percentage of memory use, divide used memory by the sum and multiply by 100)

- free disk usage to understand when there needs to be more space on the
  infrastructure nodes
  node_filesystem_avail_bytes/node_filesystem_size_bytes\*100

- detect the number of kubernetes pods that existed in the last 24 hours within
  a given namespace
  count(count_over_time(kube_pod_created{namespace=~"default"}[24h]))

- query to return how much time each pod was running, over last 24 hours

  - If a pod is still running, the time from its creation to now
  - If a post has terminated, the time from creation to completion sum
    by(namespace, pod) (

  (last_over_time(kube_pod_completion_time[1d])-
  last_over_time(kube_pod_created[1d]))

  or

  (time() - kube_pod_created)

)

- checking node health status count(
  kube*node_status_condition{condition="Ready", status="true"} == 1 ) * count(
  kube*node_status_condition{condition="Ready", status="true"} == 1 and
  kube_node_status_condition{condition="DiskPressure", status="false"} == 1 ) *
  count( kube\*node_status_condition{condition="Ready", status="true"} == 1 and
  kube_node_status_condition{condition="DiskPressure", status="false"} == 1 and
  kube_node_status_condition{condition="MemoryPressure", status="false"} == 1 )
  - count( kube\*node_status_condition{condition="Ready", status="true"} == 1
    and kube_node_status_condition{condition="DiskPressure", status="false"} ==
    1 and kube_node_status_condition{condition="MemoryPressure", status="false"}
    == 1 and kube_node_status_condition{condition="PIDPressure", status="false"}
    == 1 )
  - count( kube_node_status_condition{condition="Ready", status="true"} == 1 and
    kube_node_status_condition{condition="DiskPressure", status="false"} == 1
    and kube_node_status_condition{condition="MemoryPressure", status="false"}
    == 1 and kube_node_status_condition{condition="PIDPressure", status="false"}
    == 1 and kube_node_status_condition{condition="NetworkUnavailable",
    status="false"} == 1 )

## alert manager queries

- nodes with less than 15% free memory (node_memory_MemFree_bytes /
  node_memory_MemTotal_bytes) \* 100 < 15
