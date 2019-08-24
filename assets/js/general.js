//document.addEventListener('DOMContentLoaded', (event) => {}

(function() {
  var navigationSelect = document.querySelectorAll('.navigation__select');
  navigationSelect.forEach(function(el) {
    el.addEventListener('change', function(event){
      window.location = el.value;
    });
  });
}());

var clipboard = new ClipboardJS('.copy-to-clipboard', {
  target: function(trigger) {
    return trigger.nextElementSibling.querySelector('code');
  }
  // },
  // text: function (trigger) {
  //         console.log(trigger);
  //         text = trigger.innerHTML;
  //         return text.replace(/^\$\s/gm, '');
  //       }
});

clipboard.on('success', function(e) {
  e.trigger.classList.add('pressed');
  setTimeout(function () {
    e.trigger.classList.remove('pressed');
    e.clearSelection();
  }, 400);;
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});

function searchToggle(obj, evt) {
  var container = $(obj).closest('.search-wrapper');
  if (!container.hasClass('active')) {
    container.addClass('active');
    $("#search-input").focus();
    evt.preventDefault();
    $(obj).click(false);
  }
}

jQuery(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  $(".dropdown").click(function () {
    $(this).toggleClass("is-active");
  });

  function closeDropdown() {
    $(".dropdown").focusout(function () {
      $(this).removeClass("is-active");
    });
  }

  $('#search-input').focusout(function () {
    var container = $(this).closest('.search-wrapper');
    // delay to allow for autocomplete suggestion click to fire
    setTimeout(function () {
      container.removeClass('active');
      container.find('#search-input').val('');
    }, 300);
  });

  $("h1:not(:first-of-type),h1~h2,h1~h3,h1~h4,h1~h5,h1~h6").append(function (index, html) {
    var element = $(this);
    var url = document.location.origin + document.location.pathname;
    var link = url + "#" + element[0].id;
    return "<a href='" + link + "'>" +
      "<span class='icon anchor'><i class='mdi mdi-link'></i></span>" +
      "</a>";
  });

  // table of contents sticky
  var toc = document.getElementById("toc");
  window.onscroll = function () {
    scrollSticky()
  };

  function scrollSticky() {
    if (window.pageYOffset > 100) {
      toc.classList.add("sticky");
    } else {
      toc.classList.remove("sticky");
    }
  }

  // highlight

  var ajax;
  jQuery('[data-search-input]').on('input', function () {
    var input = jQuery(this),
      value = input.val(),
      items = jQuery('[data-nav-id]');
    items.removeClass('search-match');
    if (!value.length) {
      $('ul.menu').removeClass('searched');
      items.css('display', 'block');
      sessionStorage.removeItem('search-value');
      $(".content").unhighlight({
        element: 'mark'
      })
      return;
    }

    sessionStorage.setItem('search-value', value);
    $(".content").unhighlight({
      element: 'mark'
    }).highlight(value, {
      element: 'mark'
    });

    if (ajax && ajax.abort) ajax.abort();

    jQuery('[data-search-clear]').on('click', function () {
      jQuery('[data-search-input]').val('').trigger('input');
      sessionStorage.removeItem('search-input');
      $(".content").unhighlight({
        element: 'mark'
      })
    });
  });

  $.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
      return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
  });

  if (sessionStorage.getItem('search-value')) {
    var searchValue = sessionStorage.getItem('search-value')
    sessionStorage.removeItem('search-value');
    var searchedElem = $('.content').find(':contains(' + searchValue + ')').get(0);
    searchedElem && searchedElem.scrollIntoView();
    $(".content").highlight(searchValue, {
      element: 'mark'
    });
  }

  

  // $('.code-container').each(function () {
  //   var code = $(this),
  //     text = code.text();

  //   if (text.length > 5) {
  //     if (!clipInit) {
  //       var text, clip = new ClipboardJS('.copy-to-clipboard', {
  //         text: function (trigger) {
  //           text = $(trigger).next('code').text();
  //           return text.replace(/^\$\s/gm, '');
  //         }
  //       });

  //       var inPre;
  //       clip.on('success', function (e) {
  //         e.clearSelection();
  //         inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
  //         $(e.trigger).addClass('pressed');
  //         setTimeout(function () {
  //           $(e.trigger).removeClass('pressed');
  //         }, 400);;
  //       });

  //       // clip.on('error', function(e) {
  //       //     inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
  //       //     $(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 'n'));
  //       //     $(document).one('copy', function(){
  //       //         $(e.trigger).attr('aria-label', 'Copied to clipboard').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 'n'));
  //       //     });
  //       // });

  //       clipInit = true;
  //     }

  //     code.before('<button class="copy-to-clipboard is-hidden-touch" title="Copy to clipboard"><i class="mdi clipboard-icon" aria-hidden="true"></i></button>');
  //   }
  // });

});

jQuery.extend({
  highlight: function (node, re, nodeName, className) {
    if (node.nodeType === 3) {
      var match = node.data.match(re);
      if (match && !$(node.parentNode).hasClass("mermaid")) {
        var highlight = document.createElement(nodeName || 'span');
        highlight.className = className || 'highlight';
        var wordNode = node.splitText(match.index);
        wordNode.splitText(match[0].length);
        var wordClone = wordNode.cloneNode(true);
        highlight.appendChild(wordClone);
        wordNode.parentNode.replaceChild(highlight, wordNode);
        return 1; //skip added node in parent
      }
    } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
      !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
      !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
      for (var i = 0; i < node.childNodes.length; i++) {
        i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
      }
    }
    return 0;
  }
});

jQuery.fn.unhighlight = function (options) {
  var settings = {
    className: 'highlight',
    element: 'span'
  };
  jQuery.extend(settings, options);

  return this.find(settings.element + "." + settings.className).each(function () {
    var parent = this.parentNode;
    parent.replaceChild(this.firstChild, this);
    parent.normalize();
  }).end();
};

jQuery.fn.highlight = function (words, options) {
  var settings = {
    className: 'highlight',
    element: 'span',
    caseSensitive: false,
    wordsOnly: false
  };
  jQuery.extend(settings, options);

  if (!words) {
    return;
  }

  if (words.constructor === String) {
    words = [words];
  }
  words = jQuery.grep(words, function (word, i) {
    return word != '';
  });
  words = jQuery.map(words, function (word, i) {
    return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  });
  if (words.length == 0) {
    return this;
  };

  var flag = settings.caseSensitive ? "" : "i";
  var pattern = "(" + words.join("|") + ")";
  if (settings.wordsOnly) {
    pattern = "\\b" + pattern + "\\b";
  }
  var re = new RegExp(pattern, flag);

  return this.each(function () {
    jQuery.highlight(this, re, settings.element, settings.className);
  });
};

// Get Parameters from some url
var getUrlParameter = function getUrlParameter(sPageURL) {
  var url = sPageURL.split('?');
  var obj = {};
  if (url.length == 2) {
    var sURLVariables = url[1].split('&'),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      obj[sParameterName[0]] = sParameterName[1];
    }
    return obj;
  } else {
    return undefined;
  }
};