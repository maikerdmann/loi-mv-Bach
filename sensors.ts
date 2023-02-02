namespace Sensoren{
    export class Ultraschallsensor{
        buffer: Array<number>
        num: number
        typee: String
        filter: Filter.BaseFilter;

        constructor(typee: String) {
            this.typee = typee

            switch (typee){
                case 'MA':
                    this.filter = new Filter.MA(10)
                case 'WMA':
                    this.filter = new Filter.WMA(10)
                case 'EWMA':
                    this.filter = new Filter.EWMA(10,0.5)
                case 'LMS':
                    this.filter = new Filter.LMS(10,0.001)
                case 'NLMS':
                    this.filter = new Filter.WMA(10)
                case 'KALMAN':
                    this.filter = new Filter.Kalman(10)
            }
        }

        get_entfernung(){
            return this.filter.current_value
        }

        get_real() {
            return this.filter.window[0]
        }

        init(){
            let messung = randint(300000, 400000) / 1000
            this.filter.add_measurment(messung)
        }

    }
    
    export class SignalStaerke{
        buffer: Array<number>
        num: number
        typee: String
        filter: Filter.BaseFilter;
        
        constructor(typee: String) {
            this.typee = typee
            
            switch (typee){
                case 'MA':
                    this.filter = new Filter.MA(10)
                case 'WMA':
                    this.filter = new Filter.WMA(10)
                case 'EWMA':
                    this.filter = new Filter.EWMA(10)
                case 'LMS':
                    this.filter = new Filter.LMS(10)
                case 'NLMS':
                    this.filter = new Filter.WMA(10)
                case 'KALMAN':
                    this.filter = new Filter.Kalman(10)
            }
        }
        
        get_entfernung(){
            return this.filter.current_value
        }
        
        get_real() {
            return this.filter.window[0]
        }
        
        init(){
            let messung = randint(300000, 400000) / 1000
            this.filter.add_measurment(messung)
        }
        
    }
}