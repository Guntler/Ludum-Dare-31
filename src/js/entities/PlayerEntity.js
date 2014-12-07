game.PlayerEntity = game.BaseEntity.extend({
	
    /* -----
    constructor
    ------ */
    init: function(x, y, settings) {
        // call the constructor
        this._super(game.BaseEntity, 'init', [x, y, settings]);
		
		// define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 3, 0, 4]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,21,0,20]);
		this.renderable.addAnimation("jump",  [0,7]);
		this.renderable.addAnimation("air",  [29,30]);
		this.renderable.addAnimation("standhold",  [70,71,72,73,74,75,76,77]);
		this.renderable.addAnimation("standshoot",  [80,81,82,83,84,85,86,87],100);
		this.renderable.addAnimation("walkhold",  [90,91,92,93,94,95,96,97]);
		this.renderable.addAnimation("walkshoot",  [100,101,102,103,104,105,106,107],100);
		this.renderable.addAnimation("jumphold",  [110,111,112,113]);
		this.renderable.addAnimation("airhold",  [114,115]);
		this.renderable.addAnimation("airshoot",  [125,124],100);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

		//this.body.addShape(new me.Rect(5,12,16,32));
		//this.updateColRect(23, 18, 4, 60);
		this.body.setCollisionType = me.collision.types.PLAYER_OBJECT;
		this.shooting = false;

		this.currentWep = null;
		this.cooldown = 100;
		this.lastfired = null;
    },

	equipWep: function(weapon) {
		this.currentWep = weapon;
	},

	onCollision : function (response, other) {
		if (other.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
			//this.pos.x -= 5;
			//this.pos.y -= 5;
			//console.log("Collided with enemy.");
			return true;
		}
		else if (other.body.setCollisionType === me.collision.types.COLLECTABLE_OBJECT) {
			other.open(this);
			//console.log("Collided with collectable.");
		}
		else if (other.body.setCollisionType === me.collision.types.PROJECTILE_OBJECT) {
			if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
				return false;
			}
			else {
				return true;
			}
		}
		return true;
	},
 
    /* -----
    update the player pos
    ------ */
    update: function(dt) {
		
        if (me.input.isKeyPressed('left')) {
			this.direction = "left";
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

			if(this.shooting) {
				if (!this.renderable.isCurrentAnimation("walkshoot")) {
					this.renderable.setAnimationFrame();
					this.renderable.setCurrentAnimation("walkshoot");
				}
			} else {
				if(this.currentWeapon==null) {
					if (!this.renderable.isCurrentAnimation("walkhold")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("walkhold");
					}
				} else {
					if (!this.renderable.isCurrentAnimation("walk")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("walk");
					}
				}
			}
        } else if (me.input.isKeyPressed('right')) {
			this.direction = "right";
            // unflip the sprite
			this.renderable.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;

			if(this.shooting) {
				if (!this.renderable.isCurrentAnimation("walkshoot")) {
					this.renderable.setAnimationFrame();
					this.renderable.setCurrentAnimation("walkshoot");
				}
			} else {
				if(this.currentWeapon==null) {
					if (!this.renderable.isCurrentAnimation("walkhold")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("walkhold");
					}
				} else {
					if (!this.renderable.isCurrentAnimation("walk")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("walk");
					}
				}
			}
        } else {
			this.body.vel.x = 0;
			if(this.body.falling) {
				if(this.shooting) {
					if (!this.renderable.isCurrentAnimation("airshoot")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("airshoot");
					}
				} else {
					if(this.currentWeapon==null) {
						if (!this.renderable.isCurrentAnimation("airhold")) {
							this.renderable.setAnimationFrame();
							this.renderable.setCurrentAnimation("airhold");
						}
					} else {
						if (!this.renderable.isCurrentAnimation("air")) {
							this.renderable.setAnimationFrame();
							this.renderable.setCurrentAnimation("air");
						}
					}
				}
			} else {
				if(this.shooting) {
					if (!this.renderable.isCurrentAnimation("standshoot")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("standshoot");
					}
				} else {
					if(this.currentWeapon==null) {
						if (!this.renderable.isCurrentAnimation("standhold")) {
							this.renderable.setAnimationFrame();
							this.renderable.setCurrentAnimation("standhold");
						}
					} else {
						if (!this.renderable.isCurrentAnimation("stand")) {
							this.renderable.setAnimationFrame();
							this.renderable.setCurrentAnimation("stand");
						}
					}
				}
			}
        }
     
		if (me.input.isKeyPressed('jump')) {
			if(this.shooting) {
				if (!this.renderable.isCurrentAnimation("airshoot")) {
					this.renderable.setAnimationFrame();
					this.renderable.setCurrentAnimation("airshoot");
				}
			} else {
				if(this.currentWeapon==null) {
					if (!this.renderable.isCurrentAnimation("jumphold")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("jumphold");
					}
				} else {
					if (!this.renderable.isCurrentAnimation("jump")) {
						this.renderable.setAnimationFrame();
						this.renderable.setCurrentAnimation("jump");
					}
				}
			}
			// make sure we are not already jumping or falling
			if (!this.body.jumping && !this.body.falling) {
				this.body.doubleJump = false;
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.body.jumping = true;
			}
			else if((this.body.jumping || this.body.falling) && !this.body.doubleJump) {
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				this.body.doubleJump = true;
			}
		}
		
		if(me.input.isKeyPressed('shoot')) {
			if(this.lastfired == null || this.lastfired <= 0) {
				if(this.direction=="right")
					me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
				else
					me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
				this.lastfired = this.cooldown;
				this.shooting = true;
			}
		}
		
		if(this.lastfired != null)
			this.lastfired -= dt;

		if(this.lastfired<=0) {
			this.shooting = false;
		}
 
        // check & update player movement
        this.body.update(dt);
		
		me.collision.check(this);
 
        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    }
});

