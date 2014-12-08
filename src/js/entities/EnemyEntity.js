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
        this.renderable.addAnimation("die",  [24,25,26,27,28,29,30]);
        this.renderable.addAnimation("jump",  [40,41,42,43,44]);
        this.renderable.addAnimation("air",  [45,46]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.alwaysUpdate = true;

        this.attacking = true;
        this.stunTime = 400;

        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    },

    update: function(dt) {
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
                //TODO
            }
            else if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
                if(!other.owner.invincible)
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
        else if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
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

        this.attacking = true;
        this.stunTime = 400;

        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    }
});