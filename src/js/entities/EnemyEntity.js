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
        width: 8,
        height: 8,
        spritewidth: 8,
        spriteheight: 8,
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    }
};

game.EnemyEntity = game.BaseEntity.extend({
    init: function(x,y) {
        this._super(game.BaseEntity, 'init', [x, y, settings]);
    }
});