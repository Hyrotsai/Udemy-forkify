import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsViews extends View {
  _parentElement = document.querySelector('.results'); //! OJITO
  _errorMessage = 'No se pudo encontrar recipientes!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsViews();
