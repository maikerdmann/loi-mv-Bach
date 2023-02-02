namespace Filter {
	export class BaseFilter{
		window: Array<number>
		windowsize: number;
		current_value: number
		
		constructor(windowsize:number){
			this.windowsize = windowsize
			this.window = []
		}
		
		add_measurment(measurement: number){
			let length = this.window.unshift(measurement)
			if (length > 10) {
				this.window.pop()
			}
			this.current_value = this.calculate(measurement)
		}
		
		calculate(measurement:number): number {
			return 0
		}
	}
	
	export class MA extends BaseFilter {
		constructor(windowsize: number) {
			super(windowsize)
		}
		
		calculate(measurement: number) {
			if (this.window.length < this.windowsize) {
				return this.window[0]
			}
			
			let window_average = round(average(this.window), 10)
			return window_average
		}
	}
	
	export class WMA extends BaseFilter {
		constructor(windowsize: number) {
			super(windowsize)
		}
		
		calculate(measurement: number) {
			if (this.window.length < this.windowsize) {
				return this.window[0]
			}
			
			let window_with_weights = []
			
			for (let i = 0; i < 5; i++) {
				let weight = i + 1
				window_with_weights.push(this.window[i] * weight)
			}
			let weights = [1, 2, 3, 4, 5]
			
			let window_weighted_average = round(sum(window_with_weights) / sum(weights), 10)
			return window_weighted_average
		}
	}
	
	export class EWMA extends BaseFilter {
		alpha: number
		
		constructor(windowsize: number = 5, alpha: number) {
			super(windowsize)
			this.alpha = alpha
		}
		
		calculate(measurement: number) {
			if (this.window.length < this.windowsize) {
				return this.window[0]
			}
			
			let window_with_weights = []
			let weights = []
			
			for (let i = 0; i < 5; i++) {
				let weight = Math.pow((1 - this.alpha), 5 - i)
				window_with_weights.push(this.window[i] * weight)
				weights.push(weight)
			}
			
			let window_weighted_average = round(sum(window_with_weights) / sum(weights), 10)
			return window_weighted_average
		}
	}
	
	export class LMS extends BaseFilter{
		mu: number;
		h: Array<number>;
		
		constructor(windowsize: number, mu: number) {
			super(windowsize);
			this.mu = mu
			this.h = [4,5]
		}
		
		add_measurment(measurement: number) {
			this.current_value = this.calculate(measurement)
			
			let length = this.window.unshift(measurement)
			if (length > this.windowsize) {
				this.window.pop()
			}
		}
		
		calculate_with(measurement: number){
			if (this.window.length < this.windowsize) {
				return this.window[0]
			}
			
			let input = this.window
			let xhatn = matdot(this.h, input)
			let en = measurement - xhatn
			
			let temp1 = mattimesnum(input, en)
			let temp2 = mattimesnum(temp1, this.mu)
			
			this.h = matadd(temp2, this.h)
			
			if (this.window.length < 8) {
				return measurement
			}
			
			return xhatn
		}
	}
	
	function average(array: number[]) {
		const sum = array.reduce((a, b) => a + b, 0)
		const avg = (sum / array.length) || 0
		return avg
	}
	
	function sum(array: number[]) {
		return array.reduce((a, b) => a + b, 0)
	}
	
	function round(num: number, decimal: number) {
		let dec = Math.pow(10, decimal)
		return Math.round(num * dec) / dec
	}
	
	function matdot(h:number[], input:number[]):number {
		let newarr = []
		for (let i = 0; i < h.length; i++){
			newarr[i] = h[i] * input[i]
		}
		return sum(newarr)
	}
	
	function matadd(arr1: number[], arr2: number[]): number[] {
		let newarr = []
		for (let i = 0; i < arr1.length; i++) {
			newarr[i] = arr1[i] + arr2[i]
		}
		return newarr
	}
	
	function mattimes(arr1: number[], arr2: number[]): number[] {
		let newarr = []
		for (let i = 0; i < arr1.length; i++) {
			newarr[i] = arr1[i] * arr2[i]
		}
		return newarr
	}
	
	function mattimesnum(arr1: number[], num: number): number[] {
		let newarr = []
		for (let i = 0; i < arr1.length; i++) {
			newarr[i] = arr1[i] * num
		}
		return newarr
	}
	
	function mataddnum(arr1: number[], num: number): number[] {
		let newarr = []
		for (let i = 0; i < arr1.length; i++) {
			newarr[i] = arr1[i] + num
		}
		return newarr
	}
}