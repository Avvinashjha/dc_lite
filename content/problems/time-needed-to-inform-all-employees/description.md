The company's `n` employees are labeled `0` through `n - 1`. Employee `headID` is the head and knows the news at time 0.

`manager[i]` is employee i's direct manager; only the head has manager `-1`. The hierarchy is one rooted tree. After employee i receives the news, it takes `informTime[i]` minutes to inform **all of their direct subordinates simultaneously**. Each subordinate can then inform their own team independently.

Return the earliest time when every employee has received the news. Parallel branches do not add together: the answer is the longest accumulated delay from the head to an employee. Employees with no subordinates have an informing time of 0.
