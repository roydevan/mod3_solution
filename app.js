(function (){
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'shoppingList.html',
    scope: {
      categories: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'menu',
    bindToController: true
  };

  return ddo;
  }


  function FoundItemsDirectiveController() {
    var menu = this;
    //console.log(menu.searchTerm)
    return true;

  }

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm="";
  menu.title="List of Menu Categories";

  menu.removeItem = function (itemIndex) {
    menu.categories.splice(itemIndex, 1);
  };

  menu.addItem = function () {
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function (response) {
      menu.categories = response;
    })
  };

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;



  service.getMatchedMenuItems = function (searchTerm) {

    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })
    .then (function(response) {
      var found = [];

      if ((searchTerm !== undefined) && (searchTerm !== '')) {

          for (var i = 0; i < response.data.menu_items.length; i++) {
            var name = response.data.menu_items[i].description;
            if (name.toLowerCase().indexOf(searchTerm) !== -1) {
              var item = {
                short_name: response.data.menu_items[i].short_name,
                name: response.data.menu_items[i].name,
                description: response.data.menu_items[i].description
              };
              found.push(item);
        }
      }
    }
      return found;

    })
    .catch(function (errorResponse) {
        console.log(errorResponse.message);
      });
  };

}

})();
