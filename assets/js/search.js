var lunrIndex, pagesIndex;

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Initialize lunrjs using generated index file
function initLunr() {
  if (!endsWith(baseurl, "/")) {
    baseurl = baseurl + '/'
  };

  $.getJSON(baseurl + "index.json")
    .done(function (index) {
      pagesIndex = index;
      lunrIndex = lunr(function () {
        this.ref("uri");
        this.field('title', {
          boost: 15
        });
        this.field('tags', {
          boost: 10
        });
        this.field("content", {
          boost: 5
        });
        this.field('reluri', {
          boost: 0
        });

        pagesIndex.forEach(function (page) {
          this.add(page)
        }, this)

        this.pipeline.remove(this.stemmer)
      })
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting Hugo index file:", err);
    });
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
  // Find the item in our index corresponding to the lunr one to have more info
  return lunrIndex.search(query).map(function (result) {
    return pagesIndex.filter(function (page) {
      return page.uri === result.ref;
    })[0];
  });
}

initLunr();

function autocomplete(element) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  element.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    arr = search(val);
    for (i = 0; i < arr.length; i++) {
      b = document.createElement("DIV");
      b.setAttribute("class", "autocomplete-item");
      b.setAttribute("data-term", val);
      b.setAttribute("data-title", arr[i].title);
      b.setAttribute("data-uri", arr[i].uri);
      b.innerHTML = "<p><span class='autocomplete-item__section'>" + arr[i].section + "/</span><span class='autocomplete-item__page'>" + arr[i].title + "</span></p>";
      b.addEventListener("click", function (e) {
        console.log("click" + this.getAttribute('data-uri'));
        location.href = this.getAttribute('data-uri');
        closeAllLists();
      });
      a.appendChild(b);
    }
  });
  /*execute a function presses a key on the keyboard:*/
  element.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    console.log("addActive:" + x);
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
  }

  function closeAllLists(el) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (el != x[i] && el != element) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}