import Search from './models/Search';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
	- Search object
	- Current recipe object
	- Shopping list object
	- Liked recipes
*/
const state = {};

const controlRecipe = async () => {
	//get id from URL
	const id = window.location.hash.replace('#', '');

	if(id){
		// prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//highlight selected recipe
		if(state.search){
			searchView.highlightSelected(id)
		}

		// create recipe object
		state.recipe = new Recipe(id);


		try{
			// get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
		
			// calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);

		}catch(error){
			console.log(error);
		}
	}
}

const controlSearch = async () => {
	// Get query from the view
	// FOR TESTING: UNCOMMENT OUT
	const query = searchView.getInput();

	if (query){
		// New search object and add to state
		state.search = new Search(query);

		// Preparer UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try{
			// Search for recipes
			await state.search.getResults();

			// Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);

		}catch(error){
			clearLoader();
			console.log(error);
		}
	}
}

elements.searchForm.addEventListener('submit', e=>{
	e.preventDefault();
	controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
	e.preventDefault();
	const btn = e.target.closest('.btn-inline');

	if(btn){
		const goToPage = parseInt(btn.dataset.goto, 10);

		searchView.clearResults();

		searchView.renderResults(state.search.result, goToPage);
	}
});


/**
	Recipe controller
**/
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));