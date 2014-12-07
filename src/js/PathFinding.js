pathfinding = {};

pathfinding.NavMesh = {
	"Node1":[
						{dest: "Node2", requiresJump: false},
						{dest: "Node6", requiresJump: false}
			],
	"Node2":[
						{dest: "Node1", requiresJump: false},
						{dest: "Node5", requiresJump: false}
			],
	"Node3":[
						{dest: "Node6", requiresJump: false},
						{dest: "Node10", requiresJump: false}
			],
	"Node4":[
						{dest: "Node9", requiresJump: false},
						{dest: "Node5", requiresJump: false}
			],
	"Node5":[
						{dest: "Node2", requiresJump: true},
						{dest: "Node4", requiresJump: false},
						{dest: "Node7", requiresJump: false}
			],
	"Node6":[
						{dest: "Node1", requiresJump: true},
						{dest: "Node3", requiresJump: false},
						{dest: "Node8", requiresJump: false},
			],
	"Node7":[
						{dest: "Node5", requiresJump: false}
			],
	"Node8":[
						{dest: "Node6", requiresJump: false}
			],
	"Node9":[
						{dest: "Node4", requiresJump: true},
						{dest: "Node10", requiresJump: false},
						{dest: "Node11", requiresJump: false},
			],
	"Node10":[
						{dest: "Node3", requiresJump: true},
						{dest: "Node9", requiresJump: false},
						{dest: "Node12", requiresJump: false},
			],
	"Node11":[
						{dest: "Node17", requiresJump: true},
						{dest: "Node14", requiresJump: false},
						{dest: "Node9", requiresJump: false},
			],
	"Node12":[
						{dest: "Node13", requiresJump: true},
						{dest: "Node18", requiresJump: false},
						{dest: "Node10", requiresJump: false},
			],
	"Node13":[
						{dest: "Node12", requiresJump: true},
						{dest: "Node18", requiresJump: false},
						{dest: "Node16", requiresJump: false},
			],
	"Node14":[
						{dest: "Node11", requiresJump: true},
						{dest: "Node17", requiresJump: false},
						{dest: "Node15", requiresJump: false},
			],
	"Node15":[
						{dest: "Node14", requiresJump: false}
			],
	"Node16":[
						{dest: "Node13", requiresJump: false}
			],
	"Node17":[
						{dest: "Node11", requiresJump: true},
						{dest: "Node14", requiresJump: true},
						{dest: "Node21", requiresJump: false},
						{dest: "Node19", requiresJump: false},
			],
	"Node18":[
						{dest: "Node13", requiresJump: true},
						{dest: "Node12", requiresJump: true},
						{dest: "Node20", requiresJump: false},
						{dest: "Node19", requiresJump: false},
			],
	"Node19":[
						{dest: "Node17", requiresJump: false},
						{dest: "Node18", requiresJump: false},
			],
	"Node20":[
						{dest: "Node18", requiresJump: false}
			],
	"Node21":[
						{dest: "Node17", requiresJump: false}
			]
};

/*pathfinding.PlatformAreas = {
	"Platform1"
}*/

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

pathfinding.Astar = function(start_x, start_y, dest) {
	/*closedset = [];
	openset = [];
	camefrom = [];
	
	gScore = {};
	gScore["start"] = 0;
	
	var start_neighbors = [];
	
	
	var NodeStart = {pos: {x: start_x, y: start_y}, neighbors:
	
	fScore = {};
	fScore["start"] := g_score["start"] + game.pathFinding.CalculateCost(start, dest);
	
	while(openset.length > 0) {
		var min = null;
		var current = null;
		for(var i = 0; i < openset.length; i++) {
			if(current == null) {
				current = openset[i];
				min = fScore[openset[i].orig];
			}
			else if (fScore[openset[i].orig] < min) {
				current = openset[i];
				min = fScore[openset[i].orig];
			}
		}
		
		if(current != null) {
			if(current.orig == dest.orig) {
				return GetPath(camefrom, dest);
			}
			
			var index = openset.indexOf(current);
			if (index > -1) {
				array.splice(index, 1);
			}
			
			closedset.push(current);
			
			for(var i = 0; i < current.neighbors.length; i++) {
				if(closedset.indexOf(current.neighbors[i]) != -1)
					continue;
					
				var tentative_g_score = gScore[current.orig] + game.pathFinding.CalculateCost(current, current
			}
		}
	}*/
}