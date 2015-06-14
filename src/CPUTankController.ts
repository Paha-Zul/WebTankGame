///<reference path="Tank.ts"/>
///<reference path="MyMath.ts"/>

class CPUTankController{
    targetSpeed:number;
    targetLastPos:Phaser.Point = null;
    disToTarget:number;

    constructor(public tank : Tank){

    }

    update(delta:number){

        this.disToTarget = this.getDisToTarget(this.tank.leader.tankBody.position);
        this.getTargetSpeed(delta, this.tank.leader.tankBody.position);
        this.tankCPUMove(this.tank.leader.tankBody.position, delta);
        this.tankCPURotate(this.tank.leader.tankBody.position);
        this.tankCPUAimTurret(this.tank.leader);
    }

    getDisToTarget = (targetPoint:Phaser.Point):number => {
        return this.tank.tankBody.position.distance(targetPoint);
    };

    getTargetSpeed = (delta:number, targetPoint:Phaser.Point) => {
        if(this.targetLastPos === null) this.targetLastPos = targetPoint;
        else {
            this.targetSpeed = targetPoint.distance(this.targetLastPos);
            this.targetLastPos = new Phaser.Point(targetPoint.x, targetPoint.y);
        }
    };

    tankCPUMove = (target:Phaser.Point, delta:number) => {
        var angleToTarget = Math.atan2(target.y - this.tank.tankBody.y, target.x - this.tank.tankBody.x)*180/Math.PI;
        var myAngle = this.tank.tankBody.angle;

        var offset:number = angleToTarget - myAngle;
        if(offset <= -180) offset += 360;
        if(offset > 180) offset -= 360;

        var scale = ((90 - Math.abs(offset))/180)/0.5;

        //if(this.tankBody.position.distance(target) <= this.disToFollow)
        //    this.currSpeed = this.leader.currSpeed;

        var timeToStop = Math.abs(this.tank.currSpeed/(this.tank.acceleration*this.tank.brakeMultiplier*delta));
        var dis = target.distance(this.tank.tankBody.position);

        //If we are within range of stopping, match the target speed.
        if(timeToStop*this.tank.currSpeed < dis)
            this.tank.desiredSpeed = this.targetSpeed;
        //If we are outside of stopping range, accelerate.
        else
            this.tank.desiredSpeed = this.tank.maxSpeed;

        console.log("desired: "+this.tank.desiredSpeed+", targetSPeed: "+this.targetSpeed);

        //Negative
        if(this.tank.desiredSpeed <= 0){
            //We are reversing faster than we need to.
            if(this.tank.currSpeed < this.tank.desiredSpeed)
                //Hit the brakes.
                this.tank.currSpeed += this.tank.acceleration*this.tank.brakeMultiplier*scale;
            //We need to reverse faster
            else
                //Accelerate in reverse
                this.tank.currSpeed -= this.tank.acceleration
        //Positive
        }else{
            //We are driving faster than we need to.
            if(this.tank.currSpeed > this.tank.desiredSpeed)
                //Hit the brakes.
                this.tank.currSpeed += this.tank.acceleration*this.tank.brakeMultiplier*scale;
            //We are driving slower than we should.
            else
                //Accelerate forward
                this.tank.currSpeed -= this.tank.acceleration
        }

        //console.log("angleToTarget: "+angleToTarget+", myAngle: "+myAngle+", offset: "+offset+", scale: "+scale+" currSpeed: "+this.currSpeed);
    };

    tankCPUAimTurret = (target:Tank) => {
        var angle = Math.atan2(target.tankBody.y - this.tank.tankBody.y, target.tankBody.x - this.tank.tankBody.x)*180/Math.PI;
        //console.log("Angle: "+angle);
        this.tank.turret.angle = MyMath.lerp(this.tank.turret.angle, angle, this.tank.turretRotationSpeed);
    };

    tankCPURotate = (target:Phaser.Point) => {
        var angleToTarget = Math.atan2(target.y - this.tank.tankBody.y, target.x - this.tank.tankBody.x)*180/Math.PI;
        var myAngle = this.tank.tankBody.angle;

        var offset = angleToTarget - myAngle;
        if (offset <= -180) offset += 360;
        if (offset > 180) offset -= 360;

        //Reverse the tank if we are closer to that.
        //if(offset < -90 || offset > 90)
            //angleToTarget = MyMath.normalize(angleToTarget+180);

        this.tank.tankBody.angle = MyMath.lerp(myAngle, angleToTarget, this.tank.rotationSpeed);
    };
}
