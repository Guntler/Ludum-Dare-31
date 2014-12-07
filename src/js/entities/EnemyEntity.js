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
    }
};

game.EnemyEntity = game.BaseEntity.extend({
    init: function(x,y,settings) {
        //this._super(me.Entity, 'init', [x+16, y+16, {image: "skeleton", width: 16, height: 32, spritewidth: 64, spriteheight: 64}]);
        this._super(game.BaseEntity, 'init', [x, y, settings]);

        this.renderable.addAnimation("walk",  [7, 8, 9, 10]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,1,2,3]);
        this.renderable.addAnimation("attack",  [14,15,16,17]);
        this.renderable.addAnimation("die",  [21,22,23,24,25,26,27]);
        this.renderable.addAnimation("jump",  [35,36,37,38]);
        this.renderable.addAnimation("air",  [39,40,41]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.alwaysUpdate = true;

        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    },

    update: function(dt) {
        // check & update player movement
        this.body.update(dt);

        me.collision.check(this);


        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },

    onCollision : function (response, other) {
        if(other.body.setCollisionType === me.collision.types.PROJECTILE_OBJECT) {
            if(other.owner.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
                //TODO
            }
            else if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
                return false;
            }
        }
        else if(other.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
            return false;
        }
        else {return true;}
    }
});