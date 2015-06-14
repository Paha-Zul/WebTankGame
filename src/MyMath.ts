/**
 * Created by Paha on 6/6/2015.
 */

class MyMath{

    /**
     * Lerps between the currRotation and targetRotation at the rotationSpeed.
     * @param currRotation The current rotation to start at.
     * @param targetRotation The target rotation to towards to.
     * @param rotationSpeed The speed to rotate.
     * @returns {number} The rotation after the lerp.
     */
    static lerp(currRotation:number, targetRotation:number, rotationSpeed:number):number{
        var offset:number = MyMath.normalize(targetRotation - currRotation);

        if(offset < 1 && offset > - 1)
            return targetRotation;

        if (offset >= 0) currRotation += rotationSpeed;
        if (offset < 0) currRotation -= rotationSpeed;

        currRotation = MyMath.normalize(currRotation);
        return currRotation;
    }

    /**
     * Normalizes an angle between 180 and -180
     * @param rotation The rotation to normalize.
     * @returns {number} The normalized angle.
     */
    static normalize(rotation:number){
        if (rotation <= -180) rotation += 360;
        if (rotation > 180) rotation -= 360;
        return rotation;
    }

    /**
     * Keeps a value between two bounds.
     * @param value The value to  bound.
     * @param min The minimum the value can be.
     * @param max The maximum the value can be.
     * @returns {number} The bounded value.
     */
    static bound(value:number, min:number, max:number){
        if(value >= max) value = max;
        else if(value <= min) value = min;
        return value;
    }
}
