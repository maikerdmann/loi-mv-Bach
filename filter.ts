namespace LOI_MV {
	
	let ultra_ma_values: number[] = []
	let ultra_wma_values: number[] = []
	let ultra_ewma_values: number[] = []
	let ultra_kalman_values: number[] = []
	
	
	export function moving_average(value:number){
		if (ultra_values.length < 5){
			return ultra_values[0]
		}
		
		let window = ultra_values.slice(-5)
		let window_average = round(average(value, window), 10)
		return window_average
	}
	
	export function weighted_moving_average(value:number){
		if (ultra_values.length < 5){
			return ultra_values[0]
		}
		
		let window = ultra_values.slice(-5)
		let window_n = []
		
		for (let i = 0; i < 5; i++) {
			let weight = i + 1
			window_n.push(window[i]*weight)
		}
		let weights = [1,2,3,4,5]
		
		let window_weighted_average = round(sum(window_n)/sum(weights), 10)
		return window_weighted_average
	}
	
	export function exponential_weighted_moving_average(value:number, alpha:number){
		if (ultra_values.length < 5){
			return ultra_values[0]
		}
		
		let window = ultra_values.slice(-5)
		let window_n = []
		let weights = []
		
		for (let i = 0; i < 5; i++) {
			let weight = Math.pow((1 - alpha), 5 - i)
			window_n.push(window[i] * weight)
			weights.push(weight)
		}
		
		let window_weighted_average = round(sum(window_n)/sum(weights), 10)
		return window_weighted_average
	}
	
	
	
	function sum(array: number[]){
		return array.reduce((a, b) => a + b, 0)
	}
	
	function average(num: number, array: number[]){
		const sum = array.reduce((a, b) => a + b, 0)
		const avg = (sum / array.length) || 0
		return avg
	}
	
	function round(num: number, decimal: number){
		let dec = Math.pow(10,decimal)
		return Math.round(num * dec) / dec
	}
}