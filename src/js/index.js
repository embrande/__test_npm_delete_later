import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
	- Search object
	- Current recipe object
	- Shopping list object
	- Liked recipes
*/
const state = {};

const controlSearch = async () => {
	// Get query from the view
	const query = searchView.getInput();

	if (query){
		// New search object and add to state
		state.search = new Search(query);

		// Preparer UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		// Search for recipes
		clearLoader();
		await state.search.getResults();

		// Render results on UI
		searchView.renderResults(state.search.result);
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