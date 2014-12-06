/*------------------- 
a player entity
-------------------------------- */
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
		
		//this.body.addShape(new me.Rect(5,12,16,32));
		//this.body.removeShape(0);
		//console.log(this.body.shapes);
		/*this.direction = 'stand2';
		this.addAnimation("run", [0,1,2,3,4,5,6,7,8,9]);
		this.addAnimation("stand", [33]);
		this.addAnimation("stand2", [44]);
		this.addAnimation("jump", [29,29,29,29,29,29,29,29,27,27]);
		this.addAnimation("jump2", [26,27,27,27,29,29,27,27,26]);
		this.updateColRect(23, 18, 4, 60);*/
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