/**
 * Created by Paha on 6/4/2015.
 */


/// <reference path="build/phaser.d.ts" />
/// <reference path="Tank.ts" />

class SimpleGame {


    constructor() {
        this.game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    game: Phaser.Game;
    gameWidth:number = 800;
    gameHeight:number = 600;
    tank : Tank;
    otherTank : Tank;
    public cursors;
    public tankGroup;
    public bulletGroup;
    wasd : WASD;

    preload() {
        //this.game.load.image('logo', 'phaser2.png');
        this.game.load.image('light_tank', 'light_tank.png');
        this.game.load.image('light_tank_turret', 'light_tank_turret.png');
        this.game.load.image('bullet', 'bullet.png');
    }

    create = () => {
        //var logo = this.game.add.tankBody(this.game.world.centerX, this.game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var bmd = this.game.add.bitmapData(this.gameWidth, this.gameHeight);

        console.log("width/height: "+this.gameWidth+"/"+this.gameHeight);

        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        bmd.ctx.fillStyle = '#aaaaaa';
        bmd.ctx.fill();

        var screen = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, bmd);
        screen.anchor.set(0.5, 0.5);

        this.tankGroup = this.game.add.group();
        this.tankGroup.enableBody = true;
        this.tankGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup = this.game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this.tank = new Tank("light", this, "player", 0);
        this.otherTank = new Tank("light", this, "cpu", 0, this.tank);

        //this.tankGroup.add(otherTank);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.wasd = new WASD(this);

    }

    update = () => {
        this.tank.update(this.game.time.physicsElapsedMS);
        this.otherTank.update(this.game.time.physicsElapsedMS);

    }

}

class WASD{
    W;
    A;
    S;
    D;

    constructor(game : SimpleGame){
        this.W = game.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.A = game.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.S = game.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.D = game.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
