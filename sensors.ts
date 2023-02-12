namespace Sensoren {

    class BaseSensor{
        live: number
        filter: any;

        constructor(typee: String) {
            switch (typee) {
                case 'MA':
                    this.filter = new Filter.MA(10)
                    break
                case 'WMA':
                    this.filter = new Filter.WMA(10)
                    break
                case 'EWMA':
                    this.filter = new Filter.EWMA(10, 0.5)
                    break
                case 'LMS':
                    this.filter = new Filter.LMS(10, 0.001)
                    break
                case 'NLMS':
                    this.filter = new Filter.WMA(10)
                    break
                case 'KALMAN':
                    this.filter = new Filter.Kalman(10)
                    break
            }
        }

        get_measurement() {
            return this.filter.current_value
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
            this.filter.calculate(measurement)
        }
    }


    export class Ultraschallsensor extends BaseSensor {
        
        constructor(typee: String) {
            super(typee)
        }

        measure(){
            let messung_ms = sonar.ping(DigitalPin.P8,DigitalPin.P9,PingUnit.MicroSeconds)
            return messung_ms * 0.034 / 2
        }
    }

    export class SignalStaerke extends BaseSensor {

        constructor(typee: String) {
            super(typee)
        }

        measure(){
            return 0
        }

    }
}