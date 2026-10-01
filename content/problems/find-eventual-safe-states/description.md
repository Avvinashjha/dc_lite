You're given a directed graph. A node with no outgoing edges is called a terminal node, and a node is eventually safe if following any path from it always eventually reaches a terminal node — meaning it can never be part of an endless cycle. Return the list of all eventually safe nodes.

**Example:** graph = [[1,2],[2,3],[5],[0],[5],[],[]] → Output: [2,4,5,6]
