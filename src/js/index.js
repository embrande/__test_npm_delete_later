import List from './models/List'; 
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
	- Search object
	- Current recipe object
	- Shopping list object
	- Liked recipes
*/
const state = {};
window.state = state;

const controlRecipe = async () => {
	//get id from URL
	const id = window.location.hash.replace('#', '');

	if(id){
		// prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//highlight selected recipepu
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


/***
	list controller
***/
const controlList = () => {
	// create a new list IF there is none yet
	if(!state.list) state.list = new List();

	// Add each ingredient to the list and user interface
	state.recipe.ingredients.forEach(el => {

		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);

	});
}

// handle delete and update list item events
elements.shopping.addEventListener('click', el => {

	const id = el.target.closest('.shopping__item').dataset.itemid;

	if(el.target.matches('.shopping__delete, .shopping__delete *')){

		state.list.deleteItem(id);

		listView.deleteItem(id);

	}else if(el.target.matches('.shopping__count-value')){
		const val = parseFloat(el.target.value, 10);
		state.list.updateCount(id, val);
	}

});




elements.recipe.addEventListener('click', el => {
	if(el.target.matches('.btn-decrease, .btn-decrease *')){
		if(state.recipe.servings > 1){
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}	
	}else if(el.target.matches('.btn-increase, .btn-increase *')){
		state.recipe.updateServings("inc");
		recipeView.updateServingsIngredients(state.recipe);
	}else if(el.target.matches('.recipe__btn--add, .recipe__btn--add *')){
		controlList();
	}
});


window.l = new List();