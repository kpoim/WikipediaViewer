var endpoint = "https://en.wikipedia.org/w/api.php";
var parameters = [
  "action=query",
  "format=json",
  "origin=*",
  "prop=extracts",
  "continue=",
  "generator=search",
  "exsentences=2",
  "exintro=1",
  "exsectionformat=wiki",
  "gsrnamespace=0",
  "gsrlimit=10",
  "gsrsearch="
];
var str;
$(document).ready(function() {
  $('#searchfield').focus();
  $("#searchbutton").click(function(e) {
    e.preventDefault();
    if (notEmpty($("#searchfield"))) {
      str = $("#searchfield").val();
      var url = endpoint + "?" + parameters.join("&") + str;
      getResults(url);
      $("#results").show();
      $("#container")
        .removeClass("full")
        .addClass("min");
    }
  });

  $("#random").click(function() {
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  });

  $(document).on("keydown", function(key) {
    if (key.keyCode === 13) $("#searchbutton").trigger("click");
  });

  $("#title").click(function() {
    $("#results").hide(0, function() {
      $("#container")
        .removeClass("min")
        .addClass("full");
    });
  });
});
function notEmpty(e) {
  var str = e
  .val()
  .trim()
  .replace(/\s\s+/g, " ");
  e.val(str);
  return str;
}

function getResults(url) {
  $.ajax({
    url: url,
    headers: {
      "Api-User-Agent":
      "Wikipedia Viewer (https://codepen.io/kpoim/full/MrRqNg/; kostas_poim@yahoo.gr)"
    },
    success: function(data) {
      if (data.hasOwnProperty("query")) {
        var txt = '<ul id="list">';
        var counter = 0;
        var items = [];
        for (var x in data.query.pages) {
          items[data.query.pages[x].index - 1] = data.query.pages[x];
        }
        txt = items.reduce((acc, next) => {
          acc +=
            '<li id="' +
            next.pageid +
            '" style="background-color: ' +
            (counter++ % 2 === 0 ? "#606060" : "#6c6c6c") +
            '">';
          acc +=
            '<a href="http://en.wikipedia.org/?curid=' +
            next.pageid +
            '" target="_blank" class="link">';
          acc += "<h3>" + next.title + "</h3></a>";
          acc += next.extract;
          acc += "</li>";
          return acc;
        }, txt);
        txt += "</ul>";
        $('#searchfield').blur();
        $("#results").html(txt);
      } else {
        var txt = '<h2 style="margin-top: 30vh;">No results</h2>';
        $("#results").html(txt);
      }
    },
    cache: false
  });
}
