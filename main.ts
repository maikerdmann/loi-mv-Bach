

namespace LOI_MV {
    /**
     * Test-Funktion
     */
    //% blockId=loimvUltraschall
    //% block="ultraschall"
    export function ultraschall(): number {
        return sonar.ping(DigitalPin.P8, DigitalPin.P9, PingUnit.Centimeters)
    }
    /**
     * Steuert die Antriebsmotoren mit den Parametern "Power" und "Lenkung".
     * Power gibt die Kraft von -10 bis 10 an, wobei negative Werte den Rückwärtsgang bedeuten
     * Lenkung lässt die Motoren auf auf beiden Seiten unterschiedlich schnell bewegen, um eine Drehung des Roboters zu erzeugen. 
     * -10 ist links, 0 gerade aus und 10 rechts
     */
    //% blockId=loimvAntrieb
    //% block="antrieb %power"
    //% power.min=-10 power.max=10
    //% lenkung.min=-10 lenkung.max=10
    export function antrieb(power: number, lenkung: number): void {
        let speedL //Geschwindigkeit der linken Motoren
        let speedR //Geschwindigkeit der rechten Motoren 
        const motorMin = 200
        if (lenkung < 0) {
            speedR = power
            speedL = power + 2 * power / 10 * lenkung
        } else if (lenkung > 0) {
            speedL = power
            speedR = power + 2 * power / 10 * lenkung
        } else {
            speedL = speedR = power
        }

        if (speedL > 0) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P1, Math.map(speedL, 0, 10, motorMin, 1023))
        } else if (speedL < 0) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P12, 1)
            pins.analogWritePin(AnalogPin.P1, Math.map(speedL, 0, -10, motorMin, 1023))
        } else {
            pins.analogWritePin(AnalogPin.P1, 0)
        }

        if (speedR > 0) {
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P2, Math.map(speedR, 0, 10, motorMin, 1023))
        } else if (speedR < 0) {
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.analogWritePin(AnalogPin.P2, Math.map(speedR, 0, -10, motorMin, 1023))
        } else {
            pins.analogWritePin(AnalogPin.P2, 0)
        }
    }
    /**
     * Gibt des Wert des rechten Helligkeitssensors aus
     */
    //% blockId=loimvHelligkeitRechts
    //% block="helligkeitRechts"
    export function helligkeitRechts(): number {
        return pins.digitalReadPin(DigitalPin.P7)
    }

    /**
     * Gibt des Wert des linken Helligkeitssensors aus
     */
    //% blockId=loimvHelligkeitLinks
    //% block="helligkeitLinks"
    export function helligkeitLinks(): number {
        return pins.digitalReadPin(DigitalPin.P6)
    }
}