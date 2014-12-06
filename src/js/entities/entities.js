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
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
		
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
            this.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else {
         this.body.vel.x = 0;
        }
     
        if (me.input.isKeyPressed('jump')) {
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
 
        // update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y!=0) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
     
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
});