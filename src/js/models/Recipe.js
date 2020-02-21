import axios from 'axios';

export default class Recipe {
	constructor(id){
		this.id = id;
	}

	async getRecipe(id){

		//change the id of the recipe on the method-level
		if(id) this.id = id

		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.author = res.data.recipe.publisher;
			this.ingredients = res.data.recipe.ingredients;
		}catch (error){
			console.log(error);
		}
	}

	calcTime(){
		// asuming we need 15 minutes for each 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings(){
		this.calcServings = 4;
	}

	parseIngredients(){
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
		const newIngredients = this.ingredients.map(el => {
			//uniform units
			let ingredient = el.toLowerCase();

			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});

			//remove parethasis
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			//parse ingredients into count, units, and ingredients
			const ingredientSeparate = ingredient.split(' ');
			const unitIndex  = ingredientSeparate.findIndex(el2 => unitsShort.includes(el2));


			return ingredient;
		});
		this.ingredients = newIngredients;
	}
}