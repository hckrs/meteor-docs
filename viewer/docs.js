
Router.route('/docs');


Router._scrollToHash = function(hash) {
  var $main = $(".main-content")
    , $section = $(hash);

  if ($section.length) {
    var sectionTop = $section.offset().top;
    $main.animate({
      scrollTop: $main.scrollTop() + sectionTop - $main.offset().top
    }, "slow");
  }
};

Template.docs.rendered = function() {
  Router._scrollToHash(location.hash)
}

Template.docs.helpers({
  docs: function() {
    return DocsPackage.getDocNames();
  }
});