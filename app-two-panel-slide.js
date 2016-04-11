jQuery(document).ready(function() {

window.app = {};

app.fpScrollingSpeed = 700;

var $lampe_markers = $(".lampe-markers").on("click", ".plus", function(e) {
    e.preventDefault(),
    $(this).addClass("active");
    var i = this.href.substring(this.href.lastIndexOf("#"));
    $(i).addClass("active open").find(".plus").addClass("active")
});
$(".detail").on("click", ".plus", function(e) {
    e.preventDefault(),
    $(e.delegateTarget).trigger("quit.detail")
}).on("quit.detail", function() {
    var e = $(this);
    e.find(".plus").removeClass("active"),
    e.removeClass("open"),
    setTimeout(function() {
        e.removeClass("active")
    }, app.fpScrollingSpeed),
    setTimeout(function() {
        $lampe_markers.find(".plus").removeClass("active")
    }, app.fpScrollingSpeed / 3)
})

});