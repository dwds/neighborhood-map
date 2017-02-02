// slideout menu
var $toggleList = $('.toggle-list');
var $listMenu = $('.list-menu');
var $locationList = $('.location-list');
$toggleList.on('click', toggleMenu);
$locationList.on('click', 'a', toggleMenu);

function toggleMenu(e) {
  e.preventDefault();
  if($(window).width() < 1000) {
    $listMenu.toggleClass('list-show');
  }
}
