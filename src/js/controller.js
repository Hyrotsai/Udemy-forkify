import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
// import recipeView, { RecipeView } from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //! Update result view
    resultsView.update(model.getSearchResultPage());
    //! Update bookmark
    bookmarksView.update(model.state.bookmarks);
    //! 1) Loading Recipe
    // console.log(model.state.recipe);
    await model.loadRecipe(id);

    //! Rendering Recipe*
    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    // console.error(`Controler: ${err.message}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //! 1 Get Search Query
    const query = searchView.getQuery();
    if (!query) return;
    //! 2 Load Search
    await model.loadSearchResult(query);
    //! 3 Render Results
    // resultsView.render(model.state.search.results); //! OJITO
    resultsView.render(model.getSearchResultPage(1)); //! OJITO
    //! 4 Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //! 1 Render NEW Results
  resultsView.render(model.getSearchResultPage(goToPage)); //!

  //! 2 Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //! Update recipe serving (in state)
  model.updateServings(newServings);
  //! Update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //! Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //! Update recipe view
  recipeView.update(model.state.recipe);
  //! Rndr bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //! Upload spinner
    addRecipeView.renderSpinner();
    //! Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //!Render recipe
    recipeView.render(model.state.recipe);

    //!Success message
    addRecipeView.renderMessage();

    //! Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //! Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();
    //! Close form windows
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
