pathfinding = {};

pathfinding.NavMesh = {
	"Node1":[
						{node: "Node2", requiresJump: false},
						{node: "Node6", requiresJump: false}
			],
	"Node2":[
						{node: "Node1", requiresJump: false},
						{node: "Node5", requiresJump: false}
			],
	"Node3":[
						{node: "Node6", requiresJump: false},
						{node: "Node10", requiresJump: false}
			],
	"Node4":[
						{node: "Node9", requiresJump: false},
						{node: "Node5", requiresJump: false}
			],
	"Node5":[
						{node: "Node2", requiresJump: true},
						{node: "Node4", requiresJump: false},
						{node: "Node7", requiresJump: false}
			],
	"Node6":[
						{node: "Node1", requiresJump: true},
						{node: "Node3", requiresJump: false},
						{node: "Node8", requiresJump: false},
			],
	"Node7":[
						{node: "Node5", requiresJump: false}
			],
	"Node8":[
						{node: "Node6", requiresJump: false}
			],
	"Node9":[
						{node: "Node4", requiresJump: true},
						{node: "Node10", requiresJump: false},
						{node: "Node11", requiresJump: false},
			],
	"Node10":[
						{node: "Node3", requiresJump: true},
						{node: "Node9", requiresJump: false},
						{node: "Node12", requiresJump: false},
			],
	"Node11":[
						{node: "Node17", requiresJump: true},
						{node: "Node14", requiresJump: false},
						{node: "Node9", requiresJump: false},
			],
	"Node12":[
						{node: "Node13", requiresJump: true},
						{node: "Node18", requiresJump: false},
						{node: "Node10", requiresJump: false},
			],
	"Node13":[
						{node: "Node12", requiresJump: true},
						{node: "Node18", requiresJump: false},
						{node: "Node16", requiresJump: false},
			],
	"Node14":[
						{node: "Node11", requiresJump: true},
						{node: "Node17", requiresJump: false},
						{node: "Node15", requiresJump: false},
			],
	"Node15":[
						{node: "Node14", requiresJump: false}
			],
	"Node16":[
						{node: "Node13", requiresJump: false}
			],
	"Node17":[
						{node: "Node11", requiresJump: true},
						{node: "Node14", requiresJump: true},
						{node: "Node21", requiresJump: false},
						{node: "Node19", requiresJump: false},
			],
	"Node18":[
						{node: "Node13", requiresJump: true},
						{node: "Node12", requiresJump: true},
						{node: "Node20", requiresJump: false},
						{node: "Node19", requiresJump: false},
			],
	"Node19":[
						{node: "Node17", requiresJump: false},
						{node: "Node18", requiresJump: false},
			],
	"Node20":[
						{node: "Node18", requiresJump: false}
			],
	"Node21":[
						{node: "Node17", requiresJump: false}
			]
};

pathfinding.PlatformNodes = {
	"Platform1": ["Node1","Node2"],
	"Platform2": ["Node3","Node6","Node8"],
	"Platform3": ["Node4","Node5","Node7"],
	"Platform4": ["Node13","Node16"],
	"Platform5": ["Node9","Node10","Node11","Node12"],
	"Platform6": ["Node14","Node15"],
	"Platform7": ["Node17","Node18","Node19","Node20","Node21"]
};

pathfinding.PlatformAreas = {};

pathfinding.Nodes = {};

pathfinding.CalculateCost = function(start, dest) {
	var xs = 0;
	var ys = 0;
 
	xs = dest.x - start.x;
	xs = xs * xs;
	 
	ys = dest.y - start.y;
	ys = ys * ys;
	 
	return Math.sqrt( xs + ys );
};

pathfinding.Astar = function(ent, ent2) {
	closedset = [];
	openset = [];
	camefrom = [];
	
	gScore = {};
	gScore["start"] = 0;
	
	var start_neighbors = [];
	var end_neighbors = [];
	
	for(var i = 0; i < pathfinding.PlatformAreas; i++) {
		if(ent.body.getBounds().overlaps(pathfinding.PlatformAreas[i].body.getBounds()) {
			start_neighbors = pathfinding.PlatformNodes[pathfinding.PlatformAreas[i]];
		}
		
		if(ent2.body.getBounds().overlaps(pathfinding.PlatformAreas[i].body.getBounds()) {
			end_neighbors = pathfinding.PlatformNodes[pathfinding.PlatformAreas[i]];
		}
	}
	
	var NodeStart = {node: "start", position: {x: ent.body.pos.x, y: ent.body.pos.y}, neighbors: start_neighbors};
	var NodeEnd = {node: "end", position: {x: ent2.body.pos.x, y: ent2.body.pos.y}, neighbors: end_neighbors};
	
	openset.push(NodeStart);
	
	fScore = {};
	fScore["start"] := g_score["start"] + game.pathFinding.CalculateCost(NodeStart.position, NodeEnd.position);
	
	while(openset.length > 0) {
		var min = null;
		var current = null;
		for(var i = 0; i < openset.length; i++) {
			if(current == null) {
				current = openset[i];
				min = fScore[openset[i].node];
			}
			else if (fScore[openset[i].orig] < min) {
				current = openset[i];
				min = fScore[openset[i].node];
			}
		}
		
		if(current != null) {
		
			for(var i = 0; i < end_neighbors.length; i++) {
				if(end_neighbors[i] == current.node) {
					return GetPath(camefrom, NodeEnd);
				}
			}
			
			var index = openset.indexOf(current);
			if (index > -1) {
				array.splice(index, 1);
			}
			
			closedset.push(current);
			
			for(var i = 0; i < current.neighbors.length; i++) {
				if(closedset.indexOf(current.neighbors[i]) != -1)
					continue;
				var neighbor = pathfinding.Nodes[current.neighbors[i].node];
				var tentative_g_score = gScore[current.orig] + game.pathFinding.CalculateCost(current, current.neighbors[i]);
			}
			
			//TODO finish this
		}
	}
}