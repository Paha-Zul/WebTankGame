
/// <reference path="build/phaser.d.ts" />
/// <reference path="main2.ts" />
///<reference path="CPUTankController.ts"/>
///<reference path="MyMath.ts"/>

class Tank{
    cpuController : CPUTankController;

    tankBody : Phaser.Sprite;
    turret : Phaser.Sprite;

    maxSpeed : number;
    currSpeed : number = 0;
    acceleration : number;
    brakeMultiplier : number = 2;
    reloadTime : number;
    lastReload : number;
    rotationSpeed : number;
    turretRotationSpeed : number;

    disToTip : number;

    leader : Tank;
    disToFollow : number;

    constructor(public tankType:string, public game : SimpleGame, public controller : string, public team : number, leader? : Tank){
        this.leader = leader;

        if(tankType == 'light') {
            this.maxSpeed = 400;
            this.acceleration = 5;
            this.disToTip = 30;
            this.reloadTime = 100;
            this.lastReload = 0;
            this.rotationSpeed = 2;
            this.turretRotationSpeed = 5;
        }

        if(controller === 'cpu'){
            this.disToFollow = 50;
            this.cpuController = new CPUTankController(this);
        }

        this.tankBody = this.game.game.add.sprite(this.game.game.world.centerX, this.game.game.world.centerY, 'light_tank');
        this.turret = this.game.game.add.sprite(this.game.game.world.centerX, this.game.game.world.centerY, 'light_tank_turret');
        this.tankBody.anchor.set(0.5, 0.5);
        this.turret.anchor.set(0.5, 0.5);
        this.game.tankGroup.add(this.tankBody);
    }

    update = (delta:number) => {
        this.currSpeed *= 0.99;

        if(this.controller === 'player') {
            this.tankMove();
            this.turretFollowMouse();
            this.turretFire();
        }else if(this.controller === 'cpu' && this.team === 0)
            this.cpuController.update(delta);

        this.tankBody.body.velocity.x = Math.cos(this.tankBody.angle * Math.PI/180)*this.currSpeed;
        this.tankBody.body.velocity.y = Math.sin(this.tankBody.angle * Math.PI/180)*this.currSpeed;

        this.turret.x = this.tankBody.x;
        this.turret.y = this.tankBody.y;

        this.currSpeed = MyMath.bound(this.currSpeed, -this.maxSpeed, this.maxSpeed);
    };

    tankMove = () => {

        if (this.game.cursors.left.isDown || this.game.wasd.A.isDown)
            this.tankBody.angle -= this.rotationSpeed;

        if (this.game.cursors.right.isDown|| this.game.wasd.D.isDown)
            this.tankBody.angle += this.rotationSpeed;

        if (this.game.cursors.up.isDown|| this.game.wasd.W.isDown)
            this.currSpeed += this.acceleration;

        if (this.game.cursors.down.isDown|| this.game.wasd.S.isDown)
            this.currSpeed -= this.acceleration;
    };

    turretFollowMouse = () => {
        var mouseX = this.game.game.input.mousePointer.x;
        var mouseY = this.game.game.input.mousePointer.y;

        this.turret.angle = MyMath.lerp(this.turret.angle, Math.atan2(mouseY - this.turret.y, mouseX - this.turret.x)*180/Math.PI, this.turretRotationSpeed);
    };

    turretFire = () => {
        if(this.game.game.input.activePointer.isDown && this.lastReload + this.reloadTime <= this.game.game.time.now){
            var x = Math.cos(this.turret.angle * Math.PI/180)*this.disToTip + this.turret.x;
            var y = Math.sin(this.turret.angle * Math.PI/180)*this.disToTip + this.turret.y;

            //Try and get a bullet from the pool, otherwise, make a new one.
            var bullet = this.game.bulletGroup.getFirstDead();
            if(bullet === null) {
                bullet = this.game.bulletGroup.create(x, y, 'bullet');
                console.log("Creating new");
            }
            else{
                bullet.revive();
                bullet.reset(x, y);
            }

            bullet.anchor.set(0.5,0.5);
            bullet.angle = this.turret.angle;

            bullet.body.velocity.x = Math.cos(this.turret.angle * Math.PI/180)*1500;
            bullet.body.velocity.y = Math.sin(this.turret.angle * Math.PI/180)*1500;

            bullet.lifespan = 500;

            this.lastReload = this.game.game.time.now;
        }
    };
}
