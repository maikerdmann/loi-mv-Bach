namespace LOI_MV {
    
    export let ultra_values: number[] = []
    export let ultra_values_w0: number[] = []
    
    
    /**
     * Test-Funktion
     */
    //% blockId=loimvUltraschall
    //% block="ultraschall"
    export function ultraschall(): number {
        let num = ultra_values[0]
        return num
    }
    
    export function ultraschall_w0(): number {
        let num = ultra_values_w0[0]
        return num
    }
    
    export function ultraschall_ma(): number {
        let num = ultra_ma_values[0]
        return num
    }
    
    export function ultraschall_wma(): number {
        let num = ultra_wma_values[0]
        return num
    }
    
    export function ultraschall_ewma(): number {
        let num = ultra_ewma_values[0]
        return num
    }
    
    export function ultraschall_kalman(): number {
        let num = ultra_kalman_values[0]
        return num
    }
    
    
    /**
     * initiert den ultraschall
     */
    //% blockId=loimvUltrainit
    //% block="ultrainit"
    export function ultraschall_init() {
        control.inBackground(function () {
            while (true) {
                let value = sonar.ping(DigitalPin.P8, DigitalPin.P9, PingUnit.Centimeters)
                let length = ultra_values.unshift(value)
                if (length > 10){
                    ultra_values.pop()
                }
            }
        })
    }
    /**
     * Steuert die Antriebsmotoren mit den Parametern "Power" und "Lenkung".
     * Power gibt die Kraft von -10 bis 10 an, wobei negative Werte den Rückwärtsgang bedeuten
     * Lenkung lässt die Motoren auf auf beiden Seiten unterschiedlich schnell bewegen, um eine Drehung des Roboters zu erzeugen. 
     * -10 ist links, 0 gerade aus und 10 rechts
     */
    //% blockId=loimvAntrieb
    //% block="antrieb %power %lenkung"
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
            speedR = power - 2 * power / 10 * lenkung
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

    /**
     * Dreht den Roboter um einen Winkel
     */
    //% blockId=loimvGraddrehung
    //% block="Graddrehung %drehung %toleranz"
    //% drehung.min=-180 drehung.max=180
    //%toleranz.min=5 toleranz.max=20
    export function graddrehung(drehung: number, toleranz: number): void {
        antrieb(0, 0)
        let zielrichtung = (input.compassHeading() + drehung) % 360
        let i = 0
        while (Math.abs(zielrichtung - input.compassHeading()) > toleranz && i < 50) {
            i += 1
            if ((zielrichtung - input.compassHeading()) % 360 > 180) {
                antrieb(8, 10)
            } else {
                antrieb(8, -10)
            }
            basic.pause(100)
            antrieb(0, 0)
            basic.pause(200)
        }
        antrieb(0, 0)
        //if (i == 50) {
        //    return 1
        //} else {
        //    return 0
        //}
    }
    
    /**
     * Fährt den Roboter korrekt hoch
     */
    //% blockId=loimvInit
    //% block="init %kompass"
    export function init(kompass: boolean): void {
        let strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        if (kompass){
            basic.pause(input.compassHeading())
        }        
        I2C_LCD1602.LcdInit(0)
        antrieb(0, 0)
        I2C_LCD1602.ShowString("Landesolympiade", 0, 0)
        I2C_LCD1602.ShowString("Informatik MV", 1, 1)
        basic.pause(300)
        control.inBackground(function () {
            antrieb(10, 0),
            basic.pause(1000),
            antrieb(0, 0),
            basic.pause(10),
            antrieb(10, 0),
            basic.pause(1000),
            antrieb(0, 0),
            basic.pause(10)
        })
    }



}