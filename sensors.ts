namespace Sensoren {

    class BaseSensor {
        live: number
        filter: any;

        constructor(){
            console.log("sd")
        }

        get_measurement() {
            return this.filter.get_last_value()
        }

        get_real() {
            return this.live
        }

        measure() {
            return 0
        }

        update() {
            let measurement = this.measure()
            this.live = measurement
            console.log(this.filter.update(measurement))
        }
    }


    export class Ultraschallsensor extends BaseSensor {

        trig: DigitalPin
        echo: DigitalPin
        cal_factor: number

        constructor(trig: DigitalPin = DigitalPin.P8, echo: DigitalPin = DigitalPin.P9, factor?:number) {
            super()
            this.trig = trig
            this.echo = echo
            if (factor){
                this.cal_factor = factor
            }
        }

        set_filter(filter: Filterlist){
            switch (filter) {
                case Filterlist.MA:
                    this.filter = new Filter.MA(5)
                    break
                case Filterlist.WMA:
                    this.filter = new Filter.WMA(5)
                    break
                case Filterlist.EMA:
                    this.filter = new Filter.EMA(0.5)
                    break
                case Filterlist.LMS:
                    this.filter = new Filter.LMS(5, 0.00001)
                    break
                case Filterlist.NLMS:
                    this.filter = new Filter.NLMS(5)
                    break
                case Filterlist.Kalman:
                    this.filter = new Filter.Kalman(0, 1, 1, 0, 1, 1, 1)
                    break
            }
        }

        ping(trig: DigitalPin, echo: DigitalPin): number {
            // send pulse
            pins.setPull(trig, PinPullMode.PullNone);
            pins.digitalWritePin(trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);

            // read pulse
            const d = pins.pulseIn(echo, PulseValue.High, 400 * 58);

            //time divided by 2 times the sonicspeed
            return d / 2 * 0.03432
        }

        measure() {
            let messung_cm = this.ping(this.trig, this.echo)

            if (this.cal_factor){
                return messung_cm / this.cal_factor
            }
            return messung_cm
        }

        calibrate(first: number, second:number) {
            let temp1 = first/10
            let temp2 = second/20

            this.cal_factor = (temp1 + temp2)/2
        }
    }

    export class SignalStaerke extends BaseSensor {

        constructor() {
            super()
        }

        measure() {
            return 0
        }

    }
}