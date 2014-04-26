var $state = new Object;
$state.loadingPosts = false;
$state.nextPage = undefined; // loaded inside document.ready
var $posts;
$state.morePostsAvailable = function() {
  return (!$state.loadingPosts && $state.nextPage != undefined);
};

function updatePage() {
  if ($state.morePostsAvailable() && ($(document).height() - $(window).height()) - $(window).scrollTop() < 200) {
    $state.loadingPosts = true;
    $("#loader").show();
    $.ajax({
      url: $state.nextPage,
      dataType: "html",
      success: function(html) {
        $state.nextPage = $("#nextpage", html).attr("href");
        posts = $(".post", html);
        $("#posts_queue").append(posts);
        $("#posts_queue > .post").each(function() {
          $(this).imagesLoaded(function(instance) {
            element = instance.elements[0];
            $posts.append(element);
            $posts.masonry('appended', element);
            if ($("#posts_queue").children().length == 0) {
              $("#loader").hide();
              $state.loadingPosts = false;
            }
          });
        });
      }
    });
  }
  setTimeout(function() {
    updatePage();
  }, 100);
}
window.startThemeJS = function() {
  $posts = $("#posts");
  $("#loader").hide();
  $("#nextpage").hide();
  imagesLoaded("#posts", function() {
    $posts.masonry({
      columnWidth: 250,
      itemSelector: '.post',
      gutter: 5,
      transitionDuration: 0
    });
    $state.nextPage = $("#nextpage").attr("href");
    updatePage();
  });
};