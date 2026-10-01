You're given n servers and a list of direct connections between them. Identify every critical connection — a bridge edge that, if removed, would split the network and leave some servers unable to reach others.

**Example:** n=4, connections=[[0,1],[1,2],[2,0],[1,3]] → Output: [[1,3]]
