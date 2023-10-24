
/**
* Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
* Weitere Informationen unter https://makecode.microbit.org/blocks/custom
*/
let strip: neopixel.Strip;

enum direction {
    fwd = 1,
    rwd = 0
};

class Sun {
    sunPositionHead: number;
    sunPositionHeadBefore: number;
    numberOfLEDs: number;
    sunSize: number;
    sunDelayInMillis: number;
    intervalID: number;
    brightnessOfSun: number;
    simulateClouds: boolean;
    directionOfSun: direction;

    sunColoring: Colors;

    numberOfLEDsOneStrip: number;
    numberOfParallelStripes: number;

    constructor(pin: DigitalPin, sunPositionHead: number, sunSize: number, brightnessOfSun: number, numberOfParallelStripes: number, numberOfLEDsOneStrip:number ) {
        this.sunPositionHead = sunPositionHead;
        this.sunPositionHeadBefore = sunPositionHead;
        this.sunSize = sunSize;
        this.numberOfLEDsOneStrip = numberOfLEDsOneStrip;
        this.numberOfParallelStripes = numberOfParallelStripes;
        this.numberOfLEDs = this.numberOfLEDsOneStrip * this.numberOfParallelStripes;
        this.sunColoring = Colors.White;
        this.brightnessOfSun = brightnessOfSun;
        this.simulateClouds = false;
        this.sunDelayInMillis = 50;
        this.directionOfSun = direction.fwd;
    }

    moveSunOneStep() {
        if (this.directionOfSun === direction.fwd) {
            this.incrementSunPositionHead();
        } else {
            this.decrementSunPositionHead();
        }
        this.updateSun();
    }

    updateSun() {
        for (let stripeNumber = 0; stripeNumber < this.numberOfParallelStripes; stripeNumber++) {
            if (this.directionOfSun === direction.fwd) {
                for (let sunPixels = 0; sunPixels < this.sunSize; sunPixels++) {
                    let px: number;
                    let pxBefore: number;
                    px = this.sunPositionHead - sunPixels;
                    pxBefore = this.sunPositionHeadBefore - sunPixels;
                    this.clearLEDDevidedStripe(pxBefore, stripeNumber);
                    this.setLEDDevidedStripe(px, stripeNumber);
                }
            } else {
                for (let sunPixels = this.sunSize - 1; sunPixels >= 0; sunPixels--) {
                    let px: number;
                    let pxBefore: number;
                    px = this.sunPositionHead - sunPixels;
                    pxBefore = this.sunPositionHeadBefore - sunPixels;
                    this.clearLEDDevidedStripe(pxBefore, stripeNumber);
                    this.setLEDDevidedStripe(px, stripeNumber);
                }
            }
        }
        strip.show();
    }

    stopSun() {
        control.clearInterval(this.intervalID, control.IntervalMode.Interval);
    }

    resumeSun() {
        this.moveSunAutomatically(this.sunDelayInMillis);
    }

    setBrightnessOfSun(brightnessOfSun: number) {
        if (brightnessOfSun > 255) {
            brightnessOfSun = 255;
        }
        if (brightnessOfSun < 0) {
            brightnessOfSun = 0;
        }
        this.brightnessOfSun = brightnessOfSun;
        strip.setBrightness(this.brightnessOfSun);
        this.updateSun();
    }

    moveSunAutomatically(delayInMillis: number) {
        this.sunDelayInMillis = delayInMillis;
        control.clearInterval(this.intervalID, control.IntervalMode.Interval);
        this.intervalID = control.setInterval(() => {
            this.moveSunOneStep();
        }, delayInMillis, control.IntervalMode.Interval)
    }

    setSunColoring(color: Colors) {
        this.sunColoring = color;
        this.updateSun();
    }

    getPositionHead(){
        return this.sunPositionHead;
    }

    private incrementSunPositionHead(): void {
        this.sunPositionHeadBefore = this.sunPositionHead;
        if (this.sunPositionHead < (this.numberOfLEDsOneStrip + this.sunSize - 1)) {
            this.sunPositionHead = this.sunPositionHead + 1;
        } else {
            this.sunPositionHead = 0;
        }
    }

    private decrementSunPositionHead(): void {
        this.sunPositionHeadBefore = this.sunPositionHead;
        if (this.sunPositionHead > (0 - this.sunSize + 1)) {
            this.sunPositionHead = this.sunPositionHead - 1;
        } else {
            this.sunPositionHead = this.numberOfLEDsOneStrip + this.sunSize;
        }
    }

    private setLED(index: number): void {
        strip.setPixelColor(index, this.sunColoring);
        if (this.simulateClouds) {
            let brightnessRandom = Math.randomRange(0, this.brightnessOfSun);
            strip.setBrightness(brightnessRandom);
            strip.setPixelWhiteLED(index, brightnessRandom);
        } else {
            strip.setBrightness(this.brightnessOfSun);
            strip.setPixelWhiteLED(index, this.brightnessOfSun);
        }
    }

    private clearLED(index: number): void {
        strip.setPixelColor(index, Colors.Black);
        strip.setPixelWhiteLED(index, 0);
    }

    private isInRange(indexLED: number, stripeNumber: number): boolean {
        let rangeOK: boolean;
        rangeOK = true;

        if (indexLED >= this.numberOfLEDsOneStrip * (stripeNumber + 1)) {
            rangeOK = false;
        }

        if (indexLED < this.numberOfLEDsOneStrip * stripeNumber) {
            rangeOK = false;
        }
        return rangeOK;
    }

    private setLEDDevidedStripe(indexLED: number, stripeNumber: number) {
        indexLED = this.getIndexOfParallelLED(indexLED, stripeNumber);
        if (this.isInRange(indexLED, stripeNumber)) {
            this.setLED(indexLED);
        }
    }

    private clearLEDDevidedStripe(indexLED: number, stripeNumber: number) {
        indexLED = this.getIndexOfParallelLED(indexLED, stripeNumber);
        if (this.isInRange(indexLED, stripeNumber)) {
            this.clearLED(indexLED);
        }
    }

    private isOdd(n: number): boolean {
        return Math.abs(n % 2) == 1;
    }

    getIndexOfParallelLED(indexLED: number, stripeNumber: number): number {
        let indexOfParallelLED;
        if (this.isOdd(stripeNumber)) {
            //ungerade 1 3 5
            indexOfParallelLED = ((stripeNumber + 1) * this.numberOfLEDsOneStrip - 1) - indexLED;
        } else {
            //gerade 0 2 4
            indexOfParallelLED = stripeNumber * this.numberOfLEDsOneStrip + indexLED;
        }
        return indexOfParallelLED;
    }
}

enum Colors {
    //% block=rot
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=gelb
    Yellow = 0xFFFF00,
    //% block=grün
    Green = 0x00FF00,
    //% block=blau
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violett
    Violet = 0x8a2be2,
    //% block=rosarot
    Purple = 0xFF00FF,
    //% block=weiss
    White = 0xFFFFFF,
    //% block=warmweiss
    Black = 0x000000
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="\uf185"
//% groups=['start', 'automatic movement', 'manual movement', 'manual changes']
namespace sonnenbogen {
    let mysun: Sun;
    /**
     * initializes the LED- stripe
     * @param pin Pin
     * @param sunSize Sun size
     * @param brightnessOfSun Brightness of sun
     */
    //% block="activate sun on $pin, sun is $sunSize LEDs wide, $brightnessOfSun bright, $numberOfParallelStripes parallel stripes, $numberOfLEDsOneStrip per stripe"
    //% sunSize.defl=5 sunSize.min=1 sunSize.max=30
    //% numberOfParallelStripes.defl=5 numberOfParallelStripes.min=1 numberOfParallelStripes.max=7
    //% numberOfLEDsOneStrip.defl=197 numberOfLEDsOneStrip.min=100 numberOfLEDsOneStrip.max=250
    //% brightnessOfSun.defl=255 brightnessOfSun.min=0 brightnessOfSun.max=255
    //% group="start"
    //% weight=100
    export function init(pin: DigitalPin, sunSize: number, brightnessOfSun: number, numberOfParallelStripes: number, numberOfLEDsOneStrip:number): void {
        mysun = new Sun(pin, 0, sunSize, brightnessOfSun, numberOfParallelStripes, numberOfLEDsOneStrip);
        strip = neopixel.create(pin, mysun.numberOfLEDs, NeoPixelMode.RGBW);
        strip.show();
    }

    /**
    * moves the sun automatically
    * @param delayInMillis Delay time
    */
    //% block="move sun automatically with delays of $delayInMillis ms"
    //% delayInMillis.min=0 delayInMillis.max=2000 delayInMillis.defl=100
    //% group="automatic movement"
    //% weight=90
    export function moveSunAutomatically(delayInMillis: number): void {
        mysun.moveSunAutomatically(delayInMillis);
    }

    /**
    * stops the sun movement
    */
    //% block="stop sun movement"
    //% group="manual movement"
    //% weight=100
    export function stopSun(): void {
        mysun.stopSun();
    }

    /**
    * stops the sun movement and disables the sun
    */
    //% block="disable sun"
    //% group="manual changes"
    //% weight=90
    export function disableSun(): void {
        mysun.stopSun();
        mysun.setBrightnessOfSun(0);
        strip.show();
    }

    /**
    * enables the sun
    */
    //% block="enable sun"
    //% group="manual changes"
    //% weight=80
    export function enableSun(): void {
        mysun.setBrightnessOfSun(255);
        mysun.resumeSun();
    }

    /**
    * moves the sun one step
    */
    //% block="move sun one step forward"
    //% group="manual movement"
    //% weight=70
    export function moveSunOneStep(): void {
        mysun.moveSunOneStep();
    }

    /**
    * sets the sun position
    * @param sunPositionHead sun position
    */
    //% block="set sun position to %sunPositionHead"
    //% group="manual changes"
    //% weight=60
    export function setSunPosition(sunPositionHead: number): void {
        mysun.sunPositionHead = sunPositionHead;
        mysun.sunPositionHeadBefore = sunPositionHead;
        strip.clear();
        mysun.updateSun();
    }

    /**
    * changes the coloring of the sun
    * @param color Color
    */
    //% block="change coloring of the sun to %color"
    //% group="manual changes"
    //% weight=50
    export function setSunColor(color: Colors): void {
        mysun.setSunColoring(color);
    }

    /**
    * changes the brightness of the sun
    * @param brightnessOfSun Brightness of Sun
    */
    //% block="change bightness of the sun to %brightnessOfSun"
    //% brightnessOfSun.defl=255 brightnessOfSun.min=0 brightnessOfSun.max=255
    //% group="manual changes"
    //% weight=40
    export function setBrightnessOfTheSun(brightnessOfSun: number): void {
        mysun.setBrightnessOfSun(brightnessOfSun);
    }

    /**
    * simulates cloudy weather
    */
    //% block="simulate cloudy weather"
    //% group="manual changes"
    //% weight=30
    export function enableClouds(): void {
        mysun.simulateClouds = true;
    }

    /**
    * simulates cloudy weather
    */
    //% block="disable cloudy weather"
    //% group="manual changes"
    //% weight=20
    export function disableClouds(): void {
        mysun.simulateClouds = false;
    }

    /**
    * changes the direction of movement
    */
    //% block="change direction of movement"
    //% group="manual changes"
    //% weight=10
    export function changeDirection(): void {
        if (mysun.directionOfSun === direction.fwd) {
            mysun.directionOfSun = direction.rwd;
        } else {
            mysun.directionOfSun = direction.fwd;
        }
    }

    /**
        * gets the position of the sun
        */
    //% block="get sun position"
    //% group="manual movement"
    //% weight=5
    export function getPositionHead(): number{
        return mysun.getPositionHead();
    }
}
