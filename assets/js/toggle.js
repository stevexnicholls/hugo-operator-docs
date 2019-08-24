(function() {
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function(event){
      resetTheme(event);
    });

    function resetTheme(event) {
      event.preventDefault();
      if (document.documentElement.getAttribute('data-theme') == null) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('themeToggle', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('themeToggle'); 
      } 
    };
    
    // Function to initialize theme
    function initTheme() {
      var darkThemeSelected = (localStorage.getItem('themeToggle') !== null && localStorage.getItem('themeToggle') === 'dark');
      darkThemeSelected ? document.documentElement.setAttribute('data-theme', 'dark') : document.documentElement.removeAttribute('data-theme');
    };
  }
}());

(function() {
  var fullscreenToggle = document.getElementById('fullscreen-toggle');
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', function(event){
      resetFullscreen(event);
    });

    function resetFullscreen(event) {
      event.preventDefault();
      if (document.documentElement.getAttribute('data-fullscreen') == null) {
        document.documentElement.setAttribute('data-fullscreen', 'true')
        localStorage.setItem('fullscreenToggle', 'true');
      } else {
        document.documentElement.removeAttribute('data-fullscreen');
        localStorage.removeItem('fullscreenToggle'); 
      } 
    };
  }
}());