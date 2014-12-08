/**
 * Created by pbpdi_000 on 06/12/2014.
 */
game.SpawnerEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function (x, y, settings) {
        // call the constructor

        this.id = settings.id;
        this.interval = settings.interval;
        this.spawned = 0;
        this.amtAlive = 0;
        this.max = settings.max;
        this.maxATime = settings.maxATime;
        this._super(me.Entity, 'init', [x, y, settings]);

        this.body.setCollisionType = me.collision.types.NO_OBJECT;

        // ensure the player is updated even when outside of the viewport
        this.exhausted = false;
        this.elapsed = 0;
    },

    onCollision : function (response, other) {
        return false;
    },

    spawn: function(enemy) {
        me.game.world.addChild(new me.pool.pull("enemy", this.pos.x, this.pos.y-32, this, "catbot"));
        this.elapsed = this.interval;
        this.spawned++;
        this.amtAlive++;
    },

    update: function(dt) {
        if(this.elapsed <= 0 && !this.exhausted && this.amtAlive<this.maxATime) {
            this.spawn(null);
        }
        else {
            this.elapsed -= dt;
        }

        if(this.spawned == this.max) {
            this.exhausted = true;
        }
    }
});