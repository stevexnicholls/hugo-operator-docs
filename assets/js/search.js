const urlParams = new URLSearchParams(window.location.search);
var idx, searchResults = null
var documents = []

function renderSearchResults(results) {
  if (results.length > 0) {
    // show max 20 results
    if (results.length > 19) {
      results = results.slice(0, 20)
    }

    // reset search results
    searchResults.innerHTML = ''
    // append results
    results.forEach(result => {
      // create result item
      var article = document.createElement('article')
      article.innerHTML = `
            <div class="search-result"><div class="name"><a href="${result.ref}">${documents[result.ref].title}</a></div><div class="url"><a href="${result.ref}">${result.ref}</a></div><div class="summary">
            ${documents[result.ref].summary} ...</div>
            `
      searchResults.appendChild(article)
    })
    // if results are empty
  } else {
    searchResults.innerHTML = '<p>No results found.</p>'
  }
}

function registerSearchHandler() {
  // register on input event
  searchInput.oninput = function (event) {
    // remove search results if the user empties the search input field
    if (searchInput.value == '') {
      searchResults.innerHTML = ''
    } else {

      // get input value
      var query = event.target.value

      // run fuzzy search
      var results = idx.search(query)

      // render results
      renderSearchResults(results)
    }
  }
}

window.onload = function () {

  searchInput = document.getElementById('search-input-main')
  searchResults = document.getElementById('search-results')

  if (urlParams.has('search')) {
    searchInput.value = urlParams.get('search');
  }

  fetch('/index.json', {
    method: 'get'
  }).then(
    res => res.json()
  ).then(
    res => {
      // index document
      idx = lunr(function () {
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

        // remove stemmer due to issue with stemmed results
        this.pipeline.remove(lunr.stemmer)
        // this.pipeline.remove(lunr.trimmer)
        // this.pipeline.remove(lunr.stopWordFilter)
        this.searchPipeline.remove(lunr.stemmer)
        // this.searchPipeline.remove(lunr.trimmer)
        // this.searchPipeline.remove(lunr.stopWordFilter)

        res.forEach(function (doc) {
          if (doc.title) {
            this.add(doc)
            documents[doc.uri] = {
              'title': doc.title,
              'content': doc.content,
              'section': doc.section,
              'tags': doc.tags,
              'reluri': doc.reluri,
              'summary': doc.summary,
            }
          }
        }, this);
      })

      registerSearchHandler()
      var query = urlParams.get('search')
      if (query) {
        var results = idx.search(query)
        renderSearchResults(results)
      }
    }
  ).catch(
    err => {
      searchResults.innerHTML = `<p>${err}</p>`
    }
  )
}