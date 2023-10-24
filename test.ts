// Hier kann man Tests durchführen; diese Datei wird nicht kompiliert, wenn dieses Paket als Erweiterung verwendet wird.
sonnenbogen.init(DigitalPin.P0, 10, 255,5,197)
basic.forever(function () {
    sonnenbogen.setBrightnessOfTheSun(50)
    serial.writeLine("sun is moving, color white...")
    sonnenbogen.moveSunAutomatically(200)
    basic.pause(5000)

    serial.writeLine("sun is changing direction")
    sonnenbogen.changeDirection()
    basic.pause(5000)

    serial.writeLine("sun is moving slower, color white...")
    sonnenbogen.moveSunAutomatically(100)
    basic.pause(5000)

    serial.writeLine("sun is starting at the 150th led")
    sonnenbogen.setSunPosition(150);
    basic.pause(5000)

    serial.writeLine("sun has a red color")
    sonnenbogen.setSunColor(Colors.Red)
    basic.pause(5000)

    serial.writeLine("sun stops")
    sonnenbogen.stopSun()
    basic.pause(5000)

    serial.writeLine("sun moves one step")
    sonnenbogen.moveSunOneStep()
    basic.pause(5000)

    serial.writeLine("sun moves automatically, faster than before")
    sonnenbogen.moveSunAutomatically(10)
    basic.pause(5000)

    serial.writeLine("brightness is reduced")
    sonnenbogen.setBrightnessOfTheSun(50)
    basic.pause(5000)

    serial.writeLine("color changes to white")
    sonnenbogen.setSunColor(Colors.White)
    basic.pause(5000)
    
    serial.writeLine("enable clouds")
    sonnenbogen.enableClouds()
    basic.pause(5000)

    serial.writeLine("disable clouds")
    sonnenbogen.disableClouds()
    basic.pause(5000)

    serial.writeLine("set sun position to 0")
    sonnenbogen.setSunPosition(0);
    basic.pause(5000)

    serial.writeLine("disable sun")
    sonnenbogen.disableSun();
    basic.pause(5000)

    serial.writeLine("enable sun")
    sonnenbogen.enableSun()
    basic.pause(5000)
})
