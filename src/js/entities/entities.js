/*------------------- 
a player entity
-------------------------------- */
game.BulletEntity = me.Entity.extend({

    /* -----
    constructor
    ------ */
    init: function(x, y, vx, vy) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {image: "bullet", width: 8, height: 8, spritewidth: 8, spriteheight: 8}]);
		
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(vx, vy);
		this.body.setMaxVelocity(vx, vy); 
		this.body.setFriction (0.3,0); 
		
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
		this.z = 4;
		this.lifetime = 5000;
		
		// define a basic walking animation (using all frames)
        this.renderable.addAnimation("glow",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("glow");
    },
 
    /* -----
    update the bullet pos
    ------ */
    update: function(dt) {
		this.body.vel.x = this.body.accel.x;
		this.body.vel.y = this.body.accel.y;
 
        // check & update player movement
        this.body.update(dt);
		
		me.collision.check(this);
		
		this.lifetime -= dt;
		if(this.lifetime <= 0)
			me.game.world.removeChild(this);
 
        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },
	
	onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

game.PlayerEntity = me.Entity.extend({
	
    /* -----
    constructor
    ------ */
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
		
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
		this.body.setMaxVelocity(5, 15); 
		this.body.setFriction (0.3,0); 
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
		
		// define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 3, 0, 4]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,21,0,20]);
		this.renderable.addAnimation("jump",  [0,7]);
		this.renderable.addAnimation("air",  [29,30]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
		
		this.cooldown = 100;
		this.lastfired = null;
    },
 
    /* -----
    update the player pos
    ------ */
    update: function(dt) {
		
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
			
			if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
			}
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
			this.renderable.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
			
			if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
			}
        } else {
			this.body.vel.x = 0;
			if(this.body.falling) {
				if (!this.renderable.isCurrentAnimation("air")) {
					this.renderable.setCurrentAnimation("air");
				}
			} else {
				if (!this.renderable.isCurrentAnimation("stand")) {
					this.renderable.setCurrentAnimation("stand");
				}
			}
        }
     
		if (me.input.isKeyPressed('jump')) {
			if (!this.renderable.isCurrentAnimation("jump")) {
				this.renderable.setCurrentAnimation("jump");
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
				me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, 20, 0));
				this.lastfired = this.cooldown;
			}
		}
		
		if(this.lastfired != null)
			this.lastfired -= dt;
 
        // check & update player movement
        this.body.update(dt);
		
		me.collision.check(this);
 
        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },
	
	onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

