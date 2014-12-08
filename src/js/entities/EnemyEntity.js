game.enemies = {
    skeledoge: {
        name: 'Skeledoge',
        image: "skeleton",
        animation: [2, 3, 4, 5],
        health:300,
        damage: 30,
        stun: true,
        explosiveDmg: 100,
        speedX: 30,
        speedY: 0,
        width: 64,
        height: 64,
        spritewidth: 64,
        spriteheight: 64,
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    },
    catbot: {
        name: 'Catbot',
        image: "catbot",
        animation: [2, 3, 4, 5],
        health:300,
        damage: 30,
        stun: true,
        explosiveDmg: 100,
        speedX: 30,
        speedY: 0,
        width: 64,
        height: 64,
        spritewidth: 64,
        spriteheight: 64,
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    }
};

game.EnemyEntity = game.BaseEntity.extend({
    init: function(x,y,settings) {
        //this._super(me.Entity, 'init', [x+16, y+16, {image: "skeleton", width: 16, height: 32, spritewidth: 64, spriteheight: 64}]);
        this._super(game.BaseEntity, 'init', [x, y, settings]);

        this.renderable.addAnimation("walk",  [8, 9, 10, 11]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,1,2,3]);
        this.renderable.addAnimation("attack",  [16,17,18,19]);
        this.renderable.addAnimation("die",  [24,25,26,27,28,29,30],100);
        this.renderable.addAnimation("jump",  [40,41,42,43,44]);
        this.renderable.addAnimation("air",  [45,46]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.alwaysUpdate = true;

        //this.attacking = true;
        this.stunTime = 400;
		
		
		this.path = null;
		this.currentNode = 0;
		this.nextNode = 1;
		this.pathfindingInterval = 1000;
		this.timeToPathfind = 3000;
		this.doublejumpdelay = 250;
		this.timetodoublej = 500;
		this.arrived = true;
		
		
        this.wait = 20;
        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    },

    update: function(dt) {
        if(this.health<=0) {
            this.switchAnimation("die");
            this.alive = false;
            this.wait--;
            this.renderable.flicker(0);

            if(this.wait<=0) {
                me.game.world.removeChild(this);
				pathfinding.playerEntity.score += 100;
            }
        }

        if(!this.alive) {
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
        }

        if (this.stunnedTime <= 0) {
            this.isHurt = false;
            this.stunnedTime = 0;
        }
        else {
            this.stunnedTime -= dt;
        }

        if (!this.isHurt) {
			
            if (this.timeToPathfind <= 0 || this.arrived) {
                this.path = pathfinding.Astar(this, pathfinding.playerEntity);
                this.timeToPathfind = this.pathfindingInterval;
                this.currentNode = 0;
                this.nextNode = 1;
				if(this.path != null)
					this.arrived = false;
            }
            else this.timeToPathfind -= dt;

            if (this.path != null && this.path.length > 0 && this.nextNode < this.path.length && !(this.arrived)) {
                var neighbors = this.path[this.currentNode].neighbors;
                var needsJump = null;
                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i].node == this.path[this.nextNode].node) {
                        needsJump = neighbors[i].requiresJump;
                    }
                }

                if (this.path[this.nextNode].position.x > this.pos.x) {
					if(this.path[this.nextNode].node == "end" && this.direction == "left") {
						this.arrived = true;
					}
					else {
						this.direction = "right";
						// unflip the sprite
						this.renderable.flipX(false);
						// update the entity velocity
						this.body.vel.x += this.body.accel.x * me.timer.tick;
						if (!this.jumping && !this.falling) {
							this.switchAnimation("walk");
						}
					}
                }
                else if (this.path[this.nextNode].position.x < this.pos.x) {
					if(this.path[this.nextNode].node == "end" && this.direction == "right") {
						this.arrived = true;
					}
					else {
						this.direction = "left";
						// flip the sprite on horizontal axis
						this.renderable.flipX(true);
						// update the entity velocity
						this.body.vel.x -= this.body.accel.x * me.timer.tick;

						if (!this.jumping && !this.falling) {
							this.switchAnimation("walk");
						}
					}
                }

                if (needsJump) {
                    if (!this.body.jumping && !this.body.falling) {
                        this.switchAnimation("jump");

                        this.body.doubleJump = false;
                        // set current vel to the maximum defined value
                        // gravity will then do the rest
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        // set the jumping flag
                        this.body.jumping = true;
						this.timetodoublej = this.doublejumpdelay;
                    }
                    else if ((this.body.jumping || this.body.falling) && !this.body.doubleJump && this.timetodoublej < 0) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        this.body.doubleJump = true;
                    }
                }
            }
        }
		
		this.timetodoublej -= dt;
        // check & update player movement
        this.body.update(dt);

        me.collision.check(this);

        if(this.body.vel.y != 0)
            this.switchAnimation("air");
        else {
            if(this.attacking) {
                this.switchAnimation("attack");
            }
        }

        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },

    onCollision : function (response, other) {
        if(other.body.setCollisionType === me.collision.types.PROJECTILE_OBJECT) {
            if(other.owner.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
                return false;
            }
            else if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
                var kbMultiplier = 0;
                var stunMultiplier = 1;
                if (response.overlapV.x > 0) {
                    kbMultiplier=-1;
                }
                else if (response.overlapV.x < 0) {
                    kbMultiplier=1;
                }
                this.body.vel.x = kbMultiplier*500;
                this.body.vel.y = -5;
                this.stunnedTime = stunMultiplier*400;
                this.renderable.flicker(this.stunnedTime);
                this.isHurt = true;
                this.hurt(20);
                return false;
            }
        }
        else if(other.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
            if(other.direction == "left" && other.attacking &&
                other.renderable.getCurrentAnimationFrame()==1||other.renderable.getCurrentAnimationFrame()==2) {
                kbMultiplier=-1;
            }
            return false;
        }
        else if(other.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
            return false;
        }
        else if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
			if(other.node != undefined && other.node != null && this.path != null && other.node == this.path[this.nextNode].node) {
				this.nextNode++;
				this.currentNode++;
			}
	
            return false;
        }
        else {return true;}
    }
});

game.CatbotEntity = game.EnemyEntity.extend({
    init: function(x,y,settings) {
        //this._super(me.Entity, 'init', [x+16, y+16, {image: "skeleton", width: 16, height: 32, spritewidth: 64, spriteheight: 64}]);
        this._super(game.EnemyEntity, 'init', [x, y, settings]);
        this.renderable.addAnimation("walk",  [8, 9, 10, 11]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,1,2,3,4,5]);
        this.renderable.addAnimation("attack",  [9,10,11,12,13,14]);
        this.renderable.addAnimation("walk",  [18,19,20,21,22,23]);
        this.renderable.addAnimation("die",  [63,64,65,66,67,68,69,70,71]);
        this.renderable.addAnimation("air",  [40,41]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.alwaysUpdate = true;

        this.attacking = false;
        this.stunTime = 400;

        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    }
});