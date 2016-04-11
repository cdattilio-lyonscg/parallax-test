(function(a, b) {
    function c(a, b) {
        b = b || {},
        b.sideBySide = b.sideBySide || !1,
        this.$target = a,
        this.$cache = {
            parent: a.find("#scroller"),
            leftPane: a.find("#scroller #side-0.pane"),
            leftImageContainer: a.find("#scroller #side-0.pane").find(".p-0"),
            rightPane: a.find("#scroller #side-1.pane"),
            rightImageContainer: a.find("#scroller #side-1.pane").find(".p-0"),
            pullTab: a.find("#scroller .bar"),
            scrollerWidth: 0,
            scrollerX: 0,
            position: 0,
            sideBySide: b.sideBySide,
            needsToPaint: !0
        },
        this._paint(),
        this._initEvents()
    }
    function d(a, b) {
        return new c(a,b)
    }
    c.prototype.setSideBySide = function(a) {
        this.$cache.sideBySide = a,
        this.setPosition($cache.position, $cache),
        this.setHeight($cache)
    }
    ,
    c.prototype._setPosition = function(a) {
        0 > a ? a = 0 : a > 100 && (a = 100),
        this.$cache.position = a
    }
    ,
    c.prototype._repaint = function() {
        this.$cache.needsToPaint = !0
    }
    ,
    c.prototype._paint = function() {
        var a = this.$cache;
        setInterval(function() {
            if (a.needsToPaint) {
                a.needsToPaint = !1,
                a.parent.css("height", a.leftPane.find(".p-0").height() + "px"),
                a.scrollerWidth = a.parent.width(),
                a.scrollerX = a.parent.offset().left;
                var b = a.position;
                a.leftPane.css("left", -(100 - b) + "%"),
                a.rightPane.css("left", b + "%"),
                a.sideBySide ? (a.leftImageContainer.css("left", "0%"),
                a.rightImageContainer.css("left", "0%")) : (a.leftImageContainer.css("left", 100 - b + "%"),
                a.rightImageContainer.css("left", -b + "%"));
                var c = "";
                ["-webkit-", "-moz-", ""].forEach(function(d) {
                    c += "left: " + d + "calc(" + b + "% - " + a.pullTab.width() / 2 + "px);"
                }),
                a.pullTab.attr("style", c)
            }
        }, 50)
    }
    ,
    c.prototype._initEvents = function() {
        var a = !1
          , c = 0
          , d = 0
          , e = this.$cache
          , f = this;
        f._setPosition(50),
        b(window).on("resize", function(a) {
            f._repaint()
        }),
        e.parent.find("img").on("load", function() {
            f._setPosition(50),
            f._repaint()
        }),
        e.parent.on("mousedown touchstart", function(b) {
            a = !0,
            c = e.pullTab.offset().left + e.pullTab.width() / 2,
            d = "touchstart" != b.type ? b.pageX : b.originalEvent.touches[0].pageX
        }),
        b(window).on("mousemove touchmove", function(b) {
            if (a) {
                var g = ("touchmove" != b.type ? b.pageX : b.originalEvent.touches[0].pageX) - d
                  , h = c + g - e.scrollerX
                  , i = h / e.scrollerWidth * 100;
                f._setPosition(i),
                f._repaint()
            }
        }).on("mouseup touchend", function(b) {
            a && (a = !1,
            f.$target.trigger("swipebox:dragend"))
        }),
        e.parent.on("mousemove", function(a) {
            a.preventDefault()
        }),
        e.pullTab.on("click", function(a) {
            a.preventDefault()
        })
    }
    ,
    a.swipebox = {
        create: d
    }
}(window.app = window.app || {}, jQuery));