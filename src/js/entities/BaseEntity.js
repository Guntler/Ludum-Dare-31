/**
 * Created by pbpdi_000 on 06/12/2014.
 */
game.BaseEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
        this.body.setMaxVelocity(5, 15);
        this.body.setFriction(0.3, 0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.health = 100;
        this.direction = "right";
    },

    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    },

    hurt: function(val) {
        this.health-=val;
    }
})

