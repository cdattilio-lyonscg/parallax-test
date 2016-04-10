(function loadPriceFromCartAPI() {
    function getNewAvailability(sku) {
        var availability = "";
        var countryCode = getCountryCode();
        var lclCookie = getCookie("lcl");
        var locale = lclCookie && lclCookie.length >= 5 ? lclCookie : getCountryCode(true);
        var $defer = new $.Deferred;
        if (countryCode && sku) requestToAPI(countryCode, locale).done(function(data) {
            var product = findProductBySKU(data, sku);
            if (product && product.hasOwnProperty("availability")) {
                availability = product.availability;
                $defer.resolve(availability)
            }
        });
        return $defer
    }

    function getNewPrice(sku) {
        var price =
            "";
        var countryCode = getCommonEuLocale(getCountryCode());
        var lclCookie = getCookie("lcl");
        var locale = lclCookie && lclCookie.length >= 5 ? lclCookie : getCountryCode(true);
        var $defer = new $.Deferred;
        if (countryCode && sku) requestToAPI(countryCode, locale).done(function(data) {
            var product = findProductBySKU(data, sku);
            if (product && product.hasOwnProperty("price")) {
                price = formatCurrency(product.price, countryCode);
                $defer.resolve(price)
            }
        });
        return $defer
    }

    function getCommonEuLocale(locale) {
        var locales = ["eu"];
        return locales.indexOf(locale) ===
            -1 ? locale : "pt"
    }

    function getCountryCode(fullLocale) {
        var locale;
        var bodyClass = $("body").attr("class").match(/locale-\S+/);
        if (bodyClass) locale = bodyClass[0].replace("locale-", "");
        else if (typeof fitbit !== "undefined") locale = fitbit.i18n.locale;
        if (typeof fullLocale === undefined || !fullLocale) locale = locale.split("_")[1].toLowerCase();
        return locale
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "\x3d");
        if (parts.length == 2) return parts.pop().split(";").shift()
    }

    function formatCurrency(price,
        locale) {
        var rPrice = /#/;
        var rDelimiter = /(\.|\,)/;
        var formatedPrice = "";
        var delimiter = ".";
        switch (locale) {
            case "us":
            case "ca":
                formatedPrice = "$#";
                break;
            case "nz":
                formatedPrice = "NZ$#";
                break;
            case "au":
                formatedPrice = "A$#";
                break;
            case "gb":
                formatedPrice = "\u00a3#";
                break;
            case "fr":
            case "de":
            case "it":
            case "es":
            case "fi":
            case "be":
            case "dk":
            case "at":
            case "ch":
            case "se":
            case "no":
            case "nl":
            case "eu":
            case "pt":
                formatedPrice = "# \u20ac";
                delimiter = ",";
                break;
            default:
                console.log("price api: locale not found")
        }
        return formatedPrice.replace(rPrice,
            price).replace(rDelimiter, delimiter)
    }

    function requestToAPI(countryCode, locale) {
        if (typeof $cache === "undefined") $cache = $.get("/cart/api/store", {
            id: countryCode,
            locale: locale
        });
        return $cache
    }

    function findProductBySKU(data, sku) {
        if (data.hasOwnProperty("products"))
            if (data.products.hasOwnProperty(sku)) return data.products[sku];
        return false
    }
    var $cache;
    $("[data-fitbit-cart-api-id]").each(function() {
        var $this = $(this);
        var id = $this.data("fitbitCartApiId");
        getNewPrice(id).done(function(data) {
            $this.text(data).hide(0).show(0)
        })
    });
    $("[data-availability-text]").each(function() {
        var $this = $(this);
        var id = $this.data("availabilityText");
        getNewAvailability(id).done(function(data) {
            $this.text(data)
        })
    })
})();
var curvyCornersNoAutoScan = true;
$(function() {
    function isMobileDevice() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("android") > 1 || ua.indexOf("ipad") > 1 || ua.indexOf("iphone") > 1 || ua.indexOf("android") > 1
    }

    function b(a) {
        if (!is_mobile) {
            var d = $(this).scrollTop();
            if (d >= 90) {
                if ($("#products_menu").hasClass("products_menu_nailedToTop")) return;
                $("#products_menu").addClass("products_menu_nailedToTop")
            } else {
                if (!$("#products_menu").hasClass("products_menu_nailedToTop")) return;
                $("#products_menu").removeClass("products_menu_nailedToTop")
            }
        }
    }
    $(window).scroll(b);
    $(b);
    var is_mobile = isMobileDevice();
    if (is_mobile) {
        $("body").css("min-width", "1250px");
        $("#box-carusel-left").addClass("ipad")
    }
    if ($("#products_menu").length > 0) $("#products_menu").css("top", $("#products_menu_empty_area").position().top + "px");
    $("a.button[data-target], a.link-arrow-right[data-target]").on("click", function() {
        if ($(this).data("go") && $(this).data("go").length && $(this).data("go") != "false") {
            location.pathname = $(this).data("go");
            return true
        }
        handleBuyElem($(this).data("target"))
    });
    $("#comparison-content-table .buy-button[data-target], #box-carusel .button[data-target]").click(function() {
        if ($(this).data("go") &&
            $(this).data("go").length && $(this).data("go") != "false") {
            location.pathname = $(this).data("go");
            return true
        }
        handleBuyElem($(this).data("target"))
    });
    $("#products_menu .sub-menu ul li.active a").click(function() {
        return false
    })
});
$(function() {
    if ($.browser.msie && parseInt($.browser.version) <= 7) $(".pink-link").append('\x3ci class\x3d"before"\x3e\x3c/i\x3e').append('\x3ci class\x3d"after"\x3e\x3c/i\x3e')
});
var holiday = false;
expedited = typeof expedited != "undefined" ? expedited : false;
overnight = typeof overnight != "undefined" ? overnight : false;
$(document).ready(function() {
    if (holiday) {
        $("#wrapper-box-carusel").after('\x3cdiv class\x3d"holiday home-stripe"\x3e\x3cdiv\x3e\x3c/div\x3e\x3c/div\x3e');
        $(".holiday.home-stripe").css({
            "background": "url(https://static1.fitbit.com/simple.b-cssdisabled-png.hdd8f03ccc6fe013d3368a5e0f72ebe77.pack?items\x3d%2Fcontent%2Fassets%2Fonezip%2Fimages%2Fholiday%2Fbg_stripe_homepage.png) bottom repeat-x",
            "height": "30px",
            "background-color": "#f6f6f6",
            "background-clip": "padding-box"
        });
        $(".scrollbar").css({
            "top": "374px"
        });
        if (expedited && !overnight) {
            $(".home-stripe div").append($(".holiday-shipping.expedited"));
            $("#features_shipping_label").addClass("holiday").html("").append($(".holiday-shipping.expedited")).show()
        } else if (overnight) {
            $(".home-stripe div").append($(".holiday-shipping.overnight"));
            $("#features_shipping_label").addClass("holiday").html("").append($(".holiday-shipping.overnight")).show()
        } else $("#features_shipping_label").show();
        $("head").append("\x3cstyle\x3e.module-dd.subnav .subnav-products{background:url(https://static0.fitbit.com/simple.b-cssdisabled-png.h9e040ad0db75166de1bf194eb6574663.pack?items\x3d%2Fcontent%2Fassets%2Fonezip%2Fimages%2Fholiday%2Fbg_dropdown_snowflakes.png) no-repeat bottom right}\x3c/style\x3e");
        $("#box-carusel-left").append('\x3cdiv class\x3d"holiday snow-left"\x3e\x3c/div\x3e');
        $(".holiday.snow-left").css({
            "background": "url(https://static1.fitbit.com/simple.b-cssdisabled-png.hd413f9970fbf6f88c3d4d33228342311.pack?items\x3d%2Fcontent%2Fassets%2Fonezip%2Fimages%2Fholiday%2Fbg_home_snowflakes-left.png) top no-repeat",
            "width": "617px",
            "height": "300px",
            "position": "absolute",
            "top": "0px",
            "right": "10px",
            "pointer-events": "none"
        });
        $("#box-carusel-right").append('\x3cdiv class\x3d"holiday snow-right"\x3e\x3c/div\x3e');
        $(".holiday.snow-right").css({
            "background": "url(https://static0.fitbit.com/simple.b-cssdisabled-png.hac3b7ebf9303a23205da7e272ff24373.pack?items\x3d%2Fcontent%2Fassets%2Fonezip%2Fimages%2Fholiday%2Fbg_home_snowflakes-right.png) top no-repeat",
            "width": "161px",
            "height": "201px",
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "pointer-events": "none"
        });
        $("#features_carusel_area").after('\x3cdiv class\x3d"holiday features-stripe"\x3e\x3c/div\x3e');
        $(".holiday.features-stripe").css({
            "background": "url(https://static0.fitbit.com/simple.b-cssdisabled-png.h96ea51291a7b8f4bf20bad599cdeec45.pack?items\x3d%2Fcontent%2Fassets%2Fonezip%2Fimages%2Fholiday%2Fbg_stripe_productpage.png) center 4px repeat-x",
            "height": "17px",
            "margin-bottom": "-16px",
            "background-clip": "padding-box"
        })
    }
    $("#features_shipping_label").show()
});
var is_chrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
var is_ff = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
var is_ie = $.browser.msie;
$(document).ready(function() {
    if (is_chrome) $("head").append("\x3cstyle\x3e@media print{ body *{font-family:Arial,sans-serif!important;}}\x3c/style\x3e");
    if (is_ff || $.browser.safari) {
        $("section.specs-section").filter(function(i) {
            return i % 2 == 1
        }).after('\x3cdiv class\x3d"specs-page-break" style\x3d"page-break-after:always; width:100%; height:1px;"\x3e\x3c/div\x3e');
        $(".specs-page-break").last().remove()
    }
    if (is_ie) {
        $("section.specs-section").filter(function(i) {
            return i % 2 == 1
        }).after('\x3cdiv class\x3d"specs-page-break" style\x3d"page-break-before:always; width:100%; height:1px;"\x3e\x3c/div\x3e');
        $(".specs-page-break").last().remove()
    }
    if (is_ie && $("html").is(".ie6, .ie7, .ie8")) {
        Printfix();
        $("#accessories").prepend('\x3cdiv class\x3d"page-break"\x3e\x3c/div\x3e')
    }
    $(".page-break").css("page-break-after", "always")
});

function Printfix() {
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint
}

function beforePrint() {
    $("#box-carusel-left .text").css("left", "-70px");
    $("#dashboard .text1,#dashboard .text2,#dashboard .text3").css({
        "top": "-\x3d500"
    });
    $("#comparison-content-area table td.check").html("\x3cb\x3e\x26#x2713;\x3c/b\x3e");
    $("#comparison-content-area table td.check b").css("display", "none")
}

function afterPrint() {
    $("#box-carusel-left .text").css("left", "0px");
    $("#dashboard .text1,#dashboard .text2,#dashboard .text3").css({
        "top": "+\x3d500"
    });
    $("#comparison-content-area table td.check").html("")
}
(function(j, f) {
    function s(a, b) {
        var c = a.createElement("p");
        var m = a.getElementsByTagName("head")[0] || a.documentElement;
        c.innerHTML = "x\x3cstyle\x3e" + b + "\x3c/style\x3e";
        return m.insertBefore(c.lastChild, m.firstChild)
    }

    function o() {
        var a = d$$2.elements;
        return "string" == typeof a ? a.split(" ") : a
    }

    function n(a) {
        var b = t[a[u]];
        b || (b = {}, p++, a[u] = p, t[p] = b);
        return b
    }

    function v(a, b, c) {
        b || (b = f);
        if (e) return b.createElement(a);
        c || (c = n(b));
        b = c.cache[a] ? c.cache[a].cloneNode() : y.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() :
            c.createElem(a);
        return b.canHaveChildren && !z.test(a) ? c.frag.appendChild(b) : b
    }

    function A(a$$0, b) {
        if (!b.cache) b.cache = {}, b.createElem = a$$0.createElement, b.createFrag = a$$0.createDocumentFragment, b.frag = b.createFrag();
        a$$0.createElement = function(c) {
            return !d$$2.shivMethods ? b.createElem(c) : v(c, a$$0, b)
        };
        a$$0.createDocumentFragment = Function("h,f", "return function(){var n\x3df.cloneNode(),c\x3dn.createElement;h.shivMethods\x26\x26(" + o().join().replace(/\w+/g, function(a) {
            b.createElem(a);
            b.frag.createElement(a);
            return 'c("' + a + '")'
        }) + ");return n}")(d$$2, b.frag)
    }

    function w(a) {
        a || (a = f);
        var b = n(a);
        if (d$$2.shivCSS && !q && !b.hasCSS) b.hasCSS = !!s(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}");
        e || A(a, b);
        return a
    }

    function B(a) {
        var b;
        var c = a.attributes;
        var m = c.length;
        for (var f = a.ownerDocument.createElement(l + ":" + a.nodeName); m--;) b = c[m], b.specified && f.setAttribute(b.nodeName, b.nodeValue);
        f.style.cssText = a.style.cssText;
        return f
    }

    function x(a$$0) {
        function b() {
            clearTimeout(d$$0._removeSheetTimer);
            c$$0 && c$$0.removeNode(!0);
            c$$0 = null
        }
        var c$$0;
        var f;
        var d$$0 = n(a$$0);
        var e$$0 = a$$0.namespaces;
        var j$$0 = a$$0.parentWindow;
        if (!C || a$$0.printShived) return a$$0;
        "undefined" == typeof e$$0[l] && e$$0.add(l);
        j$$0.attachEvent("onbeforeprint", function() {
            b();
            var g;
            var i;
            var d;
            d = a$$0.styleSheets;
            var e = [];
            var h = d.length;
            for (var k = Array(h); h--;) k[h] = d[h];
            for (; d = k.pop();)
                if (!d.disabled && D.test(d.media)) {
                    try {
                        g = d.imports, i = g.length
                    } catch (j) {
                        i = 0
                    }
                    for (h = 0; h < i; h++) k.push(g[h]);
                    try {
                        e.push(d.cssText)
                    } catch (n) {}
                }
            g = e.reverse().join("").split("{");
            i = g.length;
            h = RegExp("(^|[\\s,\x3e+~])(" + o().join("|") + ")(?\x3d[[\\s,\x3e+~#.:]|$)", "gi");
            for (k = "$1" + l + "\\:$2"; i--;) e = g[i] = g[i].split("}"), e[e.length - 1] = e[e.length - 1].replace(h, k), g[i] = e.join("}");
            e = g.join("{");
            i = a$$0.getElementsByTagName("*");
            h = i.length;
            k = RegExp("^(?:" + o().join("|") + ")$", "i");
            for (d = []; h--;) g = i[h], k.test(g.nodeName) && d.push(g.applyElement(B(g)));
            f = d;
            c$$0 = s(a$$0, e)
        });
        j$$0.attachEvent("onafterprint", function() {
            var a = f;
            for (var c = a.length; c--;) a[c].removeNode();
            clearTimeout(d$$0._removeSheetTimer);
            d$$0._removeSheetTimer = setTimeout(b, 500)
        });
        a$$0.printShived = !0;
        return a$$0
    }
    var r = j.html5 || {};
    var z = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    var y = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    var q;
    var u = "_html5shiv";
    var p = 0;
    var t = {};
    var e;
    (function() {
        try {
            var a = f.createElement("a");
            a.innerHTML = "\x3cxyz\x3e\x3c/xyz\x3e";
            q = "hidden" in a;
            var b;
            if (!(b = 1 == a.childNodes.length)) {
                f.createElement("a");
                var c = f.createDocumentFragment();
                b = "undefined" == typeof c.cloneNode || "undefined" == typeof c.createDocumentFragment || "undefined" == typeof c.createElement
            }
            e = b
        } catch (d) {
            e = q = !0
        }
    })();
    var d$$2 = {
        elements: r.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
        version: "3.6.2pre",
        shivCSS: !1 !== r.shivCSS,
        supportsUnknownElements: e,
        shivMethods: !1 !== r.shivMethods,
        type: "default",
        shivDocument: w,
        createElement: v,
        createDocumentFragment: function(a,
            b) {
            a || (a = f);
            if (e) return a.createDocumentFragment();
            b = b || n(a);
            var c = b.frag.cloneNode();
            var d = 0;
            var j = o();
            for (var l = j.length; d < l; d++) c.createElement(j[d]);
            return c
        }
    };
    j.html5 = d$$2;
    w(f);
    var D = /^$|\b(?:all|print)\b/;
    var l = "html5shiv";
    var C = !e && function() {
        var a = f.documentElement;
        return !("undefined" == typeof f.namespaces || "undefined" == typeof f.parentWindow || "undefined" == typeof a.applyElement || "undefined" == typeof a.removeNode || "undefined" == typeof j.attachEvent)
    }();
    d$$2.type += " print";
    d$$2.shivPrint = x;
    x(f)
})(this,
    document);
window.Modernizr = function(a, b, c) {
        function z(a) {
            j.cssText = a
        }

        function A(a, b) {
            return z(m.join(a + ";") + (b || ""))
        }

        function B(a, b) {
            return typeof a === b
        }

        function C(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function D(a, b) {
            for (var d in a) {
                var e = a[d];
                if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0
            }
            return !1
        }

        function E(a, b, d) {
            for (var e in a) {
                var f = b[a[e]];
                if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f
            }
            return !1
        }

        function F(a, b, c) {
            var d = a.charAt(0).toUpperCase() + a.slice(1);
            var e = (a + " " + o.join(d + " ") + d).split(" ");
            return B(b,
                "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), E(e, b, c))
        }
        var d = "2.8.3";
        var e = {};
        var f = !0;
        var g = b.documentElement;
        var h = "modernizr";
        var i = b.createElement(h);
        var j = i.style;
        var k;
        var l = {}.toString;
        var m = " -webkit- -moz- -o- -ms- ".split(" ");
        var n = "Webkit Moz O ms";
        var o = n.split(" ");
        var p = n.toLowerCase().split(" ");
        var q = {};
        var r = {};
        var s = {};
        var t = [];
        var u = t.slice;
        var v;
        var w = function(a, c, d, e) {
            var f;
            var i;
            var j;
            var k;
            var l = b.createElement("div");
            var m = b.body;
            var n = m || b.createElement("body");
            if (parseInt(d, 10))
                for (; d--;) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
            return f = ["\x26#173;", '\x3cstyle id\x3d"s', h, '"\x3e', a, "\x3c/style\x3e"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
        };
        var x = {}.hasOwnProperty;
        var y;
        !B(x, "undefined") && !B(x.call, "undefined") ? y = function(a,
            b) {
            return x.call(a, b)
        } : y = function(a, b) {
            return b in a && B(a.constructor.prototype[b], "undefined")
        }, Function.prototype.bind || (Function.prototype.bind = function(b) {
            var c = this;
            if (typeof c != "function") throw new TypeError;
            var d = u.call(arguments, 1);
            var e = function() {
                if (this instanceof e) {
                    var a = function() {};
                    a.prototype = c.prototype;
                    var f = new a;
                    var g = c.apply(f, d.concat(u.call(arguments)));
                    return Object(g) === g ? g : f
                }
                return c.apply(b, d.concat(u.call(arguments)))
            };
            return e
        }), q.touch = function() {
            var c;
            return "ontouchstart" in
                a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : w(["@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
                    c = a.offsetTop === 9
                }), c
        }, q.backgroundsize = function() {
            return F("backgroundSize")
        }, q.cssanimations = function() {
            return F("animationName")
        }, q.csstransforms = function() {
            return !!F("transform")
        }, q.csstransforms3d = function() {
            var a = !!F("perspective");
            return a && "webkitPerspective" in g.style && w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",
                function(b, c) {
                    a = b.offsetLeft === 9 && b.offsetHeight === 3
                }), a
        }, q.csstransitions = function() {
            return F("transition")
        };
        for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v));
        return e.addTest = function(a, b) {
                if (typeof a == "object")
                    for (var d in a) y(a, d) && e.addTest(d, a[d]);
                else {
                    a = a.toLowerCase();
                    if (e[a] !== c) return e;
                    b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
                }
                return e
            }, z(""), i = k = null,
            function(a$$1, b$$0) {
                function l(a, b) {
                    var c = a.createElement("p");
                    var d = a.getElementsByTagName("head")[0] || a.documentElement;
                    return c.innerHTML = "x\x3cstyle\x3e" + b + "\x3c/style\x3e", d.insertBefore(c.lastChild, d.firstChild)
                }

                function m() {
                    var a = s.elements;
                    return typeof a == "string" ? a.split(" ") : a
                }

                function n(a) {
                    var b = j[a[h]];
                    return b || (b = {}, i++, a[h] = i, j[i] = b), b
                }

                function o(a, c, d) {
                    c || (c = b$$0);
                    if (k) return c.createElement(a);
                    d || (d = n(c));
                    var g;
                    return d.cache[a] ? g = d.cache[a].cloneNode() : f$$0.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren &&
                        !e$$0.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g
                }

                function p(a, c) {
                    a || (a = b$$0);
                    if (k) return a.createDocumentFragment();
                    c = c || n(a);
                    var d = c.frag.cloneNode();
                    var e = 0;
                    var f = m();
                    for (var g = f.length; e < g; e++) d.createElement(f[e]);
                    return d
                }

                function q(a$$0, b) {
                    b.cache || (b.cache = {}, b.createElem = a$$0.createElement, b.createFrag = a$$0.createDocumentFragment, b.frag = b.createFrag()), a$$0.createElement = function(c) {
                        return s.shivMethods ? o(c, a$$0, b) : b.createElem(c)
                    }, a$$0.createDocumentFragment = Function("h,f", "return function(){var n\x3df.cloneNode(),c\x3dn.createElement;h.shivMethods\x26\x26(" +
                        m().join().replace(/[\w\-]+/g, function(a) {
                            return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
                        }) + ");return n}")(s, b.frag)
                }

                function r(a) {
                    a || (a = b$$0);
                    var c = n(a);
                    return s.shivCSS && !g$$0 && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a
                }
                var c$$0 = "3.7.0";
                var d$$0 = a$$1.html5 || {};
                var e$$0 = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
                var f$$0 =
                    /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
                var g$$0;
                var h = "_html5shiv";
                var i = 0;
                var j = {};
                var k;
                (function() {
                    try {
                        var a$$0 = b$$0.createElement("a");
                        a$$0.innerHTML = "\x3cxyz\x3e\x3c/xyz\x3e", g$$0 = "hidden" in a$$0, k = a$$0.childNodes.length == 1 || function() {
                            b$$0.createElement("a");
                            var a = b$$0.createDocumentFragment();
                            return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                        }()
                    } catch (c) {
                        g$$0 = !0, k = !0
                    }
                })();
                var s = {
                    elements: d$$0.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
                    version: c$$0,
                    shivCSS: d$$0.shivCSS !== !1,
                    supportsUnknownElements: k,
                    shivMethods: d$$0.shivMethods !== !1,
                    type: "default",
                    shivDocument: r,
                    createElement: o,
                    createDocumentFragment: p
                };
                a$$1.html5 = s, r(b$$0)
            }(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, e.testProp = function(a) {
                return D([a])
            },
            e.testAllProps = F, e.testStyles = w, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), e
    }(this, this.document),
    function(a$$3, b$$2, c$$2) {
        function d$$1(a) {
            return "[object Function]" == o$$0.call(a)
        }

        function e$$0(a) {
            return "string" == typeof a
        }

        function f$$0() {}

        function g$$1(a) {
            return !a || "loaded" == a || "complete" == a || "uninitialized" == a
        }

        function h$$1() {
            var a = p.shift();
            q = 1, a ? a.t ? m$$0(function() {
                ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
            }, 0) : (a(), h$$1()) : q = 0
        }

        function i$$1(a,
            c, d$$0, e, f, i, j) {
            function k(b) {
                if (!o && g$$1(l.readyState) && (u.r = o = 1, !q && h$$1(), l.onload = l.onreadystatechange = null, b)) {
                    "img" != a && m$$0(function() {
                        t.removeChild(l)
                    }, 50);
                    for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
                }
            }
            j = j || B.errorTimeout;
            var l = b$$2.createElement(a);
            var o = 0;
            var r = 0;
            var u = {
                t: d$$0,
                s: c,
                e: f,
                a: i,
                x: j
            };
            1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
                k.call(this, r)
            }, p.splice(e, 0, u), "img" != a && (r ||
                2 === y[c] ? (t.insertBefore(l, s ? null : n$$0), m$$0(k, j)) : y[c].push(l))
        }

        function j$$1(a, b, c, d, f) {
            return q = 0, b = b || "j", e$$0(a) ? i$$1("c" == b ? v : u$$0, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h$$1()), this
        }

        function k$$0() {
            var a = B;
            return a.loader = {
                load: j$$1,
                i: 0
            }, a
        }
        var l$$1 = b$$2.documentElement;
        var m$$0 = a$$3.setTimeout;
        var n$$0 = b$$2.getElementsByTagName("script")[0];
        var o$$0 = {}.toString;
        var p = [];
        var q = 0;
        var r$$0 = "MozAppearance" in l$$1.style;
        var s = r$$0 && !!b$$2.createRange().compareNode;
        var t = s ? l$$1 :
            n$$0.parentNode;
        l$$1 = a$$3.opera && "[object Opera]" == o$$0.call(a$$3.opera);
        l$$1 = !!b$$2.attachEvent && !l$$1;
        var u$$0 = r$$0 ? "object" : l$$1 ? "script" : "img";
        var v = l$$1 ? "script" : u$$0;
        var w = Array.isArray || function(a) {
            return "[object Array]" == o$$0.call(a)
        };
        var x = [];
        var y = {};
        var z = {
            timeout: function(a, b) {
                return b.length && (a.timeout = b[0]), a
            }
        };
        var A;
        var B;
        B = function(a$$2) {
                function b$$1(a) {
                    a = a.split("!");
                    var b = x.length;
                    var c = a.pop();
                    var d = a.length;
                    c = {
                        url: c,
                        origUrl: c,
                        prefixes: a
                    };
                    var e;
                    var f;
                    var g;
                    for (f = 0; f < d; f++) g = a[f].split("\x3d"),
                        (e = z[g.shift()]) && (c = e(c, g));
                    for (f = 0; f < b; f++) c = x[f](c);
                    return c
                }

                function g$$0(a, e, f, g, h) {
                    var i = b$$1(a);
                    var j = i.autoCallback;
                    i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d$$1(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c$$2, i.noexec, i.attrs, i.timeout), (d$$1(e) || d$$1(j)) && f.load(function() {
                        k$$0(), e && e(i.origUrl, h, g), j && j(i.origUrl,
                            h, g), y[i.url] = 2
                    })))
                }

                function h$$0(a$$1, b$$0) {
                    function c$$1(a$$0, c$$0) {
                        if (a$$0)
                            if (e$$0(a$$0)) c$$0 || (j = function() {
                                var a = [].slice.call(arguments);
                                k.apply(this, a), l()
                            }), g$$0(a$$0, j, b$$0, 0, h);
                            else {
                                if (Object(a$$0) === a$$0)
                                    for (n in m = function() {
                                            var b = 0;
                                            for (var c in a$$0) a$$0.hasOwnProperty(c) && b++;
                                            return b
                                        }(), a$$0) a$$0.hasOwnProperty(n) && (!c$$0 && !--m && (d$$1(j) ? j = function() {
                                        var a = [].slice.call(arguments);
                                        k.apply(this, a), l()
                                    } : j[n] = function(a) {
                                        return function() {
                                            var b = [].slice.call(arguments);
                                            a && a.apply(this,
                                                b), l()
                                        }
                                    }(k[n])), g$$0(a$$0[n], j, b$$0, n, h))
                            }
                        else !c$$0 && l()
                    }
                    var h = !!a$$1.test;
                    var i = a$$1.load || a$$1.both;
                    var j = a$$1.callback || f$$0;
                    var k = j;
                    var l = a$$1.complete || f$$0;
                    var m;
                    var n;
                    c$$1(h ? a$$1.yep : a$$1.nope, !!i), i && c$$1(i)
                }
                var i$$0;
                var j$$0;
                var l$$0 = this.yepnope.loader;
                if (e$$0(a$$2)) g$$0(a$$2, 0, l$$0, 0);
                else if (w(a$$2))
                    for (i$$0 = 0; i$$0 < a$$2.length; i$$0++) j$$0 = a$$2[i$$0], e$$0(j$$0) ? g$$0(j$$0, 0, l$$0, 0) : w(j$$0) ? B(j$$0) : Object(j$$0) === j$$0 && h$$0(j$$0, l$$0);
                else Object(a$$2) === a$$2 && h$$0(a$$2, l$$0)
            }, B.addPrefix =
            function(a, b) {
                z[a] = b
            }, B.addFilter = function(a) {
                x.push(a)
            }, B.errorTimeout = 1E4, null == b$$2.readyState && b$$2.addEventListener && (b$$2.readyState = "loading", b$$2.addEventListener("DOMContentLoaded", A = function() {
                b$$2.removeEventListener("DOMContentLoaded", A, 0), b$$2.readyState = "complete"
            }, 0)), a$$3.yepnope = k$$0(), a$$3.yepnope.executeStack = h$$1, a$$3.yepnope.injectJs = function(a, c, d, e, i, j) {
                var k = b$$2.createElement("script");
                var l;
                var o;
                e = e || B.errorTimeout;
                k.src = a;
                for (o in d) k.setAttribute(o, d[o]);
                c = j ? h$$1 : c || f$$0,
                    k.onreadystatechange = k.onload = function() {
                        !l && g$$1(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
                    }, m$$0(function() {
                        l || (l = 1, c(1))
                    }, e), i ? k.onload() : n$$0.parentNode.insertBefore(k, n$$0)
            }, a$$3.yepnope.injectCss = function(a, c, d, e, g, i) {
                e = b$$2.createElement("link");
                var j;
                c = i ? h$$1 : c || f$$0;
                e.href = a, e.rel = "stylesheet", e.type = "text/css";
                for (j in d) e.setAttribute(j, d[j]);
                g || (n$$0.parentNode.insertBefore(e, n$$0), m$$0(c, 0))
            }
    }(this, document), Modernizr.load = function() {
        yepnope.apply(window, [].slice.call(arguments,
            0))
    };
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * (--t * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c /
            2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x,
        t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) /
            p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t *
            d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x,
            d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b;
        else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        else return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
    }
});
(function($, window) {
    var $window = $(window);
    $.fn.lazyload = function(options) {
        function update() {
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) return;
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings));
                else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    counter = 0
                } else if (++counter > settings.failure_limit) return false
            })
        }
        var elements = this;
        var $container;
        var settings = {
            threshold: 200,
            failure_limit: 8,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: false,
            appear: null,
            load: null
        };
        if (options) {
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed
            }
            $.extend(settings, options)
        }
        $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);
        if (0 === settings.event.indexOf("scroll")) $container.bind(settings.event,
            function(event) {
                return update()
            });
        this.each(function() {
            var self = this;
            var $self = $(self);
            self.loaded = false;
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings)
                    }
                    var loadImgUri;
                    if ($self.data("background")) loadImgUri = $self.data("background");
                    else loadImgUri = $self.data(settings.data_attribute);
                    $("\x3cimg /\x3e").bind("load", function() {
                        $self.hide();
                        if ($self.data("background")) {
                            $self.css("backgroundImage", "url(" +
                                $self.data("background") + ")");
                            $self.removeClass("not-loaded")
                        } else $self.attr("src", $self.data(settings.data_attribute));
                        $self[settings.effect](settings.effect_speed);
                        $self.css("visibility", "visible");
                        self.loaded = true;
                        if ($self.hasClass("hidden")) $self.css("display", "none");
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded
                        });
                        elements = $(temp);
                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings)
                        }
                    }).attr("src", loadImgUri)
                }
            });
            if (0 !== settings.event.indexOf("scroll")) $self.bind(settings.event,
                function(event) {
                    if (!self.loaded) $self.trigger("appear")
                })
        });
        $window.bind("resize", function(event) {
            update()
        });
        $(document).ready(function() {
            update()
        });
        return this
    };
    $.belowthefold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) fold = $window.height() + $window.scrollTop();
        else fold = $(settings.container).offset().top + $(settings.container).height();
        return fold <= $(element).offset().top - settings.threshold
    };
    $.rightoffold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) fold = $window.width() + $window.scrollLeft();
        else fold = $(settings.container).offset().left + $(settings.container).width();
        return fold <= $(element).offset().left - settings.threshold
    };
    $.abovethetop = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) fold = $window.scrollTop();
        else fold = $(settings.container).offset().top;
        return fold >= $(element).offset().top + settings.threshold + $(element).height()
    };
    $.leftofbegin =
        function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) fold = $window.scrollLeft();
            else fold = $(settings.container).offset().left;
            return fold >= $(element).offset().left + settings.threshold + $(element).width()
        };
    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings)
    };
    $.extend($.expr[":"], {
        "below-the-fold": function(a) {
            return $.belowthefold(a, {
                threshold: 0
            })
        },
        "above-the-top": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            })
        },
        "right-of-screen": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            })
        },
        "left-of-screen": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            })
        },
        "in-viewport": function(a) {
            return $.inviewport(a, {
                threshold: 0
            })
        },
        "above-the-fold": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            })
        },
        "right-of-fold": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            })
        },
        "left-of-fold": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            })
        }
    })
})(jQuery, window);
$(".lazyload").lazyload({
    effect: "fadeIn"
}).css("visibility", "hidden");
fotoramaVersion = "4.6.2";
(function() {
    (function() {
        (function(e, t) {
            function M(e) {
                var t = e.length;
                var n = x.type(e);
                return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e)
            }

            function F(e$$0) {
                var t = O[e$$0] = {};
                return x.each(e$$0.match(T) || [], function(e, n) {
                    t[n] = !0
                }), t
            }

            function R(e, n, r, i) {
                if (x.acceptData(e)) {
                    var o;
                    var a;
                    var s = x.expando;
                    var l = e.nodeType;
                    var u = l ? x.cache : e;
                    var c = l ? e[s] : e[s] && s;
                    if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n) return c || (c = l ? e[s] = p.pop() || x.guid++ :
                        s), u[c] || (u[c] = l ? {} : {
                        toJSON: x.noop
                    }), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, o
                }
            }

            function W(e, t, n) {
                if (x.acceptData(e)) {
                    var r;
                    var i;
                    var o = e.nodeType;
                    var a = o ? x.cache : e;
                    var s = o ? e[x.expando] : x.expando;
                    if (a[s]) {
                        if (t && (r = n ? a[s] : a[s].data)) {
                            x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [t] : (t = x.camelCase(t),
                                t = t in r ? [t] : t.split(" ")), i = t.length;
                            for (; i--;) delete r[t[i]];
                            if (n ? !I(r) : !x.isEmptyObject(r)) return
                        }(n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([e], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
                    }
                }
            }

            function $(e, n, r) {
                if (r === t && 1 === e.nodeType) {
                    var i = "data-" + n.replace(P, "-$1").toLowerCase();
                    if (r = e.getAttribute(i), "string" == typeof r) {
                        try {
                            r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r
                        } catch (o) {}
                        x.data(e, n, r)
                    } else r = t
                }
                return r
            }

            function I(e) {
                for (var t in e)
                    if (("data" !==
                            t || !x.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
                return !0
            }

            function it() {
                return !0
            }

            function ot() {
                return !1
            }

            function at() {
                try {
                    return a.activeElement
                } catch (e) {}
            }

            function pt(e, t) {
                do e = e[t]; while (e && 1 !== e.nodeType);
                return e
            }

            function ft(e$$0, t, n) {
                if (x.isFunction(t)) return x.grep(e$$0, function(e, r) {
                    return !!t.call(e, r, e) !== n
                });
                if (t.nodeType) return x.grep(e$$0, function(e) {
                    return e === t !== n
                });
                if ("string" == typeof t) {
                    if (st.test(t)) return x.filter(t, e$$0, n);
                    t = x.filter(t, e$$0)
                }
                return x.grep(e$$0, function(e) {
                    return x.inArray(e,
                        t) >= 0 !== n
                })
            }

            function dt(e) {
                var t = ht.split("|");
                var n = e.createDocumentFragment();
                if (n.createElement)
                    for (; t.length;) n.createElement(t.pop());
                return n
            }

            function Lt(e, t) {
                return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }

            function Ht(e) {
                return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e
            }

            function qt(e) {
                var t = Et.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"), e
            }

            function _t(e,
                t) {
                var n;
                for (var r = 0; null != (n = e[r]); r++) x._data(n, "globalEval", !t || x._data(t[r], "globalEval"))
            }

            function Mt(e, t) {
                if (1 === t.nodeType && x.hasData(e)) {
                    var n;
                    var r;
                    var i;
                    var o = x._data(e);
                    var a = x._data(t, o);
                    var s = o.events;
                    if (s) {
                        delete a.handle, a.events = {};
                        for (n in s)
                            for (r = 0, i = s[n].length; i > r; r++) x.event.add(t, n, s[n][r])
                    }
                    a.data && (a.data = x.extend({}, a.data))
                }
            }

            function Ot(e, t) {
                var n;
                var r;
                var i;
                if (1 === t.nodeType) {
                    if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando]) {
                        i = x._data(t);
                        for (r in i.events) x.removeEvent(t,
                            r, i.handle);
                        t.removeAttribute(x.expando)
                    }
                    "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
                }
            }

            function Ft(e, n) {
                var r;
                var o;
                var a = 0;
                var s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
                if (!s)
                    for (s = [], r = e.childNodes || e; null != (o = r[a]); a++) !n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n));
                return n === t || n && x.nodeName(e, n) ? x.merge([e], s) : s
            }

            function Bt(e) {
                Ct.test(e.type) && (e.defaultChecked = e.checked)
            }

            function tn(e, t) {
                if (t in e) return t;
                var n = t.charAt(0).toUpperCase() + t.slice(1);
                var r = t;
                for (var i = en.length; i--;)
                    if (t = en[i] + n, t in e) return t;
                return r
            }

            function nn(e,
                t) {
                return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e)
            }

            function rn(e, t) {
                var n;
                var r;
                var i;
                var o = [];
                var a = 0;
                for (var s = e.length; s > a; a++) r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display"))));
                for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display ||
                    (r.style.display = t ? o[a] || "" : "none"));
                return e
            }

            function on(e, t, n) {
                var r = Vt.exec(t);
                return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
            }

            function an(e, t, n, r, i) {
                var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0;
                for (var a = 0; 4 > o; o += 2) "margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i)));
                return a
            }

            function sn(e, t, n) {
                var r = !0;
                var i = "width" === t ? e.offsetWidth : e.offsetHeight;
                var o = Rt(e);
                var a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o);
                if (0 >= i || null == i) {
                    if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i)) return i;
                    r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0
                }
                return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px"
            }

            function ln(e) {
                var t = a;
                var n = Gt[e];
                return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("\x3ciframe frameborder\x3d'0' width\x3d'0' height\x3d'0'/\x3e").css("cssText", "display:block !important")).appendTo(t.documentElement),
                    t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("\x3c!doctype html\x3e\x3chtml\x3e\x3cbody\x3e"), t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n
            }

            function un(e, t) {
                var n = x(t.createElement(e)).appendTo(t.body);
                var r = x.css(n[0], "display");
                return n.remove(), r
            }

            function gn(e, t$$0, n, r) {
                var i$$0;
                if (x.isArray(t$$0)) x.each(t$$0, function(t, i) {
                    n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
                });
                else if (n || "object" !== x.type(t$$0)) r(e, t$$0);
                else
                    for (i$$0 in t$$0) gn(e + "[" + i$$0 + "]", t$$0[i$$0],
                        n, r)
            }

            function Hn(e) {
                return function(t, n) {
                    "string" != typeof t && (n = t, t = "*");
                    var r;
                    var i = 0;
                    var o = t.toLowerCase().match(T) || [];
                    if (x.isFunction(n))
                        for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                }
            }

            function qn(e$$0, n, r, i) {
                function s(l$$0) {
                    var u;
                    return o[l$$0] = !0, x.each(e$$0[l$$0] || [], function(e, l) {
                        var c = l(n, r, i);
                        return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), s(c), !1)
                    }), u
                }
                var o = {};
                var a = e$$0 === jn;
                return s(n.dataTypes[0]) || !o["*"] && s("*")
            }

            function _n(e, n) {
                var r;
                var i;
                var o = x.ajaxSettings.flatOptions || {};
                for (i in n) n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]);
                return r && x.extend(!0, e, r), e
            }

            function Mn(e, n, r) {
                var i;
                var o;
                var a;
                var s;
                var l = e.contents;
                for (var u = e.dataTypes;
                    "*" === u[0];) u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
                if (o)
                    for (s in l)
                        if (l[s] && l[s].test(o)) {
                            u.unshift(s);
                            break
                        }
                if (u[0] in r) a = u[0];
                else {
                    for (s in r) {
                        if (!u[0] || e.converters[s + " " + u[0]]) {
                            a = s;
                            break
                        }
                        i || (i = s)
                    }
                    a = a || i
                }
                return a ? (a !== u[0] && u.unshift(a), r[a]) :
                    t
            }

            function On(e, t, n, r) {
                var i;
                var o;
                var a;
                var s;
                var l;
                var u = {};
                var c = e.dataTypes.slice();
                if (c[1])
                    for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
                for (o = c.shift(); o;)
                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                        if ("*" === o) o = l;
                        else if ("*" !== l && l !== o) {
                    if (a = u[l + " " + o] || u["* " + o], !a)
                        for (i in u)
                            if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a &&
                            e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (p) {
                            return {
                                state: "parsererror",
                                error: a ? p : "No conversion from " + l + " to " + o
                            }
                        }
                }
                return {
                    state: "success",
                    data: t
                }
            }

            function In() {
                try {
                    return new e.XMLHttpRequest
                } catch (t) {}
            }

            function zn() {
                try {
                    return new e.ActiveXObject("Microsoft.XMLHTTP")
                } catch (t) {}
            }

            function Kn() {
                return setTimeout(function() {
                    Xn = t
                }), Xn = x.now()
            }

            function Zn(e, t, n) {
                var r;
                var i = (Qn[t] || []).concat(Qn["*"]);
                var o = 0;
                for (var a = i.length; a > o; o++)
                    if (r = i[o].call(n, t, e)) return r
            }

            function er(e, t$$0, n$$0) {
                var r$$0;
                var i;
                var o$$0 = 0;
                var a$$0 = Gn.length;
                var s = x.Deferred().always(function() {
                    delete l$$0.elem
                });
                var l$$0 = function() {
                    if (i) return !1;
                    var t = Xn || Kn();
                    var n = Math.max(0, u.startTime + u.duration - t);
                    var r = n / u.duration || 0;
                    var o = 1 - r;
                    var a = 0;
                    for (var l = u.tweens.length; l > a; a++) u.tweens[a].run(o);
                    return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1)
                };
                var u = s.promise({
                    elem: e,
                    props: x.extend({}, t$$0),
                    opts: x.extend(!0, {
                        specialEasing: {}
                    }, n$$0),
                    originalProperties: t$$0,
                    originalOptions: n$$0,
                    startTime: Xn || Kn(),
                    duration: n$$0.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                        return u.tweens.push(r), r
                    },
                    stop: function(t) {
                        var n = 0;
                        var r = t ? u.tweens.length : 0;
                        if (i) return this;
                        for (i = !0; r > n; n++) u.tweens[n].run(1);
                        return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
                    }
                });
                var c = u.props;
                for (tr(c, u.opts.specialEasing); a$$0 > o$$0; o$$0++)
                    if (r$$0 = Gn[o$$0].call(u, e, c, u.opts)) return r$$0;
                return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l$$0, {
                    elem: e,
                    anim: u,
                    queue: u.opts.queue
                })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
            }

            function tr(e, t) {
                var n;
                var r;
                var i;
                var o;
                var a;
                for (n in e)
                    if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a) {
                        o = a.expand(o), delete e[r];
                        for (n in o) n in e || (e[n] = o[n], t[n] = i)
                    } else t[r] = i
            }

            function nr(e, t$$0, n) {
                var r;
                var i;
                var o;
                var a;
                var s;
                var l;
                var u = this;
                var c = {};
                var p = e.style;
                var f =
                    e.nodeType && nn(e);
                var d = x._data(e, "fxshow");
                n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || l()
                }), s.unqueued++, u.always(function() {
                    u.always(function() {
                        s.unqueued--, x.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height" in t$$0 || "width" in t$$0) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom =
                    1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always(function() {
                    p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
                }));
                for (r in t$$0)
                    if (i = t$$0[r], Vn.exec(i)) {
                        if (delete t$$0[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) continue;
                        c[r] = d && d[r] || x.style(e, r)
                    }
                if (!x.isEmptyObject(c)) {
                    d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), f ? x(e).show() : u.done(function() {
                        x(e).hide()
                    }), u.done(function() {
                        var t;
                        x._removeData(e,
                            "fxshow");
                        for (t in c) x.style(e, t, c[t])
                    });
                    for (r in c) a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
                }
            }

            function rr(e, t, n, r, i) {
                return new rr.prototype.init(e, t, n, r, i)
            }

            function ir(e, t) {
                var n;
                var r = {
                    height: e
                };
                var i = 0;
                for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Zt[i], r["margin" + n] = r["padding" + n] = e;
                return t && (r.opacity = r.width = e), r
            }

            function or(e) {
                return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
            }
            var n;
            var r;
            var i = typeof t;
            var o = e.location;
            var a = e.document;
            var s = a.documentElement;
            var l = e.jQuery;
            var u = e.$;
            var c = {};
            var p = [];
            var f = "1.10.2";
            var d = p.concat;
            var h = p.push;
            var g = p.slice;
            var m = p.indexOf;
            var y = c.toString;
            var v = c.hasOwnProperty;
            var b = f.trim;
            var x = function(e, t) {
                return new x.fn.init(e, t, r)
            };
            var w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
            var T = /\S+/g;
            var C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            var N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
            var k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
            var E = /^[\],:{}\s]*$/;
            var S = /(?:^|:|,)(?:\s*\[)+/g;
            var A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
            var j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
            var D = /^-ms-/;
            var L = /-([\da-z])/gi;
            var H = function(e, t) {
                return t.toUpperCase()
            };
            var q = function(e) {
                (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), x.ready())
            };
            var _ = function() {
                a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), e.detachEvent("onload", q))
            };
            x.fn = x.prototype = {
                    jquery: f,
                    constructor: x,
                    init: function(e, n, r) {
                        var i;
                        var o;
                        if (!e) return this;
                        if ("string" == typeof e) {
                            if (i = "\x3c" === e.charAt(0) && "\x3e" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : N.exec(e), !i || !i[1] && n) return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
                            if (i[1]) {
                                if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), k.test(i[1]) && x.isPlainObject(n))
                                    for (i in n) x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                                return this
                            }
                            if (o = a.getElementById(i[2]), o && o.parentNode) {
                                if (o.id !== i[2]) return r.find(e);
                                this.length = 1, this[0] = o
                            }
                            return this.context = a, this.selector = e, this
                        }
                        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), x.makeArray(e, this))
                    },
                    selector: "",
                    length: 0,
                    toArray: function() {
                        return g.call(this)
                    },
                    get: function(e) {
                        return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
                    },
                    pushStack: function(e) {
                        var t = x.merge(this.constructor(), e);
                        return t.prevObject = this, t.context = this.context, t
                    },
                    each: function(e,
                        t) {
                        return x.each(this, e, t)
                    },
                    ready: function(e) {
                        return x.ready.promise().done(e), this
                    },
                    slice: function() {
                        return this.pushStack(g.apply(this, arguments))
                    },
                    first: function() {
                        return this.eq(0)
                    },
                    last: function() {
                        return this.eq(-1)
                    },
                    eq: function(e) {
                        var t = this.length;
                        var n = +e + (0 > e ? t : 0);
                        return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
                    },
                    map: function(e) {
                        return this.pushStack(x.map(this, function(t, n) {
                            return e.call(t, n, t)
                        }))
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null)
                    },
                    push: h,
                    sort: [].sort,
                    splice: [].splice
                },
                x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function() {
                    var e;
                    var n;
                    var r;
                    var i;
                    var o;
                    var a;
                    var s = arguments[0] || {};
                    var l = 1;
                    var u = arguments.length;
                    var c = !1;
                    for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), u === l && (s = this, --l); u > l; l++)
                        if (null != (o = arguments[l]))
                            for (i in o) e = s[i], r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r));
                    return s
                }, x.extend({
                    expando: "jQuery" +
                        (f + Math.random()).replace(/\D/g, ""),
                    noConflict: function(t) {
                        return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x
                    },
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function(e) {
                        e ? x.readyWait++ : x.ready(!0)
                    },
                    ready: function(e) {
                        if (e === !0 ? !--x.readyWait : !x.isReady) {
                            if (!a.body) return setTimeout(x.ready);
                            x.isReady = !0, e !== !0 && --x.readyWait > 0 || (n.resolveWith(a, [x]), x.fn.trigger && x(a).trigger("ready").off("ready"))
                        }
                    },
                    isFunction: function(e) {
                        return "function" === x.type(e)
                    },
                    isArray: Array.isArray || function(e) {
                        return "array" === x.type(e)
                    },
                    isWindow: function(e) {
                        return null != e && e == e.window
                    },
                    isNumeric: function(e) {
                        return !isNaN(parseFloat(e)) && isFinite(e)
                    },
                    type: function(e) {
                        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e
                    },
                    isPlainObject: function(e) {
                        var n;
                        if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e)) return !1;
                        try {
                            if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf")) return !1
                        } catch (r) {
                            return !1
                        }
                        if (x.support.ownLast)
                            for (n in e) return v.call(e, n);
                        for (n in e);
                        return n === t || v.call(e, n)
                    },
                    isEmptyObject: function(e) {
                        for (var t in e) return !1;
                        return !0
                    },
                    error: function(e) {
                        throw Error(e);
                    },
                    parseHTML: function(e, t, n) {
                        if (!e || "string" != typeof e) return null;
                        "boolean" == typeof t && (n = t, t = !1), t = t || a;
                        var r = k.exec(e);
                        var i = !n && [];
                        return r ? [t.createElement(r[1])] : (r = x.buildFragment([e], t, i), i && x(i).remove(), x.merge([], r.childNodes))
                    },
                    parseJSON: function(n) {
                        return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), n && E.test(n.replace(A, "@").replace(j,
                            "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), t)
                    },
                    parseXML: function(n) {
                        var r;
                        var i;
                        if (!n || "string" != typeof n) return null;
                        try {
                            e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
                        } catch (o) {
                            r = t
                        }
                        return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), r
                    },
                    noop: function() {},
                    globalEval: function(t$$0) {
                        t$$0 && x.trim(t$$0) && (e.execScript || function(t) {
                            e.eval.call(e,
                                t)
                        })(t$$0)
                    },
                    camelCase: function(e) {
                        return e.replace(D, "ms-").replace(L, H)
                    },
                    nodeName: function(e, t) {
                        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                    },
                    each: function(e, t, n) {
                        var r;
                        var i = 0;
                        var o = e.length;
                        var a = M(e);
                        if (n)
                            if (a)
                                for (; o > i; i++) {
                                    if (r = t.apply(e[i], n), r === !1) break
                                } else
                                    for (i in e) {
                                        if (r = t.apply(e[i], n), r === !1) break
                                    } else if (a)
                                        for (; o > i; i++) {
                                            if (r = t.call(e[i], i, e[i]), r === !1) break
                                        } else
                                            for (i in e)
                                                if (r = t.call(e[i], i, e[i]), r === !1) break;
                        return e
                    },
                    trim: b && !b.call("\ufeff\u00a0") ? function(e) {
                        return null ==
                            e ? "" : b.call(e)
                    } : function(e) {
                        return null == e ? "" : (e + "").replace(C, "")
                    },
                    makeArray: function(e, t) {
                        var n = t || [];
                        return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [e] : e) : h.call(n, e)), n
                    },
                    inArray: function(e, t, n) {
                        var r;
                        if (t) {
                            if (m) return m.call(t, e, n);
                            for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)
                                if (n in t && t[n] === e) return n
                        }
                        return -1
                    },
                    merge: function(e, n) {
                        var r = n.length;
                        var i = e.length;
                        var o = 0;
                        if ("number" == typeof r)
                            for (; r > o; o++) e[i++] = n[o];
                        else
                            for (; n[o] !== t;) e[i++] = n[o++];
                        return e.length = i, e
                    },
                    grep: function(e,
                        t, n) {
                        var r;
                        var i = [];
                        var o = 0;
                        var a = e.length;
                        for (n = !!n; a > o; o++) r = !!t(e[o], o), n !== r && i.push(e[o]);
                        return i
                    },
                    map: function(e, t, n) {
                        var r;
                        var i = 0;
                        var o = e.length;
                        var a = M(e);
                        var s = [];
                        if (a)
                            for (; o > i; i++) r = t(e[i], i, n), null != r && (s[s.length] = r);
                        else
                            for (i in e) r = t(e[i], i, n), null != r && (s[s.length] = r);
                        return d.apply([], s)
                    },
                    guid: 1,
                    proxy: function(e, n) {
                        var r;
                        var i;
                        var o;
                        return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), i = function() {
                                return e.apply(n || this, r.concat(g.call(arguments)))
                            },
                            i.guid = e.guid = e.guid || x.guid++, i) : t
                    },
                    access: function(e$$0, n$$0, r, i, o, a, s) {
                        var l = 0;
                        var u = e$$0.length;
                        var c = null == r;
                        if ("object" === x.type(r)) {
                            o = !0;
                            for (l in r) x.access(e$$0, n$$0, l, r[l], !0, a, s)
                        } else if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n$$0.call(e$$0, i), n$$0 = null) : (c = n$$0, n$$0 = function(e, t, n) {
                                return c.call(x(e), n)
                            })), n$$0))
                            for (; u > l; l++) n$$0(e$$0[l], r, s ? i : i.call(e$$0[l], l, n$$0(e$$0[l], r)));
                        return o ? e$$0 : c ? n$$0.call(e$$0) : u ? n$$0(e$$0[0], r) : a
                    },
                    now: function() {
                        return (new Date).getTime()
                    },
                    swap: function(e,
                        t, n, r) {
                        var i;
                        var o;
                        var a = {};
                        for (o in t) a[o] = e.style[o], e.style[o] = t[o];
                        i = n.apply(e, r || []);
                        for (o in t) e.style[o] = a[o];
                        return i
                    }
                }), x.ready.promise = function(t) {
                    if (!n)
                        if (n = x.Deferred(), "complete" === a.readyState) setTimeout(x.ready);
                        else if (a.addEventListener) a.addEventListener("DOMContentLoaded", q, !1), e.addEventListener("load", q, !1);
                    else {
                        a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q);
                        var r = !1;
                        try {
                            r = null == e.frameElement && a.documentElement
                        } catch (i) {}
                        r && r.doScroll && function o() {
                            if (!x.isReady) {
                                try {
                                    r.doScroll("left")
                                } catch (e) {
                                    return setTimeout(o,
                                        50)
                                }
                                _(), x.ready()
                            }
                        }()
                    }
                    return n.promise(t)
                }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
                    c["[object " + t + "]"] = t.toLowerCase()
                });
            r = x(a),
                function(e$$2, t$$1) {
                    function at(e, t, n, i) {
                        var o;
                        var a;
                        var s;
                        var l;
                        var u;
                        var c;
                        var d;
                        var m;
                        var y;
                        var x;
                        if ((t ? t.ownerDocument || t : w$$0) !== f$$0 && p$$0(t), t = t || f$$0, n = n || [], !e || "string" != typeof e) return n;
                        if (1 !== (l = t.nodeType) && 9 !== l) return [];
                        if (h$$0 && !i) {
                            if (o = Z.exec(e))
                                if (s = o[1])
                                    if (9 === l) {
                                        if (a = t.getElementById(s), !a || !a.parentNode) return n;
                                        if (a.id === s) return n.push(a), n
                                    } else {
                                        if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v$$0(t, a) && a.id === s) return n.push(a), n
                                    }
                            else {
                                if (o[2]) return M.apply(n, t.getElementsByTagName(e)), n;
                                if ((s = o[3]) && r$$1.getElementsByClassName && t.getElementsByClassName) return M.apply(n, t.getElementsByClassName(s)), n
                            }
                            if (r$$1.qsa && (!g$$0 || !g$$0.test(e))) {
                                if (m = d = b$$0, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase()) {
                                    for (c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "$\x26") : t.setAttribute("id", m), m =
                                        "[id\x3d'" + m + "'] ", u = c.length; u--;) c[u] = m + yt(c[u]);
                                    y = V.test(e) && t.parentNode || t, x = c.join(",")
                                }
                                if (x) try {
                                    return M.apply(n, y.querySelectorAll(x)), n
                                } catch (T) {} finally {
                                    d || t.removeAttribute("id")
                                }
                            }
                        }
                        return kt(e.replace(z, "$1"), t, n, i)
                    }

                    function st() {
                        function t(n, r) {
                            return e.push(n += " ") > o$$1.cacheLength && delete t[e.shift()], t[n] = r
                        }
                        var e = [];
                        return t
                    }

                    function lt(e) {
                        return e[b$$0] = !0, e
                    }

                    function ut(e) {
                        var t = f$$0.createElement("div");
                        try {
                            return !!e(t)
                        } catch (n) {
                            return !1
                        } finally {
                            t.parentNode && t.parentNode.removeChild(t),
                                t = null
                        }
                    }

                    function ct(e, t) {
                        var n = e.split("|");
                        for (var r = e.length; r--;) o$$1.attrHandle[n[r]] = t
                    }

                    function pt(e, t) {
                        var n = t && e;
                        var r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D);
                        if (r) return r;
                        if (n)
                            for (; n = n.nextSibling;)
                                if (n === t) return -1;
                        return e ? 1 : -1
                    }

                    function ft(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return "input" === n && t.type === e
                        }
                    }

                    function dt(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return ("input" === n || "button" === n) && t.type === e
                        }
                    }

                    function ht(e) {
                        return lt(function(t) {
                            return t = +t, lt(function(n, r) {
                                var i;
                                var o = e([], n.length, t);
                                for (var a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                            })
                        })
                    }

                    function gt() {}

                    function mt(e, t) {
                        var n;
                        var r;
                        var i;
                        var a;
                        var s;
                        var l;
                        var u;
                        var c = k$$0[e + " "];
                        if (c) return t ? 0 : c.slice(0);
                        for (s = e, l = [], u = o$$1.preFilter; s;) {
                            (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({
                                value: n,
                                type: r[0].replace(z, " ")
                            }), s = s.slice(n.length));
                            for (a in o$$1.filter) !(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), i.push({
                                value: n,
                                type: a,
                                matches: r
                            }), s = s.slice(n.length));
                            if (!n) break
                        }
                        return t ? s.length : s ? at.error(e) : k$$0(e, l).slice(0)
                    }

                    function yt(e) {
                        var t = 0;
                        var n = e.length;
                        for (var r = ""; n > t; t++) r += e[t].value;
                        return r
                    }

                    function vt(e, t$$0, n$$0) {
                        var r = t$$0.dir;
                        var o = n$$0 && "parentNode" === r;
                        var a = C$$0++;
                        return t$$0.first ? function(t, n, i) {
                            for (; t = t[r];)
                                if (1 === t.nodeType || o) return e(t, n, i)
                        } : function(t, n, s) {
                            var l;
                            var u;
                            var c;
                            var p = T$$0 + " " + a;
                            if (s)
                                for (; t = t[r];) {
                                    if ((1 === t.nodeType || o) && e(t, n, s)) return !0
                                } else
                                    for (; t = t[r];)
                                        if (1 === t.nodeType ||
                                            o)
                                            if (c = t[b$$0] || (t[b$$0] = {}), (u = c[r]) && u[0] === p) {
                                                if ((l = u[1]) === !0 || l === i$$1) return l === !0
                                            } else if (u = c[r] = [p], u[1] = e(t, n, s) || i$$1, u[1] === !0) return !0
                        }
                    }

                    function bt(e) {
                        return e.length > 1 ? function(t, n, r) {
                            for (var i = e.length; i--;)
                                if (!e[i](t, n, r)) return !1;
                            return !0
                        } : e[0]
                    }

                    function xt(e, t, n, r, i) {
                        var o;
                        var a = [];
                        var s = 0;
                        var l = e.length;
                        for (var u = null != t; l > s; s++)(o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
                        return a
                    }

                    function wt(e, t, n, r, i, o$$0) {
                        return r && !r[b$$0] && (r = wt(r)), i && !i[b$$0] && (i = wt(i, o$$0)), lt(function(o,
                            a, s, l) {
                            var u;
                            var c;
                            var p;
                            var f = [];
                            var d = [];
                            var h = a.length;
                            var g = o || Nt(t || "*", s.nodeType ? [s] : s, []);
                            var m = !e || !o && t ? g : xt(g, f, e, s, l);
                            var y = n ? i || (o ? e : h || r) ? [] : a : m;
                            if (n && n(m, y, s, l), r)
                                for (u = xt(y, d), r(u, [], s, l), c = u.length; c--;)(p = u[c]) && (y[d[c]] = !(m[d[c]] = p));
                            if (o) {
                                if (i || e) {
                                    if (i) {
                                        for (u = [], c = y.length; c--;)(p = y[c]) && u.push(m[c] = p);
                                        i(null, y = [], u, l)
                                    }
                                    for (c = y.length; c--;)(p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p))
                                }
                            } else y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y)
                        })
                    }

                    function Tt(e$$0) {
                        var t;
                        var n$$0;
                        var r$$0;
                        var i = e$$0.length;
                        var a = o$$1.relative[e$$0[0].type];
                        var s = a || o$$1.relative[" "];
                        var l = a ? 1 : 0;
                        var c = vt(function(e) {
                            return e === t
                        }, s, !0);
                        var p = vt(function(e) {
                            return F.call(t, e) > -1
                        }, s, !0);
                        for (var f = [function(e, n, r) {
                                return !a && (r || n !== u$$0) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r))
                            }]; i > l; l++)
                            if (n$$0 = o$$1.relative[e$$0[l].type]) f = [vt(bt(f), n$$0)];
                            else {
                                if (n$$0 = o$$1.filter[e$$0[l].type].apply(null, e$$0[l].matches), n$$0[b$$0]) {
                                    for (r$$0 = ++l; i > r$$0; r$$0++)
                                        if (o$$1.relative[e$$0[r$$0].type]) break;
                                    return wt(l >
                                        1 && bt(f), l > 1 && yt(e$$0.slice(0, l - 1).concat({
                                            value: " " === e$$0[l - 2].type ? "*" : ""
                                        })).replace(z, "$1"), n$$0, r$$0 > l && Tt(e$$0.slice(l, r$$0)), i > r$$0 && Tt(e$$0 = e$$0.slice(r$$0)), i > r$$0 && yt(e$$0))
                                }
                                f.push(n$$0)
                            }
                        return bt(f)
                    }

                    function Ct(e, t) {
                        var n = 0;
                        var r = t.length > 0;
                        var a = e.length > 0;
                        var s$$0 = function(s, l, c, p, d) {
                            var h;
                            var g;
                            var m;
                            var y = [];
                            var v = 0;
                            var b = "0";
                            var x = s && [];
                            var w = null != d;
                            var C = u$$0;
                            var N = s || a && o$$1.find.TAG("*", d && l.parentNode || l);
                            var k = T$$0 += null == C ? 1 : Math.random() || .1;
                            for (w && (u$$0 = l !== f$$0 && l, i$$1 = n); null !=
                                (h = N[b]); b++) {
                                if (a && h) {
                                    for (g = 0; m = e[g++];)
                                        if (m(h, l, c)) {
                                            p.push(h);
                                            break
                                        }
                                    w && (T$$0 = k, i$$1 = ++n)
                                }
                                r && ((h = !m && h) && v--, s && x.push(h))
                            }
                            if (v += b, r && b !== v) {
                                for (g = 0; m = t[g++];) m(x, y, l, c);
                                if (s) {
                                    if (v > 0)
                                        for (; b--;) x[b] || y[b] || (y[b] = q.call(p));
                                    y = xt(y)
                                }
                                M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p)
                            }
                            return w && (T$$0 = k, u$$0 = C), x
                        };
                        return r ? lt(s$$0) : s$$0
                    }

                    function Nt(e, t, n) {
                        var r = 0;
                        for (var i = t.length; i > r; r++) at(e, t[r], n);
                        return n
                    }

                    function kt(e, t, n, i) {
                        var a;
                        var s;
                        var u;
                        var c;
                        var p;
                        var f = mt(e);
                        if (!i && 1 === f.length) {
                            if (s =
                                f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r$$1.getById && 9 === t.nodeType && h$$0 && o$$1.relative[s[1].type]) {
                                if (t = (o$$1.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t) return n;
                                e = e.slice(s.shift().value.length)
                            }
                            for (a = Q.needsContext.test(e) ? 0 : s.length; a--;) {
                                if (u = s[a], o$$1.relative[c = u.type]) break;
                                if ((p = o$$1.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t))) {
                                    if (s.splice(a, 1), e = i.length && yt(s), !e) return M.apply(n, i), n;
                                    break
                                }
                            }
                        }
                        return l$$0(e, f)(i, t, !h$$0, n, V.test(e)),
                            n
                    }
                    var n$$1;
                    var r$$1;
                    var i$$1;
                    var o$$1;
                    var a$$0;
                    var s$$1;
                    var l$$0;
                    var u$$0;
                    var c$$0;
                    var p$$0;
                    var f$$0;
                    var d$$0;
                    var h$$0;
                    var g$$0;
                    var m$$0;
                    var y$$0;
                    var v$$0;
                    var b$$0 = "sizzle" + -new Date;
                    var w$$0 = e$$2.document;
                    var T$$0 = 0;
                    var C$$0 = 0;
                    var N$$0 = st();
                    var k$$0 = st();
                    var E = st();
                    var S = !1;
                    var A = function(e, t) {
                        return e === t ? (S = !0, 0) : 0
                    };
                    var j = typeof t$$1;
                    var D = 1 << 31;
                    var L = {}.hasOwnProperty;
                    var H = [];
                    var q = H.pop;
                    var _ = H.push;
                    var M = H.push;
                    var O = H.slice;
                    var F = H.indexOf || function(e) {
                        var t = 0;
                        for (var n = this.length; n > t; t++)
                            if (this[t] ===
                                e) return t;
                        return -1
                    };
                    var B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
                    var P = "[\\x20\\t\\r\\n\\f]";
                    var R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
                    var W = R.replace("w", "w#");
                    var $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?\x3d)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]";
                    var I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)";
                    var z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
                        P + "+$", "g");
                    var X = RegExp("^" + P + "*," + P + "*");
                    var U = RegExp("^" + P + "*([\x3e+~]|" + P + ")" + P + "*");
                    var V = RegExp(P + "*[+~]");
                    var Y = RegExp("\x3d" + P + "*([^\\]'\"]*)" + P + "*\\]", "g");
                    var J = RegExp(I);
                    var G = RegExp("^" + W + "$");
                    var Q = {
                        ID: RegExp("^#(" + R + ")"),
                        CLASS: RegExp("^\\.(" + R + ")"),
                        TAG: RegExp("^(" + R.replace("w", "w*") + ")"),
                        ATTR: RegExp("^" + $),
                        PSEUDO: RegExp("^" + I),
                        CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"),
                        bool: RegExp("^(?:" +
                            B + ")$", "i"),
                        needsContext: RegExp("^" + P + "*[\x3e+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?\x3d[^-]|$)", "i")
                    };
                    var K = /^[^{]+\{\s*\[native \w/;
                    var Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
                    var et = /^(?:input|select|textarea|button)$/i;
                    var tt = /^h\d$/i;
                    var nt = /'|\\/g;
                    var rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig");
                    var it = function(e, t, n) {
                        var r = "0x" + t - 65536;
                        return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r)
                    };
                    try {
                        M.apply(H =
                            O.call(w$$0.childNodes), w$$0.childNodes), H[w$$0.childNodes.length].nodeType
                    } catch (ot) {
                        M = {
                            apply: H.length ? function(e, t) {
                                _.apply(e, O.call(t))
                            } : function(e, t) {
                                var n = e.length;
                                for (var r = 0; e[n++] = t[r++];);
                                e.length = n - 1
                            }
                        }
                    }
                    s$$1 = at.isXML = function(e) {
                            var t = e && (e.ownerDocument || e).documentElement;
                            return t ? "HTML" !== t.nodeName : !1
                        }, r$$1 = at.support = {}, p$$0 = at.setDocument = function(e$$1) {
                            var n$$0 = e$$1 ? e$$1.ownerDocument || e$$1 : w$$0;
                            var i$$0 = n$$0.defaultView;
                            return n$$0 !== f$$0 && 9 === n$$0.nodeType && n$$0.documentElement ?
                                (f$$0 = n$$0, d$$0 = n$$0.documentElement, h$$0 = !s$$1(n$$0), i$$0 && i$$0.attachEvent && i$$0 !== i$$0.top && i$$0.attachEvent("onbeforeunload", function() {
                                    p$$0()
                                }), r$$1.attributes = ut(function(e) {
                                    return e.className = "i", !e.getAttribute("className")
                                }), r$$1.getElementsByTagName = ut(function(e) {
                                    return e.appendChild(n$$0.createComment("")), !e.getElementsByTagName("*").length
                                }), r$$1.getElementsByClassName = ut(function(e) {
                                    return e.innerHTML = "\x3cdiv class\x3d'a'\x3e\x3c/div\x3e\x3cdiv class\x3d'a i'\x3e\x3c/div\x3e", e.firstChild.className =
                                        "i", 2 === e.getElementsByClassName("i").length
                                }), r$$1.getById = ut(function(e) {
                                    return d$$0.appendChild(e).id = b$$0, !n$$0.getElementsByName || !n$$0.getElementsByName(b$$0).length
                                }), r$$1.getById ? (o$$1.find.ID = function(e, t) {
                                    if (typeof t.getElementById !== j && h$$0) {
                                        var n = t.getElementById(e);
                                        return n && n.parentNode ? [n] : []
                                    }
                                }, o$$1.filter.ID = function(e$$0) {
                                    var t = e$$0.replace(rt, it);
                                    return function(e) {
                                        return e.getAttribute("id") === t
                                    }
                                }) : (delete o$$1.find.ID, o$$1.filter.ID = function(e$$0) {
                                    var t = e$$0.replace(rt, it);
                                    return function(e) {
                                        var n =
                                            typeof e.getAttributeNode !== j && e.getAttributeNode("id");
                                        return n && n.value === t
                                    }
                                }), o$$1.find.TAG = r$$1.getElementsByTagName ? function(e, n) {
                                    return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t$$1
                                } : function(e, t) {
                                    var n;
                                    var r = [];
                                    var i = 0;
                                    var o = t.getElementsByTagName(e);
                                    if ("*" === e) {
                                        for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                                        return r
                                    }
                                    return o
                                }, o$$1.find.CLASS = r$$1.getElementsByClassName && function(e, n) {
                                    return typeof n.getElementsByClassName !== j && h$$0 ? n.getElementsByClassName(e) : t$$1
                                }, m$$0 = [], g$$0 = [], (r$$1.qsa = K.test(n$$0.querySelectorAll)) && (ut(function(e) {
                                    e.innerHTML = "\x3cselect\x3e\x3coption selected\x3d''\x3e\x3c/option\x3e\x3c/select\x3e", e.querySelectorAll("[selected]").length || g$$0.push("\\[" + P + "*(?:value|" + B + ")"), e.querySelectorAll(":checked").length || g$$0.push(":checked")
                                }), ut(function(e) {
                                    var t = n$$0.createElement("input");
                                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^\x3d'']").length && g$$0.push("[*^$]\x3d" + P + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length ||
                                        g$$0.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g$$0.push(",.*:")
                                })), (r$$1.matchesSelector = K.test(y$$0 = d$$0.webkitMatchesSelector || d$$0.mozMatchesSelector || d$$0.oMatchesSelector || d$$0.msMatchesSelector)) && ut(function(e) {
                                    r$$1.disconnectedMatch = y$$0.call(e, "div"), y$$0.call(e, "[s!\x3d'']:x"), m$$0.push("!\x3d", I)
                                }), g$$0 = g$$0.length && RegExp(g$$0.join("|")), m$$0 = m$$0.length && RegExp(m$$0.join("|")), v$$0 = K.test(d$$0.contains) || d$$0.compareDocumentPosition ? function(e, t) {
                                    var n = 9 === e.nodeType ? e.documentElement :
                                        e;
                                    var r = t && t.parentNode;
                                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                                } : function(e, t) {
                                    if (t)
                                        for (; t = t.parentNode;)
                                            if (t === e) return !0;
                                    return !1
                                }, A = d$$0.compareDocumentPosition ? function(e, t) {
                                    if (e === t) return S = !0, 0;
                                    var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t);
                                    return i ? 1 & i || !r$$1.sortDetached && t.compareDocumentPosition(e) === i ? e === n$$0 || v$$0(w$$0, e) ? -1 : t === n$$0 || v$$0(w$$0, t) ? 1 : c$$0 ? F.call(c$$0,
                                        e) - F.call(c$$0, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
                                } : function(e, t) {
                                    var r;
                                    var i = 0;
                                    var o = e.parentNode;
                                    var a = t.parentNode;
                                    var s = [e];
                                    var l = [t];
                                    if (e === t) return S = !0, 0;
                                    if (!o || !a) return e === n$$0 ? -1 : t === n$$0 ? 1 : o ? -1 : a ? 1 : c$$0 ? F.call(c$$0, e) - F.call(c$$0, t) : 0;
                                    if (o === a) return pt(e, t);
                                    for (r = e; r = r.parentNode;) s.unshift(r);
                                    for (r = t; r = r.parentNode;) l.unshift(r);
                                    for (; s[i] === l[i];) i++;
                                    return i ? pt(s[i], l[i]) : s[i] === w$$0 ? -1 : l[i] === w$$0 ? 1 : 0
                                }, n$$0) : f$$0
                        }, at.matches = function(e, t) {
                            return at(e, null, null, t)
                        }, at.matchesSelector =
                        function(e, t) {
                            if ((e.ownerDocument || e) !== f$$0 && p$$0(e), t = t.replace(Y, "\x3d'$1']"), !(!r$$1.matchesSelector || !h$$0 || m$$0 && m$$0.test(t) || g$$0 && g$$0.test(t))) try {
                                var n = y$$0.call(e, t);
                                if (n || r$$1.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                            } catch (i) {}
                            return at(t, f$$0, null, [e]).length > 0
                        }, at.contains = function(e, t) {
                            return (e.ownerDocument || e) !== f$$0 && p$$0(e), v$$0(e, t)
                        }, at.attr = function(e, n) {
                            (e.ownerDocument || e) !== f$$0 && p$$0(e);
                            var i = o$$1.attrHandle[n.toLowerCase()];
                            var a = i && L.call(o$$1.attrHandle,
                                n.toLowerCase()) ? i(e, n, !h$$0) : t$$1;
                            return a === t$$1 ? r$$1.attributes || !h$$0 ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a
                        }, at.error = function(e) {
                            throw Error("Syntax error, unrecognized expression: " + e);
                        }, at.uniqueSort = function(e) {
                            var t;
                            var n = [];
                            var i = 0;
                            var o = 0;
                            if (S = !r$$1.detectDuplicates, c$$0 = !r$$1.sortStable && e.slice(0), e.sort(A), S) {
                                for (; t = e[o++];) t === e[o] && (i = n.push(o));
                                for (; i--;) e.splice(n[i], 1)
                            }
                            return e
                        }, a$$0 = at.getText = function(e) {
                            var t;
                            var n = "";
                            var r = 0;
                            var i = e.nodeType;
                            if (i)
                                if (1 === i || 9 === i || 11 === i) {
                                    if ("string" == typeof e.textContent) return e.textContent;
                                    for (e = e.firstChild; e; e = e.nextSibling) n += a$$0(e)
                                } else {
                                    if (3 === i || 4 === i) return e.nodeValue
                                }
                            else
                                for (; t = e[r]; r++) n += a$$0(t);
                            return n
                        }, o$$1 = at.selectors = {
                            cacheLength: 50,
                            createPseudo: lt,
                            match: Q,
                            attrHandle: {},
                            find: {},
                            relative: {
                                "\x3e": {
                                    dir: "parentNode",
                                    first: !0
                                },
                                " ": {
                                    dir: "parentNode"
                                },
                                "+": {
                                    dir: "previousSibling",
                                    first: !0
                                },
                                "~": {
                                    dir: "previousSibling"
                                }
                            },
                            preFilter: {
                                ATTR: function(e) {
                                    return e[1] = e[1].replace(rt, it), e[3] = (e[4] ||
                                        e[5] || "").replace(rt, it), "~\x3d" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                                },
                                CHILD: function(e) {
                                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), e
                                },
                                PSEUDO: function(e) {
                                    var n;
                                    var r = !e[5] && e[2];
                                    return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t$$1 ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0,
                                        3))
                                }
                            },
                            filter: {
                                TAG: function(e$$0) {
                                    var t = e$$0.replace(rt, it).toLowerCase();
                                    return "*" === e$$0 ? function() {
                                        return !0
                                    } : function(e) {
                                        return e.nodeName && e.nodeName.toLowerCase() === t
                                    }
                                },
                                CLASS: function(e$$0) {
                                    var t = N$$0[e$$0 + " "];
                                    return t || (t = RegExp("(^|" + P + ")" + e$$0 + "(" + P + "|$)")) && N$$0(e$$0, function(e) {
                                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "")
                                    })
                                },
                                ATTR: function(e, t, n) {
                                    return function(r) {
                                        var i = at.attr(r, e);
                                        return null == i ? "!\x3d" === t : t ? (i += "", "\x3d" ===
                                            t ? i === n : "!\x3d" === t ? i !== n : "^\x3d" === t ? n && 0 === i.indexOf(n) : "*\x3d" === t ? n && i.indexOf(n) > -1 : "$\x3d" === t ? n && i.slice(-n.length) === n : "~\x3d" === t ? (" " + i + " ").indexOf(n) > -1 : "|\x3d" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                                    }
                                },
                                CHILD: function(e$$0, t$$0, n$$0, r, i) {
                                    var o = "nth" !== e$$0.slice(0, 3);
                                    var a = "last" !== e$$0.slice(-4);
                                    var s = "of-type" === t$$0;
                                    return 1 === r && 0 === i ? function(e) {
                                        return !!e.parentNode
                                    } : function(t, n, l) {
                                        var u;
                                        var c;
                                        var p;
                                        var f;
                                        var d;
                                        var h;
                                        var g = o !== a ? "nextSibling" : "previousSibling";
                                        var m = t.parentNode;
                                        var y = s && t.nodeName.toLowerCase();
                                        var v = !l && !s;
                                        if (m) {
                                            if (o) {
                                                for (; g;) {
                                                    for (p = t; p = p[g];)
                                                        if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1;
                                                    h = g = "only" === e$$0 && !h && "nextSibling"
                                                }
                                                return !0
                                            }
                                            if (h = [a ? m.firstChild : m.lastChild], a && v)
                                                for (c = m[b$$0] || (m[b$$0] = {}), u = c[e$$0] || [], d = u[0] === T$$0 && u[1], f = u[0] === T$$0 && u[2], p = d && m.childNodes[d]; p = ++d && p && p[g] || (f = d = 0) || h.pop();) {
                                                    if (1 === p.nodeType && ++f && p === t) {
                                                        c[e$$0] = [T$$0, d, f];
                                                        break
                                                    }
                                                } else if (v && (u = (t[b$$0] || (t[b$$0] = {}))[e$$0]) && u[0] === T$$0) f = u[1];
                                                else
                                                    for (; p = ++d &&
                                                        p && p[g] || (f = d = 0) || h.pop();)
                                                        if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b$$0] || (p[b$$0] = {}))[e$$0] = [T$$0, f]), p === t)) break;
                                            return f -= i, f === r || 0 === f % r && f / r >= 0
                                        }
                                    }
                                },
                                PSEUDO: function(e$$0, t) {
                                    var n$$0;
                                    var r = o$$1.pseudos[e$$0] || o$$1.setFilters[e$$0.toLowerCase()] || at.error("unsupported pseudo: " + e$$0);
                                    return r[b$$0] ? r(t) : r.length > 1 ? (n$$0 = [e$$0, e$$0, "", t], o$$1.setFilters.hasOwnProperty(e$$0.toLowerCase()) ? lt(function(e, n) {
                                        var i;
                                        var o = r(e, t);
                                        for (var a = o.length; a--;) i = F.call(e, o[a]), e[i] = !(n[i] = o[a])
                                    }) : function(e) {
                                        return r(e, 0, n$$0)
                                    }) : r
                                }
                            },
                            pseudos: {
                                not: lt(function(e$$0) {
                                    var t$$0 = [];
                                    var n$$0 = [];
                                    var r = l$$0(e$$0.replace(z, "$1"));
                                    return r[b$$0] ? lt(function(e, t, n, i) {
                                        var o;
                                        var a = r(e, null, i, []);
                                        for (var s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                                    }) : function(e, i, o) {
                                        return t$$0[0] = e, r(t$$0, null, o, n$$0), !n$$0.pop()
                                    }
                                }),
                                has: lt(function(e) {
                                    return function(t) {
                                        return at(e, t).length > 0
                                    }
                                }),
                                contains: lt(function(e) {
                                    return function(t) {
                                        return (t.textContent || t.innerText || a$$0(t)).indexOf(e) > -1
                                    }
                                }),
                                lang: lt(function(e) {
                                    return G.test(e ||
                                            "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(),
                                        function(t) {
                                            var n;
                                            do
                                                if (n = h$$0 ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                                            while ((t = t.parentNode) && 1 === t.nodeType);
                                            return !1
                                        }
                                }),
                                target: function(t) {
                                    var n = e$$2.location && e$$2.location.hash;
                                    return n && n.slice(1) === t.id
                                },
                                root: function(e) {
                                    return e === d$$0
                                },
                                focus: function(e) {
                                    return e === f$$0.activeElement && (!f$$0.hasFocus || f$$0.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                                },
                                enabled: function(e) {
                                    return e.disabled === !1
                                },
                                disabled: function(e) {
                                    return e.disabled === !0
                                },
                                checked: function(e) {
                                    var t = e.nodeName.toLowerCase();
                                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                                },
                                selected: function(e) {
                                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                                },
                                empty: function(e) {
                                    for (e = e.firstChild; e; e = e.nextSibling)
                                        if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1;
                                    return !0
                                },
                                parent: function(e) {
                                    return !o$$1.pseudos.empty(e)
                                },
                                header: function(e) {
                                    return tt.test(e.nodeName)
                                },
                                input: function(e) {
                                    return et.test(e.nodeName)
                                },
                                button: function(e) {
                                    var t = e.nodeName.toLowerCase();
                                    return "input" === t && "button" === e.type || "button" === t
                                },
                                text: function(e) {
                                    var t;
                                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type)
                                },
                                first: ht(function() {
                                    return [0]
                                }),
                                last: ht(function(e, t) {
                                    return [t - 1]
                                }),
                                eq: ht(function(e, t, n) {
                                    return [0 > n ? n + t : n]
                                }),
                                even: ht(function(e, t) {
                                    for (var n = 0; t > n; n += 2) e.push(n);
                                    return e
                                }),
                                odd: ht(function(e, t) {
                                    for (var n = 1; t >
                                        n; n += 2) e.push(n);
                                    return e
                                }),
                                lt: ht(function(e, t, n) {
                                    for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                                    return e
                                }),
                                gt: ht(function(e, t, n) {
                                    for (var r = 0 > n ? n + t : n; t > ++r;) e.push(r);
                                    return e
                                })
                            }
                        }, o$$1.pseudos.nth = o$$1.pseudos.eq;
                    for (n$$1 in {
                            radio: !0,
                            checkbox: !0,
                            file: !0,
                            password: !0,
                            image: !0
                        }) o$$1.pseudos[n$$1] = ft(n$$1);
                    for (n$$1 in {
                            submit: !0,
                            reset: !0
                        }) o$$1.pseudos[n$$1] = dt(n$$1);
                    gt.prototype = o$$1.filters = o$$1.pseudos, o$$1.setFilters = new gt;
                    l$$0 = at.compile = function(e, t) {
                        var n;
                        var r = [];
                        var i = [];
                        var o = E[e + " "];
                        if (!o) {
                            for (t || (t =
                                    mt(e)), n = t.length; n--;) o = Tt(t[n]), o[b$$0] ? r.push(o) : i.push(o);
                            o = E(e, Ct(i, r))
                        }
                        return o
                    };
                    r$$1.sortStable = b$$0.split("").sort(A).join("") === b$$0, r$$1.detectDuplicates = S, p$$0(), r$$1.sortDetached = ut(function(e) {
                            return 1 & e.compareDocumentPosition(f$$0.createElement("div"))
                        }), ut(function(e) {
                            return e.innerHTML = "\x3ca href\x3d'#'\x3e\x3c/a\x3e", "#" === e.firstChild.getAttribute("href")
                        }) || ct("type|href|height|width", function(e, n, r) {
                            return r ? t$$1 : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2)
                        }), r$$1.attributes &&
                        ut(function(e) {
                            return e.innerHTML = "\x3cinput/\x3e", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                        }) || ct("value", function(e, n, r) {
                            return r || "input" !== e.nodeName.toLowerCase() ? t$$1 : e.defaultValue
                        }), ut(function(e) {
                            return null == e.getAttribute("disabled")
                        }) || ct(B, function(e, n, r) {
                            var i;
                            return r ? t$$1 : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null
                        }), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, x.text = at.getText,
                        x.isXMLDoc = at.isXML, x.contains = at.contains
                }(e);
            var O = {};
            x.Callbacks = function(e$$0) {
                e$$0 = "string" == typeof e$$0 ? O[e$$0] || F(e$$0) : x.extend({}, e$$0);
                var n$$0;
                var r$$0;
                var i$$0;
                var o;
                var a;
                var s;
                var l = [];
                var u = !e$$0.once && [];
                var c = function(t) {
                    for (r$$0 = e$$0.memory && t, i$$0 = !0, a = s || 0, s = 0, o = l.length, n$$0 = !0; l && o > a; a++)
                        if (l[a].apply(t[0], t[1]) === !1 && e$$0.stopOnFalse) {
                            r$$0 = !1;
                            break
                        }
                    n$$0 = !1, l && (u ? u.length && c(u.shift()) : r$$0 ? l = [] : p.disable())
                };
                var p = {
                    add: function() {
                        if (l) {
                            var t$$1 = l.length;
                            (function i(t$$0) {
                                x.each(t$$0,
                                    function(t, n) {
                                        var r = x.type(n);
                                        "function" === r ? e$$0.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n)
                                    })
                            })(arguments), n$$0 ? o = l.length : r$$0 && (s = t$$1, c(r$$0))
                        }
                        return this
                    },
                    remove: function() {
                        return l && x.each(arguments, function(e, t) {
                            for (var r;
                                (r = x.inArray(t, l, r)) > -1;) l.splice(r, 1), n$$0 && (o >= r && o--, a >= r && a--)
                        }), this
                    },
                    has: function(e) {
                        return e ? x.inArray(e, l) > -1 : !(!l || !l.length)
                    },
                    empty: function() {
                        return l = [], o = 0, this
                    },
                    disable: function() {
                        return l = u = r$$0 = t, this
                    },
                    disabled: function() {
                        return !l
                    },
                    lock: function() {
                        return u =
                            t, r$$0 || p.disable(), this
                    },
                    locked: function() {
                        return !u
                    },
                    fireWith: function(e, t) {
                        return !l || i$$0 && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n$$0 ? u.push(t) : c(t)), this
                    },
                    fire: function() {
                        return p.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i$$0
                    }
                };
                return p
            }, x.extend({
                Deferred: function(e$$1) {
                    var t$$0 = [
                        ["resolve", "done", x.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", x.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", x.Callbacks("memory")]
                    ];
                    var n$$0 = "pending";
                    var r = {
                        state: function() {
                            return n$$0
                        },
                        always: function() {
                            return i.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e$$0 = arguments;
                            return x.Deferred(function(n) {
                                x.each(t$$0, function(t, o) {
                                    var a = o[0];
                                    var s = x.isFunction(e$$0[t]) && e$$0[t];
                                    i[o[1]](function() {
                                        var e = s && s.apply(this, arguments);
                                        e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments)
                                    })
                                }), e$$0 = null
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? x.extend(e, r) : r
                        }
                    };
                    var i = {};
                    return r.pipe =
                        r.then, x.each(t$$0, function(e, o) {
                            var a = o[2];
                            var s = o[3];
                            r[o[1]] = a.add, s && a.add(function() {
                                n$$0 = s
                            }, t$$0[1 ^ e][2].disable, t$$0[2][2].lock), i[o[0]] = function() {
                                return i[o[0] + "With"](this === i ? r : this, arguments), this
                            }, i[o[0] + "With"] = a.fireWith
                        }), r.promise(i), e$$1 && e$$1.call(i, i), i
                },
                when: function(e$$0) {
                    var t$$0 = 0;
                    var n$$0 = g.call(arguments);
                    var r$$0 = n$$0.length;
                    var i = 1 !== r$$0 || e$$0 && x.isFunction(e$$0.promise) ? r$$0 : 0;
                    var o = 1 === i ? e$$0 : x.Deferred();
                    var a = function(e, t, n) {
                        return function(r) {
                            t[e] = this, n[e] = arguments.length >
                                1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n)
                        }
                    };
                    var s;
                    var l;
                    var u;
                    if (r$$0 > 1)
                        for (s = Array(r$$0), l = Array(r$$0), u = Array(r$$0); r$$0 > t$$0; t$$0++) n$$0[t$$0] && x.isFunction(n$$0[t$$0].promise) ? n$$0[t$$0].promise().done(a(t$$0, u, n$$0)).fail(o.reject).progress(a(t$$0, l, s)) : --i;
                    return i || o.resolveWith(u, n$$0), o.promise()
                }
            }), x.support = function(t) {
                var n$$0;
                var r$$0;
                var o$$0;
                var s$$0;
                var l$$0;
                var u;
                var c;
                var p;
                var f;
                var d = a.createElement("div");
                if (d.setAttribute("className", "t"), d.innerHTML =
                    "  \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e", n$$0 = d.getElementsByTagName("*") || [], r$$0 = d.getElementsByTagName("a")[0], !r$$0 || !r$$0.style || !n$$0.length) return t;
                s$$0 = a.createElement("select"), u = s$$0.appendChild(a.createElement("option")), o$$0 = d.getElementsByTagName("input")[0], r$$0.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length,
                    t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(r$$0.getAttribute("style")), t.hrefNormalized = "/a" === r$$0.getAttribute("href"), t.opacity = /^0.5/.test(r$$0.style.opacity), t.cssFloat = !!r$$0.style.cssFloat, t.checkOn = !!o$$0.value, t.optSelected = u.selected, t.enctype = !!a.createElement("form").enctype, t.html5Clone = "\x3c:nav\x3e\x3c/:nav\x3e" !== a.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o$$0.checked = !0, t.noCloneChecked = o$$0.cloneNode(!0).checked, s$$0.disabled = !0, t.optDisabled = !u.disabled;
                try {
                    delete d.test
                } catch (h) {
                    t.deleteExpando = !1
                }
                o$$0 = a.createElement("input"), o$$0.setAttribute("value", ""), t.input = "" === o$$0.getAttribute("value"), o$$0.value = "t", o$$0.setAttribute("type", "radio"), t.radioValue = "t" === o$$0.value, o$$0.setAttribute("checked", "t"), o$$0.setAttribute("name", "t"), l$$0 = a.createDocumentFragment(), l$$0.appendChild(o$$0), t.appendChecked =
                    o$$0.checked, t.checkClone = l$$0.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function() {
                        t.noCloneEvent = !1
                    }), d.cloneNode(!0).click());
                for (f in {
                        submit: !0,
                        change: !0,
                        focusin: !0
                    }) d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || d.attributes[c].expando === !1;
                d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip;
                for (f in x(t)) break;
                return t.ownLast = "0" !== f, x(function() {
                    var n;
                    var r;
                    var o;
                    var s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;";
                    var l = a.getElementsByTagName("body")[0];
                    l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", l.appendChild(n).appendChild(d), d.innerHTML = "\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3et\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none",
                        p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", x.swap(l, null != l.style.zoom ? {
                            zoom: 1
                        } : {}, function() {
                            t.boxSizing = 4 === d.offsetWidth
                        }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable =
                            "4px" === (e.getComputedStyle(d, null) || {
                                width: "4px"
                            }).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "\x3cdiv\x3e\x3c/div\x3e", d.firstChild.style.width =
                            "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), l.removeChild(n), n = d = o = r = null)
                }), n$$0 = s$$0 = l$$0 = u = r$$0 = o$$0 = null, t
            }({});
            var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;
            var P = /([A-Z])/g;
            x.extend({
                cache: {},
                noData: {
                    applet: !0,
                    embed: !0,
                    object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                },
                hasData: function(e) {
                    return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !!e && !I(e)
                },
                data: function(e, t, n) {
                    return R(e, t, n)
                },
                removeData: function(e, t) {
                    return W(e, t)
                },
                _data: function(e, t, n) {
                    return R(e,
                        t, n, !0)
                },
                _removeData: function(e, t) {
                    return W(e, t, !0)
                },
                acceptData: function(e) {
                    if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
                    var t = e.nodeName && x.noData[e.nodeName.toLowerCase()];
                    return !t || t !== !0 && e.getAttribute("classid") === t
                }
            }), x.fn.extend({
                data: function(e, n) {
                    var r;
                    var i;
                    var o = null;
                    var a = 0;
                    var s = this[0];
                    if (e === t) {
                        if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs"))) {
                            for (r = s.attributes; r.length > a; a++) i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), $(s, i, o[i]));
                            x._data(s, "parsedAttrs", !0)
                        }
                        return o
                    }
                    return "object" == typeof e ? this.each(function() {
                        x.data(this, e)
                    }) : arguments.length > 1 ? this.each(function() {
                        x.data(this, e, n)
                    }) : s ? $(s, e, x.data(s, e)) : null
                },
                removeData: function(e) {
                    return this.each(function() {
                        x.removeData(this, e)
                    })
                }
            });
            x.extend({
                queue: function(e, n, r) {
                    var i;
                    return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), i || []) : t
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var n = x.queue(e, t);
                    var r = n.length;
                    var i = n.shift();
                    var o =
                        x._queueHooks(e, t);
                    var a = function() {
                        x.dequeue(e, t)
                    };
                    "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var n = t + "queueHooks";
                    return x._data(e, n) || x._data(e, n, {
                        empty: x.Callbacks("once memory").add(function() {
                            x._removeData(e, t + "queue"), x._removeData(e, n)
                        })
                    })
                }
            }), x.fn.extend({
                queue: function(e, n) {
                    var r = 2;
                    return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each(function() {
                        var t =
                            x.queue(this, e, n);
                        x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        x.dequeue(this, e)
                    })
                },
                delay: function(e, t$$0) {
                    return e = x.fx ? x.fx.speeds[e] || e : e, t$$0 = t$$0 || "fx", this.queue(t$$0, function(t, n) {
                        var r = setTimeout(t, e);
                        n.stop = function() {
                            clearTimeout(r)
                        }
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, n) {
                    var r;
                    var i = 1;
                    var o = x.Deferred();
                    var a = this;
                    var s = this.length;
                    var l = function() {
                        --i || o.resolveWith(a, [a])
                    };
                    for ("string" != typeof e && (n = e, e = t), e = e || "fx"; s--;) r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l));
                    return l(), o.promise(n)
                }
            });
            var z;
            var X;
            var U = /[\t\r\n\f]/g;
            var V = /\r/g;
            var Y = /^(?:input|select|textarea|button|object)$/i;
            var J = /^(?:a|area)$/i;
            var G = /^(?:checked|selected)$/i;
            var Q = x.support.getSetAttribute;
            var K = x.support.input;
            x.fn.extend({
                    attr: function(e, t) {
                        return x.access(this, x.attr, e, t, arguments.length > 1)
                    },
                    removeAttr: function(e) {
                        return this.each(function() {
                            x.removeAttr(this, e)
                        })
                    },
                    prop: function(e, t) {
                        return x.access(this, x.prop, e, t, arguments.length > 1)
                    },
                    removeProp: function(e) {
                        return e = x.propFix[e] || e, this.each(function() {
                            try {
                                this[e] = t, delete this[e]
                            } catch (n) {}
                        })
                    },
                    addClass: function(e) {
                        var t$$0;
                        var n;
                        var r;
                        var i;
                        var o;
                        var a = 0;
                        var s = this.length;
                        var l = "string" == typeof e && e;
                        if (x.isFunction(e)) return this.each(function(t) {
                            x(this).addClass(e.call(this, t, this.className))
                        });
                        if (l)
                            for (t$$0 = (e || "").match(T) || []; s > a; a++)
                                if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U,
                                        " ") : " ")) {
                                    for (o = 0; i = t$$0[o++];) 0 > r.indexOf(" " + i + " ") && (r += i + " ");
                                    n.className = x.trim(r)
                                }
                        return this
                    },
                    removeClass: function(e) {
                        var t$$0;
                        var n;
                        var r;
                        var i;
                        var o;
                        var a = 0;
                        var s = this.length;
                        var l = 0 === arguments.length || "string" == typeof e && e;
                        if (x.isFunction(e)) return this.each(function(t) {
                            x(this).removeClass(e.call(this, t, this.className))
                        });
                        if (l)
                            for (t$$0 = (e || "").match(T) || []; s > a; a++)
                                if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : "")) {
                                    for (o = 0; i = t$$0[o++];)
                                        for (; r.indexOf(" " +
                                                i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
                                    n.className = e ? x.trim(r) : ""
                                }
                        return this
                    },
                    toggleClass: function(e, t$$0) {
                        var n$$0 = typeof e;
                        return "boolean" == typeof t$$0 && "string" === n$$0 ? t$$0 ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each(function(n) {
                            x(this).toggleClass(e.call(this, n, this.className, t$$0), t$$0)
                        }) : this.each(function() {
                            if ("string" === n$$0) {
                                var t;
                                var r = 0;
                                var o = x(this);
                                for (var a = e.match(T) || []; t = a[r++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t)
                            } else(n$$0 === i || "boolean" === n$$0) && (this.className &&
                                x._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : x._data(this, "__className__") || "")
                        })
                    },
                    hasClass: function(e) {
                        var t = " " + e + " ";
                        var n = 0;
                        for (var r = this.length; r > n; n++)
                            if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0) return !0;
                        return !1
                    },
                    val: function(e$$0) {
                        var n$$0;
                        var r;
                        var i;
                        var o$$0 = this[0];
                        if (arguments.length) return i = x.isFunction(e$$0), this.each(function(n) {
                            var o;
                            1 === this.nodeType && (o = i ? e$$0.call(this, n, x(this).val()) : e$$0, null == o ?
                                o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, function(e) {
                                    return null == e ? "" : e + ""
                                })), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o))
                        });
                        if (o$$0) return r = x.valHooks[o$$0.type] || x.valHooks[o$$0.nodeName.toLowerCase()], r && "get" in r && (n$$0 = r.get(o$$0, "value")) !== t ? n$$0 : (n$$0 = o$$0.value, "string" == typeof n$$0 ? n$$0.replace(V, "") : null == n$$0 ? "" : n$$0)
                    }
                }), x.extend({
                    valHooks: {
                        option: {
                            get: function(e) {
                                var t = x.find.attr(e, "value");
                                return null != t ? t : e.text
                            }
                        },
                        select: {
                            get: function(e) {
                                var t;
                                var n;
                                var r = e.options;
                                var i = e.selectedIndex;
                                var o = "select-one" === e.type || 0 > i;
                                var a = o ? null : [];
                                var s = o ? i + 1 : r.length;
                                for (var l = 0 > i ? s : o ? i : 0; s > l; l++)
                                    if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup"))) {
                                        if (t = x(n).val(), o) return t;
                                        a.push(t)
                                    }
                                return a
                            },
                            set: function(e, t) {
                                var n;
                                var r;
                                var i = e.options;
                                var o = x.makeArray(t);
                                for (var a = i.length; a--;) r =
                                    i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0);
                                return n || (e.selectedIndex = -1), o
                            }
                        }
                    },
                    attr: function(e, n, r) {
                        var o;
                        var a;
                        var s = e.nodeType;
                        if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), r) : (x.removeAttr(e, n), t))
                    },
                    removeAttr: function(e,
                        t) {
                        var n;
                        var r;
                        var i = 0;
                        var o = t && t.match(T);
                        if (o && 1 === e.nodeType)
                            for (; n = o[i++];) r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), e.removeAttribute(Q ? n : r)
                    },
                    attrHooks: {
                        type: {
                            set: function(e, t) {
                                if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input")) {
                                    var n = e.value;
                                    return e.setAttribute("type", t), n && (e.value = n), t
                                }
                            }
                        }
                    },
                    propFix: {
                        "for": "htmlFor",
                        "class": "className"
                    },
                    prop: function(e, n, r) {
                        var i;
                        var o;
                        var a;
                        var s = e.nodeType;
                        if (e && 3 !==
                            s && 8 !== s && 2 !== s) return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n]
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(e) {
                                var t = x.find.attr(e, "tabindex");
                                return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1
                            }
                        }
                    }
                }), X = {
                    set: function(e, t, n) {
                        return t === !1 ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, n
                    }
                }, x.each(x.expr.match.bool.source.match(/\w+/g),
                    function(e$$0, n$$0) {
                        var r$$0 = x.expr.attrHandle[n$$0] || x.find.attr;
                        x.expr.attrHandle[n$$0] = K && Q || !G.test(n$$0) ? function(e, n, i) {
                            var o = x.expr.attrHandle[n];
                            var a = i ? t : (x.expr.attrHandle[n] = t) != r$$0(e, n, i) ? n.toLowerCase() : null;
                            return x.expr.attrHandle[n] = o, a
                        } : function(e, n, r) {
                            return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null
                        }
                    }), K && Q || (x.attrHooks.value = {
                    set: function(e, n, r) {
                        return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r)
                    }
                }), Q || (z = {
                    set: function(e, n, r) {
                        var i = e.getAttributeNode(r);
                        return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t
                    }
                }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function(e, n, r) {
                    var i;
                    return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null
                }, x.valHooks.button = {
                    get: function(e, n) {
                        var r = e.getAttributeNode(n);
                        return r && r.specified ? r.value : t
                    },
                    set: z.set
                }, x.attrHooks.contenteditable = {
                    set: function(e, t, n) {
                        z.set(e, "" === t ? !1 : t, n)
                    }
                }, x.each(["width", "height"], function(e$$0,
                    n) {
                    x.attrHooks[n] = {
                        set: function(e, r) {
                            return "" === r ? (e.setAttribute(n, "auto"), r) : t
                        }
                    }
                })), x.support.hrefNormalized || x.each(["href", "src"], function(e$$0, t) {
                    x.propHooks[t] = {
                        get: function(e) {
                            return e.getAttribute(t, 4)
                        }
                    }
                }), x.support.style || (x.attrHooks.style = {
                    get: function(e) {
                        return e.style.cssText || t
                    },
                    set: function(e, t) {
                        return e.style.cssText = t + ""
                    }
                }), x.support.optSelected || (x.propHooks.selected = {
                    get: function(e) {
                        var t = e.parentNode;
                        return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
                    }
                }),
                x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                    x.propFix[this.toLowerCase()] = this
                }), x.support.enctype || (x.propFix.enctype = "encoding"), x.each(["radio", "checkbox"], function() {
                    x.valHooks[this] = {
                        set: function(e, n) {
                            return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t
                        }
                    }, x.support.checkOn || (x.valHooks[this].get = function(e) {
                        return null === e.getAttribute("value") ? "on" : e.value
                    })
                });
            var Z = /^(?:input|select|textarea)$/i;
            var et = /^key/;
            var tt = /^(?:mouse|contextmenu)|click/;
            var nt = /^(?:focusinfocus|focusoutblur)$/;
            var rt = /^([^.]*)(?:\.(.+)|)$/;
            x.event = {
                global: {},
                add: function(e$$0, n, r, o, a) {
                    var s;
                    var l;
                    var u;
                    var c;
                    var p;
                    var f;
                    var d;
                    var h;
                    var g;
                    var m;
                    var y;
                    var v = x._data(e$$0);
                    if (v) {
                        for (r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function(e) {
                                    return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments)
                                }, f.elem =
                                e$$0), n = (n || "").match(T) || [""], u = n.length; u--;) s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, p = x.event.special[g] || {}, d = x.extend({
                            type: g,
                            origType: y,
                            data: o,
                            handler: r,
                            guid: r.guid,
                            selector: a,
                            needsContext: a && x.expr.match.needsContext.test(a),
                            namespace: m.join(".")
                        }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && p.setup.call(e$$0, o, m, f) !== !1 || (e$$0.addEventListener ? e$$0.addEventListener(g, f, !1) : e$$0.attachEvent && e$$0.attachEvent("on" +
                            g, f))), p.add && (p.add.call(e$$0, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), x.event.global[g] = !0);
                        e$$0 = null
                    }
                },
                remove: function(e, t, n, r, i) {
                    var o;
                    var a;
                    var s;
                    var l;
                    var u;
                    var c;
                    var p;
                    var f;
                    var d;
                    var h;
                    var g;
                    var m = x.hasData(e) && x._data(e);
                    if (m && (c = m.events)) {
                        for (t = (t || "").match(T) || [""], u = t.length; u--;)
                            if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), d) {
                                for (p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], s = s[2] && RegExp("(^|\\.)" +
                                        h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length; o--;) a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, p.remove && p.remove.call(e, a));
                                l && !f.length && (p.teardown && p.teardown.call(e, h, m.handle) !== !1 || x.removeEvent(e, d, m.handle), delete c[d])
                            } else
                                for (d in c) x.event.remove(e, d + t[u], n, r, !0);
                        x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events"))
                    }
                },
                trigger: function(n, r, i, o) {
                    var s;
                    var l;
                    var u;
                    var c;
                    var p;
                    var f;
                    var d;
                    var h = [i || a];
                    var g = v.call(n, "type") ? n.type : n;
                    var m = v.call(n, "namespace") ? n.namespace.split(".") : [];
                    if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r =
                            null == r ? [n] : x.makeArray(r, [n]), p = x.event.special[g] || {}, o || !p.trigger || p.trigger.apply(i, r) !== !1)) {
                        if (!o && !p.noBubble && !x.isWindow(i)) {
                            for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode); u; u = u.parentNode) h.push(u), f = u;
                            f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e)
                        }
                        for (d = 0;
                            (u = h[d++]) && !n.isPropagationStopped();) n.type = d > 1 ? c : p.bindType || g, s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), s = l && u[l], s && x.acceptData(u) && s.apply && s.apply(u, r) === !1 && n.preventDefault();
                        if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(h.pop(), r) === !1) && x.acceptData(i) && l && i[g] && !x.isWindow(i)) {
                            f = i[l], f && (i[l] = null), x.event.triggered = g;
                            try {
                                i[g]()
                            } catch (y) {}
                            x.event.triggered = t, f && (i[l] = f)
                        }
                        return n.result
                    }
                },
                dispatch: function(e) {
                    e = x.event.fix(e);
                    var n;
                    var r;
                    var i;
                    var o;
                    var a;
                    var s = [];
                    var l = g.call(arguments);
                    var u = (x._data(this, "events") || {})[e.type] || [];
                    var c = x.event.special[e.type] || {};
                    if (l[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !==
                        !1) {
                        for (s = x.event.handlers.call(this, e, u), n = 0;
                            (o = s[n++]) && !e.isPropagationStopped();)
                            for (e.currentTarget = o.elem, a = 0;
                                (i = o.handlers[a++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                        return c.postDispatch && c.postDispatch.call(this, e), e.result
                    }
                },
                handlers: function(e, n) {
                    var r;
                    var i;
                    var o;
                    var a;
                    var s = [];
                    var l = n.delegateCount;
                    var u = e.target;
                    if (l && u.nodeType && (!e.button || "click" !== e.type))
                        for (; u != this; u = u.parentNode || this)
                            if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type)) {
                                for (o = [], a = 0; l > a; a++) i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [u]).length), o[r] && o.push(i);
                                o.length && s.push({
                                    elem: u,
                                    handlers: o
                                })
                            }
                    return n.length > l && s.push({
                        elem: this,
                        handlers: n.slice(l)
                    }), s
                },
                fix: function(e) {
                    if (e[x.expando]) return e;
                    var t;
                    var n;
                    var r;
                    var i = e.type;
                    var o = e;
                    var s = this.fixHooks[i];
                    for (s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
                    return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, o) : e
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, n) {
                        var r;
                        var i;
                        var o;
                        var s = n.button;
                        var l = n.fromElement;
                        return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft ||
                            0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e
                    }
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            if (this !== at() && this.focus) try {
                                return this.focus(), !1
                            } catch (e) {}
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            return this === at() && this.blur ? (this.blur(), !1) : t
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            return x.nodeName(this,
                                "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t
                        },
                        _default: function(e) {
                            return x.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            e.result !== t && (e.originalEvent.returnValue = e.result)
                        }
                    }
                },
                simulate: function(e, t, n, r) {
                    var i = x.extend(new x.Event, n, {
                        type: e,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
                }
            }, x.removeEvent = a.removeEventListener ? function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t,
                    n, !1)
            } : function(e, t, n) {
                var r = "on" + t;
                e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n))
            }, x.Event = function(e, n) {
                return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, t) : new x.Event(e, n)
            }, x.Event.prototype = {
                isDefaultPrevented: ot,
                isPropagationStopped: ot,
                isImmediatePropagationStopped: ot,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
                },
                stopImmediatePropagation: function() {
                    this.isImmediatePropagationStopped = it, this.stopPropagation()
                }
            }, x.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            }, function(e$$0, t) {
                x.event.special[e$$0] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var n;
                        var r = this;
                        var i = e.relatedTarget;
                        var o = e.handleObj;
                        return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
                    }
                }
            }), x.support.submitBubbles || (x.event.special.submit = {
                setup: function() {
                    return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", function(e$$0) {
                        var n = e$$0.target;
                        var r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t;
                        r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", function(e) {
                                e._submit_bubble = !0
                            }),
                            x._data(r, "submitBubbles", !0))
                    }), t)
                },
                postDispatch: function(e) {
                    e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0))
                },
                teardown: function() {
                    return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t)
                }
            }), x.support.changeBubbles || (x.event.special.change = {
                setup: function() {
                    return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", function(e) {
                        "checked" === e.originalEvent.propertyName &&
                            (this._just_changed = !0)
                    }), x.event.add(this, "click._change", function(e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0)
                    })), !1) : (x.event.add(this, "beforeactivate._change", function(e$$0) {
                        var t = e$$0.target;
                        Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", function(e) {
                            !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0)
                        }), x._data(t, "changeBubbles", !0))
                    }), t)
                },
                handle: function(e) {
                    var n = e.target;
                    return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t
                },
                teardown: function() {
                    return x.event.remove(this, "._change"), !Z.test(this.nodeName)
                }
            }), x.support.focusinBubbles || x.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e$$0, t) {
                var n = 0;
                var r = function(e) {
                    x.event.simulate(t, e.target, x.event.fix(e), !0)
                };
                x.event.special[t] = {
                    setup: function() {
                        0 === n++ && a.addEventListener(e$$0, r, !0)
                    },
                    teardown: function() {
                        0 === --n && a.removeEventListener(e$$0,
                            r, !0)
                    }
                }
            }), x.fn.extend({
                on: function(e$$0, n, r, i, o) {
                    var a;
                    var s;
                    if ("object" == typeof e$$0) {
                        "string" != typeof n && (r = r || n, n = t);
                        for (a in e$$0) this.on(a, n, r, e$$0[a], o);
                        return this
                    }
                    if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1) i = ot;
                    else if (!i) return this;
                    return 1 === o && (s = i, i = function(e) {
                        return x().off(e), s.apply(this, arguments)
                    }, i.guid = s.guid || (s.guid = x.guid++)), this.each(function() {
                        x.event.add(this, e$$0, i, r, n)
                    })
                },
                one: function(e, t, n, r) {
                    return this.on(e, t, n, r, 1)
                },
                off: function(e, n, r) {
                    var i;
                    var o;
                    if (e && e.preventDefault && e.handleObj) return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                    if ("object" == typeof e) {
                        for (o in e) this.off(o, n, e[o]);
                        return this
                    }
                    return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = ot), this.each(function() {
                        x.event.remove(this, e, r, n)
                    })
                },
                trigger: function(e, t) {
                    return this.each(function() {
                        x.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, n) {
                    var r = this[0];
                    return r ? x.event.trigger(e,
                        n, r, !0) : t
                }
            });
            var st = /^.[^:#\[\.,]*$/;
            var lt = /^(?:parents|prev(?:Until|All))/;
            var ut = x.expr.match.needsContext;
            var ct = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
            x.fn.extend({
                find: function(e) {
                    var t;
                    var n = [];
                    var r = this;
                    var i = r.length;
                    if ("string" != typeof e) return this.pushStack(x(e).filter(function() {
                        for (t = 0; i > t; t++)
                            if (x.contains(r[t], this)) return !0
                    }));
                    for (t = 0; i > t; t++) x.find(e, r[t], n);
                    return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
                },
                has: function(e) {
                    var t;
                    var n =
                        x(e, this);
                    var r = n.length;
                    return this.filter(function() {
                        for (t = 0; r > t; t++)
                            if (x.contains(this, n[t])) return !0
                    })
                },
                not: function(e) {
                    return this.pushStack(ft(this, e || [], !0))
                },
                filter: function(e) {
                    return this.pushStack(ft(this, e || [], !1))
                },
                is: function(e) {
                    return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length
                },
                closest: function(e, t) {
                    var n;
                    var r = 0;
                    var i = this.length;
                    var o = [];
                    for (var a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0; i > r; r++)
                        for (n = this[r]; n && n !== t; n = n.parentNode)
                            if (11 > n.nodeType &&
                                (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e))) {
                                n = o.push(n);
                                break
                            }
                    return this.pushStack(o.length > 1 ? x.unique(o) : o)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [e] : e);
                    var r = x.merge(this.get(), n);
                    return this.pushStack(x.unique(r))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject :
                        this.prevObject.filter(e))
                }
            });
            x.each({
                    parent: function(e) {
                        var t = e.parentNode;
                        return t && 11 !== t.nodeType ? t : null
                    },
                    parents: function(e) {
                        return x.dir(e, "parentNode")
                    },
                    parentsUntil: function(e, t, n) {
                        return x.dir(e, "parentNode", n)
                    },
                    next: function(e) {
                        return pt(e, "nextSibling")
                    },
                    prev: function(e) {
                        return pt(e, "previousSibling")
                    },
                    nextAll: function(e) {
                        return x.dir(e, "nextSibling")
                    },
                    prevAll: function(e) {
                        return x.dir(e, "previousSibling")
                    },
                    nextUntil: function(e, t, n) {
                        return x.dir(e, "nextSibling", n)
                    },
                    prevUntil: function(e,
                        t, n) {
                        return x.dir(e, "previousSibling", n)
                    },
                    siblings: function(e) {
                        return x.sibling((e.parentNode || {}).firstChild, e)
                    },
                    children: function(e) {
                        return x.sibling(e.firstChild)
                    },
                    contents: function(e) {
                        return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes)
                    }
                }, function(e, t) {
                    x.fn[e] = function(n, r) {
                        var i = x.map(this, t, n);
                        return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), this.pushStack(i)
                    }
                }),
                x.extend({
                    filter: function(e$$0, t, n) {
                        var r = t[0];
                        return n && (e$$0 = ":not(" + e$$0 + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e$$0) ? [r] : [] : x.find.matches(e$$0, x.grep(t, function(e) {
                            return 1 === e.nodeType
                        }))
                    },
                    dir: function(e, n, r) {
                        var i = [];
                        for (var o = e[n]; o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r));) 1 === o.nodeType && i.push(o), o = o[n];
                        return i
                    },
                    sibling: function(e, t) {
                        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                        return n
                    }
                });
            var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";
            var gt = / jQuery\d+="(?:null|\d+)"/g;
            var mt = RegExp("\x3c(?:" + ht + ")[\\s/\x3e]", "i");
            var yt = /^\s+/;
            var vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
            var bt = /<([\w:]+)/;
            var xt = /<tbody/i;
            var wt = /<|&#?\w+;/;
            var Tt = /<(?:script|style|link)/i;
            var Ct = /^(?:checkbox|radio)$/i;
            var Nt = /checked\s*(?:[^=]|=\s*.checked.)/i;
            var kt = /^$|\/(?:java|ecma)script/i;
            var Et = /^true\/(.*)/;
            var St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
            var At = {
                option: [1, "\x3cselect multiple\x3d'multiple'\x3e",
                    "\x3c/select\x3e"
                ],
                legend: [1, "\x3cfieldset\x3e", "\x3c/fieldset\x3e"],
                area: [1, "\x3cmap\x3e", "\x3c/map\x3e"],
                param: [1, "\x3cobject\x3e", "\x3c/object\x3e"],
                thead: [1, "\x3ctable\x3e", "\x3c/table\x3e"],
                tr: [2, "\x3ctable\x3e\x3ctbody\x3e", "\x3c/tbody\x3e\x3c/table\x3e"],
                col: [2, "\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e", "\x3c/colgroup\x3e\x3c/table\x3e"],
                td: [3, "\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e", "\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"],
                _default: x.support.htmlSerialize ? [0, "", ""] : [1, "X\x3cdiv\x3e",
                    "\x3c/div\x3e"
                ]
            };
            var jt = dt(a);
            var Dt = jt.appendChild(a.createElement("div"));
            At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, At.th = At.td, x.fn.extend({
                text: function(e$$0) {
                    return x.access(this, function(e) {
                        return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e))
                    }, null, e$$0, arguments.length)
                },
                append: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = Lt(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = Lt(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                remove: function(e, t) {
                    var n;
                    var r = e ? x.filter(e, this) : this;
                    for (var i = 0; null != (n = r[i]); i++) t ||
                        1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), n.parentNode.removeChild(n));
                    return this
                },
                empty: function() {
                    var e;
                    for (var t = 0; null != (e = this[t]); t++) {
                        for (1 === e.nodeType && x.cleanData(Ft(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                        e.options && x.nodeName(e, "select") && (e.options.length = 0)
                    }
                    return this
                },
                clone: function(e, t) {
                    return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                        return x.clone(this, e, t)
                    })
                },
                html: function(e$$0) {
                    return x.access(this,
                        function(e) {
                            var n = this[0] || {};
                            var r = 0;
                            var i = this.length;
                            if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t;
                            if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || ["", ""])[1].toLowerCase()])) {
                                e = e.replace(vt, "\x3c$1\x3e\x3c/$2\x3e");
                                try {
                                    for (; i > r; r++) n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), n.innerHTML = e);
                                    n = 0
                                } catch (o) {}
                            }
                            n && this.empty().append(e)
                        }, null, e$$0, arguments.length)
                },
                replaceWith: function() {
                    var e$$0 =
                        x.map(this, function(e) {
                            return [e.nextSibling, e.parentNode]
                        });
                    var t = 0;
                    return this.domManip(arguments, function(n) {
                        var r = e$$0[t++];
                        var i = e$$0[t++];
                        i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r))
                    }, !0), t ? this : this.remove()
                },
                detach: function(e) {
                    return this.remove(e, !0)
                },
                domManip: function(e, t, n) {
                    e = d.apply([], e);
                    var r$$0;
                    var i$$0;
                    var o;
                    var a;
                    var s;
                    var l;
                    var u = 0;
                    var c = this.length;
                    var p = this;
                    var f = c - 1;
                    var h = e[0];
                    var g = x.isFunction(h);
                    if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) &&
                        Nt.test(h)) return this.each(function(r) {
                        var i = p.eq(r);
                        g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n)
                    });
                    if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r$$0 = l.firstChild, 1 === l.childNodes.length && (l = r$$0), r$$0)) {
                        for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++) i$$0 = l, u !== f && (i$$0 = x.clone(i$$0, !0, !0), o && x.merge(a, Ft(i$$0, "script"))), t.call(this[u], i$$0, u);
                        if (o)
                            for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++) i$$0 = a[u], kt.test(i$$0.type || "") && !x._data(i$$0, "globalEval") &&
                                x.contains(s, i$$0) && (i$$0.src ? x._evalUrl(i$$0.src) : x.globalEval((i$$0.text || i$$0.textContent || i$$0.innerHTML || "").replace(St, "")));
                        l = r$$0 = null
                    }
                    return this
                }
            });
            x.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e$$0, t) {
                x.fn[e$$0] = function(e) {
                    var n;
                    var r = 0;
                    var i = [];
                    var o = x(e);
                    for (var a = o.length - 1; a >= r; r++) n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get());
                    return this.pushStack(i)
                }
            });
            x.extend({
                clone: function(e, t, n) {
                    var r;
                    var i;
                    var o;
                    var a;
                    var s;
                    var l = x.contains(e.ownerDocument, e);
                    if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("\x3c" + e.nodeName + "\x3e") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e)))
                        for (r = Ft(o), s = Ft(e), a = 0; null != (i = s[a]); ++a) r[a] && Ot(i, r[a]);
                    if (t)
                        if (n)
                            for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]); a++) Mt(i, r[a]);
                        else Mt(e, o);
                    return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e,
                        "script")), r = s = i = null, o
                },
                buildFragment: function(e, t, n, r) {
                    var i;
                    var o;
                    var a;
                    var s;
                    var l;
                    var u;
                    var c;
                    var p = e.length;
                    var f = dt(t);
                    var d = [];
                    for (var h = 0; p > h; h++)
                        if (o = e[h], o || 0 === o)
                            if ("object" === x.type(o)) x.merge(d, o.nodeType ? [o] : o);
                            else if (wt.test(o)) {
                        for (s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || ["", ""])[1].toLowerCase(), c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "\x3c$1\x3e\x3c/$2\x3e") + c[2], i = c[0]; i--;) s = s.lastChild;
                        if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), !x.support.tbody)
                            for (o = "table" !== l || xt.test(o) ? "\x3ctable\x3e" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length; i--;) x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u);
                        for (x.merge(d, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                        s = f.lastChild
                    } else d.push(t.createTextNode(o));
                    for (s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0; o = d[h++];)
                        if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), s = Ft(f.appendChild(o),
                                "script"), a && _t(s), n))
                            for (i = 0; o = s[i++];) kt.test(o.type || "") && n.push(o);
                    return s = null, f
                },
                cleanData: function(e, t) {
                    var n;
                    var r;
                    var o;
                    var a;
                    var s = 0;
                    var l = x.expando;
                    var u = x.cache;
                    var c = x.support.deleteExpando;
                    for (var f = x.event.special; null != (n = e[s]); s++)
                        if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o])) {
                            if (a.events)
                                for (r in a.events) f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
                            u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, p.push(o))
                        }
                },
                _evalUrl: function(e) {
                    return x.ajax({
                        url: e,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        "throws": !0
                    })
                }
            }), x.fn.extend({
                wrapAll: function(e$$0) {
                    if (x.isFunction(e$$0)) return this.each(function(t) {
                        x(this).wrapAll(e$$0.call(this, t))
                    });
                    if (this[0]) {
                        var t$$0 = x(e$$0, this[0].ownerDocument).eq(0).clone(!0);
                        this[0].parentNode && t$$0.insertBefore(this[0]), t$$0.map(function() {
                            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                            return e
                        }).append(this)
                    }
                    return this
                },
                wrapInner: function(e) {
                    return x.isFunction(e) ? this.each(function(t) {
                        x(this).wrapInner(e.call(this,
                            t))
                    }) : this.each(function() {
                        var t = x(this);
                        var n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    })
                },
                wrap: function(e) {
                    var t = x.isFunction(e);
                    return this.each(function(n) {
                        x(this).wrapAll(t ? e.call(this, n) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        x.nodeName(this, "body") || x(this).replaceWith(this.childNodes)
                    }).end()
                }
            });
            var Pt;
            var Rt;
            var Wt;
            var $t = /alpha\([^)]*\)/i;
            var It = /opacity\s*=\s*([^)]*)/;
            var zt = /^(top|right|bottom|left)$/;
            var Xt = /^(none|table(?!-c[ea]).+)/;
            var Ut = /^margin/;
            var Vt =
                RegExp("^(" + w + ")(.*)$", "i");
            var Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i");
            var Jt = RegExp("^([+-])\x3d(" + w + ")", "i");
            var Gt = {
                BODY: "block"
            };
            var Qt = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            };
            var Kt = {
                letterSpacing: 0,
                fontWeight: 400
            };
            var Zt = ["Top", "Right", "Bottom", "Left"];
            var en = ["Webkit", "O", "Moz", "ms"];
            x.fn.extend({
                css: function(e$$0, n$$0) {
                    return x.access(this, function(e, n, r) {
                        var i;
                        var o;
                        var a = {};
                        var s = 0;
                        if (x.isArray(n)) {
                            for (o = Rt(e), i = n.length; i > s; s++) a[n[s]] = x.css(e, n[s], !1, o);
                            return a
                        }
                        return r !==
                            t ? x.style(e, n, r) : x.css(e, n)
                    }, e$$0, n$$0, arguments.length > 1)
                },
                show: function() {
                    return rn(this, !0)
                },
                hide: function() {
                    return rn(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        nn(this) ? x(this).show() : x(this).hide()
                    })
                }
            }), x.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var n = Wt(e, "opacity");
                                return "" === n ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": x.support.cssFloat ?
                        "cssFloat" : "styleFloat"
                },
                style: function(e, n, r, i) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var o;
                        var a;
                        var s;
                        var l = x.camelCase(n);
                        var u = e.style;
                        if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], r === t) return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n];
                        if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") ||
                                (u[n] = "inherit"), s && "set" in s && (r = s.set(e, r, i)) === t))) try {
                            u[n] = r
                        } catch (c) {}
                    }
                },
                css: function(e, n, r, i) {
                    var o;
                    var a;
                    var s;
                    var l = x.camelCase(n);
                    return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), "" === r || r ? (o = parseFloat(a), r === !0 || x.isNumeric(o) ? o || 0 : a) : a
                }
            }), e.getComputedStyle ? (Rt = function(t) {
                return e.getComputedStyle(t, null)
            }, Wt = function(e, n, r) {
                var i;
                var o;
                var a;
                var s = r || Rt(e);
                var l =
                    s ? s.getPropertyValue(n) || s[n] : t;
                var u = e.style;
                return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l
            }) : a.documentElement.currentStyle && (Rt = function(e) {
                return e.currentStyle
            }, Wt = function(e, n, r) {
                var i;
                var o;
                var a;
                var s = r || Rt(e);
                var l = s ? s[n] : t;
                var u = e.style;
                return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, o = e.runtimeStyle, a = o &&
                    o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l
            });
            x.each(["height", "width"], function(e$$0, n) {
                    x.cssHooks[n] = {
                        get: function(e, r, i) {
                            return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, function() {
                                return sn(e, n, i)
                            }) : sn(e, n, i) : t
                        },
                        set: function(e, t, r) {
                            var i = r && Rt(e);
                            return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0)
                        }
                    }
                }), x.support.opacity || (x.cssHooks.opacity = {
                    get: function(e,
                        t) {
                        return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
                    },
                    set: function(e, t) {
                        var n = e.style;
                        var r = e.currentStyle;
                        var i = x.isNumeric(t) ? "alpha(opacity\x3d" + 100 * t + ")" : "";
                        var o = r && r.filter || n.filter || "";
                        n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i)
                    }
                }), x(function() {
                    x.support.reliableMarginRight || (x.cssHooks.marginRight = {
                        get: function(e, n) {
                            return n ? x.swap(e, {
                                display: "inline-block"
                            }, Wt, [e, "marginRight"]) : t
                        }
                    }), !x.support.pixelPosition && x.fn.position && x.each(["top", "left"], function(e$$0, n) {
                        x.cssHooks[n] = {
                            get: function(e, r) {
                                return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t
                            }
                        }
                    })
                }), x.expr && x.expr.filters && (x.expr.filters.hidden = function(e) {
                    return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display"))
                }, x.expr.filters.visible = function(e) {
                    return !x.expr.filters.hidden(e)
                }),
                x.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, function(e, t) {
                    x.cssHooks[e + t] = {
                        expand: function(n) {
                            var r = 0;
                            var i = {};
                            for (var o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0];
                            return i
                        }
                    }, Ut.test(e) || (x.cssHooks[e + t].set = on)
                });
            var cn = /%20/g;
            var pn = /\[\]$/;
            var fn = /\r?\n/g;
            var dn = /^(?:submit|button|image|reset|file)$/i;
            var hn = /^(?:input|select|textarea|keygen)/i;
            x.fn.extend({
                serialize: function() {
                    return x.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e =
                            x.prop(this, "elements");
                        return e ? x.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e))
                    }).map(function(e$$0, t) {
                        var n = x(this).val();
                        return null == n ? null : x.isArray(n) ? x.map(n, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(fn, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: n.replace(fn, "\r\n")
                        }
                    }).get()
                }
            }), x.param = function(e$$0, n) {
                var r;
                var i = [];
                var o = function(e, t) {
                    t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] =
                        encodeURIComponent(e) + "\x3d" + encodeURIComponent(t)
                };
                if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e$$0) || e$$0.jquery && !x.isPlainObject(e$$0)) x.each(e$$0, function() {
                    o(this.name, this.value)
                });
                else
                    for (r in e$$0) gn(r, e$$0[r], n, o);
                return i.join("\x26").replace(cn, "+")
            };
            x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
                function(e$$0, t) {
                    x.fn[t] = function(e, n) {
                        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                    }
                }), x.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                },
                bind: function(e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, n, r) {
                    return this.on(t, e, n, r)
                },
                undelegate: function(e, t, n) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                }
            });
            var mn;
            var yn;
            var vn = x.now();
            var bn = /\?/;
            var xn = /#.*$/;
            var wn = /([?&])_=[^&]*/;
            var Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm;
            var Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
            var Nn = /^(?:GET|HEAD)$/;
            var kn = /^\/\//;
            var En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
            var Sn = x.fn.load;
            var An = {};
            var jn = {};
            var Dn = "*/".concat("*");
            try {
                yn = o.href
            } catch (Ln) {
                yn = a.createElement("a"), yn.href = "", yn = yn.href
            }
            mn = En.exec(yn.toLowerCase()) || [];
            x.fn.load = function(e$$0, n, r) {
                if ("string" != typeof e$$0 && Sn) return Sn.apply(this, arguments);
                var i;
                var o;
                var a;
                var s = this;
                var l = e$$0.indexOf(" ");
                return l >= 0 && (i = e$$0.slice(l, e$$0.length), e$$0 = e$$0.slice(0, l)), x.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({
                    url: e$$0,
                    type: a,
                    dataType: "html",
                    data: n
                }).done(function(e) {
                    o = arguments, s.html(i ? x("\x3cdiv\x3e").append(x.parseHTML(e)).find(i) : e)
                }).complete(r && function(e, t) {
                    s.each(r, o || [e.responseText, t, e])
                }), this
            }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e$$0, t) {
                x.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }), x.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: yn,
                    type: "GET",
                    isLocal: Cn.test(mn[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset\x3dUTF-8",
                    accepts: {
                        "*": Dn,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": x.parseJSON,
                        "text xml": x.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e)
                },
                ajaxPrefilter: Hn(An),
                ajaxTransport: Hn(jn),
                ajax: function(e$$0, n$$0) {
                    function k(e, n, r, i) {
                        var c;
                        var y;
                        var v;
                        var w;
                        var T;
                        var N = n;
                        2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" ===
                            p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [y, N, C]) : h.rejectWith(f, [C, N, v]), C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [C, p, c ? y : v]), g.fireWith(f, [C, N]), l && (d.trigger("ajaxComplete", [C, p]), --x.active || x.event.trigger("ajaxStop")))
                    }
                    "object" == typeof e$$0 && (n$$0 = e$$0, e$$0 = t), n$$0 = n$$0 || {};
                    var r$$0;
                    var i$$0;
                    var o;
                    var a;
                    var s;
                    var l;
                    var u;
                    var c$$0;
                    var p = x.ajaxSetup({},
                        n$$0);
                    var f = p.context || p;
                    var d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event;
                    var h = x.Deferred();
                    var g = x.Callbacks("once memory");
                    var m = p.statusCode || {};
                    var y$$0 = {};
                    var v$$0 = {};
                    var b = 0;
                    var w$$0 = "canceled";
                    var C = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (2 === b) {
                                if (!c$$0)
                                    for (c$$0 = {}; t = Tn.exec(a);) c$$0[t[1].toLowerCase()] = t[2];
                                t = c$$0[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return 2 === b ? a : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return b || (e =
                                v$$0[n] = v$$0[n] || e, y$$0[e] = t), this
                        },
                        overrideMimeType: function(e) {
                            return b || (p.mimeType = e), this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (2 > b)
                                    for (t in e) m[t] = [m[t], e[t]];
                                else C.always(e[C.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || w$$0;
                            return u && u.abort(t), k(0, t), this
                        }
                    };
                    if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e$$0 || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), p.type = n$$0.method || n$$0.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [""], null == p.crossDomain && (r$$0 = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r$$0 || r$$0[1] === mn[1] && r$$0[2] === mn[2] && (r$$0[3] || ("http:" === r$$0[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), qn(An, p, n$$0, C), 2 === b) return C;
                    l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "\x26" : "?") +
                        p.data, delete p.data), p.cache === !1 && (p.url = wn.test(o) ? o.replace(wn, "$1_\x3d" + vn++) : o + (bn.test(o) ? "\x26" : "?") + "_\x3d" + vn++)), p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || n$$0.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ?
                        ", " + Dn + "; q\x3d0.01" : "") : p.accepts["*"]);
                    for (i$$0 in p.headers) C.setRequestHeader(i$$0, p.headers[i$$0]);
                    if (p.beforeSend && (p.beforeSend.call(f, C, p) === !1 || 2 === b)) return C.abort();
                    w$$0 = "abort";
                    for (i$$0 in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) C[i$$0](p[i$$0]);
                    if (u = qn(jn, p, n$$0, C)) {
                        C.readyState = 1, l && d.trigger("ajaxSend", [C, p]), p.async && p.timeout > 0 && (s = setTimeout(function() {
                            C.abort("timeout")
                        }, p.timeout));
                        try {
                            b = 1, u.send(y$$0, k)
                        } catch (N$$0) {
                            if (!(2 > b)) throw N$$0;
                            k(-1, N$$0)
                        }
                    } else k(-1, "No Transport");
                    return C
                },
                getJSON: function(e, t, n) {
                    return x.get(e, t, n, "json")
                },
                getScript: function(e, n) {
                    return x.get(e, t, n, "script")
                }
            }), x.each(["get", "post"], function(e$$0, n) {
                x[n] = function(e, r, i, o) {
                    return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({
                        url: e,
                        type: n,
                        dataType: o,
                        data: r,
                        success: i
                    })
                }
            });
            x.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(e) {
                        return x.globalEval(e), e
                    }
                }
            }), x.ajaxPrefilter("script",
                function(e) {
                    e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
                }), x.ajaxTransport("script", function(e$$0) {
                if (e$$0.crossDomain) {
                    var n;
                    var r = a.head || x("head")[0] || a.documentElement;
                    return {
                        send: function(t$$0, i) {
                            n = a.createElement("script"), n.async = !0, e$$0.scriptCharset && (n.charset = e$$0.scriptCharset), n.src = e$$0.url, n.onload = n.onreadystatechange = function(e, t) {
                                (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n),
                                    n = null, t || i(200, "success"))
                            }, r.insertBefore(n, r.firstChild)
                        },
                        abort: function() {
                            n && n.onload(t, !0)
                        }
                    }
                }
            });
            var Fn = [];
            var Bn = /(=)\?(?=&|$)|\?\?/;
            x.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = Fn.pop() || x.expando + "_" + vn++;
                    return this[e] = !0, e
                }
            }), x.ajaxPrefilter("json jsonp", function(n, r, i) {
                var o;
                var a;
                var s;
                var l = n.jsonp !== !1 && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data");
                return l || "jsonp" === n.dataTypes[0] ?
                    (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Bn, "$1" + o) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "\x26" : "?") + n.jsonp + "\x3d" + o), n.converters["script json"] = function() {
                        return s || x.error(o + " was not called"), s[0]
                    }, n.dataTypes[0] = "json", a = e[o], e[o] = function() {
                        s = arguments
                    }, i.always(function() {
                        e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), s = a = t
                    }), "script") : t
            });
            var Pn;
            var Rn;
            var Wn = 0;
            var $n = e.ActiveXObject && function() {
                for (var e in Pn) Pn[e](t, !0)
            };
            x.ajaxSettings.xhr = e.ActiveXObject ? function() {
                return !this.isLocal && In() || zn()
            } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !!Rn && "withCredentials" in Rn, Rn = x.support.ajax = !!Rn, Rn && x.ajaxTransport(function(n) {
                if (!n.crossDomain || x.support.cors) {
                    var r;
                    return {
                        send: function(i$$0, o) {
                            var a;
                            var s$$0;
                            var l = n.xhr();
                            if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)
                                for (s$$0 in n.xhrFields) l[s$$0] = n.xhrFields[s$$0];
                            n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType),
                                n.crossDomain || i$$0["X-Requested-With"] || (i$$0["X-Requested-With"] = "XMLHttpRequest");
                            try {
                                for (s$$0 in i$$0) l.setRequestHeader(s$$0, i$$0[s$$0])
                            } catch (u$$0) {}
                            l.send(n.hasContent && n.data || null), r = function(e, i) {
                                var s;
                                var u;
                                var c;
                                var p;
                                try {
                                    if (r && (i || 4 === l.readyState))
                                        if (r = t, a && (l.onreadystatechange = x.noop, $n && delete Pn[a]), i) 4 !== l.readyState && l.abort();
                                        else {
                                            p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText);
                                            try {
                                                c = l.statusText
                                            } catch (f) {
                                                c = ""
                                            }
                                            s || !n.isLocal ||
                                                n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404
                                        }
                                } catch (d) {
                                    i || o(-1, d)
                                }
                                p && o(s, c, p, u)
                            }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r()
                        },
                        abort: function() {
                            r && r(t, !0)
                        }
                    }
                }
            });
            var Xn;
            var Un;
            var Vn = /^(?:toggle|show|hide)$/;
            var Yn = RegExp("^(?:([+-])\x3d|)(" + w + ")([a-z%]*)$", "i");
            var Jn = /queueHooks$/;
            var Gn = [nr];
            var Qn = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t);
                    var r = n.cur();
                    var i = Yn.exec(t);
                    var o = i && i[3] || (x.cssNumber[e] ? "" : "px");
                    var a =
                        (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e));
                    var s = 1;
                    var l = 20;
                    if (a && a[3] !== o) {
                        o = o || a[3], i = i || [], a = +r || 1;
                        do s = s || ".5", a /= s, x.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --l)
                    }
                    return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n
                }]
            };
            x.Animation = x.extend(er, {
                tweener: function(e, t) {
                    x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                    var n;
                    var r = 0;
                    for (var i = e.length; i > r; r++) n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? Gn.unshift(e) : Gn.push(e)
                }
            });
            x.Tween =
                rr, rr.prototype = {
                    constructor: rr,
                    init: function(e, t, n, r, i, o) {
                        this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px")
                    },
                    cur: function() {
                        var e = rr.propHooks[this.prop];
                        return e && e.get ? e.get(this) : rr.propHooks._default.get(this)
                    },
                    run: function(e) {
                        var t;
                        var n = rr.propHooks[this.prop];
                        return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) *
                            t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this
                    }
                }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
                    _default: {
                        get: function(e) {
                            var t;
                            return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                        },
                        set: function(e) {
                            x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem,
                                e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                        }
                    }
                }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
                    set: function(e) {
                        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                    }
                }, x.each(["toggle", "show", "hide"], function(e$$0, t) {
                    var n = x.fn[t];
                    x.fn[t] = function(e, r, i) {
                        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i)
                    }
                }), x.fn.extend({
                    fadeTo: function(e, t, n, r) {
                        return this.filter(nn).css("opacity", 0).show().end().animate({
                            opacity: t
                        }, e, n, r)
                    },
                    animate: function(e, t$$0, n, r) {
                        var i =
                            x.isEmptyObject(e);
                        var o = x.speed(t$$0, n, r);
                        var a = function() {
                            var t = er(this, x.extend({}, e), o);
                            (i || x._data(this, "finish")) && t.stop(!0)
                        };
                        return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
                    },
                    stop: function(e$$0, n$$0, r) {
                        var i = function(e) {
                            var t = e.stop;
                            delete e.stop, t(r)
                        };
                        return "string" != typeof e$$0 && (r = n$$0, n$$0 = e$$0, e$$0 = t), n$$0 && e$$0 !== !1 && this.queue(e$$0 || "fx", []), this.each(function() {
                            var t = !0;
                            var n = null != e$$0 && e$$0 + "queueHooks";
                            var o = x.timers;
                            var a = x._data(this);
                            if (n) a[n] && a[n].stop &&
                                i(a[n]);
                            else
                                for (n in a) a[n] && a[n].stop && Jn.test(n) && i(a[n]);
                            for (n = o.length; n--;) o[n].elem !== this || null != e$$0 && o[n].queue !== e$$0 || (o[n].anim.stop(r), t = !1, o.splice(n, 1));
                            (t || !r) && x.dequeue(this, e$$0)
                        })
                    },
                    finish: function(e) {
                        return e !== !1 && (e = e || "fx"), this.each(function() {
                            var t;
                            var n = x._data(this);
                            var r = n[e + "queue"];
                            var i = n[e + "queueHooks"];
                            var o = x.timers;
                            var a = r ? r.length : 0;
                            for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                                o.splice(t, 1));
                            for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                            delete n.finish
                        })
                    }
                });
            x.each({
                slideDown: ir("show"),
                slideUp: ir("hide"),
                slideToggle: ir("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e$$0, t) {
                x.fn[e$$0] = function(e, n, r) {
                    return this.animate(t, e, n, r)
                }
            }), x.speed = function(e, t, n) {
                var r = e && "object" == typeof e ? x.extend({}, e) : {
                    complete: n || !n && t || x.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !x.isFunction(t) && t
                };
                return r.duration = x.fx.off ?
                    0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                        x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue)
                    }, r
            }, x.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                }
            }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function() {
                var e;
                var n = x.timers;
                var r = 0;
                for (Xn = x.now(); n.length > r; r++) e = n[r], e() || n[r] !== e || n.splice(r--,
                    1);
                n.length || x.fx.stop(), Xn = t
            }, x.fx.timer = function(e) {
                e() && x.timers.push(e) && x.fx.start()
            }, x.fx.interval = 13, x.fx.start = function() {
                Un || (Un = setInterval(x.fx.tick, x.fx.interval))
            }, x.fx.stop = function() {
                clearInterval(Un), Un = null
            }, x.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function(e) {
                return x.grep(x.timers, function(t) {
                    return e === t.elem
                }).length
            }), x.fn.offset = function(e) {
                if (arguments.length) return e === t ? this : this.each(function(t) {
                    x.offset.setOffset(this,
                        e, t)
                });
                var n;
                var r;
                var o = {
                    top: 0,
                    left: 0
                };
                var a = this[0];
                var s = a && a.ownerDocument;
                if (s) return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), r = or(s), {
                    top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
                    left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
                }) : o
            }, x.offset = {
                setOffset: function(e, t, n) {
                    var r = x.css(e, "position");
                    "static" === r && (e.style.position = "relative");
                    var i = x(e);
                    var o = i.offset();
                    var a = x.css(e, "top");
                    var s = x.css(e, "left");
                    var l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [a, s]) > -1;
                    var u = {};
                    var c = {};
                    var p;
                    var f;
                    l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u)
                }
            }, x.fn.extend({
                position: function() {
                    if (this[0]) {
                        var e;
                        var t;
                        var n = {
                            top: 0,
                            left: 0
                        };
                        var r = this[0];
                        return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t =
                            this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), n.left += x.css(e[0], "borderLeftWidth", !0)), {
                            top: t.top - n.top - x.css(r, "marginTop", !0),
                            left: t.left - n.left - x.css(r, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent || s; e && !x.nodeName(e, "html") && "static" === x.css(e, "position");) e = e.offsetParent;
                        return e || s
                    })
                }
            }), x.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(e$$0, n) {
                var r = /Y/.test(n);
                x.fn[e$$0] =
                    function(i$$0) {
                        return x.access(this, function(e, i, o) {
                            var a = or(e);
                            return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, t)
                        }, e$$0, i$$0, arguments.length, null)
                    }
            });
            x.each({
                Height: "height",
                Width: "width"
            }, function(e, n$$0) {
                x.each({
                    padding: "inner" + e,
                    content: n$$0,
                    "": "outer" + e
                }, function(r$$0, i$$1) {
                    x.fn[i$$1] = function(i$$0, o$$0) {
                        var a = arguments.length && (r$$0 || "boolean" != typeof i$$0);
                        var s = r$$0 || (i$$0 === !0 || o$$0 === !0 ? "margin" : "border");
                        return x.access(this,
                            function(n, r, i) {
                                var o;
                                return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s)
                            }, n$$0, a ? i$$0 : t, a, null)
                    }
                })
            }), x.fn.size = function() {
                return this.length
            }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, "function" == typeof define && define.amd && define("jquery", [], function() {
                return x
            }))
        })(window)
    })();
    (function(window$$0, document$$0, location, $, undefined) {
        function bez(coOrdArray) {
            var encodedFuncName = "bez_" + $.makeArray(arguments).join("_").replace(".", "p");
            if (typeof $["easing"][encodedFuncName] !== "function") {
                var polyBez = function(p1, p2) {
                    var A = [null, null];
                    var B = [null, null];
                    var C = [null, null];
                    var bezCoOrd = function(t, ax) {
                        C[ax] = 3 * p1[ax];
                        B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax];
                        A[ax] = 1 - C[ax] - B[ax];
                        return t * (C[ax] + t * (B[ax] + t * A[ax]))
                    };
                    var xDeriv = function(t) {
                        return C[0] + t * (2 * B[0] + 3 * A[0] * t)
                    };
                    var xForT = function(t) {
                        var x =
                            t;
                        var i = 0;
                        for (var z; ++i < 14;) {
                            z = bezCoOrd(x, 0) - t;
                            if (Math.abs(z) < .001) break;
                            x -= z / xDeriv(x)
                        }
                        return x
                    };
                    return function(t) {
                        return bezCoOrd(xForT(t), 1)
                    }
                };
                $["easing"][encodedFuncName] = function(x, t, b, c, d) {
                    return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b
                }
            }
            return encodedFuncName
        }

        function noop() {}

        function minMaxLimit(value, min, max) {
            return Math.max(isNaN(min) ? -Infinity : min, Math.min(isNaN(max) ? Infinity : max, value))
        }

        function readTransform(css) {
            return css.match(/ma/) && css.match(/-?\d+(?!d)/g)[css.match(/3d/) ?
                12 : 4]
        }

        function readPosition($el) {
            if (CSS3) return +readTransform($el.css("transform"));
            else return +$el.css("left").replace("px", "")
        }

        function getTranslate(pos) {
            var obj = {};
            if (CSS3) obj.transform = "translate3d(" + pos + "px,0,0)";
            else obj.left = pos;
            return obj
        }

        function getDuration(time) {
            return {
                "transition-duration": time + "ms"
            }
        }

        function unlessNaN(value, alternative) {
            return isNaN(value) ? alternative : value
        }

        function numberFromMeasure(value, measure) {
            return unlessNaN(+String(value).replace(measure || "px", ""))
        }

        function numberFromPercent(value) {
            return /%$/.test(value) ?
                numberFromMeasure(value, "%") : undefined
        }

        function numberFromWhatever(value, whole) {
            return unlessNaN(numberFromPercent(value) / 100 * whole, numberFromMeasure(value))
        }

        function measureIsValid(value) {
            return (!isNaN(numberFromMeasure(value)) || !isNaN(numberFromMeasure(value, "%"))) && value
        }

        function getPosByIndex(index, side, margin, baseIndex) {
            return (index - (baseIndex || 0)) * (side + (margin || 0))
        }

        function getIndexByPos(pos, side, margin, baseIndex) {
            return -Math.round(pos / (side + (margin || 0)) - (baseIndex || 0))
        }

        function bindTransitionEnd($el) {
            var elData =
                $el.data();
            if (elData.tEnd) return;
            var el = $el[0];
            var transitionEndEvent = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                msTransition: "MSTransitionEnd",
                transition: "transitionend"
            };
            addEvent(el, transitionEndEvent[Modernizr.prefixed("transition")], function(e) {
                elData.tProp && e.propertyName.match(elData.tProp) && elData.onEndFn()
            });
            elData.tEnd = true
        }

        function afterTransition($el, property, fn, time) {
            var ok;
            var elData = $el.data();
            if (elData) {
                elData.onEndFn =
                    function() {
                        if (ok) return;
                        ok = true;
                        clearTimeout(elData.tT);
                        fn()
                    };
                elData.tProp = property;
                clearTimeout(elData.tT);
                elData.tT = setTimeout(function() {
                    elData.onEndFn()
                }, time * 1.5);
                bindTransitionEnd($el)
            }
        }

        function stop($el, left) {
            if ($el.length) {
                var elData = $el.data();
                if (CSS3) {
                    $el.css(getDuration(0));
                    elData.onEndFn = noop;
                    clearTimeout(elData.tT)
                } else $el.stop();
                var lockedLeft = getNumber(left, function() {
                    return readPosition($el)
                });
                $el.css(getTranslate(lockedLeft));
                return lockedLeft
            }
        }

        function getNumber() {
            var number;
            var _i =
                0;
            for (var _l = arguments.length; _i < _l; _i++) {
                number = _i ? arguments[_i]() : arguments[_i];
                if (typeof number === "number") break
            }
            return number
        }

        function edgeResistance(pos, edge) {
            return Math.round(pos + (edge - pos) / 1.5)
        }

        function getProtocol() {
            getProtocol.p = getProtocol.p || (location.protocol === "https:" ? "https://" : "http://");
            return getProtocol.p
        }

        function parseHref(href) {
            var a = document$$0.createElement("a");
            a.href = href;
            return a
        }

        function findVideoId(href, forceVideo) {
            if (typeof href !== "string") return href;
            href = parseHref(href);
            var id;
            var type;
            if (href.host.match(/youtube\.com/) && href.search) {
                id = href.search.split("v\x3d")[1];
                if (id) {
                    var ampersandPosition = id.indexOf("\x26");
                    if (ampersandPosition !== -1) id = id.substring(0, ampersandPosition);
                    type = "youtube"
                }
            } else if (href.host.match(/youtube\.com|youtu\.be/)) {
                id = href.pathname.replace(/^\/(embed\/|v\/)?/, "").replace(/\/.*/, "");
                type = "youtube"
            } else if (href.host.match(/vimeo\.com/)) {
                type = "vimeo";
                id = href.pathname.replace(/^\/(video\/)?/, "").replace(/\/.*/, "")
            }
            if ((!id || !type) && forceVideo) {
                id =
                    href.href;
                type = "custom"
            }
            return id ? {
                id: id,
                type: type,
                s: href.search.replace(/^\?/, ""),
                p: getProtocol()
            } : false
        }

        function getVideoThumbs(dataFrame, data, fotorama) {
            var img;
            var thumb;
            var video = dataFrame.video;
            if (video.type === "youtube") {
                thumb = getProtocol() + "img.youtube.com/vi/" + video.id + "/default.jpg";
                img = thumb.replace(/\/default.jpg$/, "/hqdefault.jpg");
                dataFrame.thumbsReady = true
            } else if (video.type === "vimeo") $.ajax({
                url: getProtocol() + "vimeo.com/api/v2/video/" + video.id + ".json",
                dataType: "jsonp",
                success: function(json) {
                    dataFrame.thumbsReady =
                        true;
                    updateData(data, {
                        img: json[0].thumbnail_large,
                        thumb: json[0].thumbnail_small
                    }, dataFrame.i, fotorama)
                }
            });
            else dataFrame.thumbsReady = true;
            return {
                img: img,
                thumb: thumb
            }
        }

        function updateData(data, _dataFrame, i, fotorama) {
            var _i = 0;
            for (var _l = data.length; _i < _l; _i++) {
                var dataFrame = data[_i];
                if (dataFrame.i === i && dataFrame.thumbsReady) {
                    var clear = {
                        videoReady: true
                    };
                    clear[STAGE_FRAME_KEY] = clear[NAV_THUMB_FRAME_KEY] = clear[NAV_DOT_FRAME_KEY] = false;
                    fotorama.splice(_i, 1, $.extend({}, dataFrame, clear, _dataFrame));
                    break
                }
            }
        }

        function getDataFromHtml($el) {
            function getDataFromImg($img, imgData, checkVideo) {
                var $child = $img.children("img").eq(0);
                var _imgHref = $img.attr("href");
                var _imgSrc = $img.attr("src");
                var _thumbSrc = $child.attr("src");
                var _video = imgData.video;
                var video = checkVideo ? findVideoId(_imgHref, _video === true) : false;
                if (video) _imgHref = false;
                else video = _video;
                getDimensions($img, $child, $.extend(imgData, {
                    video: video,
                    img: imgData.img || _imgHref || _imgSrc || _thumbSrc,
                    thumb: imgData.thumb || _thumbSrc || _imgSrc || _imgHref
                }))
            }

            function getDimensions($img,
                $child, imgData) {
                var separateThumbFLAG = imgData.thumb && imgData.img !== imgData.thumb;
                var width = numberFromMeasure(imgData.width || $img.attr("width"));
                var height = numberFromMeasure(imgData.height || $img.attr("height"));
                $.extend(imgData, {
                    width: width,
                    height: height,
                    thumbratio: getRatio(imgData.thumbratio || numberFromMeasure(imgData.thumbwidth || $child && $child.attr("width") || separateThumbFLAG || width) / numberFromMeasure(imgData.thumbheight || $child && $child.attr("height") || separateThumbFLAG || height))
                })
            }
            var data = [];
            $el.children().each(function() {
                var $this =
                    $(this);
                var dataFrame = optionsToLowerCase($.extend($this.data(), {
                    id: $this.attr("id")
                }));
                if ($this.is("a, img")) getDataFromImg($this, dataFrame, true);
                else if (!$this.is(":empty")) getDimensions($this, null, $.extend(dataFrame, {
                    html: this,
                    _html: $this.html()
                }));
                else return;
                data.push(dataFrame)
            });
            return data
        }

        function isHidden(el) {
            return el.offsetWidth === 0 && el.offsetHeight === 0
        }

        function isDetached(el) {
            return !$.contains(document$$0.documentElement, el)
        }

        function waitFor(test, fn, timeout, i) {
            if (!waitFor.i) {
                waitFor.i =
                    1;
                waitFor.ii = [true]
            }
            i = i || waitFor.i;
            if (typeof waitFor.ii[i] === "undefined") waitFor.ii[i] = true;
            if (test()) fn();
            else waitFor.ii[i] && setTimeout(function() {
                waitFor.ii[i] && waitFor(test, fn, timeout, i)
            }, timeout || 100);
            return waitFor.i++
        }

        function setHash(hash) {
            location.replace(location.protocol + "//" + location.host + location.pathname.replace(/^\/?/, "/") + location.search + "#" + hash)
        }

        function fit($el, measuresToFit, method, position) {
            var elData = $el.data();
            var measures = elData.measures;
            if (measures && (!elData.l || elData.l.W !==
                    measures.width || elData.l.H !== measures.height || elData.l.r !== measures.ratio || elData.l.w !== measuresToFit.w || elData.l.h !== measuresToFit.h || elData.l.m !== method || elData.l.p !== position)) {
                var width = measures.width;
                var height = measures.height;
                var ratio = measuresToFit.w / measuresToFit.h;
                var biggerRatioFLAG = measures.ratio >= ratio;
                var fitFLAG = method === "scaledown";
                var containFLAG = method === "contain";
                var coverFLAG = method === "cover";
                var pos = parsePosition(position);
                if (biggerRatioFLAG && (fitFLAG || containFLAG) || !biggerRatioFLAG &&
                    coverFLAG) {
                    width = minMaxLimit(measuresToFit.w, 0, fitFLAG ? width : Infinity);
                    height = width / measures.ratio
                } else if (biggerRatioFLAG && coverFLAG || !biggerRatioFLAG && (fitFLAG || containFLAG)) {
                    height = minMaxLimit(measuresToFit.h, 0, fitFLAG ? height : Infinity);
                    width = height * measures.ratio
                }
                $el.css({
                    width: Math.ceil(width),
                    height: Math.ceil(height),
                    left: Math.floor(numberFromWhatever(pos.x, measuresToFit.w - width)),
                    top: Math.floor(numberFromWhatever(pos.y, measuresToFit.h - height))
                });
                elData.l = {
                    W: measures.width,
                    H: measures.height,
                    r: measures.ratio,
                    w: measuresToFit.w,
                    h: measuresToFit.h,
                    m: method,
                    p: position
                }
            }
            return true
        }

        function setStyle($el, style) {
            var el = $el[0];
            if (el.styleSheet) el.styleSheet.cssText = style;
            else $el.html(style)
        }

        function findShadowEdge(pos, min, max) {
            return min === max ? false : pos <= min ? "left" : pos >= max ? "right" : "left right"
        }

        function getIndexFromHash(hash, data, ok, startindex) {
            if (!ok) return false;
            if (!isNaN(hash)) return hash - (startindex ? 0 : 1);
            var index;
            var _i = 0;
            for (var _l = data.length; _i < _l; _i++) {
                var dataFrame = data[_i];
                if (dataFrame.id ===
                    hash) {
                    index = _i;
                    break
                }
            }
            return index
        }

        function smartClick($el, fn, _options) {
            _options = _options || {};
            $el.each(function() {
                var $this = $(this);
                var thisData = $this.data();
                var startEvent;
                if (thisData.clickOn) return;
                thisData.clickOn = true;
                $.extend(touch($this, {
                    onStart: function(e) {
                        startEvent = e;
                        (_options.onStart || noop).call(this, e)
                    },
                    onMove: _options.onMove || noop,
                    onTouchEnd: _options.onTouchEnd || noop,
                    onEnd: function(result) {
                        if (result.moved) return;
                        fn.call(this, startEvent)
                    }
                }), {
                    noMove: true
                })
            })
        }

        function div(classes, child) {
            return '\x3cdiv class\x3d"' +
                classes + '"\x3e' + (child || "") + "\x3c/div\x3e"
        }

        function shuffle(array) {
            for (var l = array.length; l;) {
                var i = Math.floor(Math.random() * l--);
                var t = array[l];
                array[l] = array[i];
                array[i] = t
            }
            return array
        }

        function clone(array) {
            return Object.prototype.toString.call(array) == "[object Array]" && $.map(array, function(frame) {
                return $.extend({}, frame)
            })
        }

        function lockScroll($el, left, top) {
            $el.scrollLeft(left || 0).scrollTop(top || 0)
        }

        function optionsToLowerCase(options) {
            if (options) {
                var opts = {};
                $.each(options, function(key, value) {
                    opts[key.toLowerCase()] =
                        value
                });
                return opts
            }
        }

        function getRatio(_ratio) {
            if (!_ratio) return;
            var ratio = +_ratio;
            if (!isNaN(ratio)) return ratio;
            else {
                ratio = _ratio.split("/");
                return +ratio[0] / +ratio[1] || undefined
            }
        }

        function addEvent(el, e, fn, bool) {
            if (!e) return;
            el.addEventListener ? el.addEventListener(e, fn, !!bool) : el.attachEvent("on" + e, fn)
        }

        function elIsDisabled(el) {
            return !!el.getAttribute("disabled")
        }

        function disableAttr(FLAG) {
            return {
                tabindex: FLAG * -1 + "",
                disabled: FLAG
            }
        }

        function addEnterUp(el, fn) {
            addEvent(el, "keyup", function(e) {
                elIsDisabled(el) ||
                    e.keyCode == 13 && fn.call(el, e)
            })
        }

        function addFocus(el, fn) {
            addEvent(el, "focus", el.onfocusin = function(e) {
                fn.call(el, e)
            }, true)
        }

        function stopEvent(e, stopPropagation) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            stopPropagation && e.stopPropagation && e.stopPropagation()
        }

        function getDirectionSign(forward) {
            return forward ? "\x3e" : "\x3c"
        }

        function parsePosition(rule) {
            rule = (rule + "").split(/\s+/);
            return {
                x: measureIsValid(rule[0]) || FIFTYFIFTY,
                y: measureIsValid(rule[1]) || FIFTYFIFTY
            }
        }

        function slide($el, options) {
            var elData =
                $el.data();
            var elPos = Math.round(options.pos);
            var onEndFn = function() {
                elData.sliding = false;
                (options.onEnd || noop)()
            };
            if (typeof options.overPos !== "undefined" && options.overPos !== options.pos) {
                elPos = options.overPos;
                onEndFn = function() {
                    slide($el, $.extend({}, options, {
                        overPos: options.pos,
                        time: Math.max(TRANSITION_DURATION, options.time / 2)
                    }))
                }
            }
            var translate = $.extend(getTranslate(elPos), options.width && {
                width: options.width
            });
            elData.sliding = true;
            if (CSS3) {
                $el.css($.extend(getDuration(options.time), translate));
                if (options.time >
                    10) afterTransition($el, "transform", onEndFn, options.time);
                else onEndFn()
            } else $el.stop().animate(translate, options.time, BEZIER, onEndFn)
        }

        function fade($el1, $el2, $frames, options, fadeStack, chain) {
            var chainedFLAG = typeof chain !== "undefined";
            if (!chainedFLAG) {
                fadeStack.push(arguments);
                Array.prototype.push.call(arguments, fadeStack.length);
                if (fadeStack.length > 1) return
            }
            $el1 = $el1 || $($el1);
            $el2 = $el2 || $($el2);
            var _$el1 = $el1[0];
            var _$el2 = $el2[0];
            var crossfadeFLAG = options.method === "crossfade";
            var onEndFn = function() {
                if (!onEndFn.done) {
                    onEndFn.done =
                        true;
                    var args = (chainedFLAG || fadeStack.shift()) && fadeStack.shift();
                    args && fade.apply(this, args);
                    (options.onEnd || noop)(!!args)
                }
            };
            var time = options.time / (chain || 1);
            $frames.removeClass(fadeRearClass + " " + fadeFrontClass);
            $el1.stop().addClass(fadeRearClass);
            $el2.stop().addClass(fadeFrontClass);
            crossfadeFLAG && _$el2 && $el1.fadeTo(0, 0);
            $el1.fadeTo(crossfadeFLAG ? time : 0, 1, crossfadeFLAG && onEndFn);
            $el2.fadeTo(time, 0, onEndFn);
            _$el1 && crossfadeFLAG || _$el2 || onEndFn()
        }

        function extendEvent(e) {
            var touch = (e.touches || [])[0] ||
                e;
            e._x = touch.pageX;
            e._y = touch.clientY;
            e._now = $.now()
        }

        function touch($el, options) {
            function onStart(e) {
                $target = $(e.target);
                tail.checked = targetIsSelectFLAG = targetIsLinkFlag = moved = false;
                if (touchEnabledFLAG || tail.flow || e.touches && e.touches.length > 1 || e.which > 1 || lastEvent && lastEvent.type !== e.type && preventEvent || (targetIsSelectFLAG = options.select && $target.is(options.select, el))) return targetIsSelectFLAG;
                touchFLAG = e.type === "touchstart";
                targetIsLinkFlag = $target.is("a, a *", el);
                controlTouch = tail.control;
                tolerance =
                    tail.noMove || tail.noSwipe || controlTouch ? 16 : !tail.snap ? 4 : 0;
                extendEvent(e);
                startEvent = lastEvent = e;
                moveEventType = e.type.replace(/down|start/, "move").replace(/Down/, "Move");
                (options.onStart || noop).call(el, e, {
                    control: controlTouch,
                    $target: $target
                });
                touchEnabledFLAG = tail.flow = true;
                if (!touchFLAG || tail.go) stopEvent(e)
            }

            function onMove(e) {
                if (e.touches && e.touches.length > 1 || MS_POINTER && !e.isPrimary || moveEventType !== e.type || !touchEnabledFLAG) {
                    touchEnabledFLAG && onEnd();
                    (options.onTouchEnd || noop)();
                    return
                }
                extendEvent(e);
                var xDiff = Math.abs(e._x - startEvent._x);
                var yDiff = Math.abs(e._y - startEvent._y);
                var xyDiff = xDiff - yDiff;
                var xWin = (tail.go || tail.x || xyDiff >= 0) && !tail.noSwipe;
                var yWin = xyDiff < 0;
                if (touchFLAG && !tail.checked) {
                    if (touchEnabledFLAG = xWin) stopEvent(e)
                } else {
                    stopEvent(e);
                    (options.onMove || noop).call(el, e, {
                        touch: touchFLAG
                    })
                }
                if (!moved && Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) > tolerance) moved = true;
                tail.checked = tail.checked || xWin || yWin
            }

            function onEnd(e) {
                (options.onTouchEnd || noop)();
                var _touchEnabledFLAG = touchEnabledFLAG;
                tail.control = touchEnabledFLAG = false;
                if (_touchEnabledFLAG) tail.flow = false;
                if (!_touchEnabledFLAG || targetIsLinkFlag && !tail.checked) return;
                e && stopEvent(e);
                preventEvent = true;
                clearTimeout(preventEventTimeout);
                preventEventTimeout = setTimeout(function() {
                    preventEvent = false
                }, 1E3);
                (options.onEnd || noop).call(el, {
                    moved: moved,
                    $target: $target,
                    control: controlTouch,
                    touch: touchFLAG,
                    startEvent: startEvent,
                    aborted: !e || e.type === "MSPointerCancel"
                })
            }

            function onOtherStart() {
                if (tail.flow) return;
                setTimeout(function() {
                    tail.flow =
                        true
                }, 10)
            }

            function onOtherEnd() {
                if (!tail.flow) return;
                setTimeout(function() {
                    tail.flow = false
                }, TOUCH_TIMEOUT)
            }
            var el = $el[0];
            var tail = {};
            var touchEnabledFLAG;
            var startEvent;
            var $target;
            var controlTouch;
            var touchFLAG;
            var targetIsSelectFLAG;
            var targetIsLinkFlag;
            var tolerance;
            var moved;
            if (MS_POINTER) {
                addEvent(el, "MSPointerDown", onStart);
                addEvent(document$$0, "MSPointerMove", onMove);
                addEvent(document$$0, "MSPointerCancel", onEnd);
                addEvent(document$$0, "MSPointerUp", onEnd)
            } else {
                addEvent(el, "touchstart", onStart);
                addEvent(el, "touchmove", onMove);
                addEvent(el, "touchend", onEnd);
                addEvent(document$$0, "touchstart", onOtherStart);
                addEvent(document$$0, "touchend", onOtherEnd);
                addEvent(document$$0, "touchcancel", onOtherEnd);
                $WINDOW.on("scroll", onOtherEnd);
                $el.on("mousedown", onStart);
                $DOCUMENT.on("mousemove", onMove).on("mouseup", onEnd)
            }
            $el.on("click", "a", function(e) {
                tail.checked && stopEvent(e)
            });
            return tail
        }

        function moveOnTouch($el, options) {
            function startTracking(e, noStop) {
                tracked = true;
                startCoo = coo = e._x;
                startTime = e._now;
                moveTrack = [
                    [startTime, startCoo]
                ];
                startElPos = moveElPos = tail.noMove || noStop ? 0 : stop($el, (options.getPos || noop)());
                (options.onStart || noop).call(el, e)
            }

            function onStart(e, result) {
                min = tail.min;
                max = tail.max;
                snap = tail.snap;
                slowFLAG = e.altKey;
                tracked = moved = false;
                controlFLAG = result.control;
                if (!controlFLAG && !elData.sliding) startTracking(e)
            }

            function onMove(e, result) {
                if (!tail.noSwipe) {
                    if (!tracked) startTracking(e);
                    coo = e._x;
                    moveTrack.push([e._now, coo]);
                    moveElPos = startElPos - (startCoo - coo);
                    edge = findShadowEdge(moveElPos,
                        min, max);
                    if (moveElPos <= min) moveElPos = edgeResistance(moveElPos, min);
                    else if (moveElPos >= max) moveElPos = edgeResistance(moveElPos, max);
                    if (!tail.noMove) {
                        $el.css(getTranslate(moveElPos));
                        if (!moved) {
                            moved = true;
                            result.touch || MS_POINTER || $el.addClass(grabbingClass)
                        }(options.onMove || noop).call(el, e, {
                            pos: moveElPos,
                            edge: edge
                        })
                    }
                }
            }

            function onEnd(result) {
                if (tail.noSwipe && result.moved) return;
                if (!tracked) startTracking(result.startEvent, true);
                result.touch || MS_POINTER || $el.removeClass(grabbingClass);
                endTime = $.now();
                var _backTimeIdeal = endTime - TOUCH_TIMEOUT;
                var _backTime;
                var _timeDiff;
                var _timeDiffLast;
                var backTime = null;
                var backCoo;
                var virtualPos;
                var limitPos;
                var newPos;
                var overPos;
                var time = TRANSITION_DURATION;
                var speed;
                var friction = options.friction;
                for (var _i = moveTrack.length - 1; _i >= 0; _i--) {
                    _backTime = moveTrack[_i][0];
                    _timeDiff = Math.abs(_backTime - _backTimeIdeal);
                    if (backTime === null || _timeDiff < _timeDiffLast) {
                        backTime = _backTime;
                        backCoo = moveTrack[_i][1]
                    } else if (backTime === _backTimeIdeal || _timeDiff > _timeDiffLast) break;
                    _timeDiffLast = _timeDiff
                }
                newPos = minMaxLimit(moveElPos, min, max);
                var cooDiff = backCoo - coo;
                var forwardFLAG = cooDiff >= 0;
                var timeDiff = endTime - backTime;
                var longTouchFLAG = timeDiff > TOUCH_TIMEOUT;
                var swipeFLAG = !longTouchFLAG && moveElPos !== startElPos && newPos === moveElPos;
                if (snap) {
                    newPos = minMaxLimit(Math[swipeFLAG ? forwardFLAG ? "floor" : "ceil" : "round"](moveElPos / snap) * snap, min, max);
                    min = max = newPos
                }
                if (swipeFLAG && (snap || newPos === moveElPos)) {
                    speed = -(cooDiff / timeDiff);
                    time *= minMaxLimit(Math.abs(speed), options.timeLow, options.timeHigh);
                    virtualPos = Math.round(moveElPos + speed * time / friction);
                    if (!snap) newPos = virtualPos;
                    if (!forwardFLAG && virtualPos > max || forwardFLAG && virtualPos < min) {
                        limitPos = forwardFLAG ? min : max;
                        overPos = virtualPos - limitPos;
                        if (!snap) newPos = limitPos;
                        overPos = minMaxLimit(newPos + overPos * .03, limitPos - 50, limitPos + 50);
                        time = Math.abs((moveElPos - overPos) / (speed / friction))
                    }
                }
                time *= slowFLAG ? 10 : 1;
                (options.onEnd || noop).call(el, $.extend(result, {
                    moved: result.moved || longTouchFLAG && snap,
                    pos: moveElPos,
                    newPos: newPos,
                    overPos: overPos,
                    time: time
                }))
            }
            var el = $el[0];
            var elData = $el.data();
            var tail = {};
            var startCoo;
            var coo;
            var startElPos;
            var moveElPos;
            var edge;
            var moveTrack;
            var startTime;
            var endTime;
            var min;
            var max;
            var snap;
            var slowFLAG;
            var controlFLAG;
            var moved;
            var tracked;
            tail = $.extend(touch(options.$wrap, $.extend({}, options, {
                onStart: onStart,
                onMove: onMove,
                onEnd: onEnd
            })), tail);
            return tail
        }

        function wheel($el, options) {
            var el = $el[0];
            var lockFLAG;
            var lastDirection;
            var lastNow;
            var tail = {
                prevent: {}
            };
            addEvent(el, WHEEL, function(e) {
                var yDelta = e.wheelDeltaY ||
                    -1 * e.deltaY || 0;
                var xDelta = e.wheelDeltaX || -1 * e.deltaX || 0;
                var xWin = Math.abs(xDelta) && !Math.abs(yDelta);
                var direction = getDirectionSign(xDelta < 0);
                var sameDirection = lastDirection === direction;
                var now = $.now();
                var tooFast = now - lastNow < TOUCH_TIMEOUT;
                lastDirection = direction;
                lastNow = now;
                if (!xWin || !tail.ok || tail.prevent[direction] && !lockFLAG) return;
                else {
                    stopEvent(e, true);
                    if (lockFLAG && sameDirection && tooFast) return
                }
                if (options.shift) {
                    lockFLAG = true;
                    clearTimeout(tail.t);
                    tail.t = setTimeout(function() {
                            lockFLAG = false
                        },
                        SCROLL_LOCK_TIMEOUT)
                }(options.onEnd || noop)(e, options.shift ? direction : xDelta)
            });
            return tail
        }

        function calculateIndexes() {
            $.each($.Fotorama.instances, function(index, instance) {
                instance.index = index
            })
        }

        function addInstance(instance) {
            $.Fotorama.instances.push(instance);
            calculateIndexes()
        }

        function hideInstance(instance) {
            $.Fotorama.instances.splice(instance.index, 1);
            calculateIndexes()
        }
        var _fotoramaClass = "fotorama";
        var _fullscreenClass = "fullscreen";
        var wrapClass = _fotoramaClass + "__wrap";
        var wrapCss2Class = wrapClass +
            "--css2";
        var wrapCss3Class = wrapClass + "--css3";
        var wrapVideoClass = wrapClass + "--video";
        var wrapFadeClass = wrapClass + "--fade";
        var wrapSlideClass = wrapClass + "--slide";
        var wrapNoControlsClass = wrapClass + "--no-controls";
        var wrapNoShadowsClass = wrapClass + "--no-shadows";
        var wrapPanYClass = wrapClass + "--pan-y";
        var wrapRtlClass = wrapClass + "--rtl";
        var wrapOnlyActiveClass = wrapClass + "--only-active";
        var wrapNoCaptionsClass = wrapClass + "--no-captions";
        var wrapToggleArrowsClass = wrapClass + "--toggle-arrows";
        var stageClass =
            _fotoramaClass + "__stage";
        var stageFrameClass = stageClass + "__frame";
        var stageFrameVideoClass = stageFrameClass + "--video";
        var stageShaftClass = stageClass + "__shaft";
        var grabClass = _fotoramaClass + "__grab";
        var pointerClass = _fotoramaClass + "__pointer";
        var arrClass = _fotoramaClass + "__arr";
        var arrDisabledClass = arrClass + "--disabled";
        var arrPrevClass = arrClass + "--prev";
        var arrNextClass = arrClass + "--next";
        var arrArrClass = arrClass + "__arr";
        var navClass = _fotoramaClass + "__nav";
        var navWrapClass = navClass + "-wrap";
        var navShaftClass =
            navClass + "__shaft";
        var navDotsClass = navClass + "--dots";
        var navThumbsClass = navClass + "--thumbs";
        var navFrameClass = navClass + "__frame";
        var navFrameDotClass = navFrameClass + "--dot";
        var navFrameThumbClass = navFrameClass + "--thumb";
        var fadeClass = _fotoramaClass + "__fade";
        var fadeFrontClass = fadeClass + "-front";
        var fadeRearClass = fadeClass + "-rear";
        var shadowClass = _fotoramaClass + "__shadow";
        var shadowsClass = shadowClass + "s";
        var shadowsLeftClass = shadowsClass + "--left";
        var shadowsRightClass = shadowsClass + "--right";
        var activeClass =
            _fotoramaClass + "__active";
        var selectClass = _fotoramaClass + "__select";
        var hiddenClass = _fotoramaClass + "--hidden";
        var fullscreenClass = _fotoramaClass + "--fullscreen";
        var fullscreenIconClass = _fotoramaClass + "__fullscreen-icon";
        var errorClass = _fotoramaClass + "__error";
        var loadingClass = _fotoramaClass + "__loading";
        var loadedClass = _fotoramaClass + "__loaded";
        var loadedFullClass = loadedClass + "--full";
        var loadedImgClass = loadedClass + "--img";
        var grabbingClass = _fotoramaClass + "__grabbing";
        var imgClass = _fotoramaClass + "__img";
        var imgFullClass = imgClass + "--full";
        var dotClass = _fotoramaClass + "__dot";
        var thumbClass = _fotoramaClass + "__thumb";
        var thumbBorderClass = thumbClass + "-border";
        var htmlClass = _fotoramaClass + "__html";
        var videoClass = _fotoramaClass + "__video";
        var videoPlayClass = videoClass + "-play";
        var videoCloseClass = videoClass + "-close";
        var captionClass = _fotoramaClass + "__caption";
        var captionWrapClass = _fotoramaClass + "__caption__wrap";
        var spinnerClass = _fotoramaClass + "__spinner";
        var buttonAttributes = '" tabindex\x3d"0" role\x3d"button';
        var JQUERY_VERSION = $ && $.fn.jquery.split(".");
        if (!JQUERY_VERSION || JQUERY_VERSION[0] < 1 || JQUERY_VERSION[0] == 1 && JQUERY_VERSION[1] < 8) throw "Fotorama requires jQuery 1.8 or later and will not run without it.";
        var _ = {};
        var Modernizr = function(window, document, undefined) {
            function setCss(str) {
                mStyle.cssText = str
            }

            function setCssAll(str1, str2) {
                return setCss(prefixes.join(str1 + ";") + (str2 || ""))
            }

            function is(obj, type) {
                return typeof obj === type
            }

            function contains(str, substr) {
                return !!~("" + str).indexOf(substr)
            }

            function testProps(props,
                prefixed) {
                for (var i in props) {
                    var prop = props[i];
                    if (!contains(prop, "-") && mStyle[prop] !== undefined) return prefixed == "pfx" ? prop : true
                }
                return false
            }

            function testDOMProps(props, obj, elem) {
                for (var i in props) {
                    var item = obj[props[i]];
                    if (item !== undefined) {
                        if (elem === false) return props[i];
                        if (is(item, "function")) return item.bind(elem || obj);
                        return item
                    }
                }
                return false
            }

            function testPropsAll(prop, prefixed, elem) {
                var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
                var props = (prop + " " + cssomPrefixes.join(ucProp + " ") +
                    ucProp).split(" ");
                if (is(prefixed, "string") || is(prefixed, "undefined")) return testProps(props, prefixed);
                else {
                    props = (prop + " " + domPrefixes.join(ucProp + " ") + ucProp).split(" ");
                    return testDOMProps(props, prefixed, elem)
                }
            }
            var version = "2.6.2";
            var Modernizr = {};
            var docElement = document.documentElement;
            var mod = "modernizr";
            var modElem = document.createElement(mod);
            var mStyle = modElem.style;
            var inputElem;
            var toString = {}.toString;
            var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
            var omPrefixes = "Webkit Moz O ms";
            var cssomPrefixes =
                omPrefixes.split(" ");
            var domPrefixes = omPrefixes.toLowerCase().split(" ");
            var tests = {};
            var inputs = {};
            var attrs = {};
            var classes = [];
            var slice = classes.slice;
            var featureName;
            var injectElementWithStyles = function(rule, callback, nodes, testnames) {
                var style;
                var ret;
                var node;
                var docOverflow;
                var div = document.createElement("div");
                var body = document.body;
                var fakeBody = body || document.createElement("body");
                if (parseInt(nodes, 10))
                    for (; nodes--;) {
                        node = document.createElement("div");
                        node.id = testnames ? testnames[nodes] : mod +
                            (nodes + 1);
                        div.appendChild(node)
                    }
                style = ["\x26#173;", '\x3cstyle id\x3d"s', mod, '"\x3e', rule, "\x3c/style\x3e"].join("");
                div.id = mod;
                (body ? div : fakeBody).innerHTML += style;
                fakeBody.appendChild(div);
                if (!body) {
                    fakeBody.style.background = "";
                    fakeBody.style.overflow = "hidden";
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = "hidden";
                    docElement.appendChild(fakeBody)
                }
                ret = callback(div, rule);
                if (!body) {
                    fakeBody.parentNode.removeChild(fakeBody);
                    docElement.style.overflow = docOverflow
                } else div.parentNode.removeChild(div);
                return !!ret
            };
            var _hasOwnProperty = {}.hasOwnProperty;
            var hasOwnProp;
            if (!is(_hasOwnProperty, "undefined") && !is(_hasOwnProperty.call, "undefined")) hasOwnProp = function(object, property) {
                return _hasOwnProperty.call(object, property)
            };
            else hasOwnProp = function(object, property) {
                return property in object && is(object.constructor.prototype[property], "undefined")
            };
            if (!Function.prototype.bind) Function.prototype.bind = function bind(that) {
                var target = this;
                if (typeof target != "function") throw new TypeError;
                var args = slice.call(arguments,
                    1);
                var bound = function() {
                    if (this instanceof bound) {
                        var F = function() {};
                        F.prototype = target.prototype;
                        var self = new F;
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) return result;
                        return self
                    } else return target.apply(that, args.concat(slice.call(arguments)))
                };
                return bound
            };
            tests["csstransforms3d"] = function() {
                var ret = !!testPropsAll("perspective");
                return ret
            };
            for (var feature in tests)
                if (hasOwnProp(tests, feature)) {
                    featureName = feature.toLowerCase();
                    Modernizr[featureName] =
                        tests[feature]();
                    classes.push((Modernizr[featureName] ? "" : "no-") + featureName)
                }
            Modernizr.addTest = function(feature, test) {
                if (typeof feature == "object")
                    for (var key in feature) {
                        if (hasOwnProp(feature, key)) Modernizr.addTest(key, feature[key])
                    } else {
                        feature = feature.toLowerCase();
                        if (Modernizr[feature] !== undefined) return Modernizr;
                        test = typeof test == "function" ? test() : test;
                        if (typeof enableClasses !== "undefined" && enableClasses) docElement.className += " " + (test ? "" : "no-") + feature;
                        Modernizr[feature] = test
                    }
                return Modernizr
            };
            setCss("");
            modElem = inputElem = null;
            Modernizr._version = version;
            Modernizr._prefixes = prefixes;
            Modernizr._domPrefixes = domPrefixes;
            Modernizr._cssomPrefixes = cssomPrefixes;
            Modernizr.testProp = function(prop) {
                return testProps([prop])
            };
            Modernizr.testAllProps = testPropsAll;
            Modernizr.testStyles = injectElementWithStyles;
            Modernizr.prefixed = function(prop, obj, elem) {
                if (!obj) return testPropsAll(prop, "pfx");
                else return testPropsAll(prop, obj, elem)
            };
            return Modernizr
        }(window$$0, document$$0);
        var fullScreenApi = {
            ok: false,
            is: function() {
                return false
            },
            request: function() {},
            cancel: function() {},
            event: "",
            prefix: ""
        };
        var browserPrefixes = "webkit moz o ms khtml".split(" ");
        if (typeof document$$0.cancelFullScreen != "undefined") fullScreenApi.ok = true;
        else {
            var i$$1 = 0;
            for (var il = browserPrefixes.length; i$$1 < il; i$$1++) {
                fullScreenApi.prefix = browserPrefixes[i$$1];
                if (typeof document$$0[fullScreenApi.prefix + "CancelFullScreen"] != "undefined") {
                    fullScreenApi.ok = true;
                    break
                }
            }
        }
        if (fullScreenApi.ok) {
            fullScreenApi.event = fullScreenApi.prefix + "fullscreenchange";
            fullScreenApi.is =
                function() {
                    switch (this.prefix) {
                        case "":
                            return document$$0.fullScreen;
                        case "webkit":
                            return document$$0.webkitIsFullScreen;
                        default:
                            return document$$0[this.prefix + "FullScreen"]
                    }
                };
            fullScreenApi.request = function(el) {
                return this.prefix === "" ? el.requestFullScreen() : el[this.prefix + "RequestFullScreen"]()
            };
            fullScreenApi.cancel = function(el) {
                return this.prefix === "" ? document$$0.cancelFullScreen() : document$$0[this.prefix + "CancelFullScreen"]()
            }
        }
        var Spinner;
        var spinnerDefaults = {
            lines: 12,
            length: 5,
            width: 2,
            radius: 7,
            corners: 1,
            rotate: 15,
            color: "rgba(128, 128, 128, .75)",
            hwaccel: true
        };
        var spinnerOverride = {
            top: "auto",
            left: "auto",
            className: ""
        };
        (function(root, factory) {
            Spinner = factory()
        })(this, function() {
            function createEl(tag, prop) {
                var el = document$$0.createElement(tag || "div");
                for (var n in prop) el[n] = prop[n];
                return el
            }

            function ins(parent) {
                var i = 1;
                for (var n = arguments.length; i < n; i++) parent.appendChild(arguments[i]);
                return parent
            }

            function addAnimation(alpha, trail, i, lines) {
                var name = ["opacity", trail, ~~(alpha * 100), i, lines].join("-");
                var start = .01 + i / lines * 100;
                var z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha);
                var prefix = useCssAnimations.substring(0, useCssAnimations.indexOf("Animation")).toLowerCase();
                var pre = prefix && "-" + prefix + "-" || "";
                if (!animations[name]) {
                    sheet.insertRule("@" + pre + "keyframes " + name + "{" + "0%{opacity:" + z + "}" + start + "%{opacity:" + alpha + "}" + (start + .01) + "%{opacity:1}" + (start + trail) % 100 + "%{opacity:" + alpha + "}" + "100%{opacity:" + z + "}" + "}", sheet.cssRules.length);
                    animations[name] = 1
                }
                return name
            }

            function vendor(el, prop) {
                var s =
                    el.style;
                var pp;
                var i;
                prop = prop.charAt(0).toUpperCase() + prop.slice(1);
                for (i = 0; i < prefixes.length; i++) {
                    pp = prefixes[i] + prop;
                    if (s[pp] !== undefined) return pp
                }
                if (s[prop] !== undefined) return prop
            }

            function css(el, prop) {
                for (var n in prop) el.style[vendor(el, n) || n] = prop[n];
                return el
            }

            function merge(obj) {
                for (var i = 1; i < arguments.length; i++) {
                    var def = arguments[i];
                    for (var n in def)
                        if (obj[n] === undefined) obj[n] = def[n]
                }
                return obj
            }

            function pos(el) {
                for (var o = {
                        x: el.offsetLeft,
                        y: el.offsetTop
                    }; el = el.offsetParent;) o.x += el.offsetLeft,
                    o.y += el.offsetTop;
                return o
            }

            function getColor(color, idx) {
                return typeof color == "string" ? color : color[idx % color.length]
            }

            function Spinner(o) {
                if (typeof this == "undefined") return new Spinner(o);
                this.opts = merge(o || {}, Spinner.defaults, defaults)
            }

            function initVML() {
                function vml(tag, attr) {
                    return createEl("\x3c" + tag + ' xmlns\x3d"urn:schemas-microsoft.com:vml" class\x3d"spin-vml"\x3e', attr)
                }
                sheet.addRule(".spin-vml", "behavior:url(#default#VML)");
                Spinner.prototype.lines = function(el, o) {
                    function grp() {
                        return css(vml("group", {
                            coordsize: s + " " + s,
                            coordorigin: -r + " " + -r
                        }), {
                            width: s,
                            height: s
                        })
                    }

                    function seg(i, dx, filter) {
                        ins(g, ins(css(grp(), {
                            rotation: 360 / o.lines * i + "deg",
                            left: ~~dx
                        }), ins(css(vml("roundrect", {
                            arcsize: o.corners
                        }), {
                            width: r,
                            height: o.width,
                            left: o.radius,
                            top: -o.width >> 1,
                            filter: filter
                        }), vml("fill", {
                            color: getColor(o.color, i),
                            opacity: o.opacity
                        }), vml("stroke", {
                            opacity: 0
                        }))))
                    }
                    var r = o.length + o.width;
                    var s = 2 * r;
                    var margin = -(o.width + o.length) * 2 + "px";
                    var g = css(grp(), {
                        position: "absolute",
                        top: margin,
                        left: margin
                    });
                    var i$$0;
                    if (o.shadow)
                        for (i$$0 =
                            1; i$$0 <= o.lines; i$$0++) seg(i$$0, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius\x3d2,makeshadow\x3d1,shadowopacity\x3d.3)");
                    for (i$$0 = 1; i$$0 <= o.lines; i$$0++) seg(i$$0);
                    return ins(el, g)
                };
                Spinner.prototype.opacity = function(el, i, val, o) {
                    var c = el.firstChild;
                    o = o.shadow && o.lines || 0;
                    if (c && i + o < c.childNodes.length) {
                        c = c.childNodes[i + o];
                        c = c && c.firstChild;
                        c = c && c.firstChild;
                        if (c) c.opacity = val
                    }
                }
            }
            var prefixes = ["webkit", "Moz", "ms", "O"];
            var animations = {};
            var useCssAnimations;
            var sheet = function() {
                var el = createEl("style", {
                    type: "text/css"
                });
                ins(document$$0.getElementsByTagName("head")[0], el);
                return el.sheet || el.styleSheet
            }();
            var defaults = {
                lines: 12,
                length: 7,
                width: 5,
                radius: 10,
                rotate: 0,
                corners: 1,
                color: "#000",
                direction: 1,
                speed: 1,
                trail: 100,
                opacity: 1 / 4,
                fps: 20,
                zIndex: 2E9,
                className: "spinner",
                top: "auto",
                left: "auto",
                position: "relative"
            };
            Spinner.defaults = {};
            merge(Spinner.prototype, {
                spin: function(target) {
                    this.stop();
                    var self = this;
                    var o = self.opts;
                    var el = self.el = css(createEl(0, {
                        className: o.className
                    }), {
                        position: o.position,
                        width: 0,
                        zIndex: o.zIndex
                    });
                    var mid = o.radius + o.length + o.width;
                    var ep;
                    var tp;
                    if (target) {
                        target.insertBefore(el, target.firstChild || null);
                        tp = pos(target);
                        ep = pos(el);
                        css(el, {
                            left: (o.left == "auto" ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + "px",
                            top: (o.top == "auto" ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + "px"
                        })
                    }
                    el.setAttribute("role", "progressbar");
                    self.lines(el, self.opts);
                    if (!useCssAnimations) {
                        var i = 0;
                        var start = (o.lines - 1) * (1 - o.direction) / 2;
                        var alpha;
                        var fps = o.fps;
                        var f = fps / o.speed;
                        var ostep = (1 - o.opacity) / (f * o.trail / 100);
                        var astep = f / o.lines;
                        (function anim() {
                            i++;
                            for (var j = 0; j < o.lines; j++) {
                                alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity);
                                self.opacity(el, j * o.direction + start, alpha, o)
                            }
                            self.timeout = self.el && setTimeout(anim, ~~(1E3 / fps))
                        })()
                    }
                    return self
                },
                stop: function() {
                    var el = this.el;
                    if (el) {
                        clearTimeout(this.timeout);
                        if (el.parentNode) el.parentNode.removeChild(el);
                        this.el = undefined
                    }
                    return this
                },
                lines: function(el, o) {
                    function fill(color, shadow) {
                        return css(createEl(), {
                            position: "absolute",
                            width: o.length + o.width + "px",
                            height: o.width + "px",
                            background: color,
                            boxShadow: shadow,
                            transformOrigin: "left",
                            transform: "rotate(" + ~~(360 / o.lines * i + o.rotate) + "deg) translate(" + o.radius + "px" + ",0)",
                            borderRadius: (o.corners * o.width >> 1) + "px"
                        })
                    }
                    var i = 0;
                    var start = (o.lines - 1) * (1 - o.direction) / 2;
                    for (var seg; i < o.lines; i++) {
                        seg = css(createEl(), {
                            position: "absolute",
                            top: 1 + ~(o.width / 2) + "px",
                            transform: o.hwaccel ? "translate3d(0,0,0)" : "",
                            opacity: o.opacity,
                            animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i *
                                o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
                        });
                        if (o.shadow) ins(seg, css(fill("#000", "0 0 4px " + "#000"), {
                            top: 2 + "px"
                        }));
                        ins(el, ins(seg, fill(getColor(o.color, i), "0 0 1px rgba(0,0,0,.1)")))
                    }
                    return el
                },
                opacity: function(el, i, val) {
                    if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
                }
            });
            var probe = css(createEl("group"), {
                behavior: "url(#default#VML)"
            });
            if (!vendor(probe, "transform") && probe.adj) initVML();
            else useCssAnimations = vendor(probe, "animation");
            return Spinner
        });
        var $WINDOW = $(window$$0);
        var $DOCUMENT = $(document$$0);
        var $HTML;
        var $BODY;
        var QUIRKS_FORCE = location.hash.replace("#", "") === "quirks";
        var TRANSFORMS3D = Modernizr.csstransforms3d;
        var CSS3 = TRANSFORMS3D && !QUIRKS_FORCE;
        var COMPAT = TRANSFORMS3D || document$$0.compatMode === "CSS1Compat";
        var FULLSCREEN = fullScreenApi.ok;
        var MOBILE = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i);
        var SLOW = !CSS3 || MOBILE;
        var MS_POINTER = navigator.msPointerEnabled;
        var WHEEL = "onwheel" in document$$0.createElement("div") ? "wheel" :
            document$$0.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
        var TOUCH_TIMEOUT = 250;
        var TRANSITION_DURATION = 300;
        var SCROLL_LOCK_TIMEOUT = 1400;
        var AUTOPLAY_INTERVAL = 5E3;
        var MARGIN = 2;
        var THUMB_SIZE = 64;
        var WIDTH = 500;
        var HEIGHT = 333;
        var STAGE_FRAME_KEY = "$stageFrame";
        var NAV_DOT_FRAME_KEY = "$navDotFrame";
        var NAV_THUMB_FRAME_KEY = "$navThumbFrame";
        var AUTO = "auto";
        var BEZIER = bez([.1, 0, .25, 1]);
        var MAX_WIDTH = 99999;
        var FIFTYFIFTY = "50%";
        var OPTIONS = {
            width: null,
            minwidth: null,
            maxwidth: "100%",
            height: null,
            minheight: null,
            maxheight: null,
            ratio: null,
            margin: MARGIN,
            glimpse: 0,
            fit: "contain",
            position: FIFTYFIFTY,
            thumbposition: FIFTYFIFTY,
            nav: "dots",
            navposition: "bottom",
            navwidth: null,
            thumbwidth: THUMB_SIZE,
            thumbheight: THUMB_SIZE,
            thumbmargin: MARGIN,
            thumbborderwidth: MARGIN,
            thumbfit: "cover",
            allowfullscreen: false,
            transition: "slide",
            clicktransition: null,
            transitionduration: TRANSITION_DURATION,
            captions: true,
            hash: false,
            startindex: 0,
            loop: false,
            autoplay: false,
            stopautoplayontouch: true,
            keyboard: false,
            arrows: true,
            click: true,
            swipe: true,
            trackpad: false,
            enableifsingleframe: false,
            controlsonstart: true,
            shuffle: false,
            direction: "ltr",
            shadows: true,
            spinner: null
        };
        var KEYBOARD_OPTIONS = {
            left: true,
            right: true,
            down: false,
            up: false,
            space: false,
            home: false,
            end: false
        };
        waitFor.stop = function(i) {
            waitFor.ii[i] = false
        };
        var lastEvent;
        var moveEventType;
        var preventEvent;
        var preventEventTimeout;
        jQuery.Fotorama = function($fotorama, opts) {
            function checkForVideo() {
                $.each(data, function(i, dataFrame) {
                    if (!dataFrame.i) {
                        dataFrame.i = dataFrameCount++;
                        var video = findVideoId(dataFrame.video,
                            true);
                        if (video) {
                            var thumbs = {};
                            dataFrame.video = video;
                            if (!dataFrame.img && !dataFrame.thumb) thumbs = getVideoThumbs(dataFrame, data, that);
                            else dataFrame.thumbsReady = true;
                            updateData(data, {
                                img: thumbs.img,
                                thumb: thumbs.thumb
                            }, dataFrame.i, that)
                        }
                    }
                })
            }

            function allowKey(key) {
                return o_keyboard[key] || that.fullScreen
            }

            function bindGlobalEvents(FLAG) {
                var keydownCommon = "keydown." + _fotoramaClass;
                var localStamp = _fotoramaClass + stamp;
                var keydownLocal = "keydown." + localStamp;
                var resizeLocal = "resize." + localStamp + " " + "orientationchange." +
                    localStamp;
                if (FLAG) {
                    $DOCUMENT.on(keydownLocal, function(e) {
                        var catched;
                        var index;
                        if ($videoPlaying && e.keyCode === 27) {
                            catched = true;
                            unloadVideo($videoPlaying, true, true)
                        } else if (that.fullScreen || opts.keyboard && !that.index)
                            if (e.keyCode === 27) {
                                catched = true;
                                that.cancelFullScreen()
                            } else if (e.shiftKey && e.keyCode === 32 && allowKey("space") || e.keyCode === 37 && allowKey("left") || e.keyCode === 38 && allowKey("up")) index = "\x3c";
                        else if (e.keyCode === 32 && allowKey("space") || e.keyCode === 39 && allowKey("right") || e.keyCode === 40 && allowKey("down")) index =
                            "\x3e";
                        else if (e.keyCode === 36 && allowKey("home")) index = "\x3c\x3c";
                        else if (e.keyCode === 35 && allowKey("end")) index = "\x3e\x3e";
                        (catched || index) && stopEvent(e);
                        index && that.show({
                            index: index,
                            slow: e.altKey,
                            user: true
                        })
                    });
                    if (!that.index) $DOCUMENT.off(keydownCommon).on(keydownCommon, "textarea, input, select", function(e) {
                        !$BODY.hasClass(_fullscreenClass) && e.stopPropagation()
                    });
                    $WINDOW.on(resizeLocal, that.resize)
                } else {
                    $DOCUMENT.off(keydownLocal);
                    $WINDOW.off(resizeLocal)
                }
            }

            function appendElements(FLAG) {
                if (FLAG ===
                    appendElements.f) return;
                if (FLAG) {
                    $fotorama.html("").addClass(_fotoramaClass + " " + stampClass).append($wrap).before($style).before($anchor);
                    addInstance(that)
                } else {
                    $wrap.detach();
                    $style.detach();
                    $anchor.detach();
                    $fotorama.html(fotoramaData.urtext).removeClass(stampClass);
                    hideInstance(that)
                }
                bindGlobalEvents(FLAG);
                appendElements.f = FLAG
            }

            function setData() {
                data = that.data = data || clone(opts.data) || getDataFromHtml($fotorama);
                size = that.size = data.length;
                !ready.ok && opts.shuffle && shuffle(data);
                checkForVideo();
                activeIndex =
                    limitIndex(activeIndex);
                size && appendElements(true)
            }

            function stageNoMove() {
                var _noMove = size < 2 && !opts.enableifsingleframe || $videoPlaying;
                stageShaftTouchTail.noMove = _noMove || o_fade;
                stageShaftTouchTail.noSwipe = _noMove || !opts.swipe;
                !o_transition && $stageShaft.toggleClass(grabClass, !opts.click && !stageShaftTouchTail.noMove && !stageShaftTouchTail.noSwipe);
                MS_POINTER && $wrap.toggleClass(wrapPanYClass, !stageShaftTouchTail.noSwipe)
            }

            function setAutoplayInterval(interval) {
                if (interval === true) interval = "";
                opts.autoplay =
                    Math.max(+interval || AUTOPLAY_INTERVAL, o_transitionDuration * 1.5)
            }

            function setOptions() {
                function addOrRemoveClass(FLAG, value) {
                    classes[FLAG ? "add" : "remove"].push(value)
                }
                that.options = opts = optionsToLowerCase(opts);
                o_fade = opts.transition === "crossfade" || opts.transition === "dissolve";
                o_loop = opts.loop && (size > 2 || o_fade && (!o_transition || o_transition !== "slide"));
                o_transitionDuration = +opts.transitionduration || TRANSITION_DURATION;
                o_rtl = opts.direction === "rtl";
                o_keyboard = $.extend({}, opts.keyboard && KEYBOARD_OPTIONS,
                    opts.keyboard);
                var classes = {
                    add: [],
                    remove: []
                };
                if (size > 1 || opts.enableifsingleframe) {
                    o_nav = opts.nav;
                    o_navTop = opts.navposition === "top";
                    classes.remove.push(selectClass);
                    $arrs.toggle(!!opts.arrows)
                } else {
                    o_nav = false;
                    $arrs.hide()
                }
                spinnerStop();
                spinner = new Spinner($.extend(spinnerDefaults, opts.spinner, spinnerOverride, {
                    direction: o_rtl ? -1 : 1
                }));
                arrsUpdate();
                stageWheelUpdate();
                if (opts.autoplay) setAutoplayInterval(opts.autoplay);
                o_thumbSide = numberFromMeasure(opts.thumbwidth) || THUMB_SIZE;
                o_thumbSide2 = numberFromMeasure(opts.thumbheight) ||
                    THUMB_SIZE;
                stageWheelTail.ok = navWheelTail.ok = opts.trackpad && !SLOW;
                stageNoMove();
                extendMeasures(opts, [measures$$0]);
                o_navThumbs = o_nav === "thumbs";
                if (o_navThumbs) {
                    frameDraw(size, "navThumb");
                    $navFrame = $navThumbFrame;
                    navFrameKey = NAV_THUMB_FRAME_KEY;
                    setStyle($style, $.Fotorama.jst.style({
                        w: o_thumbSide,
                        h: o_thumbSide2,
                        b: opts.thumbborderwidth,
                        m: opts.thumbmargin,
                        s: stamp,
                        q: !COMPAT
                    }));
                    $nav.addClass(navThumbsClass).removeClass(navDotsClass)
                } else if (o_nav === "dots") {
                    frameDraw(size, "navDot");
                    $navFrame = $navDotFrame;
                    navFrameKey = NAV_DOT_FRAME_KEY;
                    $nav.addClass(navDotsClass).removeClass(navThumbsClass)
                } else {
                    o_nav = false;
                    $nav.removeClass(navThumbsClass + " " + navDotsClass)
                }
                if (o_nav) {
                    if (o_navTop) $navWrap.insertBefore($stage);
                    else $navWrap.insertAfter($stage);
                    frameAppend.nav = false;
                    frameAppend($navFrame, $navShaft, "nav")
                }
                o_allowFullScreen = opts.allowfullscreen;
                if (o_allowFullScreen) {
                    $fullscreenIcon.prependTo($stage);
                    o_nativeFullScreen = FULLSCREEN && o_allowFullScreen === "native"
                } else {
                    $fullscreenIcon.detach();
                    o_nativeFullScreen =
                        false
                }
                addOrRemoveClass(o_fade, wrapFadeClass);
                addOrRemoveClass(!o_fade, wrapSlideClass);
                addOrRemoveClass(!opts.captions, wrapNoCaptionsClass);
                addOrRemoveClass(o_rtl, wrapRtlClass);
                addOrRemoveClass(opts.arrows !== "always", wrapToggleArrowsClass);
                o_shadows = opts.shadows && !SLOW;
                addOrRemoveClass(!o_shadows, wrapNoShadowsClass);
                $wrap.addClass(classes.add.join(" ")).removeClass(classes.remove.join(" "));
                lastOptions = $.extend({}, opts)
            }

            function normalizeIndex(index) {
                return index < 0 ? (size + index % size) % size : index >= size ?
                    index % size : index
            }

            function limitIndex(index) {
                return minMaxLimit(index, 0, size - 1)
            }

            function edgeIndex(index) {
                return o_loop ? normalizeIndex(index) : limitIndex(index)
            }

            function getPrevIndex(index) {
                return index > 0 || o_loop ? index - 1 : false
            }

            function getNextIndex(index) {
                return index < size - 1 || o_loop ? index + 1 : false
            }

            function setStageShaftMinmaxAndSnap() {
                stageShaftTouchTail.min = o_loop ? -Infinity : -getPosByIndex(size - 1, measures$$0.w, opts.margin, repositionIndex);
                stageShaftTouchTail.max = o_loop ? Infinity : -getPosByIndex(0, measures$$0.w,
                    opts.margin, repositionIndex);
                stageShaftTouchTail.snap = measures$$0.w + opts.margin
            }

            function setNavShaftMinMax() {
                navShaftTouchTail.min = Math.min(0, measures$$0.nw - $navShaft.width());
                navShaftTouchTail.max = 0;
                $navShaft.toggleClass(grabClass, !(navShaftTouchTail.noMove = navShaftTouchTail.min === navShaftTouchTail.max))
            }

            function eachIndex(indexes, type, fn) {
                if (typeof indexes === "number") {
                    indexes = new Array(indexes);
                    var rangeFLAG = true
                }
                return $.each(indexes, function(i, index) {
                    if (rangeFLAG) index = i;
                    if (typeof index === "number") {
                        var dataFrame =
                            data[normalizeIndex(index)];
                        if (dataFrame) {
                            var key = "$" + type + "Frame";
                            var $frame = dataFrame[key];
                            fn.call(this, i, index, dataFrame, $frame, key, $frame && $frame.data())
                        }
                    }
                })
            }

            function setMeasures(width, height, ratio, index) {
                if (!measuresSetFLAG || measuresSetFLAG === "*" && index === startIndex) {
                    width = measureIsValid(opts.width) || measureIsValid(width) || WIDTH;
                    height = measureIsValid(opts.height) || measureIsValid(height) || HEIGHT;
                    that.resize({
                        width: width,
                        ratio: opts.ratio || ratio || width / height
                    }, 0, index !== startIndex && "*")
                }
            }

            function loadImg(indexes,
                type, specialMeasures, method, position, again) {
                eachIndex(indexes, type, function(i, index, dataFrame, $frame, key, frameData) {
                    function triggerTriggerEvent(event) {
                        var _index = normalizeIndex(index);
                        triggerEvent(event, {
                            index: _index,
                            src: src,
                            frame: data[_index]
                        })
                    }

                    function error() {
                        $img.remove();
                        $.Fotorama.cache[src] = "error";
                        if ((!dataFrame.html || type !== "stage") && dummy && dummy !== src) {
                            dataFrame[srcKey] = src = dummy;
                            loadImg([index], type, specialMeasures, method, position, true)
                        } else {
                            if (src && !dataFrame.html && !fullFLAG) {
                                $frame.trigger("f:error").removeClass(loadingClass).addClass(errorClass);
                                triggerTriggerEvent("error")
                            } else if (type === "stage") {
                                $frame.trigger("f:load").removeClass(loadingClass + " " + errorClass).addClass(loadedClass);
                                triggerTriggerEvent("load");
                                setMeasures()
                            }
                            frameData.state = "error";
                            if (size > 1 && data[index] === dataFrame && !dataFrame.html && !dataFrame.deleted && !dataFrame.video && !fullFLAG) {
                                dataFrame.deleted = true;
                                that.splice(index, 1)
                            }
                        }
                    }

                    function loaded() {
                        $.Fotorama.measures[src] = imgData.measures = $.Fotorama.measures[src] || {
                            width: img.width,
                            height: img.height,
                            ratio: img.width / img.height
                        };
                        setMeasures(imgData.measures.width, imgData.measures.height, imgData.measures.ratio, index);
                        $img.off("load error").addClass(imgClass + (fullFLAG ? " " + imgFullClass : "")).prependTo($frame);
                        fit($img, ($.isFunction(specialMeasures) ? specialMeasures() : specialMeasures) || measures$$0, method || dataFrame.fit || opts.fit, position || dataFrame.position || opts.position);
                        $.Fotorama.cache[src] = frameData.state = "loaded";
                        setTimeout(function() {
                            $frame.trigger("f:load").removeClass(loadingClass + " " + errorClass).addClass(loadedClass +
                                " " + (fullFLAG ? loadedFullClass : loadedImgClass));
                            if (type === "stage") triggerTriggerEvent("load");
                            else if (dataFrame.thumbratio === AUTO || !dataFrame.thumbratio && opts.thumbratio === AUTO) {
                                dataFrame.thumbratio = imgData.measures.ratio;
                                reset()
                            }
                        }, 0)
                    }

                    function waitAndLoad() {
                        var _i = 10;
                        waitFor(function() {
                            return !touchedFLAG || !_i-- && !SLOW
                        }, function() {
                            loaded()
                        })
                    }
                    if (!$frame) return;
                    var fullFLAG = that.fullScreen && dataFrame.full && dataFrame.full !== dataFrame.img && !frameData.$full && type === "stage";
                    if (frameData.$img && !again && !fullFLAG) return;
                    var img = new Image;
                    var $img = $(img);
                    var imgData = $img.data();
                    frameData[fullFLAG ? "$full" : "$img"] = $img;
                    var srcKey = type === "stage" ? fullFLAG ? "full" : "img" : "thumb";
                    var src = dataFrame[srcKey];
                    var dummy = fullFLAG ? null : dataFrame[type === "stage" ? "thumb" : "img"];
                    if (type === "navThumb") $frame = frameData.$wrap;
                    if (!src) {
                        error();
                        return
                    }
                    if (!$.Fotorama.cache[src]) {
                        $.Fotorama.cache[src] = "*";
                        $img.on("load", waitAndLoad).on("error", error)
                    } else(function justWait() {
                        if ($.Fotorama.cache[src] === "error") error();
                        else if ($.Fotorama.cache[src] ===
                            "loaded") setTimeout(waitAndLoad, 0);
                        else setTimeout(justWait, 100)
                    })();
                    frameData.state = "";
                    img.src = src
                })
            }

            function spinnerSpin($el) {
                $spinner.append(spinner.spin().el).appendTo($el)
            }

            function spinnerStop() {
                $spinner.detach();
                spinner && spinner.stop()
            }

            function updateFotoramaState() {
                var $frame = activeFrame[STAGE_FRAME_KEY];
                if ($frame && !$frame.data().state) {
                    spinnerSpin($frame);
                    $frame.on("f:load f:error", function() {
                        $frame.off("f:load f:error");
                        spinnerStop()
                    })
                }
            }

            function addNavFrameEvents(frame) {
                addEnterUp(frame,
                    onNavFrameClick);
                addFocus(frame, function() {
                    setTimeout(function() {
                        lockScroll($nav)
                    }, 0);
                    slideNavShaft({
                        time: o_transitionDuration,
                        guessIndex: $(this).data().eq,
                        minMax: navShaftTouchTail
                    })
                })
            }

            function frameDraw(indexes, type) {
                eachIndex(indexes, type, function(i, index, dataFrame, $frame, key, frameData) {
                    if ($frame) return;
                    $frame = dataFrame[key] = $wrap[key].clone();
                    frameData = $frame.data();
                    frameData.data = dataFrame;
                    var frame = $frame[0];
                    if (type === "stage") {
                        if (dataFrame.html) $('\x3cdiv class\x3d"' + htmlClass + '"\x3e\x3c/div\x3e').append(dataFrame._html ?
                            $(dataFrame.html).removeAttr("id").html(dataFrame._html) : dataFrame.html).appendTo($frame);
                        dataFrame.caption && $(div(captionClass, div(captionWrapClass, dataFrame.caption))).appendTo($frame);
                        dataFrame.video && $frame.addClass(stageFrameVideoClass).append($videoPlay.clone());
                        addFocus(frame, function() {
                            setTimeout(function() {
                                lockScroll($stage)
                            }, 0);
                            clickToShow({
                                index: frameData.eq,
                                user: true
                            })
                        });
                        $stageFrame = $stageFrame.add($frame)
                    } else if (type === "navDot") {
                        addNavFrameEvents(frame);
                        $navDotFrame = $navDotFrame.add($frame)
                    } else if (type ===
                        "navThumb") {
                        addNavFrameEvents(frame);
                        frameData.$wrap = $frame.children(":first");
                        $navThumbFrame = $navThumbFrame.add($frame);
                        if (dataFrame.video) frameData.$wrap.append($videoPlay.clone())
                    }
                })
            }

            function callFit($img, measuresToFit, method, position) {
                return $img && $img.length && fit($img, measuresToFit, method, position)
            }

            function stageFramePosition(indexes) {
                eachIndex(indexes, "stage", function(i, index, dataFrame, $frame, key, frameData) {
                    if (!$frame) return;
                    var normalizedIndex = normalizeIndex(index);
                    var method = dataFrame.fit ||
                        opts.fit;
                    var position = dataFrame.position || opts.position;
                    frameData.eq = normalizedIndex;
                    toDetach[STAGE_FRAME_KEY][normalizedIndex] = $frame.css($.extend({
                        left: o_fade ? 0 : getPosByIndex(index, measures$$0.w, opts.margin, repositionIndex)
                    }, o_fade && getDuration(0)));
                    if (isDetached($frame[0])) {
                        $frame.appendTo($stageShaft);
                        unloadVideo(dataFrame.$video)
                    }
                    callFit(frameData.$img, measures$$0, method, position);
                    callFit(frameData.$full, measures$$0, method, position)
                })
            }

            function thumbsDraw(pos, loadFLAG) {
                if (o_nav !== "thumbs" || isNaN(pos)) return;
                var leftLimit = -pos;
                var rightLimit = -pos + measures$$0.nw;
                $navThumbFrame.each(function() {
                    var $this = $(this);
                    var thisData = $this.data();
                    var eq = thisData.eq;
                    var getSpecialMeasures = function() {
                        return {
                            h: o_thumbSide2,
                            w: thisData.w
                        }
                    };
                    var specialMeasures = getSpecialMeasures();
                    var dataFrame = data[eq] || {};
                    var method = dataFrame.thumbfit || opts.thumbfit;
                    var position = dataFrame.thumbposition || opts.thumbposition;
                    specialMeasures.w = thisData.w;
                    if (thisData.l + thisData.w < leftLimit || thisData.l > rightLimit || callFit(thisData.$img, specialMeasures,
                            method, position)) return;
                    loadFLAG && loadImg([eq], "navThumb", getSpecialMeasures, method, position)
                })
            }

            function frameAppend($frames, $shaft, type) {
                if (!frameAppend[type]) {
                    var thumbsFLAG = type === "nav" && o_navThumbs;
                    var left = 0;
                    $shaft.append($frames.filter(function() {
                        var actual;
                        var $this = $(this);
                        var frameData = $this.data();
                        var _i = 0;
                        for (var _l = data.length; _i < _l; _i++)
                            if (frameData.data === data[_i]) {
                                actual = true;
                                frameData.eq = _i;
                                break
                            }
                        return actual || $this.remove() && false
                    }).sort(function(a, b) {
                        return $(a).data().eq - $(b).data().eq
                    }).each(function() {
                        if (!thumbsFLAG) return;
                        var $this = $(this);
                        var frameData = $this.data();
                        var thumbwidth = Math.round(o_thumbSide2 * frameData.data.thumbratio) || o_thumbSide;
                        frameData.l = left;
                        frameData.w = thumbwidth;
                        $this.css({
                            width: thumbwidth
                        });
                        left += thumbwidth + opts.thumbmargin
                    }));
                    frameAppend[type] = true
                }
            }

            function getDirection(x) {
                return x - stageLeft > measures$$0.w / 3
            }

            function disableDirrection(i) {
                return !o_loop && (!(activeIndex + i) || !(activeIndex - size + i)) && !$videoPlaying
            }

            function arrsUpdate() {
                var disablePrev = disableDirrection(0);
                var disableNext = disableDirrection(1);
                $arrPrev.toggleClass(arrDisabledClass, disablePrev).attr(disableAttr(disablePrev));
                $arrNext.toggleClass(arrDisabledClass, disableNext).attr(disableAttr(disableNext))
            }

            function stageWheelUpdate() {
                if (stageWheelTail.ok) stageWheelTail.prevent = {
                    "\x3c": disableDirrection(0),
                    "\x3e": disableDirrection(1)
                }
            }

            function getNavFrameBounds($navFrame) {
                var navFrameData = $navFrame.data();
                var left;
                var width;
                if (o_navThumbs) {
                    left = navFrameData.l;
                    width = navFrameData.w
                } else {
                    left = $navFrame.position().left;
                    width = $navFrame.width()
                }
                return {
                    c: left +
                        width / 2,
                    min: -left + opts.thumbmargin * 10,
                    max: -left + measures$$0.w - width - opts.thumbmargin * 10
                }
            }

            function slideThumbBorder(time) {
                var navFrameData = activeFrame[navFrameKey].data();
                slide($thumbBorder, {
                    time: time * 1.2,
                    pos: navFrameData.l,
                    width: navFrameData.w - opts.thumbborderwidth * 2
                })
            }

            function slideNavShaft(options) {
                var $guessNavFrame = data[options.guessIndex][navFrameKey];
                if ($guessNavFrame) {
                    var overflowFLAG = navShaftTouchTail.min !== navShaftTouchTail.max;
                    var minMax = options.minMax || overflowFLAG && getNavFrameBounds(activeFrame[navFrameKey]);
                    var l = overflowFLAG && (options.keep && slideNavShaft.l ? slideNavShaft.l : minMaxLimit((options.coo || measures$$0.nw / 2) - getNavFrameBounds($guessNavFrame).c, minMax.min, minMax.max));
                    var pos = overflowFLAG && minMaxLimit(l, navShaftTouchTail.min, navShaftTouchTail.max);
                    var time = options.time * 1.1;
                    slide($navShaft, {
                        time: time,
                        pos: pos || 0,
                        onEnd: function() {
                            thumbsDraw(pos, true)
                        }
                    });
                    setShadow($nav, findShadowEdge(pos, navShaftTouchTail.min, navShaftTouchTail.max));
                    slideNavShaft.l = l
                }
            }

            function navUpdate() {
                deactivateFrames(navFrameKey);
                toDeactivate[navFrameKey].push(activeFrame[navFrameKey].addClass(activeClass))
            }

            function deactivateFrames(key) {
                for (var _toDeactivate = toDeactivate[key]; _toDeactivate.length;) _toDeactivate.shift().removeClass(activeClass)
            }

            function detachFrames(key) {
                var _toDetach = toDetach[key];
                $.each(activeIndexes, function(i, index) {
                    delete _toDetach[normalizeIndex(index)]
                });
                $.each(_toDetach, function(index, $frame) {
                    delete _toDetach[index];
                    $frame.detach()
                })
            }

            function stageShaftReposition(skipOnEnd) {
                repositionIndex = dirtyIndex =
                    activeIndex;
                var $frame = activeFrame[STAGE_FRAME_KEY];
                if ($frame) {
                    deactivateFrames(STAGE_FRAME_KEY);
                    toDeactivate[STAGE_FRAME_KEY].push($frame.addClass(activeClass));
                    skipOnEnd || that.show.onEnd(true);
                    stop($stageShaft, 0, true);
                    detachFrames(STAGE_FRAME_KEY);
                    stageFramePosition(activeIndexes);
                    setStageShaftMinmaxAndSnap();
                    setNavShaftMinMax()
                }
            }

            function extendMeasures(options, measuresArray) {
                if (!options) return;
                $.each(measuresArray, function(i, measures) {
                    if (!measures) return;
                    $.extend(measures, {
                        width: options.width ||
                            measures.width,
                        height: options.height,
                        minwidth: options.minwidth,
                        maxwidth: options.maxwidth,
                        minheight: options.minheight,
                        maxheight: options.maxheight,
                        ratio: getRatio(options.ratio)
                    })
                })
            }

            function triggerEvent(event, extra) {
                $fotorama.trigger(_fotoramaClass + ":" + event, [that, extra])
            }

            function onTouchStart() {
                clearTimeout(onTouchEnd.t);
                touchedFLAG = 1;
                if (opts.stopautoplayontouch) that.stopAutoplay();
                else pausedAutoplayFLAG = true
            }

            function onTouchEnd() {
                if (!opts.stopautoplayontouch) {
                    releaseAutoplay();
                    changeAutoplay()
                }
                onTouchEnd.t =
                    setTimeout(function() {
                        touchedFLAG = 0
                    }, TRANSITION_DURATION + TOUCH_TIMEOUT)
            }

            function releaseAutoplay() {
                pausedAutoplayFLAG = !!($videoPlaying || stoppedAutoplayFLAG)
            }

            function changeAutoplay() {
                clearTimeout(changeAutoplay.t);
                waitFor.stop(changeAutoplay.w);
                if (!opts.autoplay || pausedAutoplayFLAG) {
                    if (that.autoplay) {
                        that.autoplay = false;
                        triggerEvent("stopautoplay")
                    }
                    return
                }
                if (!that.autoplay) {
                    that.autoplay = true;
                    triggerEvent("startautoplay")
                }
                var _activeIndex = activeIndex;
                var frameData = activeFrame[STAGE_FRAME_KEY].data();
                changeAutoplay.w = waitFor(function() {
                    return frameData.state || _activeIndex !== activeIndex
                }, function() {
                    changeAutoplay.t = setTimeout(function() {
                        if (pausedAutoplayFLAG || _activeIndex !== activeIndex) return;
                        var _nextAutoplayIndex = nextAutoplayIndex;
                        var nextFrameData = data[_nextAutoplayIndex][STAGE_FRAME_KEY].data();
                        changeAutoplay.w = waitFor(function() {
                            return nextFrameData.state || _nextAutoplayIndex !== nextAutoplayIndex
                        }, function() {
                            if (pausedAutoplayFLAG || _nextAutoplayIndex !== nextAutoplayIndex) return;
                            that.show(o_loop ?
                                getDirectionSign(!o_rtl) : nextAutoplayIndex)
                        })
                    }, opts.autoplay)
                })
            }

            function cancelFullScreen() {
                if (that.fullScreen) {
                    that.fullScreen = false;
                    if (FULLSCREEN) fullScreenApi.cancel(fotorama);
                    $BODY.removeClass(_fullscreenClass);
                    $HTML.removeClass(_fullscreenClass);
                    $fotorama.removeClass(fullscreenClass).insertAfter($anchor);
                    measures$$0 = $.extend({}, measuresStash);
                    unloadVideo($videoPlaying, true, true);
                    updateTouchTails("x", false);
                    that.resize();
                    loadImg(activeIndexes, "stage");
                    lockScroll($WINDOW, scrollLeft, scrollTop);
                    triggerEvent("fullscreenexit")
                }
            }

            function setShadow($el, edge) {
                if (o_shadows) {
                    $el.removeClass(shadowsLeftClass + " " + shadowsRightClass);
                    edge && !$videoPlaying && $el.addClass(edge.replace(/^|\s/g, " " + shadowsClass + "--"))
                }
            }

            function unloadVideo($video, unloadActiveFLAG, releaseAutoplayFLAG) {
                if (unloadActiveFLAG) {
                    $wrap.removeClass(wrapVideoClass);
                    $videoPlaying = false;
                    stageNoMove()
                }
                if ($video && $video !== $videoPlaying) {
                    $video.remove();
                    triggerEvent("unloadvideo")
                }
                if (releaseAutoplayFLAG) {
                    releaseAutoplay();
                    changeAutoplay()
                }
            }

            function toggleControlsClass(FLAG) {
                $wrap.toggleClass(wrapNoControlsClass, FLAG)
            }

            function stageCursor(e) {
                if (stageShaftTouchTail.flow) return;
                var x = e ? e.pageX : stageCursor.x;
                var pointerFLAG = x && !disableDirrection(getDirection(x)) && opts.click;
                if (stageCursor.p !== pointerFLAG && $stage.toggleClass(pointerClass, pointerFLAG)) {
                    stageCursor.p = pointerFLAG;
                    stageCursor.x = x
                }
            }

            function clickToShow(showOptions) {
                clearTimeout(clickToShow.t);
                if (opts.clicktransition && opts.clicktransition !== opts.transition) setTimeout(function() {
                    var _o_transition =
                        opts.transition;
                    that.setOptions({
                        transition: opts.clicktransition
                    });
                    o_transition = _o_transition;
                    clickToShow.t = setTimeout(function() {
                        that.show(showOptions)
                    }, 10)
                }, 0);
                else that.show(showOptions)
            }

            function onStageTap(e, toggleControlsFLAG) {
                var target = e.target;
                var $target = $(target);
                if ($target.hasClass(videoPlayClass)) that.playVideo();
                else if (target === fullscreenIcon) that.toggleFullScreen();
                else if ($videoPlaying) target === videoClose && unloadVideo($videoPlaying, true, true);
                else if (toggleControlsFLAG) toggleControlsClass();
                else if (opts.click) clickToShow({
                    index: e.shiftKey || getDirectionSign(getDirection(e._x)),
                    slow: e.altKey,
                    user: true
                })
            }

            function updateTouchTails(key, value) {
                stageShaftTouchTail[key] = navShaftTouchTail[key] = value
            }

            function onNavFrameClick(e) {
                var index = $(this).data().eq;
                clickToShow({
                    index: index,
                    slow: e.altKey,
                    user: true,
                    coo: e._x - $nav.offset().left
                })
            }

            function onArrClick(e) {
                clickToShow({
                    index: $arrs.index(this) ? "\x3e" : "\x3c",
                    slow: e.altKey,
                    user: true
                })
            }

            function addFocusOnControls(el) {
                addFocus(el, function() {
                    setTimeout(function() {
                            lockScroll($stage)
                        },
                        0);
                    toggleControlsClass(false)
                })
            }

            function reset() {
                setData();
                setOptions();
                if (!reset.i) {
                    reset.i = true;
                    var _startindex = opts.startindex;
                    if (_startindex || opts.hash && location.hash) startIndex = getIndexFromHash(_startindex || location.hash.replace(/^#/, ""), data, that.index === 0 || _startindex, _startindex);
                    activeIndex = repositionIndex = dirtyIndex = lastActiveIndex = startIndex = edgeIndex(startIndex) || 0
                }
                if (size) {
                    if (changeToRtl()) return;
                    if ($videoPlaying) unloadVideo($videoPlaying, true);
                    activeIndexes = [];
                    detachFrames(STAGE_FRAME_KEY);
                    reset.ok = true;
                    that.show({
                        index: activeIndex,
                        time: 0
                    });
                    that.resize()
                } else that.destroy()
            }

            function changeToRtl() {
                if (!changeToRtl.f === o_rtl) {
                    changeToRtl.f = o_rtl;
                    activeIndex = size - 1 - activeIndex;
                    that.reverse();
                    return true
                }
            }

            function ready() {
                if (!ready.ok) {
                    ready.ok = true;
                    triggerEvent("ready")
                }
            }
            $HTML = $("html");
            $BODY = $("body");
            var that = this;
            var stamp = $.now();
            var stampClass = _fotoramaClass + stamp;
            var fotorama = $fotorama[0];
            var data;
            var dataFrameCount = 1;
            var fotoramaData = $fotorama.data();
            var size;
            var $style = $("\x3cstyle\x3e\x3c/style\x3e");
            var $anchor = $(div(hiddenClass));
            var $wrap = $(div(wrapClass));
            var $stage = $(div(stageClass)).appendTo($wrap);
            var stage = $stage[0];
            var $stageShaft = $(div(stageShaftClass)).appendTo($stage);
            var $stageFrame = $();
            var $arrPrev = $(div(arrClass + " " + arrPrevClass + buttonAttributes));
            var $arrNext = $(div(arrClass + " " + arrNextClass + buttonAttributes));
            var $arrs = $arrPrev.add($arrNext).appendTo($stage);
            var $navWrap = $(div(navWrapClass));
            var $nav = $(div(navClass)).appendTo($navWrap);
            var $navShaft = $(div(navShaftClass)).appendTo($nav);
            var $navFrame;
            var $navDotFrame = $();
            var $navThumbFrame = $();
            var stageShaftData = $stageShaft.data();
            var navShaftData = $navShaft.data();
            var $thumbBorder = $(div(thumbBorderClass)).appendTo($navShaft);
            var $fullscreenIcon = $(div(fullscreenIconClass + buttonAttributes));
            var fullscreenIcon = $fullscreenIcon[0];
            var $videoPlay = $(div(videoPlayClass));
            var $videoClose = $(div(videoCloseClass)).appendTo($stage);
            var videoClose = $videoClose[0];
            var spinner;
            var $spinner = $(div(spinnerClass));
            var $videoPlaying;
            var activeIndex = false;
            var activeFrame;
            var activeIndexes;
            var repositionIndex;
            var dirtyIndex;
            var lastActiveIndex;
            var prevIndex;
            var nextIndex;
            var nextAutoplayIndex;
            var startIndex;
            var o_loop;
            var o_nav;
            var o_navThumbs;
            var o_navTop;
            var o_allowFullScreen;
            var o_nativeFullScreen;
            var o_fade;
            var o_thumbSide;
            var o_thumbSide2;
            var o_transitionDuration;
            var o_transition;
            var o_shadows;
            var o_rtl;
            var o_keyboard;
            var lastOptions = {};
            var measures$$0 = {};
            var measuresSetFLAG;
            var stageShaftTouchTail = {};
            var stageWheelTail = {};
            var navShaftTouchTail = {};
            var navWheelTail = {};
            var scrollTop;
            var scrollLeft;
            var showedFLAG;
            var pausedAutoplayFLAG;
            var stoppedAutoplayFLAG;
            var toDeactivate = {};
            var toDetach = {};
            var measuresStash;
            var touchedFLAG;
            var hoverFLAG;
            var navFrameKey;
            var stageLeft = 0;
            var fadeStack = [];
            $wrap[STAGE_FRAME_KEY] = $(div(stageFrameClass));
            $wrap[NAV_THUMB_FRAME_KEY] = $(div(navFrameClass + " " + navFrameThumbClass + buttonAttributes, div(thumbClass)));
            $wrap[NAV_DOT_FRAME_KEY] = $(div(navFrameClass + " " + navFrameDotClass + buttonAttributes, div(dotClass)));
            toDeactivate[STAGE_FRAME_KEY] = [];
            toDeactivate[NAV_THUMB_FRAME_KEY] = [];
            toDeactivate[NAV_DOT_FRAME_KEY] = [];
            toDetach[STAGE_FRAME_KEY] = {};
            $wrap.addClass(CSS3 ? wrapCss3Class : wrapCss2Class).toggleClass(wrapNoControlsClass, !opts.controlsonstart);
            fotoramaData.fotorama = this;
            that.startAutoplay = function(interval) {
                if (that.autoplay) return this;
                pausedAutoplayFLAG = stoppedAutoplayFLAG = false;
                setAutoplayInterval(interval || opts.autoplay);
                changeAutoplay();
                return this
            };
            that.stopAutoplay = function() {
                if (that.autoplay) {
                    pausedAutoplayFLAG = stoppedAutoplayFLAG =
                        true;
                    changeAutoplay()
                }
                return this
            };
            that.show = function(options) {
                var index;
                if (typeof options !== "object") {
                    index = options;
                    options = {}
                } else index = options.index;
                index = index === "\x3e" ? dirtyIndex + 1 : index === "\x3c" ? dirtyIndex - 1 : index === "\x3c\x3c" ? 0 : index === "\x3e\x3e" ? size - 1 : index;
                index = isNaN(index) ? getIndexFromHash(index, data, true) : index;
                index = typeof index === "undefined" ? activeIndex || 0 : index;
                that.activeIndex = activeIndex = edgeIndex(index);
                prevIndex = getPrevIndex(activeIndex);
                nextIndex = getNextIndex(activeIndex);
                nextAutoplayIndex =
                    normalizeIndex(activeIndex + (o_rtl ? -1 : 1));
                activeIndexes = [activeIndex, prevIndex, nextIndex];
                dirtyIndex = o_loop ? index : activeIndex;
                var diffIndex = Math.abs(lastActiveIndex - dirtyIndex);
                var time = getNumber(options.time, function() {
                    return Math.min(o_transitionDuration * (1 + (diffIndex - 1) / 12), o_transitionDuration * 2)
                });
                var overPos = options.overPos;
                if (options.slow) time *= 10;
                var _activeFrame = activeFrame;
                that.activeFrame = activeFrame = data[activeIndex];
                var silent = _activeFrame === activeFrame && !options.user;
                unloadVideo($videoPlaying,
                    activeFrame.i !== data[normalizeIndex(repositionIndex)].i);
                frameDraw(activeIndexes, "stage");
                stageFramePosition(SLOW ? [dirtyIndex] : [dirtyIndex, getPrevIndex(dirtyIndex), getNextIndex(dirtyIndex)]);
                updateTouchTails("go", true);
                silent || triggerEvent("show", {
                    user: options.user,
                    time: time
                });
                pausedAutoplayFLAG = true;
                var onEnd = that.show.onEnd = function(skipReposition) {
                    if (onEnd.ok) return;
                    onEnd.ok = true;
                    skipReposition || stageShaftReposition(true);
                    if (!silent) triggerEvent("showend", {
                        user: options.user
                    });
                    if (!skipReposition &&
                        o_transition && o_transition !== opts.transition) {
                        that.setOptions({
                            transition: o_transition
                        });
                        o_transition = false;
                        return
                    }
                    updateFotoramaState();
                    loadImg(activeIndexes, "stage");
                    updateTouchTails("go", false);
                    stageWheelUpdate();
                    stageCursor();
                    releaseAutoplay();
                    changeAutoplay()
                };
                if (!o_fade) slide($stageShaft, {
                    pos: -getPosByIndex(dirtyIndex, measures$$0.w, opts.margin, repositionIndex),
                    overPos: overPos,
                    time: time,
                    onEnd: onEnd
                });
                else {
                    var $activeFrame = activeFrame[STAGE_FRAME_KEY];
                    var $prevActiveFrame = activeIndex !== lastActiveIndex ?
                        data[lastActiveIndex][STAGE_FRAME_KEY] : null;
                    fade($activeFrame, $prevActiveFrame, $stageFrame, {
                        time: time,
                        method: opts.transition,
                        onEnd: onEnd
                    }, fadeStack)
                }
                arrsUpdate();
                if (o_nav) {
                    navUpdate();
                    var guessIndex = limitIndex(activeIndex + minMaxLimit(dirtyIndex - lastActiveIndex, -1, 1));
                    slideNavShaft({
                        time: time,
                        coo: guessIndex !== activeIndex && options.coo,
                        guessIndex: typeof options.coo !== "undefined" ? guessIndex : activeIndex,
                        keep: silent
                    });
                    if (o_navThumbs) slideThumbBorder(time)
                }
                showedFLAG = typeof lastActiveIndex !== "undefined" &&
                    lastActiveIndex !== activeIndex;
                lastActiveIndex = activeIndex;
                opts.hash && showedFLAG && !that.eq && setHash(activeFrame.id || activeIndex + 1);
                return this
            };
            that.requestFullScreen = function() {
                if (o_allowFullScreen && !that.fullScreen) {
                    scrollTop = $WINDOW.scrollTop();
                    scrollLeft = $WINDOW.scrollLeft();
                    lockScroll($WINDOW);
                    updateTouchTails("x", true);
                    measuresStash = $.extend({}, measures$$0);
                    $fotorama.addClass(fullscreenClass).appendTo($BODY.addClass(_fullscreenClass));
                    $HTML.addClass(_fullscreenClass);
                    unloadVideo($videoPlaying,
                        true, true);
                    that.fullScreen = true;
                    if (o_nativeFullScreen) fullScreenApi.request(fotorama);
                    that.resize();
                    loadImg(activeIndexes, "stage");
                    updateFotoramaState();
                    triggerEvent("fullscreenenter")
                }
                return this
            };
            that.cancelFullScreen = function() {
                if (o_nativeFullScreen && fullScreenApi.is()) fullScreenApi.cancel(document$$0);
                else cancelFullScreen();
                return this
            };
            that.toggleFullScreen = function() {
                return that[(that.fullScreen ? "cancel" : "request") + "FullScreen"]()
            };
            addEvent(document$$0, fullScreenApi.event, function() {
                if (data &&
                    !fullScreenApi.is() && !$videoPlaying) cancelFullScreen()
            });
            that.resize = function(options) {
                if (!data) return this;
                var time = arguments[1] || 0;
                var setFLAG = arguments[2];
                extendMeasures(!that.fullScreen ? optionsToLowerCase(options) : {
                    width: "100%",
                    maxwidth: null,
                    minwidth: null,
                    height: "100%",
                    maxheight: null,
                    minheight: null
                }, [measures$$0, setFLAG || that.fullScreen || opts]);
                var width = measures$$0.width;
                var height = measures$$0.height;
                var ratio = measures$$0.ratio;
                var windowHeight = $WINDOW.height() - (o_nav ? $nav.height() : 0);
                if (measureIsValid(width)) {
                    $wrap.addClass(wrapOnlyActiveClass).css({
                        width: width,
                        minWidth: measures$$0.minwidth || 0,
                        maxWidth: measures$$0.maxwidth || MAX_WIDTH
                    });
                    width = measures$$0.W = measures$$0.w = $wrap.width();
                    measures$$0.nw = o_nav && numberFromWhatever(opts.navwidth, width) || width;
                    if (opts.glimpse) measures$$0.w -= Math.round((numberFromWhatever(opts.glimpse, width) || 0) * 2);
                    $stageShaft.css({
                        width: measures$$0.w,
                        marginLeft: (measures$$0.W - measures$$0.w) / 2
                    });
                    height = numberFromWhatever(height, windowHeight);
                    height = height || ratio && width / ratio;
                    if (height) {
                        width = Math.round(width);
                        height = measures$$0.h =
                            Math.round(minMaxLimit(height, numberFromWhatever(measures$$0.minheight, windowHeight), numberFromWhatever(measures$$0.maxheight, windowHeight)));
                        $stage.stop().animate({
                            width: width,
                            height: height
                        }, time, function() {
                            $wrap.removeClass(wrapOnlyActiveClass)
                        });
                        stageShaftReposition();
                        if (o_nav) {
                            $nav.stop().animate({
                                width: measures$$0.nw
                            }, time);
                            slideNavShaft({
                                guessIndex: activeIndex,
                                time: time,
                                keep: true
                            });
                            if (o_navThumbs && frameAppend.nav) slideThumbBorder(time)
                        }
                        measuresSetFLAG = setFLAG || true;
                        ready()
                    }
                }
                stageLeft = $stage.offset().left;
                return this
            };
            that.setOptions = function(options) {
                $.extend(opts, options);
                reset();
                return this
            };
            that.shuffle = function() {
                data && shuffle(data) && reset();
                return this
            };
            that.destroy = function() {
                that.cancelFullScreen();
                that.stopAutoplay();
                data = that.data = null;
                appendElements();
                activeIndexes = [];
                detachFrames(STAGE_FRAME_KEY);
                reset.ok = false;
                return this
            };
            that.playVideo = function() {
                var dataFrame = activeFrame;
                var video = dataFrame.video;
                var _activeIndex = activeIndex;
                if (typeof video === "object" && dataFrame.videoReady) {
                    o_nativeFullScreen &&
                        that.fullScreen && that.cancelFullScreen();
                    waitFor(function() {
                        return !fullScreenApi.is() || _activeIndex !== activeIndex
                    }, function() {
                        if (_activeIndex === activeIndex) {
                            dataFrame.$video = dataFrame.$video || $($.Fotorama.jst.video(video));
                            dataFrame.$video.appendTo(dataFrame[STAGE_FRAME_KEY]);
                            $wrap.addClass(wrapVideoClass);
                            $videoPlaying = dataFrame.$video;
                            stageNoMove();
                            $arrs.blur();
                            $fullscreenIcon.blur();
                            triggerEvent("loadvideo")
                        }
                    })
                }
                return this
            };
            that.stopVideo = function() {
                unloadVideo($videoPlaying, true, true);
                return this
            };
            $stage.on("mousemove", stageCursor);
            stageShaftTouchTail = moveOnTouch($stageShaft, {
                onStart: onTouchStart,
                onMove: function(e, result) {
                    setShadow($stage, result.edge)
                },
                onTouchEnd: onTouchEnd,
                onEnd: function(result) {
                    setShadow($stage);
                    var toggleControlsFLAG = (MS_POINTER && !hoverFLAG || result.touch) && opts.arrows && opts.arrows !== "always";
                    if (result.moved || toggleControlsFLAG && result.pos !== result.newPos && !result.control) {
                        var index = getIndexByPos(result.newPos, measures$$0.w, opts.margin, repositionIndex);
                        that.show({
                            index: index,
                            time: o_fade ? o_transitionDuration : result.time,
                            overPos: result.overPos,
                            user: true
                        })
                    } else if (!result.aborted && !result.control) onStageTap(result.startEvent, toggleControlsFLAG)
                },
                timeLow: 1,
                timeHigh: 1,
                friction: 2,
                select: "." + selectClass + ", ." + selectClass + " *",
                $wrap: $stage
            });
            navShaftTouchTail = moveOnTouch($navShaft, {
                onStart: onTouchStart,
                onMove: function(e, result) {
                    setShadow($nav, result.edge)
                },
                onTouchEnd: onTouchEnd,
                onEnd: function(result) {
                    function onEnd() {
                        slideNavShaft.l = result.newPos;
                        releaseAutoplay();
                        changeAutoplay();
                        thumbsDraw(result.newPos, true)
                    }
                    if (!result.moved) {
                        var target = result.$target.closest("." + navFrameClass, $navShaft)[0];
                        target && onNavFrameClick.call(target, result.startEvent)
                    } else if (result.pos !== result.newPos) {
                        pausedAutoplayFLAG = true;
                        slide($navShaft, {
                            time: result.time,
                            pos: result.newPos,
                            overPos: result.overPos,
                            onEnd: onEnd
                        });
                        thumbsDraw(result.newPos);
                        o_shadows && setShadow($nav, findShadowEdge(result.newPos, navShaftTouchTail.min, navShaftTouchTail.max))
                    } else onEnd()
                },
                timeLow: .5,
                timeHigh: 2,
                friction: 5,
                $wrap: $nav
            });
            stageWheelTail = wheel($stage, {
                shift: true,
                onEnd: function(e, direction) {
                    onTouchStart();
                    onTouchEnd();
                    that.show({
                        index: direction,
                        slow: e.altKey
                    })
                }
            });
            navWheelTail = wheel($nav, {
                onEnd: function(e, direction) {
                    onTouchStart();
                    onTouchEnd();
                    var newPos = stop($navShaft) + direction * .25;
                    $navShaft.css(getTranslate(minMaxLimit(newPos, navShaftTouchTail.min, navShaftTouchTail.max)));
                    o_shadows && setShadow($nav, findShadowEdge(newPos, navShaftTouchTail.min, navShaftTouchTail.max));
                    navWheelTail.prevent = {
                        "\x3c": newPos >= navShaftTouchTail.max,
                        "\x3e": newPos <= navShaftTouchTail.min
                    };
                    clearTimeout(navWheelTail.t);
                    navWheelTail.t = setTimeout(function() {
                        slideNavShaft.l = newPos;
                        thumbsDraw(newPos, true)
                    }, TOUCH_TIMEOUT);
                    thumbsDraw(newPos)
                }
            });
            $wrap.hover(function() {
                setTimeout(function() {
                    if (touchedFLAG) return;
                    toggleControlsClass(!(hoverFLAG = true))
                }, 0)
            }, function() {
                if (!hoverFLAG) return;
                toggleControlsClass(!(hoverFLAG = false))
            });
            smartClick($arrs, function(e) {
                stopEvent(e);
                onArrClick.call(this, e)
            }, {
                onStart: function() {
                    onTouchStart();
                    stageShaftTouchTail.control =
                        true
                },
                onTouchEnd: onTouchEnd
            });
            $arrs.each(function() {
                addEnterUp(this, function(e) {
                    onArrClick.call(this, e)
                });
                addFocusOnControls(this)
            });
            addEnterUp(fullscreenIcon, that.toggleFullScreen);
            addFocusOnControls(fullscreenIcon);
            $.each("load push pop shift unshift reverse sort splice".split(" "), function(i, method) {
                that[method] = function() {
                    data = data || [];
                    if (method !== "load") Array.prototype[method].apply(data, arguments);
                    else if (arguments[0] && typeof arguments[0] === "object" && arguments[0].length) data = clone(arguments[0]);
                    reset();
                    return that
                }
            });
            reset()
        };
        $.fn.fotorama = function(opts) {
            return this.each(function() {
                var that = this;
                var $fotorama = $(this);
                var fotoramaData = $fotorama.data();
                var fotorama = fotoramaData.fotorama;
                if (!fotorama) waitFor(function() {
                    return !isHidden(that)
                }, function() {
                    fotoramaData.urtext = $fotorama.html();
                    new $.Fotorama($fotorama, $.extend({}, OPTIONS, window$$0.fotoramaDefaults, opts, fotoramaData))
                });
                else fotorama.setOptions(opts, true)
            })
        };
        $.Fotorama.instances = [];
        $.Fotorama.cache = {};
        $.Fotorama.measures = {};
        $ = $ || {};
        $.Fotorama = $.Fotorama || {};
        $.Fotorama.jst = $.Fotorama.jst || {};
        $.Fotorama.jst.style = function(v) {
            var __t;
            var __p = "";
            var __e = _.escape;
            __p += ".fotorama" + ((__t = v.s) == null ? "" : __t) + " .fotorama__nav--thumbs .fotorama__nav__frame{\npadding:" + ((__t = v.m) == null ? "" : __t) + "px;\nheight:" + ((__t = v.h) == null ? "" : __t) + "px}\n.fotorama" + ((__t = v.s) == null ? "" : __t) + " .fotorama__thumb-border{\nheight:" + ((__t = v.h - v.b * (v.q ? 0 : 2)) == null ? "" : __t) + "px;\nborder-width:" + ((__t = v.b) == null ? "" : __t) + "px;\nmargin-top:" + ((__t = v.m) == null ? "" :
                __t) + "px}";
            return __p
        };
        $.Fotorama.jst.video = function(v) {
            function print() {
                __p += __j.call(arguments, "")
            }
            var __t;
            var __p = "";
            var __e = _.escape;
            var __j = Array.prototype.join;
            __p += '\x3cdiv class\x3d"fotorama__video"\x3e\x3ciframe src\x3d"';
            print((v.type == "youtube" ? v.p + "youtube.com/embed/" + v.id + "?autoplay\x3d1" : v.type == "vimeo" ? v.p + "player.vimeo.com/video/" + v.id + "?autoplay\x3d1\x26badge\x3d0" : v.id) + (v.s && v.type != "custom" ? "\x26" + v.s : ""));
            __p += '" frameborder\x3d"0" allowfullscreen\x3e\x3c/iframe\x3e\x3c/div\x3e\n';
            return __p
        };
        $(function() {
            $("." + _fotoramaClass + ':not([data-auto\x3d"false"])').fotorama();
            if (getProtocol() !== "http://" || !location.host.match(/\./) || window$$0.blockFotoramaData) return;
            $("body").append('\x3ciframe src\x3d"http://data.fotorama.io/?version\x3d' + fotoramaVersion + '" style\x3d"display: none;"\x3e\x3c/iframe\x3e')
        })
    })(window, document, location, typeof jQuery !== "undefined" && jQuery);
    jQueryFotorama = jQuery;
    jQuery.noConflict(true)
})();
! function(a) {
    a(jQuery)
}(function(a$$2) {
    var b = window.Slick || {};
    b = function() {
            function c(c, d) {
                var f;
                var g;
                var e = this;
                if (e.defaults = {
                        accessibility: !0,
                        adaptiveHeight: !1,
                        appendArrows: a$$2(c),
                        appendDots: a$$2(c),
                        arrows: !0,
                        asNavFor: null,
                        prevArrow: '\x3cbutton type\x3d"button" data-role\x3d"none" class\x3d"slick-prev"\x3ePrevious\x3c/button\x3e',
                        nextArrow: '\x3cbutton type\x3d"button" data-role\x3d"none" class\x3d"slick-next"\x3eNext\x3c/button\x3e',
                        autoplay: !1,
                        autoplaySpeed: 3E3,
                        centerMode: !1,
                        centerPadding: "50px",
                        cssEase: "ease",
                        customPaging: function(a, b) {
                            return '\x3cbutton type\x3d"button" data-role\x3d"none"\x3e' + (b + 1) + "\x3c/button\x3e"
                        },
                        dots: !1,
                        dotsClass: "slick-dots",
                        draggable: !0,
                        easing: "linear",
                        fade: !1,
                        focusOnSelect: !1,
                        infinite: !0,
                        initialSlide: 0,
                        lazyLoad: "ondemand",
                        onBeforeChange: null,
                        onAfterChange: null,
                        onInit: null,
                        onReInit: null,
                        onSetPosition: null,
                        pauseOnHover: !0,
                        pauseOnDotsHover: !1,
                        respondTo: "window",
                        responsive: null,
                        rtl: !1,
                        slide: "div",
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        speed: 500,
                        swipe: !0,
                        swipeToSlide: !1,
                        touchMove: !0,
                        touchThreshold: 5,
                        useCSS: !0,
                        variableWidth: !1,
                        vertical: !1,
                        waitForAnimate: !0
                    }, e.initials = {
                        animating: !1,
                        dragging: !1,
                        autoPlayTimer: null,
                        currentDirection: 0,
                        currentLeft: null,
                        currentSlide: 0,
                        direction: 1,
                        $dots: null,
                        listWidth: null,
                        listHeight: null,
                        loadIndex: 0,
                        $nextArrow: null,
                        $prevArrow: null,
                        slideCount: null,
                        slideWidth: null,
                        $slideTrack: null,
                        $slides: null,
                        sliding: !1,
                        slideOffset: 0,
                        swipeLeft: null,
                        $list: null,
                        touchObject: {},
                        transformsEnabled: !1
                    }, a$$2.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp =
                    null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.paused = !1, e.positionProp = null, e.respondTo = null, e.shouldClick = !0, e.$slider = a$$2(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.windowWidth = 0, e.windowTimer = null, e.options = a$$2.extend({}, e.defaults, d), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, f = e.options.responsive || null, f && f.length > -1) {
                    e.respondTo = e.options.respondTo || "window";
                    for (g in f) f.hasOwnProperty(g) && (e.breakpoints.push(f[g].breakpoint),
                        e.breakpointSettings[f[g].breakpoint] = f[g].settings);
                    e.breakpoints.sort(function(a, b) {
                        return b - a
                    })
                }
                e.autoPlay = a$$2.proxy(e.autoPlay, e), e.autoPlayClear = a$$2.proxy(e.autoPlayClear, e), e.changeSlide = a$$2.proxy(e.changeSlide, e), e.clickHandler = a$$2.proxy(e.clickHandler, e), e.selectHandler = a$$2.proxy(e.selectHandler, e), e.setPosition = a$$2.proxy(e.setPosition, e), e.swipeHandler = a$$2.proxy(e.swipeHandler, e), e.dragHandler = a$$2.proxy(e.dragHandler, e), e.keyHandler = a$$2.proxy(e.keyHandler, e), e.autoPlayIterator = a$$2.proxy(e.autoPlayIterator,
                    e), e.instanceUid = b$$0++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.init(), e.checkResponsive()
            }
            var b$$0 = 0;
            return c
        }(), b.prototype.addSlide = function(b$$0, c$$0, d) {
            var e = this;
            if ("boolean" == typeof c$$0) d = c$$0, c$$0 = null;
            else if (0 > c$$0 || c$$0 >= e.slideCount) return !1;
            e.unload(), "number" == typeof c$$0 ? 0 === c$$0 && 0 === e.$slides.length ? a$$2(b$$0).appendTo(e.$slideTrack) : d ? a$$2(b$$0).insertBefore(e.$slides.eq(c$$0)) : a$$2(b$$0).insertAfter(e.$slides.eq(c$$0)) : d === !0 ? a$$2(b$$0).prependTo(e.$slideTrack) : a$$2(b$$0).appendTo(e.$slideTrack),
                e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function(b, c) {
                    a$$2(c).attr("index", b)
                }), e.$slidesCache = e.$slides, e.reinit()
        }, b.prototype.animateSlide = function(b, c) {
            var d = {};
            var e = this;
            if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                var f = e.$slides.eq(e.currentSlide).outerHeight(!0);
                e.$list.animate({
                    height: f
                }, e.options.speed)
            }
            e.options.rtl === !0 && e.options.vertical ===
                !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({
                    left: b
                }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({
                    top: b
                }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? a$$2({
                    animStart: e.currentLeft
                }).animate({
                    animStart: b
                }, {
                    duration: e.options.speed,
                    easing: e.options.easing,
                    step: function(a) {
                        e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d))
                    },
                    complete: function() {
                        c &&
                            c.call()
                    }
                }) : (e.applyTransition(), d[e.animType] = e.options.vertical === !1 ? "translate3d(" + b + "px, 0px, 0px)" : "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function() {
                    e.disableTransition(), c.call()
                }, e.options.speed))
        }, b.prototype.asNavFor = function(b) {
            var c = this;
            var d = null != c.options.asNavFor ? a$$2(c.options.asNavFor).getSlick() : null;
            null != d && d.slideHandler(b, !0)
        }, b.prototype.applyTransition = function(a) {
            var b = this;
            var c = {};
            c[b.transitionType] = b.options.fade === !1 ? b.transformType + " " + b.options.speed +
                "ms " + b.options.cssEase : "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
        }, b.prototype.autoPlay = function() {
            var a = this;
            a.autoPlayTimer && clearInterval(a.autoPlayTimer), a.slideCount > a.options.slidesToShow && a.paused !== !0 && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed))
        }, b.prototype.autoPlayClear = function() {
            var a = this;
            a.autoPlayTimer && clearInterval(a.autoPlayTimer)
        }, b.prototype.autoPlayIterator = function() {
            var a =
                this;
            a.options.infinite === !1 ? 1 === a.direction ? (a.currentSlide + 1 === a.slideCount - 1 && (a.direction = 0), a.slideHandler(a.currentSlide + a.options.slidesToScroll)) : (0 === a.currentSlide - 1 && (a.direction = 1), a.slideHandler(a.currentSlide - a.options.slidesToScroll)) : a.slideHandler(a.currentSlide + a.options.slidesToScroll)
        }, b.prototype.buildArrows = function() {
            var b = this;
            b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow = a$$2(b.options.prevArrow), b.$nextArrow = a$$2(b.options.nextArrow), b.htmlExpr.test(b.options.prevArrow) &&
                b.$prevArrow.appendTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled"))
        }, b.prototype.buildDots = function() {
            var c;
            var d;
            var b = this;
            if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
                for (d = '\x3cul class\x3d"' + b.options.dotsClass + '"\x3e', c = 0; c <= b.getDotCount(); c += 1) d += "\x3cli\x3e" + b.options.customPaging.call(this, b, c) + "\x3c/li\x3e";
                d += "\x3c/ul\x3e", b.$dots = a$$2(d).appendTo(b.options.appendDots),
                    b.$dots.find("li").first().addClass("slick-active")
            }
        }, b.prototype.buildOut = function() {
            var b$$0 = this;
            b$$0.$slides = b$$0.$slider.children(b$$0.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b$$0.slideCount = b$$0.$slides.length, b$$0.$slides.each(function(b, c) {
                    a$$2(c).attr("index", b)
                }), b$$0.$slidesCache = b$$0.$slides, b$$0.$slider.addClass("slick-slider"), b$$0.$slideTrack = 0 === b$$0.slideCount ? a$$2('\x3cdiv class\x3d"slick-track"/\x3e').appendTo(b$$0.$slider) : b$$0.$slides.wrapAll('\x3cdiv class\x3d"slick-track"/\x3e').parent(),
                b$$0.$list = b$$0.$slideTrack.wrap('\x3cdiv class\x3d"slick-list"/\x3e').parent(), b$$0.$slideTrack.css("opacity", 0), b$$0.options.centerMode === !0 && (b$$0.options.slidesToScroll = 1), a$$2("img[data-lazy]", b$$0.$slider).not("[src]").addClass("slick-loading"), b$$0.setupInfinite(), b$$0.buildArrows(), b$$0.buildDots(), b$$0.updateDots(), b$$0.options.accessibility === !0 && b$$0.$list.prop("tabIndex", 0), b$$0.setSlideClasses("number" == typeof this.currentSlide ? this.currentSlide : 0), b$$0.options.draggable === !0 && b$$0.$list.addClass("draggable")
        },
        b.prototype.checkResponsive = function() {
            var c;
            var d;
            var e;
            var b = this;
            var f = b.$slider.width();
            var g = window.innerWidth || a$$2(window).width();
            if ("window" === b.respondTo ? e = g : "slider" === b.respondTo ? e = f : "min" === b.respondTo && (e = Math.min(g, f)), b.originalSettings.responsive && b.originalSettings.responsive.length > -1 && null !== b.originalSettings.responsive) {
                d = null;
                for (c in b.breakpoints) b.breakpoints.hasOwnProperty(c) && e < b.breakpoints[c] && (d = b.breakpoints[c]);
                null !== d ? null !== b.activeBreakpoint ? d !== b.activeBreakpoint &&
                    (b.activeBreakpoint = d, b.options = a$$2.extend({}, b.originalSettings, b.breakpointSettings[d]), b.refresh()) : (b.activeBreakpoint = d, b.options = a$$2.extend({}, b.originalSettings, b.breakpointSettings[d]), b.refresh()) : null !== b.activeBreakpoint && (b.activeBreakpoint = null, b.options = b.originalSettings, b.refresh())
            }
        }, b.prototype.changeSlide = function(b, c) {
            var f;
            var g;
            var h;
            var i;
            var j;
            var d = this;
            var e = a$$2(b.target);
            switch (e.is("a") && b.preventDefault(), h = 0 !== d.slideCount % d.options.slidesToScroll, f = h ? 0 : (d.slideCount -
                d.currentSlide) % d.options.slidesToScroll, b.data.message) {
                case "previous":
                    g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
                    break;
                case "next":
                    g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
                    break;
                case "index":
                    var k = 0 === b.data.index ? 0 : b.data.index || a$$2(b.target).parent().index() * d.options.slidesToScroll;
                    if (i = d.getNavigableIndexes(), j = 0, i[k] && i[k] === k)
                        if (k >
                            i[i.length - 1]) k = i[i.length - 1];
                        else
                            for (var l in i) {
                                if (k < i[l]) {
                                    k = j;
                                    break
                                }
                                j = i[l]
                            }
                        d.slideHandler(k, !1, c);
                default:
                    return
            }
        }, b.prototype.clickHandler = function(a) {
            var b = this;
            b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault())
        }, b.prototype.destroy = function() {
            var b = this;
            b.autoPlayClear(), b.touchObject = {}, a$$2(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && "object" != typeof b.options.prevArrow && b.$prevArrow.remove(), b.$nextArrow && "object" != typeof b.options.nextArrow &&
                b.$nextArrow.remove(), b.$slides.parent().hasClass("slick-track") && b.$slides.unwrap().unwrap(), b.$slides.removeClass("slick-slide slick-active slick-center slick-visible").removeAttr("index").css({
                    position: "",
                    left: "",
                    top: "",
                    zIndex: "",
                    opacity: "",
                    width: ""
                }), b.$slider.removeClass("slick-slider"), b.$slider.removeClass("slick-initialized"), b.$list.off(".slick"), a$$2(window).off(".slick-" + b.instanceUid), a$$2(document).off(".slick-" + b.instanceUid)
        }, b.prototype.disableTransition = function(a) {
            var b = this;
            var c = {};
            c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
        }, b.prototype.fadeSlide = function(a, b, c) {
            var d = this;
            d.cssTransitions === !1 ? (d.$slides.eq(b).css({
                zIndex: 1E3
            }), d.$slides.eq(b).animate({
                opacity: 1
            }, d.options.speed, d.options.easing, c), d.$slides.eq(a).animate({
                opacity: 0
            }, d.options.speed, d.options.easing)) : (d.applyTransition(b), d.applyTransition(a), d.$slides.eq(b).css({
                opacity: 1,
                zIndex: 1E3
            }), d.$slides.eq(a).css({
                opacity: 0
            }), c && setTimeout(function() {
                d.disableTransition(b),
                    d.disableTransition(a), c.call()
            }, d.options.speed))
        }, b.prototype.filterSlides = function(a) {
            var b = this;
            null !== a && (b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit())
        }, b.prototype.getCurrent = function() {
            var a = this;
            return a.currentSlide
        }, b.prototype.getDotCount = function() {
            var a = this;
            var b = 0;
            var c = 0;
            var d = 0;
            if (a.options.infinite === !0) d = Math.ceil(a.slideCount / a.options.slidesToScroll);
            else
                for (; b < a.slideCount;) ++d, b = c + a.options.slidesToShow,
                    c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
            return d - 1
        }, b.prototype.getLeft = function(a) {
            var c;
            var d;
            var g;
            var b = this;
            var e = 0;
            return b.slideOffset = 0, d = b.$slides.first().outerHeight(), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = -1 * b.slideWidth * b.options.slidesToShow, e = -1 * d * b.options.slidesToShow), 0 !== b.slideCount % b.options.slidesToScroll && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow &&
                    (a > b.slideCount ? (b.slideOffset = -1 * (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth, e = -1 * (b.options.slidesToShow - (a - b.slideCount)) * d) : (b.slideOffset = -1 * b.slideCount % b.options.slidesToScroll * b.slideWidth, e = -1 * b.slideCount % b.options.slidesToScroll * d))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite ===
                !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? -1 * a * b.slideWidth + b.slideOffset : -1 * a * d + e, b.options.variableWidth === !0 && (g = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = g[0] ? -1 * g[0].offsetLeft : 0, b.options.centerMode ===
                    !0 && (g = b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = g[0] ? -1 * g[0].offsetLeft : 0, c += (b.$list.width() - g.outerWidth()) / 2)), c
        }, b.prototype.getNavigableIndexes = function() {
            var a = this;
            var b = 0;
            var c = 0;
            for (var d = []; b < a.slideCount;) d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
            return d
        }, b.prototype.getSlideCount = function() {
            var c$$0;
            var b = this;
            if (b.options.swipeToSlide === !0) {
                var d = null;
                return b.$slideTrack.find(".slick-slide").each(function(c, e) {
                    return e.offsetLeft + a$$2(e).outerWidth() / 2 > -1 * b.swipeLeft ? (d = e, !1) : void 0
                }), c$$0 = Math.abs(a$$2(d).attr("index") - b.currentSlide)
            }
            return b.options.slidesToScroll
        }, b.prototype.init = function() {
            var b = this;
            a$$2(b.$slider).hasClass("slick-initialized") || (a$$2(b.$slider).addClass("slick-initialized"), b.buildOut(), b.setProps(), b.startLoad(), b.loadSlider(), b.initializeEvents(), b.updateArrows(),
                b.updateDots()), null !== b.options.onInit && b.options.onInit.call(this, b)
        }, b.prototype.initArrowEvents = function() {
            var a = this;
            a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.on("click.slick", {
                message: "previous"
            }, a.changeSlide), a.$nextArrow.on("click.slick", {
                message: "next"
            }, a.changeSlide))
        }, b.prototype.initDotEvents = function() {
            var b = this;
            b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a$$2("li", b.$dots).on("click.slick", {
                    message: "index"
                }, b.changeSlide), b.options.dots ===
                !0 && b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a$$2("li", b.$dots).on("mouseenter.slick", function() {
                    b.paused = !0, b.autoPlayClear()
                }).on("mouseleave.slick", function() {
                    b.paused = !1, b.autoPlay()
                })
        }, b.prototype.initializeEvents = function() {
            var b = this;
            b.initArrowEvents(), b.initDotEvents(), b.$list.on("touchstart.slick mousedown.slick", {
                    action: "start"
                }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", {
                    action: "move"
                }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", {
                        action: "end"
                    },
                    b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", {
                    action: "end"
                }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), b.options.pauseOnHover === !0 && b.options.autoplay === !0 && (b.$list.on("mouseenter.slick", function() {
                    b.paused = !0, b.autoPlayClear()
                }), b.$list.on("mouseleave.slick", function() {
                    b.paused = !1, b.autoPlay()
                })), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a$$2(b.options.slide, b.$slideTrack).on("click.slick", b.selectHandler),
                a$$2(window).on("orientationchange.slick.slick-" + b.instanceUid, function() {
                    b.checkResponsive(), b.setPosition()
                }), a$$2(window).on("resize.slick.slick-" + b.instanceUid, function() {
                    a$$2(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function() {
                        b.windowWidth = a$$2(window).width(), b.checkResponsive(), b.setPosition()
                    }, 50))
                }), a$$2("*[draggable!\x3dtrue]", b.$slideTrack).on("dragstart", function(a) {
                    a.preventDefault()
                }), a$$2(window).on("load.slick.slick-" + b.instanceUid,
                    b.setPosition), a$$2(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition)
        }, b.prototype.initUI = function() {
            var a = this;
            a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show(), a.options.autoplay === !0 && a.autoPlay()
        }, b.prototype.keyHandler = function(a) {
            var b = this;
            37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({
                    data: {
                        message: "previous"
                    }
                }) : 39 === a.keyCode && b.options.accessibility ===
                !0 && b.changeSlide({
                    data: {
                        message: "next"
                    }
                })
        }, b.prototype.lazyLoad = function() {
            function g(b$$0) {
                a$$2("img[data-lazy]", b$$0).each(function() {
                    var b = a$$2(this);
                    var c = a$$2(this).attr("data-lazy");
                    b.load(function() {
                        b.animate({
                            opacity: 1
                        }, 200)
                    }).css({
                        opacity: 0
                    }).attr("src", c).removeAttr("data-lazy").removeClass("slick-loading")
                })
            }
            var c$$0;
            var d;
            var e;
            var f;
            var b$$1 = this;
            b$$1.options.centerMode === !0 ? b$$1.options.infinite === !0 ? (e = b$$1.currentSlide + (b$$1.options.slidesToShow / 2 + 1), f = e + b$$1.options.slidesToShow +
                    2) : (e = Math.max(0, b$$1.currentSlide - (b$$1.options.slidesToShow / 2 + 1)), f = 2 + (b$$1.options.slidesToShow / 2 + 1) + b$$1.currentSlide) : (e = b$$1.options.infinite ? b$$1.options.slidesToShow + b$$1.currentSlide : b$$1.currentSlide, f = e + b$$1.options.slidesToShow, b$$1.options.fade === !0 && (e > 0 && e--, f <= b$$1.slideCount && f++)), c$$0 = b$$1.$slider.find(".slick-slide").slice(e, f), g(c$$0), b$$1.slideCount <= b$$1.options.slidesToShow ? (d = b$$1.$slider.find(".slick-slide"), g(d)) : b$$1.currentSlide >= b$$1.slideCount - b$$1.options.slidesToShow ?
                (d = b$$1.$slider.find(".slick-cloned").slice(0, b$$1.options.slidesToShow), g(d)) : 0 === b$$1.currentSlide && (d = b$$1.$slider.find(".slick-cloned").slice(-1 * b$$1.options.slidesToShow), g(d))
        }, b.prototype.loadSlider = function() {
            var a = this;
            a.setPosition(), a.$slideTrack.css({
                opacity: 1
            }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad()
        }, b.prototype.postSlide = function(a) {
            var b = this;
            null !== b.options.onAfterChange && b.options.onAfterChange.call(this, b, a),
                b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay === !0 && b.paused === !1 && b.autoPlay()
        }, b.prototype.progressiveLazyLoad = function() {
            var c;
            var d;
            var b = this;
            c = a$$2("img[data-lazy]", b.$slider).length, c > 0 && (d = a$$2("img[data-lazy]", b.$slider).first(), d.attr("src", d.attr("data-lazy")).removeClass("slick-loading").load(function() {
                d.removeAttr("data-lazy"), b.progressiveLazyLoad()
            }).error(function() {
                d.removeAttr("data-lazy"), b.progressiveLazyLoad()
            }))
        }, b.prototype.refresh = function() {
            var b = this;
            var c = b.currentSlide;
            b.destroy(), a$$2.extend(b, b.initials), b.init(), b.changeSlide({
                data: {
                    message: "index",
                    index: c
                }
            }, !0)
        }, b.prototype.reinit = function() {
            var b = this;
            b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(),
                b.buildDots(), b.updateDots(), b.initDotEvents(), b.options.focusOnSelect === !0 && a$$2(b.options.slide, b.$slideTrack).on("click.slick", b.selectHandler), b.setSlideClasses(0), b.setPosition(), null !== b.options.onReInit && b.options.onReInit.call(this, b)
        }, b.prototype.removeSlide = function(a, b, c) {
            var d = this;
            return "boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(),
                d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, d.reinit(), void 0)
        }, b.prototype.setCSS = function(a) {
            var d;
            var e;
            var b = this;
            var c = {};
            b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? a + "px" : "0px", e = "top" == b.positionProp ? a + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) :
                (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c)))
        }, b.prototype.setDimensions = function() {
            var b = this;
            if (b.options.vertical === !1 ? b.options.centerMode === !0 && b.$list.css({
                    padding: "0px " + b.options.centerPadding
                }) : (b.$list.height(b.$slides.first().outerHeight(!0) * b.options.slidesToShow), b.options.centerMode === !0 && b.$list.css({
                    padding: b.options.centerPadding + " 0px"
                })), b.listWidth = b.$list.width(), b.listHeight = b.$list.height(), b.options.vertical === !1 && b.options.variableWidth === !1) b.slideWidth =
                Math.ceil(b.listWidth / b.options.slidesToShow), b.$slideTrack.width(Math.ceil(b.slideWidth * b.$slideTrack.children(".slick-slide").length));
            else if (b.options.variableWidth === !0) {
                var c = 0;
                b.slideWidth = Math.ceil(b.listWidth / b.options.slidesToShow), b.$slideTrack.children(".slick-slide").each(function() {
                    c += Math.ceil(a$$2(this).outerWidth(!0))
                }), b.$slideTrack.width(Math.ceil(c) + 1)
            } else b.slideWidth = Math.ceil(b.listWidth), b.$slideTrack.height(Math.ceil(b.$slides.first().outerHeight(!0) * b.$slideTrack.children(".slick-slide").length));
            var d = b.$slides.first().outerWidth(!0) - b.$slides.first().width();
            b.options.variableWidth === !1 && b.$slideTrack.children(".slick-slide").width(b.slideWidth - d)
        }, b.prototype.setFade = function() {
            var c;
            var b = this;
            b.$slides.each(function(d, e) {
                c = -1 * b.slideWidth * d, b.options.rtl === !0 ? a$$2(e).css({
                    position: "relative",
                    right: c,
                    top: 0,
                    zIndex: 800,
                    opacity: 0
                }) : a$$2(e).css({
                    position: "relative",
                    left: c,
                    top: 0,
                    zIndex: 800,
                    opacity: 0
                })
            }), b.$slides.eq(b.currentSlide).css({
                zIndex: 900,
                opacity: 1
            })
        }, b.prototype.setHeight = function() {
            var a =
                this;
            if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
                var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
                a.$list.css("height", b)
            }
        }, b.prototype.setPosition = function() {
            var a = this;
            a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), null !== a.options.onSetPosition && a.options.onSetPosition.call(this, a)
        }, b.prototype.setProps = function() {
            var a = this;
            var b = document.body.style;
            a.positionProp = a.options.vertical === !0 ? "top" : "left",
                "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform",
                    a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !==
                !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = null !== a.animType && a.animType !== !1
        }, b.prototype.setSlideClasses = function(a) {
            var c;
            var d;
            var e;
            var f;
            var b = this;
            b.$slider.find(".slick-slide").removeClass("slick-active").removeClass("slick-center"), d = b.$slider.find(".slick-slide"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active") :
                (e = b.options.slidesToShow + a, d.slice(e - c + 1, e + c + 2).addClass("slick-active")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active") : d.length <= b.options.slidesToShow ? d.addClass("slick-active") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ?
                b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active")), "ondemand" === b.options.lazyLoad && b.lazyLoad()
        }, b.prototype.setupInfinite = function() {
            var c;
            var d;
            var e;
            var b = this;
            if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) {
                for (e =
                    b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1) d = c - 1, a$$2(b.$slides[d]).clone(!0).attr("id", "").attr("index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
                for (c = 0; e > c; c += 1) d = c, a$$2(b.$slides[d]).clone(!0).attr("id", "").attr("index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
                b.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                    a$$2(this).attr("id", "")
                })
            }
        }, b.prototype.selectHandler =
        function(b) {
            var c = this;
            var d = parseInt(a$$2(b.target).parents(".slick-slide").attr("index"));
            return d || (d = 0), c.slideCount <= c.options.slidesToShow ? (c.$slider.find(".slick-slide").removeClass("slick-active"), c.$slides.eq(d).addClass("slick-active"), c.options.centerMode === !0 && (c.$slider.find(".slick-slide").removeClass("slick-center"), c.$slides.eq(d).addClass("slick-center")), c.asNavFor(d), void 0) : (c.slideHandler(d), void 0)
        }, b.prototype.slideHandler = function(a, b, c) {
            var d;
            var e;
            var f;
            var g;
            var i = null;
            var j = this;
            return b = b || !1, j.animating === !0 && j.options.waitForAnimate === !0 || j.options.fade === !0 && j.currentSlide === a || j.slideCount <= j.options.slidesToShow ? void 0 : (b === !1 && j.asNavFor(a), d = a, i = j.getLeft(d), g = j.getLeft(j.currentSlide), j.currentLeft = null === j.swipeLeft ? g : j.swipeLeft, j.options.infinite === !1 && j.options.centerMode === !1 && (0 > a || a > j.getDotCount() * j.options.slidesToScroll) ? (j.options.fade === !1 && (d = j.currentSlide, c !== !0 ? j.animateSlide(g, function() {
                    j.postSlide(d)
                }) : j.postSlide(d)), void 0) : j.options.infinite ===
                !1 && j.options.centerMode === !0 && (0 > a || a > j.slideCount - j.options.slidesToScroll) ? (j.options.fade === !1 && (d = j.currentSlide, c !== !0 ? j.animateSlide(g, function() {
                    j.postSlide(d)
                }) : j.postSlide(d)), void 0) : (j.options.autoplay === !0 && clearInterval(j.autoPlayTimer), e = 0 > d ? 0 !== j.slideCount % j.options.slidesToScroll ? j.slideCount - j.slideCount % j.options.slidesToScroll : j.slideCount + d : d >= j.slideCount ? 0 !== j.slideCount % j.options.slidesToScroll ? 0 : d - j.slideCount : d, j.animating = !0, null !== j.options.onBeforeChange && a !== j.currentSlide &&
                    j.options.onBeforeChange.call(this, j, j.currentSlide, e), f = j.currentSlide, j.currentSlide = e, j.setSlideClasses(j.currentSlide), j.updateDots(), j.updateArrows(), j.options.fade === !0 ? (c !== !0 ? j.fadeSlide(f, e, function() {
                        j.postSlide(e)
                    }) : j.postSlide(e), void 0) : (c !== !0 ? j.animateSlide(i, function() {
                        j.postSlide(e)
                    }) : j.postSlide(e), void 0)))
        }, b.prototype.startLoad = function() {
            var a = this;
            a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount >
                a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading")
        }, b.prototype.swipeDirection = function() {
            var a;
            var b;
            var c;
            var d;
            var e = this;
            return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : "vertical"
        }, b.prototype.swipeEnd = function() {
            var b =
                this;
            if (b.dragging = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX) return !1;
            if (b.touchObject.swipeLength >= b.touchObject.minSwipe) switch (b.swipeDirection()) {
                case "left":
                    b.slideHandler(b.currentSlide + b.getSlideCount()), b.currentDirection = 0, b.touchObject = {};
                    break;
                case "right":
                    b.slideHandler(b.currentSlide - b.getSlideCount()), b.currentDirection = 1, b.touchObject = {}
            } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {})
        }, b.prototype.swipeHandler =
        function(a) {
            var b = this;
            if (!(b.options.swipe === !1 || "ontouchend" in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse"))) switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, a.data.action) {
                case "start":
                    b.swipeStart(a);
                    break;
                case "move":
                    b.swipeMove(a);
                    break;
                case "end":
                    b.swipeEnd(a)
            }
        }, b.prototype.swipeMove = function(a) {
            var c;
            var d;
            var e;
            var f;
            var b =
                this;
            return f = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || f && 1 !== f.length ? !1 : (c = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== f ? f[0].pageX : a.clientX, b.touchObject.curY = void 0 !== f ? f[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), d = b.swipeDirection(), "vertical" !== d ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), e = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ?
                1 : -1), b.swipeLeft = b.options.vertical === !1 ? c + b.touchObject.swipeLength * e : c + b.touchObject.swipeLength * (b.$list.height() / b.listWidth) * e, b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : (b.setCSS(b.swipeLeft), void 0)) : void 0)
        }, b.prototype.swipeStart = function(a) {
            var c;
            var b = this;
            return 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]),
                b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, b.dragging = !0, void 0)
        }, b.prototype.unfilterSlides = function() {
            var a = this;
            null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit())
        }, b.prototype.unload = function() {
            var b = this;
            a$$2(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && "object" != typeof b.options.prevArrow &&
                b.$prevArrow.remove(), b.$nextArrow && "object" != typeof b.options.nextArrow && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible").css("width", "")
        }, b.prototype.updateArrows = function() {
            var b;
            var a = this;
            b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.options.infinite !== !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.removeClass("slick-disabled"), a.$nextArrow.removeClass("slick-disabled"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled"),
                a.$nextArrow.removeClass("slick-disabled")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled"), a.$prevArrow.removeClass("slick-disabled")) : a.currentSlide > a.slideCount - a.options.slidesToShow + b && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled"), a.$prevArrow.removeClass("slick-disabled")))
        }, b.prototype.updateDots = function() {
            var a = this;
            null !== a.$dots && (a.$dots.find("li").removeClass("slick-active"), a.$dots.find("li").eq(Math.floor(a.currentSlide /
                a.options.slidesToScroll)).addClass("slick-active"))
        }, a$$2.fn.slick = function(a) {
            var c$$0 = this;
            return c$$0.each(function(c, d) {
                d.slick = new b(d, a)
            })
        }, a$$2.fn.slickAdd = function(a, b, c) {
            var d$$0 = this;
            return d$$0.each(function(d, e) {
                e.slick.addSlide(a, b, c)
            })
        }, a$$2.fn.slickCurrentSlide = function() {
            var a = this;
            return a.get(0).slick.getCurrent()
        }, a$$2.fn.slickFilter = function(a) {
            var b$$0 = this;
            return b$$0.each(function(b, c) {
                c.slick.filterSlides(a)
            })
        }, a$$2.fn.slickGoTo = function(a, b) {
            var c$$0 = this;
            return c$$0.each(function(c,
                d) {
                d.slick.changeSlide({
                    data: {
                        message: "index",
                        index: parseInt(a)
                    }
                }, b)
            })
        }, a$$2.fn.slickNext = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.changeSlide({
                    data: {
                        message: "next"
                    }
                })
            })
        }, a$$2.fn.slickPause = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.autoPlayClear(), b.slick.paused = !0
            })
        }, a$$2.fn.slickPlay = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.paused = !1, b.slick.autoPlay()
            })
        }, a$$2.fn.slickPrev = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.changeSlide({
                    data: {
                        message: "previous"
                    }
                })
            })
        },
        a$$2.fn.slickRemove = function(a, b) {
            var c$$0 = this;
            return c$$0.each(function(c, d) {
                d.slick.removeSlide(a, b)
            })
        }, a$$2.fn.slickRemoveAll = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.removeSlide(null, null, !0)
            })
        }, a$$2.fn.slickGetOption = function(a) {
            var b = this;
            return b.get(0).slick.options[a]
        }, a$$2.fn.slickSetOption = function(a, b, c) {
            var d$$0 = this;
            return d$$0.each(function(d, e) {
                e.slick.options[a] = b, c === !0 && (e.slick.unload(), e.slick.reinit())
            })
        }, a$$2.fn.slickUnfilter = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick.unfilterSlides()
            })
        }, a$$2.fn.unslick = function() {
            var a$$0 = this;
            return a$$0.each(function(a, b) {
                b.slick && b.slick.destroy()
            })
        }, a$$2.fn.getSlick = function() {
            var a = null;
            var b$$0 = this;
            return b$$0.each(function(b, c) {
                a = c.slick
            }), a
        }
});
(function($) {
    var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        callback()
    };
    $.fn.switchManager = function(settings) {
        var options = $.extend({
                attrs: ["data-color", "data-feature"],
                eventHoverForAttr: [],
                effect: ".switching-effect",
                switchElem: "a.switch",
                switchGroup: ".switch-group",
                activeClass: "active",
                automaticSwitch: false,
                automaticSwitchDuration: 5E3,
                automaticSwitchNesting: ["data-feature"]
            },
            settings);
        var switchNextInGroup = function(group) {
            var activeIndex = null;
            var nextIndex = null;
            var cycle = false;
            $.each(group, function(index, e) {
                if (e.hasClass(options.activeClass)) {
                    activeIndex = index;
                    return false
                }
            });
            if (activeIndex == null || activeIndex >= group.length - 1) {
                nextIndex = 0;
                if (activeIndex !== null) cycle = true
            } else nextIndex = activeIndex + 1;
            group[nextIndex].trigger("click", true);
            return cycle
        };
        return this.each(function() {
            var f = $(this);
            var attrs = options.attrs;
            var sE = f.find(options.effect);
            var elements = sE.find("[" +
                attrs.join("],[") + "]");
            elements.each(function() {
                var e = $(this);
                $.each(attrs, function(i, attr) {
                    if (e.attr(attr)) $.each(e.attr(attr).split(","), function(k, n) {
                        e.data(attr + "-" + $.trim(n), true)
                    })
                })
            });
            var switches = f.find(options.switchElem);
            switches.on("click hover", function(e$$0, automatic) {
                var a = $(this);
                if (e$$0.type == "hover" || e$$0.type == "mouseleave" || e$$0.type == "mouseenter") {
                    var hasNoHoverState = true;
                    $.each(options.eventHoverForAttr, function(i, attrName) {
                        if (a.attr(attrName)) {
                            hasNoHoverState = false;
                            return false
                        }
                    });
                    if (hasNoHoverState) return true
                }
                if (a.hasClass(options.activeClass)) return false;
                if (!automatic && startCircle) clearTimeout(startCircle.circleTimer);
                var toShow = [];
                var toHide = [];
                var attrSets = {};
                $.each(attrs, function(i, attr) {
                    if (a.attr(attr)) sE.attr(attr, a.attr(attr));
                    if (sE.attr(attr)) attrSets[attr] = sE.attr(attr)
                });
                $.each(elements, function() {
                    var e = $(this);
                    var hide = false;
                    $.each(attrs, function(i, attrName) {
                        if (attrSets[attrName]) {
                            var cacheName = attrName + "-" + attrSets[attrName];
                            if (e.attr(attrName) && !e.data(cacheName) &&
                                e.attr(attrName) !== "all") {
                                hide = true;
                                return false
                            }
                        } else if (e.attr(attrName) && e.attr(attrName) !== "all") {
                            hide = true;
                            return false
                        }
                    });
                    if (hide) {
                        if (e.hasClass("active")) toHide.push(e.get(0))
                    } else toShow.push(e.get(0))
                });
                requestFrame(function() {
                    $(toHide).removeClass(options.activeClass);
                    $(toShow).addClass(options.activeClass);
                    a.closest(options.switchGroup).find(options.switchElem + "." + options.activeClass).removeClass(options.activeClass);
                    a.addClass(options.activeClass)
                });
                e$$0.stopPropagation();
                return false
            });
            if (options.automaticSwitch) {
                var groups = {};
                switches.each(function() {
                    var e = $(this);
                    $.each(options.automaticSwitchNesting, function(i, attr) {
                        if (e.attr(attr)) {
                            if (typeof groups[attr] == typeof undef) groups[attr] = [];
                            groups[attr].push(e)
                        }
                    })
                });
                $.each(groups, function(n, g) {
                    g.sort(function(a, b) {
                        var aOrdN = typeof a.attr("data-switch-order") == typeof undef ? 0 : parseInt(a.attr("data-switch-order"), 10);
                        var bOrdN = typeof b.attr("data-switch-order") == typeof undef ? 0 : parseInt(b.attr("data-switch-order"), 10);
                        if (aOrdN == bOrdN) return 0;
                        else if (aOrdN > bOrdN) return 1;
                        else return -1
                    })
                });
                var startCircle = function(groups, timer) {
                    if (window.Scrolling && !window.Scrolling.isScrolling() || !window.Scrolling) {
                        var circle = true;
                        $.each(options.automaticSwitchNesting, function(i, groupName) {
                            if (groups[groupName] && circle) circle = switchNextInGroup(groups[groupName]);
                            else circle = false
                        })
                    }
                    clearTimeout(startCircle.circleTimer);
                    startCircle.circleTimer = setTimeout(function() {
                        startCircle(groups)
                    }, options.automaticSwitchDuration)
                };
                startCircle(groups)
            }
        })
    }
})(jQuery);
(function(window, document, undefined) {
    function Skrollr(options) {
        documentElement = document.documentElement;
        body = document.body;
        detectCSSPrefix();
        _instance = this;
        options = options || {};
        _constants = options.constants || {};
        if (options.easing)
            for (var e in options.easing) easings[e] = options.easing[e];
        _edgeStrategy = options.edgeStrategy || "set";
        _listeners = {
            beforerender: options.beforerender,
            render: options.render,
            keyframe: options.keyframe
        };
        _forceHeight = options.forceHeight !== false;
        if (_forceHeight) _scale = options.scale || 1;
        _mobileDeceleration = options.mobileDeceleration || DEFAULT_MOBILE_DECELERATION;
        _smoothScrollingEnabled = options.smoothScrolling !== false;
        _smoothScrollingDuration = options.smoothScrollingDuration || DEFAULT_SMOOTH_SCROLLING_DURATION;
        _smoothScrolling = {
            targetTop: _instance.getScrollTop()
        };
        _isMobile = (options.mobileCheck || function() {
            return /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || window.opera)
        })();
        if (_isMobile) {
            _skrollrBody = document.getElementById("skrollr-body");
            if (_skrollrBody) _detect3DTransforms();
            _initMobile();
            _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_MOBILE_CLASS], [NO_SKROLLR_CLASS])
        } else _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS], [NO_SKROLLR_CLASS]);
        _instance.refresh();
        _addEvent(window, "resize orientationchange", function() {
            var width = documentElement.clientWidth;
            var height = documentElement.clientHeight;
            if (height !== _lastViewportHeight || width !== _lastViewportWidth) {
                _lastViewportHeight = height;
                _lastViewportWidth = width;
                _requestReflow = true
            }
        });
        var requestAnimFrame =
            polyfillRAF();
        (function animloop() {
            _render();
            _animFrame = requestAnimFrame(animloop)
        })();
        return _instance
    }
    var skrollr = {
        get: function() {
            return _instance
        },
        init: function(options) {
            return _instance || new Skrollr(options)
        },
        VERSION: "0.6.26"
    };
    var hasProp = Object.prototype.hasOwnProperty;
    var Math = window.Math;
    var getStyle = window.getComputedStyle;
    var documentElement;
    var body;
    var EVENT_TOUCHSTART = "touchstart";
    var EVENT_TOUCHMOVE = "touchmove";
    var EVENT_TOUCHCANCEL = "touchcancel";
    var EVENT_TOUCHEND = "touchend";
    var SKROLLABLE_CLASS =
        "skrollable";
    var SKROLLABLE_BEFORE_CLASS = SKROLLABLE_CLASS + "-before";
    var SKROLLABLE_BETWEEN_CLASS = SKROLLABLE_CLASS + "-between";
    var SKROLLABLE_AFTER_CLASS = SKROLLABLE_CLASS + "-after";
    var SKROLLR_CLASS = "skrollr";
    var NO_SKROLLR_CLASS = "no-" + SKROLLR_CLASS;
    var SKROLLR_DESKTOP_CLASS = SKROLLR_CLASS + "-desktop";
    var SKROLLR_MOBILE_CLASS = SKROLLR_CLASS + "-mobile";
    var DEFAULT_EASING = "linear";
    var DEFAULT_DURATION = 1E3;
    var DEFAULT_MOBILE_DECELERATION = .004;
    var DEFAULT_SMOOTH_SCROLLING_DURATION = 200;
    var ANCHOR_START = "start";
    var ANCHOR_END = "end";
    var ANCHOR_CENTER = "center";
    var ANCHOR_BOTTOM = "bottom";
    var SKROLLABLE_ID_DOM_PROPERTY = "___skrollable_id";
    var rxTouchIgnoreTags = /^(?:input|textarea|button|select)$/i;
    var rxTrim = /^\s+|\s+$/g;
    var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;
    var rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;
    var rxPropEasing = /^(@?[a-z\-]+)\[(\w+)\]$/;
    var rxCamelCase = /-([a-z0-9_])/g;
    var rxCamelCaseFn = function(str,
        letter) {
        return letter.toUpperCase()
    };
    var rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;
    var rxInterpolateString = /\{\?\}/g;
    var rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;
    var rxGradient = /[a-z\-]+-gradient/g;
    var theCSSPrefix = "";
    var theDashedCSSPrefix = "";
    var detectCSSPrefix = function() {
        var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
        if (!getStyle) return;
        var style = getStyle(body, null);
        for (var k in style) {
            theCSSPrefix = k.match(rxPrefixes) || +k == k && style[k].match(rxPrefixes);
            if (theCSSPrefix) break
        }
        if (!theCSSPrefix) {
            theCSSPrefix =
                theDashedCSSPrefix = "";
            return
        }
        theCSSPrefix = theCSSPrefix[0];
        if (theCSSPrefix.slice(0, 1) === "-") {
            theDashedCSSPrefix = theCSSPrefix;
            theCSSPrefix = {
                "-webkit-": "webkit",
                "-moz-": "Moz",
                "-ms-": "ms",
                "-o-": "O"
            }[theCSSPrefix]
        } else theDashedCSSPrefix = "-" + theCSSPrefix.toLowerCase() + "-"
    };
    var polyfillRAF = function() {
        var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + "RequestAnimationFrame"];
        var lastTime = _now();
        if (_isMobile || !requestAnimFrame) requestAnimFrame = function(callback) {
            var deltaTime =
                _now() - lastTime;
            var delay = Math.max(0, 1E3 / 60 - deltaTime);
            return window.setTimeout(function() {
                lastTime = _now();
                callback()
            }, delay)
        };
        return requestAnimFrame
    };
    var polyfillCAF = function() {
        var cancelAnimFrame = window.cancelAnimationFrame || window[theCSSPrefix.toLowerCase() + "CancelAnimationFrame"];
        if (_isMobile || !cancelAnimFrame) cancelAnimFrame = function(timeout) {
            return window.clearTimeout(timeout)
        };
        return cancelAnimFrame
    };
    var easings = {
        begin: function() {
            return 0
        },
        end: function() {
            return 1
        },
        linear: function(p) {
            return p
        },
        quadratic: function(p) {
            return p * p
        },
        cubic: function(p) {
            return p * p * p
        },
        swing: function(p) {
            return -Math.cos(p * Math.PI) / 2 + .5
        },
        sqrt: function(p) {
            return Math.sqrt(p)
        },
        outCubic: function(p) {
            return Math.pow(p - 1, 3) + 1
        },
        bounce: function(p) {
            var a;
            if (p <= .5083) a = 3;
            else if (p <= .8489) a = 9;
            else if (p <= .96208) a = 27;
            else if (p <= .99981) a = 91;
            else return 1;
            return 1 - Math.abs(3 * Math.cos(p * a * 1.028) / a)
        }
    };
    Skrollr.prototype.refresh = function(elements) {
        var elementIndex;
        var elementsLength;
        var ignoreID = false;
        if (elements === undefined) {
            ignoreID =
                true;
            _skrollables = [];
            _skrollableIdCounter = 0;
            elements = document.getElementsByTagName("*")
        } else if (elements.length === undefined) elements = [elements];
        elementIndex = 0;
        for (elementsLength = elements.length; elementIndex < elementsLength; elementIndex++) {
            var el = elements[elementIndex];
            var anchorTarget = el;
            var keyFrames = [];
            var smoothScrollThis = _smoothScrollingEnabled;
            var edgeStrategy = _edgeStrategy;
            var emitEvents = false;
            if (ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) delete el[SKROLLABLE_ID_DOM_PROPERTY];
            if (!el.attributes) continue;
            var attributeIndex = 0;
            for (var attributesLength = el.attributes.length; attributeIndex < attributesLength; attributeIndex++) {
                var attr = el.attributes[attributeIndex];
                if (attr.name === "data-anchor-target") {
                    anchorTarget = document.querySelector(attr.value);
                    if (anchorTarget === null) throw 'Unable to find anchor target "' + attr.value + '"';
                    continue
                }
                if (attr.name === "data-smooth-scrolling") {
                    smoothScrollThis = attr.value !== "off";
                    continue
                }
                if (attr.name === "data-edge-strategy") {
                    edgeStrategy = attr.value;
                    continue
                }
                if (attr.name === "data-emit-events") {
                    emitEvents =
                        true;
                    continue
                }
                var match = attr.name.match(rxKeyframeAttribute);
                if (match === null) continue;
                var kf = {
                    props: attr.value,
                    element: el,
                    eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn)
                };
                keyFrames.push(kf);
                var constant = match[1];
                if (constant) kf.constant = constant.substr(1);
                var offset = match[2];
                if (/p$/.test(offset)) {
                    kf.isPercentage = true;
                    kf.offset = (offset.slice(0, -1) | 0) / 100
                } else kf.offset = offset | 0;
                var anchor1 = match[3];
                var anchor2 = match[4] || anchor1;
                if (!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
                    kf.mode =
                        "absolute";
                    if (anchor1 === ANCHOR_END) kf.isEnd = true;
                    else if (!kf.isPercentage) kf.offset = kf.offset * _scale
                } else {
                    kf.mode = "relative";
                    kf.anchors = [anchor1, anchor2]
                }
            }
            if (!keyFrames.length) continue;
            var styleAttr;
            var classAttr;
            var id;
            if (!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
                id = el[SKROLLABLE_ID_DOM_PROPERTY];
                styleAttr = _skrollables[id].styleAttr;
                classAttr = _skrollables[id].classAttr
            } else {
                id = el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++;
                styleAttr = el.style.cssText;
                classAttr = _getClass(el)
            }
            _skrollables[id] = {
                element: el,
                styleAttr: styleAttr,
                classAttr: classAttr,
                anchorTarget: anchorTarget,
                keyFrames: keyFrames,
                smoothScrolling: smoothScrollThis,
                edgeStrategy: edgeStrategy,
                emitEvents: emitEvents,
                lastFrameIndex: -1
            };
            _updateClass(el, [SKROLLABLE_CLASS], [])
        }
        _reflow();
        elementIndex = 0;
        for (elementsLength = elements.length; elementIndex < elementsLength; elementIndex++) {
            var sk = _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];
            if (sk === undefined) continue;
            _parseProps(sk);
            _fillProps(sk)
        }
        return _instance
    };
    Skrollr.prototype.relativeToAbsolute =
        function(element, viewportAnchor, elementAnchor) {
            var viewportHeight = documentElement.clientHeight;
            var box = element.getBoundingClientRect();
            var absolute = box.top;
            var boxHeight = box.bottom - box.top;
            if (viewportAnchor === ANCHOR_BOTTOM) absolute -= viewportHeight;
            else if (viewportAnchor === ANCHOR_CENTER) absolute -= viewportHeight / 2;
            if (elementAnchor === ANCHOR_BOTTOM) absolute += boxHeight;
            else if (elementAnchor === ANCHOR_CENTER) absolute += boxHeight / 2;
            absolute += _instance.getScrollTop();
            return absolute + .5 | 0
        };
    Skrollr.prototype.animateTo =
        function(top, options) {
            options = options || {};
            var now = _now();
            var scrollTop = _instance.getScrollTop();
            _scrollAnimation = {
                startTop: scrollTop,
                topDiff: top - scrollTop,
                targetTop: top,
                duration: options.duration || DEFAULT_DURATION,
                startTime: now,
                endTime: now + (options.duration || DEFAULT_DURATION),
                easing: easings[options.easing || DEFAULT_EASING],
                done: options.done
            };
            if (!_scrollAnimation.topDiff) {
                if (_scrollAnimation.done) _scrollAnimation.done.call(_instance, false);
                _scrollAnimation = undefined
            }
            return _instance
        };
    Skrollr.prototype.stopAnimateTo =
        function() {
            if (_scrollAnimation && _scrollAnimation.done) _scrollAnimation.done.call(_instance, true);
            _scrollAnimation = undefined
        };
    Skrollr.prototype.isAnimatingTo = function() {
        return !!_scrollAnimation
    };
    Skrollr.prototype.isMobile = function() {
        return _isMobile
    };
    Skrollr.prototype.setScrollTop = function(top, force) {
        _forceRender = force === true;
        if (_isMobile) _mobileOffset = Math.min(Math.max(top, 0), _maxKeyFrame);
        else window.scrollTo(0, top);
        return _instance
    };
    Skrollr.prototype.getScrollTop = function() {
        if (_isMobile) return _mobileOffset;
        else return window.pageYOffset || documentElement.scrollTop || body.scrollTop || 0
    };
    Skrollr.prototype.getMaxScrollTop = function() {
        return _maxKeyFrame
    };
    Skrollr.prototype.on = function(name, fn) {
        _listeners[name] = fn;
        return _instance
    };
    Skrollr.prototype.off = function(name) {
        delete _listeners[name];
        return _instance
    };
    Skrollr.prototype.destroy = function() {
        var cancelAnimFrame = polyfillCAF();
        cancelAnimFrame(_animFrame);
        _removeAllEvents();
        _updateClass(documentElement, [NO_SKROLLR_CLASS], [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS,
            SKROLLR_MOBILE_CLASS
        ]);
        var skrollableIndex = 0;
        for (var skrollablesLength = _skrollables.length; skrollableIndex < skrollablesLength; skrollableIndex++) _reset(_skrollables[skrollableIndex].element);
        documentElement.style.overflow = body.style.overflow = "";
        documentElement.style.height = body.style.height = "";
        if (_skrollrBody) skrollr.setStyle(_skrollrBody, "transform", "none");
        _instance = undefined;
        _skrollrBody = undefined;
        _listeners = undefined;
        _forceHeight = undefined;
        _maxKeyFrame = 0;
        _scale = 1;
        _constants = undefined;
        _mobileDeceleration =
            undefined;
        _direction = "down";
        _lastTop = -1;
        _lastViewportWidth = 0;
        _lastViewportHeight = 0;
        _requestReflow = false;
        _scrollAnimation = undefined;
        _smoothScrollingEnabled = undefined;
        _smoothScrollingDuration = undefined;
        _smoothScrolling = undefined;
        _forceRender = undefined;
        _skrollableIdCounter = 0;
        _edgeStrategy = undefined;
        _isMobile = false;
        _mobileOffset = 0;
        _translateZ = undefined
    };
    var _initMobile = function() {
        var initialElement;
        var initialTouchY;
        var initialTouchX;
        var currentElement;
        var currentTouchY;
        var currentTouchX;
        var lastTouchY;
        var deltaY;
        var initialTouchTime;
        var currentTouchTime;
        var lastTouchTime;
        var deltaTime;
        _addEvent(documentElement, [EVENT_TOUCHSTART, EVENT_TOUCHMOVE, EVENT_TOUCHCANCEL, EVENT_TOUCHEND].join(" "), function(e) {
            var touch = e.changedTouches[0];
            for (currentElement = e.target; currentElement.nodeType === 3;) currentElement = currentElement.parentNode;
            currentTouchY = touch.clientY;
            currentTouchX = touch.clientX;
            currentTouchTime = e.timeStamp;
            if (!rxTouchIgnoreTags.test(currentElement.tagName)) e.preventDefault();
            switch (e.type) {
                case EVENT_TOUCHSTART:
                    if (initialElement) initialElement.blur();
                    _instance.stopAnimateTo();
                    initialElement = currentElement;
                    initialTouchY = lastTouchY = currentTouchY;
                    initialTouchX = currentTouchX;
                    initialTouchTime = currentTouchTime;
                    break;
                case EVENT_TOUCHMOVE:
                    if (rxTouchIgnoreTags.test(currentElement.tagName) && document.activeElement !== currentElement) e.preventDefault();
                    deltaY = currentTouchY - lastTouchY;
                    deltaTime = currentTouchTime - lastTouchTime;
                    _instance.setScrollTop(_mobileOffset - deltaY, true);
                    lastTouchY = currentTouchY;
                    lastTouchTime = currentTouchTime;
                    break;
                default:
                case EVENT_TOUCHCANCEL:
                case EVENT_TOUCHEND:
                    var distanceY =
                        initialTouchY - currentTouchY;
                    var distanceX = initialTouchX - currentTouchX;
                    var distance2 = distanceX * distanceX + distanceY * distanceY;
                    if (distance2 < 49) {
                        if (!rxTouchIgnoreTags.test(initialElement.tagName)) {
                            initialElement.focus();
                            var clickEvent = document.createEvent("MouseEvents");
                            clickEvent.initMouseEvent("click", true, true, e.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                            initialElement.dispatchEvent(clickEvent)
                        }
                        return
                    }
                    initialElement = undefined;
                    var speed =
                        deltaY / deltaTime;
                    speed = Math.max(Math.min(speed, 3), -3);
                    var duration = Math.abs(speed / _mobileDeceleration);
                    var targetOffset = speed * duration + .5 * _mobileDeceleration * duration * duration;
                    var targetTop = _instance.getScrollTop() - targetOffset;
                    var targetRatio = 0;
                    if (targetTop > _maxKeyFrame) {
                        targetRatio = (_maxKeyFrame - targetTop) / targetOffset;
                        targetTop = _maxKeyFrame
                    } else if (targetTop < 0) {
                        targetRatio = -targetTop / targetOffset;
                        targetTop = 0
                    }
                    duration = duration * (1 - targetRatio);
                    _instance.animateTo(targetTop + .5 | 0, {
                        easing: "outCubic",
                        duration: duration
                    });
                    break
            }
        });
        window.scrollTo(0, 0);
        documentElement.style.overflow = body.style.overflow = "hidden"
    };
    var _updateDependentKeyFrames = function() {
        var viewportHeight = documentElement.clientHeight;
        var processedConstants = _processConstants();
        var skrollable;
        var element;
        var anchorTarget;
        var keyFrames;
        var keyFrameIndex;
        var keyFramesLength;
        var kf;
        var skrollableIndex;
        var skrollablesLength;
        var offset;
        var constantValue;
        skrollableIndex = 0;
        for (skrollablesLength = _skrollables.length; skrollableIndex < skrollablesLength; skrollableIndex++) {
            skrollable =
                _skrollables[skrollableIndex];
            element = skrollable.element;
            anchorTarget = skrollable.anchorTarget;
            keyFrames = skrollable.keyFrames;
            keyFrameIndex = 0;
            for (keyFramesLength = keyFrames.length; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
                kf = keyFrames[keyFrameIndex];
                offset = kf.offset;
                constantValue = processedConstants[kf.constant] || 0;
                kf.frame = offset;
                if (kf.isPercentage) {
                    offset = offset * viewportHeight;
                    kf.frame = offset
                }
                if (kf.mode === "relative") {
                    _reset(element);
                    kf.frame = _instance.relativeToAbsolute(anchorTarget, kf.anchors[0],
                        kf.anchors[1]) - offset;
                    _reset(element, true)
                }
                kf.frame += constantValue;
                if (_forceHeight)
                    if (!kf.isEnd && kf.frame > _maxKeyFrame) _maxKeyFrame = kf.frame
            }
        }
        _maxKeyFrame = Math.max(_maxKeyFrame, _getDocumentHeight());
        skrollableIndex = 0;
        for (skrollablesLength = _skrollables.length; skrollableIndex < skrollablesLength; skrollableIndex++) {
            skrollable = _skrollables[skrollableIndex];
            keyFrames = skrollable.keyFrames;
            keyFrameIndex = 0;
            for (keyFramesLength = keyFrames.length; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
                kf = keyFrames[keyFrameIndex];
                constantValue = processedConstants[kf.constant] || 0;
                if (kf.isEnd) kf.frame = _maxKeyFrame - kf.offset + constantValue
            }
            skrollable.keyFrames.sort(_keyFrameComparator)
        }
    };
    var _calcSteps = function(fakeFrame, actualFrame) {
        var skrollableIndex = 0;
        for (var skrollablesLength = _skrollables.length; skrollableIndex < skrollablesLength; skrollableIndex++) {
            var skrollable = _skrollables[skrollableIndex];
            var element = skrollable.element;
            var frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
            var frames = skrollable.keyFrames;
            var framesLength =
                frames.length;
            var firstFrame = frames[0];
            var lastFrame = frames[frames.length - 1];
            var beforeFirst = frame < firstFrame.frame;
            var afterLast = frame > lastFrame.frame;
            var firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
            var emitEvents = skrollable.emitEvents;
            var lastFrameIndex = skrollable.lastFrameIndex;
            var key;
            var value;
            if (beforeFirst || afterLast) {
                if (beforeFirst && skrollable.edge === -1 || afterLast && skrollable.edge === 1) continue;
                if (beforeFirst) {
                    _updateClass(element, [SKROLLABLE_BEFORE_CLASS], [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]);
                    if (emitEvents && lastFrameIndex > -1) {
                        _emitEvent(element, firstFrame.eventType, _direction);
                        skrollable.lastFrameIndex = -1
                    }
                } else {
                    _updateClass(element, [SKROLLABLE_AFTER_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]);
                    if (emitEvents && lastFrameIndex < framesLength) {
                        _emitEvent(element, lastFrame.eventType, _direction);
                        skrollable.lastFrameIndex = framesLength
                    }
                }
                skrollable.edge = beforeFirst ? -1 : 1;
                switch (skrollable.edgeStrategy) {
                    case "reset":
                        _reset(element);
                        continue;
                    case "ease":
                        frame = firstOrLastFrame.frame;
                        break;
                    default:
                    case "set":
                        var props = firstOrLastFrame.props;
                        for (key in props)
                            if (hasProp.call(props, key)) {
                                value = _interpolateString(props[key].value);
                                if (key.indexOf("@") === 0) element.setAttribute(key.substr(1), value);
                                else skrollr.setStyle(element, key, value)
                            }
                        continue
                }
            } else if (skrollable.edge !== 0) {
                _updateClass(element, [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]);
                skrollable.edge = 0
            }
            for (var keyFrameIndex = 0; keyFrameIndex < framesLength - 1; keyFrameIndex++)
                if (frame >= frames[keyFrameIndex].frame &&
                    frame <= frames[keyFrameIndex + 1].frame) {
                    var left = frames[keyFrameIndex];
                    var right = frames[keyFrameIndex + 1];
                    for (key in left.props)
                        if (hasProp.call(left.props, key)) {
                            var progress = (frame - left.frame) / (right.frame - left.frame);
                            progress = left.props[key].easing(progress);
                            value = _calcInterpolation(left.props[key].value, right.props[key].value, progress);
                            value = _interpolateString(value);
                            if (key.indexOf("@") === 0) element.setAttribute(key.substr(1), value);
                            else skrollr.setStyle(element, key, value)
                        }
                    if (emitEvents)
                        if (lastFrameIndex !==
                            keyFrameIndex) {
                            if (_direction === "down") _emitEvent(element, left.eventType, _direction);
                            else _emitEvent(element, right.eventType, _direction);
                            skrollable.lastFrameIndex = keyFrameIndex
                        }
                    break
                }
        }
    };
    var _render = function() {
        if (_requestReflow) {
            _requestReflow = false;
            _reflow()
        }
        var renderTop = _instance.getScrollTop();
        var afterAnimationCallback;
        var now = _now();
        var progress;
        if (_scrollAnimation) {
            if (now >= _scrollAnimation.endTime) {
                renderTop = _scrollAnimation.targetTop;
                afterAnimationCallback = _scrollAnimation.done;
                _scrollAnimation =
                    undefined
            } else {
                progress = _scrollAnimation.easing((now - _scrollAnimation.startTime) / _scrollAnimation.duration);
                renderTop = _scrollAnimation.startTop + progress * _scrollAnimation.topDiff | 0
            }
            _instance.setScrollTop(renderTop, true)
        } else if (!_forceRender) {
            var smoothScrollingDiff = _smoothScrolling.targetTop - renderTop;
            if (smoothScrollingDiff) _smoothScrolling = {
                startTop: _lastTop,
                topDiff: renderTop - _lastTop,
                targetTop: renderTop,
                startTime: _lastRenderCall,
                endTime: _lastRenderCall + _smoothScrollingDuration
            };
            if (now <= _smoothScrolling.endTime) {
                progress =
                    easings.sqrt((now - _smoothScrolling.startTime) / _smoothScrollingDuration);
                renderTop = _smoothScrolling.startTop + progress * _smoothScrolling.topDiff | 0
            }
        }
        if (_isMobile && _skrollrBody) skrollr.setStyle(_skrollrBody, "transform", "translate(0, " + -_mobileOffset + "px) " + _translateZ);
        if (_forceRender || _lastTop !== renderTop) {
            _direction = renderTop > _lastTop ? "down" : renderTop < _lastTop ? "up" : _direction;
            _forceRender = false;
            var listenerParams = {
                curTop: renderTop,
                lastTop: _lastTop,
                maxTop: _maxKeyFrame,
                direction: _direction
            };
            var continueRendering =
                _listeners.beforerender && _listeners.beforerender.call(_instance, listenerParams);
            if (continueRendering !== false) {
                _calcSteps(renderTop, _instance.getScrollTop());
                _lastTop = renderTop;
                if (_listeners.render) _listeners.render.call(_instance, listenerParams)
            }
            if (afterAnimationCallback) afterAnimationCallback.call(_instance, false)
        }
        _lastRenderCall = now
    };
    var _parseProps = function(skrollable) {
        var keyFrameIndex = 0;
        for (var keyFramesLength = skrollable.keyFrames.length; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
            var frame =
                skrollable.keyFrames[keyFrameIndex];
            var easing;
            var value;
            var prop;
            var props = {};
            for (var match;
                (match = rxPropValue.exec(frame.props)) !== null;) {
                prop = match[1];
                value = match[2];
                easing = prop.match(rxPropEasing);
                if (easing !== null) {
                    prop = easing[1];
                    easing = easing[2]
                } else easing = DEFAULT_EASING;
                value = value.indexOf("!") ? _parseProp(value) : [value.slice(1)];
                props[prop] = {
                    value: value,
                    easing: easings[easing]
                }
            }
            frame.props = props
        }
    };
    var _parseProp = function(val) {
        var numbers = [];
        rxRGBAIntegerColor.lastIndex = 0;
        val = val.replace(rxRGBAIntegerColor,
            function(rgba) {
                return rgba.replace(rxNumericValue, function(n) {
                    return n / 255 * 100 + "%"
                })
            });
        if (theDashedCSSPrefix) {
            rxGradient.lastIndex = 0;
            val = val.replace(rxGradient, function(s) {
                return theDashedCSSPrefix + s
            })
        }
        val = val.replace(rxNumericValue, function(n) {
            numbers.push(+n);
            return "{?}"
        });
        numbers.unshift(val);
        return numbers
    };
    var _fillProps = function(sk) {
        var propList = {};
        var keyFrameIndex;
        var keyFramesLength;
        keyFrameIndex = 0;
        for (keyFramesLength = sk.keyFrames.length; keyFrameIndex < keyFramesLength; keyFrameIndex++) _fillPropForFrame(sk.keyFrames[keyFrameIndex],
            propList);
        propList = {};
        for (keyFrameIndex = sk.keyFrames.length - 1; keyFrameIndex >= 0; keyFrameIndex--) _fillPropForFrame(sk.keyFrames[keyFrameIndex], propList)
    };
    var _fillPropForFrame = function(frame, propList) {
        for (var key in propList)
            if (!hasProp.call(frame.props, key)) frame.props[key] = propList[key];
        for (key in frame.props) propList[key] = frame.props[key]
    };
    var _calcInterpolation = function(val1, val2, progress) {
        var valueIndex;
        var val1Length = val1.length;
        if (val1Length !== val2.length) throw "Can't interpolate between \"" +
            val1[0] + '" and "' + val2[0] + '"';
        var interpolated = [val1[0]];
        for (valueIndex = 1; valueIndex < val1Length; valueIndex++) interpolated[valueIndex] = val1[valueIndex] + (val2[valueIndex] - val1[valueIndex]) * progress;
        return interpolated
    };
    var _interpolateString = function(val) {
        var valueIndex = 1;
        rxInterpolateString.lastIndex = 0;
        return val[0].replace(rxInterpolateString, function() {
            return val[valueIndex++]
        })
    };
    var _reset = function(elements, undo) {
        elements = [].concat(elements);
        var skrollable;
        var element;
        var elementsIndex = 0;
        for (var elementsLength =
                elements.length; elementsIndex < elementsLength; elementsIndex++) {
            element = elements[elementsIndex];
            skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];
            if (!skrollable) continue;
            if (undo) {
                element.style.cssText = skrollable.dirtyStyleAttr;
                _updateClass(element, skrollable.dirtyClassAttr)
            } else {
                skrollable.dirtyStyleAttr = element.style.cssText;
                skrollable.dirtyClassAttr = _getClass(element);
                element.style.cssText = skrollable.styleAttr;
                _updateClass(element, skrollable.classAttr)
            }
        }
    };
    var _detect3DTransforms = function() {
        _translateZ =
            "translateZ(0)";
        skrollr.setStyle(_skrollrBody, "transform", _translateZ);
        var computedStyle = getStyle(_skrollrBody);
        var computedTransform = computedStyle.getPropertyValue("transform");
        var computedTransformWithPrefix = computedStyle.getPropertyValue(theDashedCSSPrefix + "transform");
        var has3D = computedTransform && computedTransform !== "none" || computedTransformWithPrefix && computedTransformWithPrefix !== "none";
        if (!has3D) _translateZ = ""
    };
    skrollr.setStyle = function(el, prop, val) {
        var style = el.style;
        prop = prop.replace(rxCamelCase,
            rxCamelCaseFn).replace("-", "");
        if (prop === "zIndex")
            if (isNaN(val)) style[prop] = val;
            else style[prop] = "" + (val | 0);
        else if (prop === "float") style.styleFloat = style.cssFloat = val;
        else try {
            if (theCSSPrefix) style[theCSSPrefix + prop.slice(0, 1).toUpperCase() + prop.slice(1)] = val;
            style[prop] = val
        } catch (ignore) {}
    };
    var _addEvent = skrollr.addEvent = function(element, names, callback) {
        var intermediate = function(e) {
            e = e || window.event;
            if (!e.target) e.target = e.srcElement;
            if (!e.preventDefault) e.preventDefault = function() {
                e.returnValue =
                    false;
                e.defaultPrevented = true
            };
            return callback.call(this, e)
        };
        names = names.split(" ");
        var name;
        var nameCounter = 0;
        for (var namesLength = names.length; nameCounter < namesLength; nameCounter++) {
            name = names[nameCounter];
            if (element.addEventListener) element.addEventListener(name, callback, false);
            else element.attachEvent("on" + name, intermediate);
            _registeredEvents.push({
                element: element,
                name: name,
                listener: callback
            })
        }
    };
    var _removeEvent = skrollr.removeEvent = function(element, names, callback) {
        names = names.split(" ");
        var nameCounter =
            0;
        for (var namesLength = names.length; nameCounter < namesLength; nameCounter++)
            if (element.removeEventListener) element.removeEventListener(names[nameCounter], callback, false);
            else element.detachEvent("on" + names[nameCounter], callback)
    };
    var _removeAllEvents = function() {
        var eventData;
        var eventCounter = 0;
        for (var eventsLength = _registeredEvents.length; eventCounter < eventsLength; eventCounter++) {
            eventData = _registeredEvents[eventCounter];
            _removeEvent(eventData.element, eventData.name, eventData.listener)
        }
        _registeredEvents = []
    };
    var _emitEvent = function(element, name, direction) {
        if (_listeners.keyframe) _listeners.keyframe.call(_instance, element, name, direction)
    };
    var _reflow = function() {
        var pos = _instance.getScrollTop();
        _maxKeyFrame = 0;
        if (_forceHeight && !_isMobile) body.style.height = "";
        _updateDependentKeyFrames();
        if (_forceHeight && !_isMobile) body.style.height = _maxKeyFrame + documentElement.clientHeight + "px";
        if (_isMobile) _instance.setScrollTop(Math.min(_instance.getScrollTop(), _maxKeyFrame));
        else _instance.setScrollTop(pos, true);
        _forceRender =
            true
    };
    var _processConstants = function() {
        var viewportHeight = documentElement.clientHeight;
        var copy = {};
        var prop;
        var value;
        for (prop in _constants) {
            value = _constants[prop];
            if (typeof value === "function") value = value.call(_instance);
            else if (/p$/.test(value)) value = value.slice(0, -1) / 100 * viewportHeight;
            copy[prop] = value
        }
        return copy
    };
    var _getDocumentHeight = function() {
        var skrollrBodyHeight = _skrollrBody && _skrollrBody.offsetHeight || 0;
        var bodyHeight = Math.max(skrollrBodyHeight, body.scrollHeight, body.offsetHeight, documentElement.scrollHeight,
            documentElement.offsetHeight, documentElement.clientHeight);
        return bodyHeight - documentElement.clientHeight
    };
    var _getClass = function(element) {
        var prop = "className";
        if (window.SVGElement && element instanceof window.SVGElement) {
            element = element[prop];
            prop = "baseVal"
        }
        return element[prop]
    };
    var _updateClass = function(element, add, remove) {
        var prop = "className";
        if (window.SVGElement && element instanceof window.SVGElement) {
            element = element[prop];
            prop = "baseVal"
        }
        if (remove === undefined) {
            element[prop] = add;
            return
        }
        var val = element[prop];
        var classRemoveIndex = 0;
        for (var removeLength = remove.length; classRemoveIndex < removeLength; classRemoveIndex++) val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), " ");
        val = _trim(val);
        var classAddIndex = 0;
        for (var addLength = add.length; classAddIndex < addLength; classAddIndex++)
            if (_untrim(val).indexOf(_untrim(add[classAddIndex])) === -1) val += " " + add[classAddIndex];
        element[prop] = _trim(val)
    };
    var _trim = function(a) {
        return a.replace(rxTrim, "")
    };
    var _untrim = function(a) {
        return " " + a + " "
    };
    var _now = Date.now || function() {
        return +new Date
    };
    var _keyFrameComparator = function(a, b) {
        return a.frame - b.frame
    };
    var _instance;
    var _skrollables;
    var _skrollrBody;
    var _listeners;
    var _forceHeight;
    var _maxKeyFrame = 0;
    var _scale = 1;
    var _constants;
    var _mobileDeceleration;
    var _direction = "down";
    var _lastTop = -1;
    var _lastRenderCall = _now();
    var _lastViewportWidth = 0;
    var _lastViewportHeight = 0;
    var _requestReflow = false;
    var _scrollAnimation;
    var _smoothScrollingEnabled;
    var _smoothScrollingDuration;
    var _smoothScrolling;
    var _forceRender;
    var _skrollableIdCounter = 0;
    var _edgeStrategy;
    var _isMobile = false;
    var _mobileOffset = 0;
    var _translateZ;
    var _registeredEvents = [];
    var _animFrame;
    window.skrollr = skrollr
})(window, document);
(function($) {
    var animate = false;
    var animateScroll = false;
    var scrollEndTimeOut = null;
    var nativeScrolling = false;
    var lastScrollTop = null;
    var events = {};
    var mousewheel = false;
    var keypressed = false;
    window.Scrolling = function(options) {
        this.options = $.extend({
            bySpeed: false,
            duration: 1E3,
            pixelsPerDuration: 1E3,
            easing: "swing",
            minScrollByDuration: 10,
            minDurationBySpeed: 50
        }, options)
    };
    $(window).bind("mousewheel DOMMouseScroll", function(event) {
        mousewheel = true
    });
    $(window).on("keydown", function(e) {
        keypressed = e.keyCode
    });
    $(window).on("scroll resize orientationchange",
        function(e) {
            var _this = this;
            if (e.type == "scroll") {
                var scrollTop = Scrolling.getScrollTop();
                clearTimeout(scrollEndTimeOut);
                var direction = 0;
                if (lastScrollTop !== null) direction = lastScrollTop - scrollTop > 0 ? 1 : -1;
                if (!animateScroll) nativeScrolling = true;
                var nativeScrollingScrollEnd = nativeScrolling && mousewheel ? true : false;
                scrollEndTimeOut = setTimeout(function() {
                    if (events["scrollend"]) {
                        var nE = jQuery.Event("scrollend", {
                            direction: direction,
                            nat: nativeScrollingScrollEnd,
                            bykey: keypressed
                        });
                        $.each(events["scrollend"], function(i,
                            s) {
                            if (s && s.func) s.func.call(_this, nE)
                        })
                    }
                    lastScrollTop = Scrolling.getScrollTop();
                    mousewheel = false;
                    keypressed = false;
                    if (!animate) animateScroll = false;
                    nativeScrolling = false
                }, 350);
                if (!animate) animateScroll = false;
                lastScrollTop = scrollTop
            }
            if (events[e.type]) $.each(events[e.type], function(i, s) {
                if (s && s.func) s.func.call(_this, e)
            })
        });
    Scrolling.getScrollTop = function() {
        return $("html").scrollTop() || $("body").scrollTop() || $(window).scrollTop()
    };
    Scrolling.on = function(listEvents, func, opt) {
        $.each(listEvents.split(" "),
            function(i, event) {
                var options = $.extend({
                    weight: 0
                }, opt);
                event = $.trim(event);
                if (typeof events[event] == typeof undef) events[event] = [];
                if (typeof func == typeof
                    function() {}) events[event].push({
                    func: func,
                    opt: options
                });
                events[event].sort(function(a, b) {
                    if (a.opt.weight == b.opt.weight) return 0;
                    else if (a.opt.weight > b.opt.weight) return 1;
                    else return -1
                })
            })
    };
    Scrolling.off = function(listEvents, func) {
        var remove = false;
        $.each(listEvents.split(" "), function(i$$0, event) {
            event = $.trim(event);
            if (typeof events[event] == typeof undef) return false;
            $.each(events[event], function(i, s) {
                if (s.func === func) {
                    events[event].splice(i, 1);
                    remove = true;
                    return false
                }
            })
        });
        return remove
    };
    Scrolling.isScrolling = function() {
        return animate || nativeScrolling
    };
    Scrolling.isAnimated = function() {
        return animate
    };
    Scrolling.getViewerSize = function() {
        return {
            w: $(window).width(),
            h: $(window).height()
        }
    };
    Scrolling.prototype.on = function(listEvents, func, opt) {
        Scrolling.on(listEvents, func, opt)
    };
    Scrolling.prototype.off = function(listEvents, func) {
        return Scrolling.off(listEvents, func)
    };
    Scrolling.prototype.isScrolling =
        function() {
            return Scrolling.isScrolling()
        };
    Scrolling.prototype.isAnimated = function() {
        return Scrolling.isAnimated()
    };
    Scrolling.prototype.getScrollTop = function() {
        return Scrolling.getScrollTop()
    };
    Scrolling.prototype.animateTo = function(top, options, complete) {
        if (navigator.userAgent.match(/nokia/i)) {
            this.scrollTo(top, options, complete);
            return
        }
        options = $.extend({}, this.options, options);
        $("html, body").stop(true, false);
        animate = true;
        animateScroll = true;
        var duration = options.duration;
        var bySpeed = options.bySpeed;
        if (Math.abs(this.getScrollTop() - top) < options.minScrollByDuration) bySpeed = true;
        if (bySpeed) duration = Math.max(Math.round(Math.abs(this.getScrollTop() - top) / (options.pixelsPerDuration / options.duration)), options.minDurationBySpeed);
        var onlyOneAnimate = true;
        $("html, body").animate({
            scrollTop: top
        }, {
            queue: false,
            easing: this.options.easing,
            duration: duration,
            complete: function() {
                if (onlyOneAnimate) {
                    onlyOneAnimate = false;
                    animate = false;
                    if (typeof complete == typeof
                        function() {}) complete()
                }
            }
        })
    };
    Scrolling.prototype.scrollTo =
        function(top, options, complete) {
            $("html, body").stop(true, false);
            $("html, body").scrollTop(top);
            animate = false;
            if (typeof complete == typeof
                function() {}) complete()
        };
    Scrolling.prototype.scrollToElem = function(elem, options, complete) {
        if (elem.length) {
            this.scrollTo(elem.offset().top, options, complete);
            return true
        }
        return false
    };
    Scrolling.prototype.animateToElem = function(elem, options, complete) {
        if (elem.length) {
            this.animateTo(elem.offset().top, options, complete);
            return true
        }
        return false
    };
    Scrolling.prototype.getViewerSize =
        function() {
            return Scrolling.getViewerSize()
        };
    lastScrollTop = Scrolling.getScrollTop()
})(jQuery);
(function($) {
    var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        callback()
    };
    window.Navigation = function(links, options) {
        this.options = $.extend({
                anchorGroup: ".nav-group",
                locationReplace: false,
                locationReversReplace: false,
                activeClass: "active",
                attrLockMouseWheel: "data-nav-lock-mousewheel",
                attrNavBox: "data-nav-box",
                slideGroup: ".slide-group",
                onScrollComplete: null
            },
            options);
        this._mouseWheel = /firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
        this.links = links.filter("a");
        this.scrolling = new Scrolling(options)
    };
    Navigation.prototype._determineDependentNodesByHash = function() {
        var _this = this;
        var match = this.getMatchDependentNodeByHash();
        var activeClass = this.options.activeClass;
        _this.links.removeClass(activeClass);
        var anchorGroup = match.link.closest(_this.options.anchorGroup);
        if (_this.currGroupActiveClass) anchorGroup.removeClass(_this.currGroupActiveClass);
        _this.currGroupActiveClass = null;
        if (this._isBoxVisibleInWindow(match.box)) {
            if (match.link.attr("class")) {
                anchorGroup.addClass(match.link.attr("class"));
                _this.currGroupActiveClass = match.link.attr("class")
            }
            match.link.addClass(activeClass);
            $.each(this.links, function() {
                var box = $(this.hash);
                if (box.attr(_this.options.attrNavBox)) box = box.closest(box.attr(_this.options.attrNavBox));
                box.removeClass(activeClass)
            });
            match.box.addClass(activeClass);
            if (this.options.locationReplace && this.options.locationReversReplace &&
                history.replaceState) history.replaceState(null, null, match.link.get(0).hash)
        } else if (this.options.locationReplace && this.options.locationReversReplace && history.replaceState) history.replaceState(null, null, location.href.split("#")[0])
    };
    Navigation.prototype._isBoxVisibleInWindow = function(box) {
        var scrollTop = this.scrolling.getScrollTop();
        if (scrollTop + this.scrolling.getViewerSize().h > box.offset().top && scrollTop < box.offset().top + box.height()) return true;
        return false
    };
    Navigation.prototype._scrollingByLink =
        function(l, options) {
            var _this = this;
            var hash = l.get(0).hash;
            var goTo = $(l.get(0).hash);
            var box = goTo;
            if (box.attr(_this.options.attrNavBox)) box = box.closest(box.attr(_this.options.attrNavBox));
            _this.currentMatch = {
                link: l,
                box: box
            };
            return _this.scrolling.animateToElem(goTo, options, function() {
                if (_this.options.locationReplace)
                    if (history.replaceState) history.replaceState(null, null, hash);
                    else location.hash = hash.replace("#", "");
                if (_this.options.onScrollComplete && typeof _this.options.onScrollComplete == typeof
                    function() {}) _this.options.onScrollComplete({
                    link: l,
                    box: box
                })
            })
        };
    Navigation.prototype.getMatchDependentNodeByHash = function() {
        var _this = this;
        var m = {
            h: null,
            link: null
        };
        _this.links.each(function() {
            var $this = $(this);
            var box = $(this.hash);
            if (box.attr(_this.options.attrNavBox)) box = box.closest(box.attr(_this.options.attrNavBox));
            if (box.length && box.is(":visible")) {
                var h = 0;
                var hT = box.offset().top - _this.scrolling.getScrollTop();
                if (hT <= 0) {
                    h = box.height() + hT;
                    if (h > _this.scrolling.getViewerSize().h) h = _this.scrolling.getViewerSize().h
                } else {
                    h = _this.scrolling.getViewerSize().h -
                        hT;
                    if (h > box.height()) h = box.height()
                }
                h = h / box.height();
                if (m.h === null || h > m.h) {
                    m.h = h;
                    m.box = box;
                    m.link = $this
                }
            }
        });
        return {
            link: m.link,
            box: m.box
        }
    };
    Navigation.prototype.activateNavToHash = function() {
        var _this = this;
        if (!_this._navToHashFN) {
            this._navToHashFN = function() {
                return !_this._scrollingByLink($(this))
            };
            this.links.each(function() {
                $(this).on("click", _this._navToHashFN)
            })
        }
        return _this
    };
    Navigation.prototype.activateDependentNodesByHash = function() {
        var _this = this;
        if (!_this._nodesByHashFN) {
            _this._determineDependentNodesByHash();
            _this._nodesByHashFN = function() {
                requestFrame(function() {
                    _this._determineDependentNodesByHash()
                })
            };
            this.scrolling.on("scroll resize", _this._nodesByHashFN)
        }
        return _this
    };
    Navigation.prototype.destroy = function() {
        var _this = this;
        if (this._nodesByHashFN) {
            this.scrolling.off("scroll resize", this._nodesByHashFN);
            this._nodesByHashFN = null
        }
        if (this._navToHashFN) {
            this.links.each(function() {
                $(this).off("click", _this._navToHashFN)
            });
            this._navToHashFN = null
        }
        return _this
    };
    $.fn.navigation = function(settings) {
        var navigation;
        this.each(function(index, element) {
            if (element.navigation) {
                navigation = element.navigation;
                return false
            }
        });
        if (!navigation) {
            navigation = new Navigation($(this), settings);
            this.each(function(index, element) {
                element.navigation = navigation
            })
        }
        if (settings && typeof settings == typeof {}) {
            var returnFN = false;
            var returnValue;
            $.each(settings, function(name, val) {
                if ((name.indexOf("set") == 0 || name.indexOf("get") == 0 || name.indexOf("activate") == 0) && navigation[name] && typeof navigation[name] == typeof
                    function() {}) {
                    returnValue = navigation[name](val);
                    returnFN = true;
                    return false
                }
            });
            if (returnFN) return returnValue
        }
        return this
    };
    $.fn.navigationDestroy = function() {
        var navigation;
        this.each(function(index, element) {
            if (element.navigation) {
                if (!navigation) navigation = element.navigation;
                delete element.navigation
            }
        });
        if (navigation) {
            navigation.destroy();
            navigation = null
        }
        return this
    }
})(jQuery);
(function($) {
    var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        callback()
    };
    var slideID = 0;
    window.Sliding = function(slides, options) {
        var _this = this;
        this.options = $.extend({
            attrLockMouseWheel: "data-nav-lock-mousewheel",
            slideGroup: ".slide-group",
            attrNavClass: "data-nav-class",
            attrNavBox: "data-nav-box",
            navGroupClass: "nav-group mobile-hide",
            useSnap: false,
            useReach: true,
            onSlideMatch: null,
            onSlidesInit: null
        }, options);
        this._mouseWheel = /firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
        this._eventListAutomaticNav = _this._mouseWheel + " " + "keydown";
        this.group = null;
        this.slides = [];
        this.lastLink = null;
        this.listeners = {
            fullOnWindow: null,
            controlNavGroup: null,
            nav: null
        };
        slides.each(function() {
            var slide = $(this);
            var groupElem = slide.closest(_this.options.slideGroup);
            if (!groupElem.length) return;
            if (_this.group === null) {
                _this.group = groupElem;
                _this.ul = $("\x3cul /\x3e")
            }
            if (groupElem.get(0) !==
                _this.group.get(0)) return;
            var id = slide.attr("id");
            if (!id) {
                ++slideID;
                id = "slide-" + slideID
            }
            var li = $('\x3cli\x3e\x3ca href\x3d"#' + id + '"\x3e\x3cspan\x3e' + id + "\x3c/span\x3e\x3c/a\x3e\x3c/li\x3e");
            if (slide.attr(_this.options.attrNavClass)) li.find("a").addClass(slide.attr(_this.options.attrNavClass));
            _this.ul.append(li);
            slide.attr("id", id);
            var slideBox = slide;
            if (slide.attr(_this.options.attrNavBox)) slideBox = slide.closest(slide.attr(_this.options.attrNavBox));
            _this.slides.push(slideBox.get(0))
        });
        this.slides =
            $(this.slides);
        this.nav = $("\x3cnav /\x3e");
        this.nav.addClass(_this.options.navGroupClass);
        this.nav.append(this.ul);
        this.group.append(this.nav);
        this.links = this.nav.find("a");
        this.navigation = new Navigation(this.links, $.extend({}, _this.options, {
            onScrollComplete: function(match) {
                _this.onSlideMatch(match)
            }
        }));
        this.activate()
    };
    Sliding.prototype.activate = function() {
        var _this = this;
        this.onSlidesInit(this.slides);
        this.navigation.activateNavToHash();
        this.navigation.activateDependentNodesByHash();
        if (!this.listeners.fullOnWindow) {
            this.listeners.fullOnWindow =
                function() {
                    if (_this._isBoxVisibleInFullScreen(_this.group)) _this.group.addClass("full-on-window");
                    else _this.group.removeClass("full-on-window")
                };
            this.listeners.fullOnWindow();
            Scrolling.on("scroll resize", this.listeners.fullOnWindow)
        }
        if (!this.listeners.controlNavGroup) {
            this.listeners.controlNavGroup = function() {
                var scrollTop = Scrolling.getScrollTop();
                if (_this.group.offset().top <= scrollTop && _this.group.offset().top + _this.group.height() >= scrollTop + Scrolling.getViewerSize().h * .9) _this.nav.removeClass("outside");
                else _this.nav.addClass("outside")
            };
            this.listeners.controlNavGroup();
            Scrolling.on("scroll resize", this.listeners.controlNavGroup)
        }
        if (!this.listeners.nav) {
            this.listeners.nav = function(e) {
                return _this._onNav(e)
            };
            if (this.options.useSnap) $(window).on(_this._eventListAutomaticNav, this.listeners.nav);
            if (this.options.useReach) Scrolling.on("scrollend", this.listeners.nav)
        }
        return _this
    };
    Sliding.prototype.onSlideMatch = function(match) {
        this.lastLink = match.link;
        if (typeof this.options.onSlideMatch == typeof
            function() {}) this.options.onSlideMatch(match)
    };
    Sliding.prototype.onSlidesInit = function(slides) {
        if (typeof this.options.onSlidesInit == typeof
            function() {}) this.options.onSlidesInit(slides)
    };
    Sliding.prototype._isBoxVisibleInFullScreen = function(box) {
        var scrollTop = Scrolling.getScrollTop();
        if (box.offset().top <= scrollTop && box.offset().top + box.outerHeight() > scrollTop + Scrolling.getViewerSize().h) return true;
        return false
    };
    Sliding.prototype._isBoxVisibleInWindow = function(box) {
        var scrollTop = Scrolling.getScrollTop();
        if (scrollTop >= box.offset().top && scrollTop +
            Scrolling.getViewerSize().h <= box.offset().top + box.height()) return true;
        return false
    };
    Sliding.prototype._onNav = function(e) {
        var _this = this;
        var match = this.navigation.getMatchDependentNodeByHash();
        var scrollTop = Scrolling.getScrollTop();
        var returnFN = function() {
            if (Scrolling.isAnimated()) {
                e.stopPropagation();
                e.preventDefault();
                return false
            } else return true
        };
        if (this._isBoxVisibleInWindow(_this.group)) {
            if (e.type == "scrollend" && !e.bykey) return returnFN();
            if (match.box.attr(_this.options.attrLockMouseWheel) &&
                match.box.attr(_this.options.attrLockMouseWheel).toLowerCase() == "true") return returnFN();
            var index = null;
            _this.links.each(function(i) {
                if ($(this).get(0).hash === match.link.get(0).hash) {
                    index = i;
                    return false
                }
            });
            var direction = 0;
            var e_type = e.bykey ? "keydown" : e.type;
            switch (e_type) {
                case "scrollend":
                    direction = e.direction;
                    break;
                case _this._mouseWheel:
                    direction = Math.max(-1, Math.min(1, e.originalEvent.wheelDelta || -e.originalEvent.detail));
                    break;
                case "keydown":
                    if (e.bykey == 40) direction = -1;
                    else if (e.bykey == 38) direction =
                        1;
                    else return returnFN();
                    break
            }
            var optionsScroll = {
                bySpeed: true,
                pixelsPerDuration: 800
            };
            if (!Scrolling.isAnimated() && direction != 0)
                if (direction > 0) {
                    if (_this.links[index - 1]) {
                        _this.navigation._scrollingByLink($(_this.links[index - 1]), optionsScroll);
                        _this.lastLink = $(_this.links[index - 1])
                    }
                } else if (_this.links[index + 1]) {
                _this.navigation._scrollingByLink($(_this.links[index + 1]), optionsScroll);
                _this.lastLink = $(_this.links[index + 1])
            }
            return returnFN()
        } else _this.lastLink = null
    };
    Sliding.prototype.clear = function() {
        var _this =
            this;
        if (this.options.useSnap) $(window).off(_this._eventListAutomaticNav, this.listeners.nav);
        if (this.options.useReach) Scrolling.off("scrollend", this.listeners.nav);
        this.listeners.nav = null;
        Scrolling.off("scroll resize", this.listeners.fullOnWindow);
        this.listeners.fullOnWindow = null;
        Scrolling.off("scroll resize", this.listeners.controlNavGroup);
        this.listeners.controlNavGroup = null;
        this.navigation.destroy();
        return _this
    }
})(jQuery);
(function($) {
    var PopUp = function(e, options) {
        this.options = $.extend({
            onclose: null
        }, options);
        this.e = e;
        this._init();
        this.timerClose = null
    };
    PopUp.all = {};
    PopUp.prototype._init = function() {
        var _this = this;
        this.e.addClass("popup");
        this.overlay = $('\x3cdiv class\x3d"popup-overlay" /\x3e');
        this.e.prepend(this.overlay);
        var close = $('\x3ca href\x3d"javascript:void(0)" class\x3d"close"\x3e\x3cspan\x3eClose PopUp\x3c/span\x3e\x3c/a\x3e');
        this.e.prepend(close);
        $(window).on("resize orientationchange", $.proxy(this.align,
            this));
        close.on("click", $.proxy(this.down, this));
        this.overlay.on("click", function() {
            _this.down()
        })
    };
    PopUp.prototype.down = function() {
        var _this = this;
        if (typeof this.options.onclose == typeof
            function() {}) this.options.onclose();
        this.e.removeClass("active");
        this.e.addClass("close");
        clearTimeout(this.timerClose);
        this.timerClose = setTimeout(function() {
            _this.e.removeClass("close")
        }, 400)
    };
    PopUp.prototype.align = function() {
        var _this = this;
        this.e.css({
            "margin-left": -(this.e.outerWidth() / 2) + "px",
            "margin-top": -(this.e.outerHeight() /
                2) + "px"
        })
    };
    PopUp.prototype.isActive = function() {
        return this.e.hasClass("active")
    };
    PopUp.prototype.up = function() {
        clearTimeout(this.timerClose);
        this.e.removeClass("close");
        var _this = this;
        $.each(PopUp.all, function(id, p) {
            if (id != _this.e.attr("id")) p.down()
        });
        this.align();
        this.e.addClass("active");
        this.align()
    };
    $.fn.popUp = function(settings) {
        var popUps = [];
        this.each(function() {
            var e = $(this);
            var id = e.attr("id");
            if (!id) return;
            if (!PopUp.all[id]) {
                PopUp.all[id] = new PopUp(e, settings);
                e.data("popUp", PopUp.all[id])
            }
            popUps.push(PopUp.all[id]);
            PopUp.all[id].up()
        });
        if (typeof settings == typeof {} && settings.getInstance) return popUps;
        popUps = null;
        return this
    }
})(jQuery);
(function($) {
    var rxCamelCase = /-([a-z0-9_])/g;
    var rxCamelCaseFn = function(str, letter) {
        return letter.toUpperCase()
    };
    var CSSPrefix = "";
    var dashedCSSPrefix = "";
    var getComputedStyle = window.getComputedStyle;
    (function() {
        var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
        if (!getComputedStyle) return;
        var style = getComputedStyle(document.body, null);
        for (var k in style) {
            CSSPrefix = k.match(rxPrefixes) || +k == k && style[k].match(rxPrefixes);
            if (CSSPrefix) break
        }
        if (!CSSPrefix) {
            CSSPrefix = dashedCSSPrefix = "";
            return
        }
        CSSPrefix =
            CSSPrefix[0];
        if (CSSPrefix.slice(0, 1) === "-") {
            dashedCSSPrefix = CSSPrefix;
            CSSPrefix = {
                "-webkit-": "webkit",
                "-moz-": "Moz",
                "-ms-": "ms",
                "-o-": "O"
            }[CSSPrefix]
        } else dashedCSSPrefix = "-" + CSSPrefix.toLowerCase() + "-"
    })();
    window.Animator = function(settings) {
        var _this = this;
        _this.options = $.extend({
            animAttrDelay: "data-animate-delay",
            animAttrDuration: "data-animate-duration",
            animAttrName: "data-animate-name",
            animClassNameInit: "animate-init",
            animClassNameDo: "animate-do",
            animClassNameEnd: "animate-end"
        }, settings)
    };
    Animator.prototype._getAnimateElements =
        function(elems) {
            var _this = this;
            var templateSearch = "[" + _this.options.animAttrName + "]";
            return $(elems).filter(templateSearch).add($(elems).find(templateSearch))
        };
    Animator.prototype._setStyle = function(el, prop, val) {
        var style = el.style;
        prop = prop.replace(rxCamelCase, rxCamelCaseFn).replace("-", "");
        if (prop === "zIndex")
            if (isNaN(val)) style[prop] = val;
            else style[prop] = "" + (val | 0);
        else if (prop === "float") style.styleFloat = style.cssFloat = val;
        else try {
            if (CSSPrefix) style[CSSPrefix + prop.slice(0, 1).toUpperCase() + prop.slice(1)] =
                val;
            style[prop] = val
        } catch (ignore) {}
    };
    Animator.prototype._init = function(elem) {
        var _this = this;
        if (elem.hasClass(_this.options.animClassNameInit)) return;
        if (elem.attr(_this.options.animAttrDuration)) _this._setStyle(elem.get(0), "animation-duration", elem.attr(_this.options.animAttrDuration));
        if (elem.attr(_this.options.animAttrDelay)) _this._setStyle(elem.get(0), "animation-delay", elem.attr(_this.options.animAttrDelay));
        elem.addClass(_this.options.animClassNameInit)
    };
    Animator.prototype._clear = function(elem) {
        var _this =
            this;
        var animName = elem.attr(_this.options.animAttrName);
        if (animName) elem.removeClass(animName).removeClass(_this.options.animClassNameDo).removeClass(_this.options.animClassNameEnd)
    };
    Animator.prototype._destroy = function(elem) {
        var _this = this;
        _this._clear(elem);
        elem.removeClass(_this.options.animClassNameInit)
    };
    Animator.prototype.init = function(elems) {
        var _this = this;
        _this._getAnimateElements(elems).each(function() {
            _this._init($(this))
        })
    };
    Animator.prototype.start = function(elems) {
        var _this = this;
        _this._getAnimateElements(elems).each(function() {
            _this._init($(this));
            var animName = $(this).attr(_this.options.animAttrName);
            if (animName) {
                _this._clear($(this));
                $(this).addClass(animName).addClass(_this.options.animClassNameDo);
                $(this).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    $(this).removeClass(animName).removeClass(_this.options.animClassNameDo).addClass(_this.options.animClassNameEnd)
                })
            }
        })
    };
    Animator.prototype.clear = function(elems) {
        var _this = this;
        _this._getAnimateElements(elems).each(function() {
            _this._clear($(this))
        })
    };
    Animator.prototype.destroy = function(elems) {
        var _this = this;
        _this._getAnimateElements(elems).each(function() {
            _this._destroy($(this))
        })
    }
})(jQuery);
var mejs = mejs || {};
mejs.version = "2.15.1";
mejs.meIndex = 0;
mejs.plugins = {
    silverlight: [{
        version: [3, 0],
        types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
    }],
    flash: [{
        version: [9, 0, 124],
        types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mpeg", "video/youtube", "video/x-youtube", "application/x-mpegURL"]
    }],
    youtube: [{
        version: null,
        types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]
    }],
    vimeo: [{
        version: null,
        types: ["video/vimeo", "video/x-vimeo"]
    }]
};
mejs.Utility = {
    encodeUrl: function(url) {
        return encodeURIComponent(url)
    },
    escapeHTML: function(s) {
        return s.toString().split("\x26").join("\x26amp;").split("\x3c").join("\x26lt;").split('"').join("\x26quot;")
    },
    absolutizeUrl: function(url) {
        var el = document.createElement("div");
        el.innerHTML = '\x3ca href\x3d"' + this.escapeHTML(url) + '"\x3ex\x3c/a\x3e';
        return el.firstChild.href
    },
    getScriptPath: function(scriptNames) {
        var i = 0;
        var j;
        var codePath = "";
        var testname = "";
        var slashPos;
        var filenamePos;
        var scriptUrl;
        var scriptPath;
        var scriptFilename;
        var scripts = document.getElementsByTagName("script");
        var il = scripts.length;
        for (var jl = scriptNames.length; i < il; i++) {
            scriptUrl = scripts[i].src;
            slashPos = scriptUrl.lastIndexOf("/");
            if (slashPos > -1) {
                scriptFilename = scriptUrl.substring(slashPos + 1);
                scriptPath = scriptUrl.substring(0, slashPos + 1)
            } else {
                scriptFilename = scriptUrl;
                scriptPath = ""
            }
            for (j = 0; j < jl; j++) {
                testname = scriptNames[j];
                filenamePos = scriptFilename.indexOf(testname);
                if (filenamePos > -1) {
                    codePath = scriptPath;
                    break
                }
            }
            if (codePath !== "") break
        }
        return codePath
    },
    secondsToTimeCode: function(time, forceHours, showFrameCount, fps) {
        if (typeof showFrameCount == "undefined") showFrameCount = false;
        else if (typeof fps == "undefined") fps = 25;
        var hours = Math.floor(time / 3600) % 24;
        var minutes = Math.floor(time / 60) % 60;
        var seconds = Math.floor(time % 60);
        var frames = Math.floor((time % 1 * fps).toFixed(3));
        var result = (forceHours || hours > 0 ? (hours < 10 ? "0" + hours : hours) + ":" : "") + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + (showFrameCount ? ":" + (frames < 10 ? "0" + frames : frames) : "");
        return result
    },
    timeCodeToSeconds: function(hh_mm_ss_ff, forceHours, showFrameCount, fps) {
        if (typeof showFrameCount == "undefined") showFrameCount = false;
        else if (typeof fps == "undefined") fps = 25;
        var tc_array = hh_mm_ss_ff.split(":");
        var tc_hh = parseInt(tc_array[0], 10);
        var tc_mm = parseInt(tc_array[1], 10);
        var tc_ss = parseInt(tc_array[2], 10);
        var tc_ff = 0;
        var tc_in_seconds = 0;
        if (showFrameCount) tc_ff = parseInt(tc_array[3]) / fps;
        tc_in_seconds = tc_hh * 3600 + tc_mm * 60 + tc_ss + tc_ff;
        return tc_in_seconds
    },
    convertSMPTEtoSeconds: function(SMPTE) {
        if (typeof SMPTE !=
            "string") return false;
        SMPTE = SMPTE.replace(",", ".");
        var secs = 0;
        var decimalLen = SMPTE.indexOf(".") != -1 ? SMPTE.split(".")[1].length : 0;
        var multiplier = 1;
        SMPTE = SMPTE.split(":").reverse();
        for (var i = 0; i < SMPTE.length; i++) {
            multiplier = 1;
            if (i > 0) multiplier = Math.pow(60, i);
            secs += Number(SMPTE[i]) * multiplier
        }
        return Number(secs.toFixed(decimalLen))
    },
    removeSwf: function(id) {
        var obj = document.getElementById(id);
        if (obj && /object|embed/i.test(obj.nodeName))
            if (mejs.MediaFeatures.isIE) {
                obj.style.display = "none";
                (function() {
                    if (obj.readyState ==
                        4) mejs.Utility.removeObjectInIE(id);
                    else setTimeout(arguments.callee, 10)
                })()
            } else obj.parentNode.removeChild(obj)
    },
    removeObjectInIE: function(id) {
        var obj = document.getElementById(id);
        if (obj) {
            for (var i in obj)
                if (typeof obj[i] == "function") obj[i] = null;
            obj.parentNode.removeChild(obj)
        }
    }
};
mejs.PluginDetector = {
    hasPluginVersion: function(plugin, v) {
        var pv = this.plugins[plugin];
        v[1] = v[1] || 0;
        v[2] = v[2] || 0;
        return pv[0] > v[0] || pv[0] == v[0] && pv[1] > v[1] || pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2] ? true : false
    },
    nav: window.navigator,
    ua: window.navigator.userAgent.toLowerCase(),
    plugins: [],
    addPlugin: function(p, pluginName, mimeType, activeX, axDetect) {
        this.plugins[p] = this.detectPlugin(pluginName, mimeType, activeX, axDetect)
    },
    detectPlugin: function(pluginName, mimeType, activeX, axDetect) {
        var version = [0, 0, 0];
        var description;
        var i;
        var ax;
        if (typeof this.nav.plugins != "undefined" && typeof this.nav.plugins[pluginName] == "object") {
            description = this.nav.plugins[pluginName].description;
            if (description && !(typeof this.nav.mimeTypes != "undefined" && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
                version = description.replace(pluginName, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split(".");
                for (i = 0; i < version.length; i++) version[i] = parseInt(version[i].match(/\d+/), 10)
            }
        } else if (typeof window.ActiveXObject != "undefined") try {
            ax =
                new ActiveXObject(activeX);
            if (ax) version = axDetect(ax)
        } catch (e) {}
        return version
    }
};
mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function(ax) {
    var version = [];
    var d = ax.GetVariable("$version");
    if (d) {
        d = d.split(" ")[1].split(",");
        version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)]
    }
    return version
});
mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function(ax$$0) {
    var v$$0 = [0, 0, 0, 0];
    var loopMatch = function(ax, v, i, n) {
        for (; ax.isVersionSupported(v[0] + "." + v[1] + "." + v[2] + "." + v[3]);) v[i] += n;
        v[i] -= n
    };
    loopMatch(ax$$0, v$$0, 0, 1);
    loopMatch(ax$$0, v$$0, 1, 1);
    loopMatch(ax$$0, v$$0, 2, 1E4);
    loopMatch(ax$$0, v$$0, 2, 1E3);
    loopMatch(ax$$0, v$$0, 2, 100);
    loopMatch(ax$$0, v$$0, 2, 10);
    loopMatch(ax$$0, v$$0, 2, 1);
    loopMatch(ax$$0, v$$0, 3, 1);
    return v$$0
});
mejs.MediaFeatures = {
    init: function() {
        var t = this;
        var d = document;
        var nav = mejs.PluginDetector.nav;
        var ua = mejs.PluginDetector.ua.toLowerCase();
        var i;
        var v;
        var html5Elements = ["source", "track", "audio", "video"];
        t.isiPad = ua.match(/ipad/i) !== null;
        t.isiPhone = ua.match(/iphone/i) !== null;
        t.isiOS = t.isiPhone || t.isiPad;
        t.isAndroid = ua.match(/android/i) !== null;
        t.isBustedAndroid = ua.match(/android 2\.[12]/) !== null;
        t.isBustedNativeHTTPS = location.protocol === "https:" && (ua.match(/android [12]\./) !== null || ua.match(/macintosh.* version.* safari/) !==
            null);
        t.isIE = nav.appName.toLowerCase().indexOf("microsoft") != -1 || nav.appName.toLowerCase().match(/trident/gi) !== null;
        t.isChrome = ua.match(/chrome/gi) !== null;
        t.isChromium = ua.match(/chromium/gi) !== null;
        t.isFirefox = ua.match(/firefox/gi) !== null;
        t.isWebkit = ua.match(/webkit/gi) !== null;
        t.isGecko = ua.match(/gecko/gi) !== null && !t.isWebkit && !t.isIE;
        t.isOpera = ua.match(/opera/gi) !== null;
        t.hasTouch = "ontouchstart" in window;
        t.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
        for (i = 0; i < html5Elements.length; i++) v = document.createElement(html5Elements[i]);
        t.supportsMediaTag = typeof v.canPlayType !== "undefined" || t.isBustedAndroid;
        try {
            v.canPlayType("video/mp4")
        } catch (e) {
            t.supportsMediaTag = false
        }
        t.hasSemiNativeFullScreen = typeof v.webkitEnterFullscreen !== "undefined";
        t.hasNativeFullscreen = typeof v.requestFullscreen !== "undefined";
        t.hasWebkitNativeFullScreen = typeof v.webkitRequestFullScreen !== "undefined";
        t.hasMozNativeFullScreen = typeof v.mozRequestFullScreen !== "undefined";
        t.hasMsNativeFullScreen =
            typeof v.msRequestFullscreen !== "undefined";
        t.hasTrueNativeFullScreen = t.hasWebkitNativeFullScreen || t.hasMozNativeFullScreen || t.hasMsNativeFullScreen;
        t.nativeFullScreenEnabled = t.hasTrueNativeFullScreen;
        if (t.hasMozNativeFullScreen) t.nativeFullScreenEnabled = document.mozFullScreenEnabled;
        else if (t.hasMsNativeFullScreen) t.nativeFullScreenEnabled = document.msFullscreenEnabled;
        if (t.isChrome) t.hasSemiNativeFullScreen = false;
        if (t.hasTrueNativeFullScreen) {
            t.fullScreenEventName = "";
            if (t.hasWebkitNativeFullScreen) t.fullScreenEventName =
                "webkitfullscreenchange";
            else if (t.hasMozNativeFullScreen) t.fullScreenEventName = "mozfullscreenchange";
            else if (t.hasMsNativeFullScreen) t.fullScreenEventName = "MSFullscreenChange";
            t.isFullScreen = function() {
                if (t.hasMozNativeFullScreen) return d.mozFullScreen;
                else if (t.hasWebkitNativeFullScreen) return d.webkitIsFullScreen;
                else if (t.hasMsNativeFullScreen) return d.msFullscreenElement !== null
            };
            t.requestFullScreen = function(el) {
                if (t.hasWebkitNativeFullScreen) el.webkitRequestFullScreen();
                else if (t.hasMozNativeFullScreen) el.mozRequestFullScreen();
                else if (t.hasMsNativeFullScreen) el.msRequestFullscreen()
            };
            t.cancelFullScreen = function() {
                if (t.hasWebkitNativeFullScreen) document.webkitCancelFullScreen();
                else if (t.hasMozNativeFullScreen) document.mozCancelFullScreen();
                else if (t.hasMsNativeFullScreen) document.msExitFullscreen()
            }
        }
        if (t.hasSemiNativeFullScreen && ua.match(/mac os x 10_5/i)) {
            t.hasNativeFullScreen = false;
            t.hasSemiNativeFullScreen = false
        }
    }
};
mejs.MediaFeatures.init();
mejs.HtmlMediaElement = {
    pluginType: "native",
    isFullScreen: false,
    setCurrentTime: function(time) {
        this.currentTime = time
    },
    setMuted: function(muted) {
        this.muted = muted
    },
    setVolume: function(volume) {
        this.volume = volume
    },
    stop: function() {
        this.pause()
    },
    setSrc: function(url) {
        for (var existingSources = this.getElementsByTagName("source"); existingSources.length > 0;) this.removeChild(existingSources[0]);
        if (typeof url == "string") this.src = url;
        else {
            var i;
            var media;
            for (i = 0; i < url.length; i++) {
                media = url[i];
                if (this.canPlayType(media.type)) {
                    this.src =
                        media.src;
                    break
                }
            }
        }
    },
    setVideoSize: function(width, height) {
        this.width = width;
        this.height = height
    }
};
mejs.PluginMediaElement = function(pluginid, pluginType, mediaUrl) {
    this.id = pluginid;
    this.pluginType = pluginType;
    this.src = mediaUrl;
    this.events = {};
    this.attributes = {}
};
mejs.PluginMediaElement.prototype = {
    pluginElement: null,
    pluginType: "",
    isFullScreen: false,
    playbackRate: -1,
    defaultPlaybackRate: -1,
    seekable: [],
    played: [],
    paused: true,
    ended: false,
    seeking: false,
    duration: 0,
    error: null,
    tagName: "",
    muted: false,
    volume: 1,
    currentTime: 0,
    play: function() {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube" || this.pluginType == "vimeo") this.pluginApi.playVideo();
            else this.pluginApi.playMedia();
            this.paused = false
        }
    },
    load: function() {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube" ||
                this.pluginType == "vimeo");
            else this.pluginApi.loadMedia();
            this.paused = false
        }
    },
    pause: function() {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube" || this.pluginType == "vimeo") this.pluginApi.pauseVideo();
            else this.pluginApi.pauseMedia();
            this.paused = true
        }
    },
    stop: function() {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube" || this.pluginType == "vimeo") this.pluginApi.stopVideo();
            else this.pluginApi.stopMedia();
            this.paused = true
        }
    },
    canPlayType: function(type) {
        var i;
        var j;
        var pluginInfo;
        var pluginVersions =
            mejs.plugins[this.pluginType];
        for (i = 0; i < pluginVersions.length; i++) {
            pluginInfo = pluginVersions[i];
            if (mejs.PluginDetector.hasPluginVersion(this.pluginType, pluginInfo.version))
                for (j = 0; j < pluginInfo.types.length; j++)
                    if (type == pluginInfo.types[j]) return "probably"
        }
        return ""
    },
    positionFullscreenButton: function(x, y, visibleAndAbove) {
        if (this.pluginApi != null && this.pluginApi.positionFullscreenButton) this.pluginApi.positionFullscreenButton(Math.floor(x), Math.floor(y), visibleAndAbove)
    },
    hideFullscreenButton: function() {
        if (this.pluginApi !=
            null && this.pluginApi.hideFullscreenButton) this.pluginApi.hideFullscreenButton()
    },
    setSrc: function(url) {
        if (typeof url == "string") {
            this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(url));
            this.src = mejs.Utility.absolutizeUrl(url)
        } else {
            var i;
            var media;
            for (i = 0; i < url.length; i++) {
                media = url[i];
                if (this.canPlayType(media.type)) {
                    this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(media.src));
                    this.src = mejs.Utility.absolutizeUrl(url);
                    break
                }
            }
        }
    },
    setCurrentTime: function(time) {
        if (this.pluginApi != null) {
            if (this.pluginType ==
                "youtube" || this.pluginType == "vimeo") this.pluginApi.seekTo(time);
            else this.pluginApi.setCurrentTime(time);
            this.currentTime = time
        }
    },
    setVolume: function(volume) {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube") this.pluginApi.setVolume(volume * 100);
            else this.pluginApi.setVolume(volume);
            this.volume = volume
        }
    },
    setMuted: function(muted) {
        if (this.pluginApi != null) {
            if (this.pluginType == "youtube") {
                if (muted) this.pluginApi.mute();
                else this.pluginApi.unMute();
                this.muted = muted;
                this.dispatchEvent("volumechange")
            } else this.pluginApi.setMuted(muted);
            this.muted = muted
        }
    },
    setVideoSize: function(width, height) {
        if (this.pluginElement && this.pluginElement.style) {
            this.pluginElement.style.width = width + "px";
            this.pluginElement.style.height = height + "px"
        }
        if (this.pluginApi != null && this.pluginApi.setVideoSize) this.pluginApi.setVideoSize(width, height)
    },
    setFullscreen: function(fullscreen) {
        if (this.pluginApi != null && this.pluginApi.setFullscreen) this.pluginApi.setFullscreen(fullscreen)
    },
    enterFullScreen: function() {
        if (this.pluginApi != null && this.pluginApi.setFullscreen) this.setFullscreen(true)
    },
    exitFullScreen: function() {
        if (this.pluginApi != null && this.pluginApi.setFullscreen) this.setFullscreen(false)
    },
    addEventListener: function(eventName, callback, bubble) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback)
    },
    removeEventListener: function(eventName, callback) {
        if (!eventName) {
            this.events = {};
            return true
        }
        var callbacks = this.events[eventName];
        if (!callbacks) return true;
        if (!callback) {
            this.events[eventName] = [];
            return true
        }
        for (var i = 0; i < callbacks.length; i++)
            if (callbacks[i] ===
                callback) {
                this.events[eventName].splice(i, 1);
                return true
            }
        return false
    },
    dispatchEvent: function(eventName) {
        var i;
        var args;
        var callbacks = this.events[eventName];
        if (callbacks) {
            args = Array.prototype.slice.call(arguments, 1);
            for (i = 0; i < callbacks.length; i++) callbacks[i].apply(null, args)
        }
    },
    hasAttribute: function(name) {
        return name in this.attributes
    },
    removeAttribute: function(name) {
        delete this.attributes[name]
    },
    getAttribute: function(name) {
        if (this.hasAttribute(name)) return this.attributes[name];
        return ""
    },
    setAttribute: function(name,
        value) {
        this.attributes[name] = value
    },
    remove: function() {
        mejs.Utility.removeSwf(this.pluginElement.id);
        mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id)
    }
};
mejs.MediaPluginBridge = {
    pluginMediaElements: {},
    htmlMediaElements: {},
    registerPluginElement: function(id, pluginMediaElement, htmlMediaElement) {
        this.pluginMediaElements[id] = pluginMediaElement;
        this.htmlMediaElements[id] = htmlMediaElement
    },
    unregisterPluginElement: function(id) {
        delete this.pluginMediaElements[id];
        delete this.htmlMediaElements[id]
    },
    initPlugin: function(id) {
        var pluginMediaElement = this.pluginMediaElements[id];
        var htmlMediaElement = this.htmlMediaElements[id];
        if (pluginMediaElement) {
            switch (pluginMediaElement.pluginType) {
                case "flash":
                    pluginMediaElement.pluginElement =
                        pluginMediaElement.pluginApi = document.getElementById(id);
                    break;
                case "silverlight":
                    pluginMediaElement.pluginElement = document.getElementById(pluginMediaElement.id);
                    pluginMediaElement.pluginApi = pluginMediaElement.pluginElement.Content.MediaElementJS;
                    break
            }
            if (pluginMediaElement.pluginApi != null && pluginMediaElement.success) pluginMediaElement.success(pluginMediaElement, htmlMediaElement)
        }
    },
    fireEvent: function(id, eventName, values) {
        var e;
        var i;
        var bufferedTime;
        var pluginMediaElement = this.pluginMediaElements[id];
        if (!pluginMediaElement) return;
        e = {
            type: eventName,
            target: pluginMediaElement
        };
        for (i in values) {
            pluginMediaElement[i] = values[i];
            e[i] = values[i]
        }
        bufferedTime = values.bufferedTime || 0;
        e.target.buffered = e.buffered = {
            start: function(index) {
                return 0
            },
            end: function(index) {
                return bufferedTime
            },
            length: 1
        };
        pluginMediaElement.dispatchEvent(e.type, e)
    }
};
mejs.MediaElementDefaults = {
    mode: "auto",
    plugins: ["flash", "silverlight", "youtube", "vimeo"],
    enablePluginDebug: false,
    httpsBasicAuthSite: false,
    type: "",
    pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.js", "mediaelement-and-player.js", "mediaelement-and-player.min.js"]),
    flashName: "flashmediaelement.swf",
    flashStreamer: "",
    enablePluginSmoothing: false,
    enablePseudoStreaming: false,
    pseudoStreamingStartQueryParam: "start",
    silverlightName: "silverlightmediaelement.xap",
    defaultVideoWidth: 480,
    defaultVideoHeight: 270,
    pluginWidth: -1,
    pluginHeight: -1,
    pluginVars: [],
    timerRate: 250,
    startVolume: .8,
    success: function() {},
    error: function() {}
};
mejs.MediaElement = function(el, o) {
    return mejs.HtmlMediaElementShim.create(el, o)
};
mejs.HtmlMediaElementShim = {
    create: function(el, o) {
        var options = mejs.MediaElementDefaults;
        var htmlMediaElement = typeof el == "string" ? document.getElementById(el) : el;
        var tagName = htmlMediaElement.tagName.toLowerCase();
        var isMediaTag = tagName === "audio" || tagName === "video";
        var src = isMediaTag ? htmlMediaElement.getAttribute("src") : htmlMediaElement.getAttribute("href");
        var poster = htmlMediaElement.getAttribute("poster");
        var autoplay = htmlMediaElement.getAttribute("autoplay");
        var preload = htmlMediaElement.getAttribute("preload");
        var controls = htmlMediaElement.getAttribute("controls");
        var playback;
        for (var prop in o) options[prop] = o[prop];
        src = typeof src == "undefined" || src === null || src == "" ? null : src;
        poster = typeof poster == "undefined" || poster === null ? "" : poster;
        preload = typeof preload == "undefined" || preload === null || preload === "false" ? "none" : preload;
        autoplay = !(typeof autoplay == "undefined" || autoplay === null || autoplay === "false");
        controls = !(typeof controls == "undefined" || controls === null || controls === "false");
        playback = this.determinePlayback(htmlMediaElement,
            options, mejs.MediaFeatures.supportsMediaTag, isMediaTag, src);
        playback.url = playback.url !== null ? mejs.Utility.absolutizeUrl(playback.url) : "";
        if (playback.method == "native") {
            if (mejs.MediaFeatures.isBustedAndroid) {
                htmlMediaElement.src = playback.url;
                htmlMediaElement.addEventListener("click", function() {
                    htmlMediaElement.play()
                }, false)
            }
            return this.updateNative(playback, options, autoplay, preload)
        } else if (playback.method !== "") return this.createPlugin(playback, options, poster, autoplay, preload, controls);
        else {
            this.createErrorMessage(playback,
                options, poster);
            return this
        }
    },
    determinePlayback: function(htmlMediaElement, options, supportsMediaTag, isMediaTag, src) {
        var mediaFiles = [];
        var i;
        var j;
        var k;
        var l;
        var n;
        var type$$0;
        var result = {
            method: "",
            url: "",
            htmlMediaElement: htmlMediaElement,
            isVideo: htmlMediaElement.tagName.toLowerCase() != "audio"
        };
        var pluginName;
        var pluginVersions;
        var pluginInfo;
        var dummy;
        var media;
        if (typeof options.type != "undefined" && options.type !== "")
            if (typeof options.type == "string") mediaFiles.push({
                type: options.type,
                url: src
            });
            else
                for (i =
                    0; i < options.type.length; i++) mediaFiles.push({
                    type: options.type[i],
                    url: src
                });
        else if (src !== null) {
            type$$0 = this.formatType(src, htmlMediaElement.getAttribute("type"));
            mediaFiles.push({
                type: type$$0,
                url: src
            })
        } else
            for (i = 0; i < htmlMediaElement.childNodes.length; i++) {
                n = htmlMediaElement.childNodes[i];
                if (n.nodeType == 1 && n.tagName.toLowerCase() == "source") {
                    src = n.getAttribute("src");
                    type$$0 = this.formatType(src, n.getAttribute("type"));
                    media = n.getAttribute("media");
                    if (!media || !window.matchMedia || window.matchMedia &&
                        window.matchMedia(media).matches) mediaFiles.push({
                        type: type$$0,
                        url: src
                    })
                }
            }
        if (!isMediaTag && mediaFiles.length > 0 && mediaFiles[0].url !== null && this.getTypeFromFile(mediaFiles[0].url).indexOf("audio") > -1) result.isVideo = false;
        if (mejs.MediaFeatures.isBustedAndroid) htmlMediaElement.canPlayType = function(type) {
            return type.match(/video\/(mp4|m4v)/gi) !== null ? "maybe" : ""
        };
        if (mejs.MediaFeatures.isChromium) htmlMediaElement.canPlayType = function(type) {
            return type.match(/video\/(webm|ogv|ogg)/gi) !== null ? "maybe" : ""
        };
        if (supportsMediaTag &&
            (options.mode === "auto" || options.mode === "auto_plugin" || options.mode === "native") && !(mejs.MediaFeatures.isBustedNativeHTTPS && options.httpsBasicAuthSite === true)) {
            if (!isMediaTag) {
                dummy = document.createElement(result.isVideo ? "video" : "audio");
                htmlMediaElement.parentNode.insertBefore(dummy, htmlMediaElement);
                htmlMediaElement.style.display = "none";
                result.htmlMediaElement = htmlMediaElement = dummy
            }
            for (i = 0; i < mediaFiles.length; i++)
                if (mediaFiles[i].type == "video/m3u8" || htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/,
                        "") !== "" || htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/, "mpeg")).replace(/no/, "") !== "" || htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/m4a/, "mp4")).replace(/no/, "") !== "") {
                    result.method = "native";
                    result.url = mediaFiles[i].url;
                    break
                }
            if (result.method === "native") {
                if (result.url !== null) htmlMediaElement.src = result.url;
                if (options.mode !== "auto_plugin") return result
            }
        }
        if (options.mode === "auto" || options.mode === "auto_plugin" || options.mode === "shim")
            for (i = 0; i < mediaFiles.length; i++) {
                type$$0 =
                    mediaFiles[i].type;
                for (j = 0; j < options.plugins.length; j++) {
                    pluginName = options.plugins[j];
                    pluginVersions = mejs.plugins[pluginName];
                    for (k = 0; k < pluginVersions.length; k++) {
                        pluginInfo = pluginVersions[k];
                        if (pluginInfo.version == null || mejs.PluginDetector.hasPluginVersion(pluginName, pluginInfo.version))
                            for (l = 0; l < pluginInfo.types.length; l++)
                                if (type$$0 == pluginInfo.types[l]) {
                                    result.method = pluginName;
                                    result.url = mediaFiles[i].url;
                                    return result
                                }
                    }
                }
            }
        if (options.mode === "auto_plugin" && result.method === "native") return result;
        if (result.method === "" && mediaFiles.length > 0) result.url = mediaFiles[0].url;
        return result
    },
    formatType: function(url, type) {
        var ext;
        if (url && !type) return this.getTypeFromFile(url);
        else if (type && ~type.indexOf(";")) return type.substr(0, type.indexOf(";"));
        else return type
    },
    getTypeFromFile: function(url) {
        url = url.split("?")[0];
        var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
        return (/(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? "video" : "audio") + "/" + this.getTypeFromExtension(ext)
    },
    getTypeFromExtension: function(ext) {
        switch (ext) {
            case "mp4":
            case "m4v":
            case "m4a":
                return "mp4";
            case "webm":
            case "webma":
            case "webmv":
                return "webm";
            case "ogg":
            case "oga":
            case "ogv":
                return "ogg";
            default:
                return ext
        }
    },
    createErrorMessage: function(playback, options, poster) {
        var htmlMediaElement = playback.htmlMediaElement;
        var errorContainer = document.createElement("div");
        errorContainer.className = "me-cannotplay";
        try {
            errorContainer.style.width = htmlMediaElement.width + "px";
            errorContainer.style.height = htmlMediaElement.height + "px"
        } catch (e) {}
        if (options.customError) errorContainer.innerHTML = options.customError;
        else errorContainer.innerHTML = poster !== "" ? '\x3ca href\x3d"' + playback.url + '"\x3e\x3cimg src\x3d"' + poster + '" width\x3d"100%" height\x3d"100%" /\x3e\x3c/a\x3e' : '\x3ca href\x3d"' + playback.url + '"\x3e\x3cspan\x3e' + mejs.i18n.t("Download File") + "\x3c/span\x3e\x3c/a\x3e";
        htmlMediaElement.parentNode.insertBefore(errorContainer, htmlMediaElement);
        htmlMediaElement.style.display = "none";
        options.error(htmlMediaElement)
    },
    createPlugin: function(playback, options, poster, autoplay, preload, controls) {
        var htmlMediaElement =
            playback.htmlMediaElement;
        var width = 1;
        var height = 1;
        var pluginid = "me_" + playback.method + "_" + mejs.meIndex++;
        var pluginMediaElement$$0 = new mejs.PluginMediaElement(pluginid, playback.method, playback.url);
        var container = document.createElement("div");
        var specialIEContainer;
        var node;
        var initVars;
        pluginMediaElement$$0.tagName = htmlMediaElement.tagName;
        for (var i = 0; i < htmlMediaElement.attributes.length; i++) {
            var attribute = htmlMediaElement.attributes[i];
            if (attribute.specified == true) pluginMediaElement$$0.setAttribute(attribute.name,
                attribute.value)
        }
        for (node = htmlMediaElement.parentNode; node !== null && node.tagName.toLowerCase() !== "body" && node.parentNode != null;) {
            if (node.parentNode.tagName.toLowerCase() === "p") {
                node.parentNode.parentNode.insertBefore(node, node.parentNode);
                break
            }
            node = node.parentNode
        }
        if (playback.isVideo) {
            width = options.pluginWidth > 0 ? options.pluginWidth : options.videoWidth > 0 ? options.videoWidth : htmlMediaElement.getAttribute("width") !== null ? htmlMediaElement.getAttribute("width") : options.defaultVideoWidth;
            height = options.pluginHeight >
                0 ? options.pluginHeight : options.videoHeight > 0 ? options.videoHeight : htmlMediaElement.getAttribute("height") !== null ? htmlMediaElement.getAttribute("height") : options.defaultVideoHeight;
            width = mejs.Utility.encodeUrl(width);
            height = mejs.Utility.encodeUrl(height)
        } else if (options.enablePluginDebug) {
            width = 320;
            height = 240
        }
        pluginMediaElement$$0.success = options.success;
        mejs.MediaPluginBridge.registerPluginElement(pluginid, pluginMediaElement$$0, htmlMediaElement);
        container.className = "me-plugin";
        container.id = pluginid +
            "_container";
        if (playback.isVideo) htmlMediaElement.parentNode.insertBefore(container, htmlMediaElement);
        else document.body.insertBefore(container, document.body.childNodes[0]);
        initVars = ["id\x3d" + pluginid, "isvideo\x3d" + (playback.isVideo ? "true" : "false"), "autoplay\x3d" + (autoplay ? "true" : "false"), "preload\x3d" + preload, "width\x3d" + width, "startvolume\x3d" + options.startVolume, "timerrate\x3d" + options.timerRate, "flashstreamer\x3d" + options.flashStreamer, "height\x3d" + height, "pseudostreamstart\x3d" + options.pseudoStreamingStartQueryParam];
        if (playback.url !== null)
            if (playback.method == "flash") initVars.push("file\x3d" + mejs.Utility.encodeUrl(playback.url));
            else initVars.push("file\x3d" + playback.url);
        if (options.enablePluginDebug) initVars.push("debug\x3dtrue");
        if (options.enablePluginSmoothing) initVars.push("smoothing\x3dtrue");
        if (options.enablePseudoStreaming) initVars.push("pseudostreaming\x3dtrue");
        if (controls) initVars.push("controls\x3dtrue");
        if (options.pluginVars) initVars = initVars.concat(options.pluginVars);
        switch (playback.method) {
            case "silverlight":
                container.innerHTML =
                    '\x3cobject data\x3d"data:application/x-silverlight-2," type\x3d"application/x-silverlight-2" id\x3d"' + pluginid + '" name\x3d"' + pluginid + '" width\x3d"' + width + '" height\x3d"' + height + '" class\x3d"mejs-shim"\x3e' + '\x3cparam name\x3d"initParams" value\x3d"' + initVars.join(",") + '" /\x3e' + '\x3cparam name\x3d"windowless" value\x3d"true" /\x3e' + '\x3cparam name\x3d"background" value\x3d"black" /\x3e' + '\x3cparam name\x3d"minRuntimeVersion" value\x3d"3.0.0.0" /\x3e' + '\x3cparam name\x3d"autoUpgrade" value\x3d"true" /\x3e' +
                    '\x3cparam name\x3d"source" value\x3d"' + options.pluginPath + options.silverlightName + '" /\x3e' + "\x3c/object\x3e";
                break;
            case "flash":
                if (mejs.MediaFeatures.isIE) {
                    specialIEContainer = document.createElement("div");
                    container.appendChild(specialIEContainer);
                    specialIEContainer.outerHTML = '\x3cobject classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase\x3d"//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 'id\x3d"' + pluginid + '" width\x3d"' + width + '" height\x3d"' + height + '" class\x3d"mejs-shim"\x3e' +
                        '\x3cparam name\x3d"movie" value\x3d"' + options.pluginPath + options.flashName + "?x\x3d" + new Date + '" /\x3e' + '\x3cparam name\x3d"flashvars" value\x3d"' + initVars.join("\x26amp;") + '" /\x3e' + '\x3cparam name\x3d"quality" value\x3d"high" /\x3e' + '\x3cparam name\x3d"bgcolor" value\x3d"#000000" /\x3e' + '\x3cparam name\x3d"wmode" value\x3d"transparent" /\x3e' + '\x3cparam name\x3d"allowScriptAccess" value\x3d"always" /\x3e' + '\x3cparam name\x3d"allowFullScreen" value\x3d"true" /\x3e' + '\x3cparam name\x3d"scale" value\x3d"default" /\x3e' +
                        "\x3c/object\x3e"
                } else container.innerHTML = '\x3cembed id\x3d"' + pluginid + '" name\x3d"' + pluginid + '" ' + 'play\x3d"true" ' + 'loop\x3d"false" ' + 'quality\x3d"high" ' + 'bgcolor\x3d"#000000" ' + 'wmode\x3d"transparent" ' + 'allowScriptAccess\x3d"always" ' + 'allowFullScreen\x3d"true" ' + 'type\x3d"application/x-shockwave-flash" pluginspage\x3d"//www.macromedia.com/go/getflashplayer" ' + 'src\x3d"' + options.pluginPath + options.flashName + '" ' + 'flashvars\x3d"' + initVars.join("\x26") + '" ' + 'width\x3d"' + width + '" ' + 'height\x3d"' +
                    height + '" ' + 'scale\x3d"default"' + 'class\x3d"mejs-shim"\x3e\x3c/embed\x3e';
                break;
            case "youtube":
                var videoId;
                if (playback.url.lastIndexOf("youtu.be") != -1) {
                    videoId = playback.url.substr(playback.url.lastIndexOf("/") + 1);
                    if (videoId.indexOf("?") != -1) videoId = videoId.substr(0, videoId.indexOf("?"))
                } else videoId = playback.url.substr(playback.url.lastIndexOf("\x3d") + 1);
                youtubeSettings = {
                    container: container,
                    containerId: container.id,
                    pluginMediaElement: pluginMediaElement$$0,
                    pluginId: pluginid,
                    videoId: videoId,
                    height: height,
                    width: width
                };
                if (mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0])) mejs.YouTubeApi.createFlash(youtubeSettings);
                else mejs.YouTubeApi.enqueueIframe(youtubeSettings);
                break;
            case "vimeo":
                var player_id = pluginid + "_player";
                pluginMediaElement$$0.vimeoid = playback.url.substr(playback.url.lastIndexOf("/") + 1);
                container.innerHTML = '\x3ciframe src\x3d"//player.vimeo.com/video/' + pluginMediaElement$$0.vimeoid + "?api\x3d1\x26portrait\x3d0\x26byline\x3d0\x26title\x3d0\x26player_id\x3d" + player_id + '" width\x3d"' + width +
                    '" height\x3d"' + height + '" frameborder\x3d"0" class\x3d"mejs-shim" id\x3d"' + player_id + '"\x3e\x3c/iframe\x3e';
                if (typeof $f == "function") {
                    var player = $f(container.childNodes[0]);
                    player.addEvent("ready", function() {
                        function createEvent(player, pluginMediaElement, eventName, e) {
                            var obj = {
                                type: eventName,
                                target: pluginMediaElement
                            };
                            if (eventName == "timeupdate") {
                                pluginMediaElement.currentTime = obj.currentTime = e.seconds;
                                pluginMediaElement.duration = obj.duration = e.duration
                            }
                            pluginMediaElement.dispatchEvent(obj.type, obj)
                        }
                        $.extend(player, {
                            playVideo: function() {
                                player.api("play")
                            },
                            stopVideo: function() {
                                player.api("unload")
                            },
                            pauseVideo: function() {
                                player.api("pause")
                            },
                            seekTo: function(seconds) {
                                player.api("seekTo", seconds)
                            },
                            setVolume: function(volume) {
                                player.api("setVolume", volume)
                            },
                            setMuted: function(muted) {
                                if (muted) {
                                    player.lastVolume = player.api("getVolume");
                                    player.api("setVolume", 0)
                                } else {
                                    player.api("setVolume", player.lastVolume);
                                    delete player.lastVolume
                                }
                            }
                        });
                        player.addEvent("play", function() {
                            createEvent(player, pluginMediaElement$$0,
                                "play");
                            createEvent(player, pluginMediaElement$$0, "playing")
                        });
                        player.addEvent("pause", function() {
                            createEvent(player, pluginMediaElement$$0, "pause")
                        });
                        player.addEvent("finish", function() {
                            createEvent(player, pluginMediaElement$$0, "ended")
                        });
                        player.addEvent("playProgress", function(e) {
                            createEvent(player, pluginMediaElement$$0, "timeupdate", e)
                        });
                        pluginMediaElement$$0.pluginElement = container;
                        pluginMediaElement$$0.pluginApi = player;
                        mejs.MediaPluginBridge.initPlugin(pluginid)
                    })
                } else console.warn("You need to include froogaloop for vimeo to work");
                break
        }
        htmlMediaElement.style.display = "none";
        htmlMediaElement.removeAttribute("autoplay");
        return pluginMediaElement$$0
    },
    updateNative: function(playback, options, autoplay, preload) {
        var htmlMediaElement = playback.htmlMediaElement;
        for (var m in mejs.HtmlMediaElement) htmlMediaElement[m] = mejs.HtmlMediaElement[m];
        options.success(htmlMediaElement, htmlMediaElement);
        return htmlMediaElement
    }
};
mejs.YouTubeApi = {
    isIframeStarted: false,
    isIframeLoaded: false,
    loadIframeApi: function() {
        if (!this.isIframeStarted) {
            var tag = document.createElement("script");
            tag.src = "//www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            this.isIframeStarted = true
        }
    },
    iframeQueue: [],
    enqueueIframe: function(yt) {
        if (this.isLoaded) this.createIframe(yt);
        else {
            this.loadIframeApi();
            this.iframeQueue.push(yt)
        }
    },
    createIframe: function(settings) {
        var pluginMediaElement =
            settings.pluginMediaElement;
        var player = new YT.Player(settings.containerId, {
            height: settings.height,
            width: settings.width,
            videoId: settings.videoId,
            playerVars: {
                controls: 0
            },
            events: {
                "onReady": function() {
                    settings.pluginMediaElement.pluginApi = player;
                    mejs.MediaPluginBridge.initPlugin(settings.pluginId);
                    setInterval(function() {
                        mejs.YouTubeApi.createEvent(player, pluginMediaElement, "timeupdate")
                    }, 250)
                },
                "onStateChange": function(e) {
                    mejs.YouTubeApi.handleStateChange(e.data, player, pluginMediaElement)
                }
            }
        })
    },
    createEvent: function(player,
        pluginMediaElement, eventName) {
        var obj = {
            type: eventName,
            target: pluginMediaElement
        };
        if (player && player.getDuration) {
            pluginMediaElement.currentTime = obj.currentTime = player.getCurrentTime();
            pluginMediaElement.duration = obj.duration = player.getDuration();
            obj.paused = pluginMediaElement.paused;
            obj.ended = pluginMediaElement.ended;
            obj.muted = player.isMuted();
            obj.volume = player.getVolume() / 100;
            obj.bytesTotal = player.getVideoBytesTotal();
            obj.bufferedBytes = player.getVideoBytesLoaded();
            var bufferedTime = obj.bufferedBytes /
                obj.bytesTotal * obj.duration;
            obj.target.buffered = obj.buffered = {
                start: function(index) {
                    return 0
                },
                end: function(index) {
                    return bufferedTime
                },
                length: 1
            }
        }
        pluginMediaElement.dispatchEvent(obj.type, obj)
    },
    iFrameReady: function() {
        this.isLoaded = true;
        for (this.isIframeLoaded = true; this.iframeQueue.length > 0;) {
            var settings = this.iframeQueue.pop();
            this.createIframe(settings)
        }
    },
    flashPlayers: {},
    createFlash: function(settings) {
        this.flashPlayers[settings.pluginId] = settings;
        var specialIEContainer;
        var youtubeUrl = "//www.youtube.com/apiplayer?enablejsapi\x3d1\x26amp;playerapiid\x3d" +
            settings.pluginId + "\x26amp;version\x3d3\x26amp;autoplay\x3d0\x26amp;controls\x3d0\x26amp;modestbranding\x3d1\x26loop\x3d0";
        if (mejs.MediaFeatures.isIE) {
            specialIEContainer = document.createElement("div");
            settings.container.appendChild(specialIEContainer);
            specialIEContainer.outerHTML = '\x3cobject classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase\x3d"//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 'id\x3d"' + settings.pluginId + '" width\x3d"' + settings.width + '" height\x3d"' +
                settings.height + '" class\x3d"mejs-shim"\x3e' + '\x3cparam name\x3d"movie" value\x3d"' + youtubeUrl + '" /\x3e' + '\x3cparam name\x3d"wmode" value\x3d"transparent" /\x3e' + '\x3cparam name\x3d"allowScriptAccess" value\x3d"always" /\x3e' + '\x3cparam name\x3d"allowFullScreen" value\x3d"true" /\x3e' + "\x3c/object\x3e"
        } else settings.container.innerHTML = '\x3cobject type\x3d"application/x-shockwave-flash" id\x3d"' + settings.pluginId + '" data\x3d"' + youtubeUrl + '" ' + 'width\x3d"' + settings.width + '" height\x3d"' + settings.height +
            '" style\x3d"visibility: visible; " class\x3d"mejs-shim"\x3e' + '\x3cparam name\x3d"allowScriptAccess" value\x3d"always"\x3e' + '\x3cparam name\x3d"wmode" value\x3d"transparent"\x3e' + "\x3c/object\x3e"
    },
    flashReady: function(id) {
        var settings = this.flashPlayers[id];
        var player = document.getElementById(id);
        var pluginMediaElement = settings.pluginMediaElement;
        pluginMediaElement.pluginApi = pluginMediaElement.pluginElement = player;
        mejs.MediaPluginBridge.initPlugin(id);
        player.cueVideoById(settings.videoId);
        var callbackName =
            settings.containerId + "_callback";
        window[callbackName] = function(e) {
            mejs.YouTubeApi.handleStateChange(e, player, pluginMediaElement)
        };
        player.addEventListener("onStateChange", callbackName);
        setInterval(function() {
            mejs.YouTubeApi.createEvent(player, pluginMediaElement, "timeupdate")
        }, 250);
        mejs.YouTubeApi.createEvent(player, pluginMediaElement, "canplay")
    },
    handleStateChange: function(youTubeState, player, pluginMediaElement) {
        switch (youTubeState) {
            case -1:
                pluginMediaElement.paused = true;
                pluginMediaElement.ended = true;
                mejs.YouTubeApi.createEvent(player, pluginMediaElement, "loadedmetadata");
                break;
            case 0:
                pluginMediaElement.paused = false;
                pluginMediaElement.ended = true;
                mejs.YouTubeApi.createEvent(player, pluginMediaElement, "ended");
                break;
            case 1:
                pluginMediaElement.paused = false;
                pluginMediaElement.ended = false;
                mejs.YouTubeApi.createEvent(player, pluginMediaElement, "play");
                mejs.YouTubeApi.createEvent(player, pluginMediaElement, "playing");
                break;
            case 2:
                pluginMediaElement.paused = true;
                pluginMediaElement.ended = false;
                mejs.YouTubeApi.createEvent(player,
                    pluginMediaElement, "pause");
                break;
            case 3:
                mejs.YouTubeApi.createEvent(player, pluginMediaElement, "progress");
                break;
            case 5:
                break
        }
    }
};

function onYouTubePlayerAPIReady() {
    mejs.YouTubeApi.iFrameReady()
}

function onYouTubePlayerReady(id) {
    mejs.YouTubeApi.flashReady(id)
}
window.mejs = mejs;
window.MediaElement = mejs.MediaElement;
(function(context, exports, undefined) {
    var i18n = {
        "locale": {
            "language": "",
            "strings": {}
        },
        "methods": {}
    };
    i18n.getLanguage = function() {
        var language = i18n.locale.language || window.navigator.userLanguage || window.navigator.language;
        return language.substr(0, 2).toLowerCase()
    };
    if (typeof mejsL10n != "undefined") i18n.locale.language = mejsL10n.language;
    i18n.methods.checkPlain = function(str) {
        var character;
        var regex;
        var replace = {
            "\x26": "\x26amp;",
            '"': "\x26quot;",
            "\x3c": "\x26lt;",
            "\x3e": "\x26gt;"
        };
        str = String(str);
        for (character in replace)
            if (replace.hasOwnProperty(character)) {
                regex =
                    new RegExp(character, "g");
                str = str.replace(regex, replace[character])
            }
        return str
    };
    i18n.methods.t = function(str, options) {
        if (i18n.locale.strings && i18n.locale.strings[options.context] && i18n.locale.strings[options.context][str]) str = i18n.locale.strings[options.context][str];
        return i18n.methods.checkPlain(str)
    };
    i18n.t = function(str, options) {
        if (typeof str === "string" && str.length > 0) {
            var language = i18n.getLanguage();
            options = options || {
                "context": language
            };
            return i18n.methods.t(str, options)
        } else throw {
            "name": "InvalidArgumentException",
            "message": "First argument is either not a string or empty."
        };
    };
    exports.i18n = i18n
})(document, mejs);
(function(exports, undefined) {
    if (typeof mejsL10n != "undefined") exports[mejsL10n.language] = mejsL10n.strings
})(mejs.i18n.locale.strings);
(function(exports, undefined) {
    if (typeof exports.de === "undefined") exports.de = {
        "Fullscreen": "Vollbild",
        "Go Fullscreen": "Vollbild an",
        "Turn off Fullscreen": "Vollbild aus",
        "Close": "Schlie\u00c3\u009fen"
    }
})(mejs.i18n.locale.strings);
(function(exports, undefined) {
    if (typeof exports.zh === "undefined") exports.zh = {
        "Fullscreen": "\u00e5\u0085\u00a8\u00e8\u009e\u00a2\u00e5\u00b9\u0095",
        "Go Fullscreen": "\u00e5\u0085\u00a8\u00e5\u00b1\u008f\u00e6\u00a8\u00a1\u00e5\u00bc\u008f",
        "Turn off Fullscreen": "\u00e9\u0080\u0080\u00e5\u0087\u00ba\u00e5\u0085\u00a8\u00e5\u00b1\u008f\u00e6\u00a8\u00a1\u00e5\u00bc\u008f",
        "Close": "\u00e9\u0097\u009c\u00e9\u0096\u0089"
    }
})(mejs.i18n.locale.strings);
if (typeof jQuery != "undefined") mejs.$ = jQuery;
else if (typeof ender != "undefined") mejs.$ = ender;
(function($) {
    mejs.MepDefaults = {
        poster: "",
        showPosterWhenEnded: false,
        defaultVideoWidth: 480,
        defaultVideoHeight: 270,
        videoWidth: -1,
        videoHeight: -1,
        defaultAudioWidth: 400,
        defaultAudioHeight: 30,
        defaultSeekBackwardInterval: function(media) {
            return media.duration * .05
        },
        defaultSeekForwardInterval: function(media) {
            return media.duration * .05
        },
        setDimensions: true,
        audioWidth: -1,
        audioHeight: -1,
        startVolume: .8,
        loop: false,
        autoRewind: true,
        enableAutosize: true,
        alwaysShowHours: false,
        showTimecodeFrameCount: false,
        framesPerSecond: 25,
        autosizeProgress: true,
        alwaysShowControls: false,
        hideVideoControlsOnLoad: false,
        clickToPlayPause: true,
        iPadUseNativeControls: false,
        iPhoneUseNativeControls: false,
        AndroidUseNativeControls: false,
        features: ["playpause", "current", "progress", "duration", "tracks", "volume", "fullscreen"],
        isVideo: true,
        enableKeyboard: true,
        pauseOtherPlayers: true,
        keyActions: [{
            keys: [32, 179],
            action: function(player, media) {
                if (media.paused || media.ended) player.play();
                else player.pause()
            }
        }, {
            keys: [38],
            action: function(player, media) {
                player.container.find(".mejs-volume-slider").css("display",
                    "block");
                if (player.isVideo) {
                    player.showControls();
                    player.startControlsTimer()
                }
                var newVolume = Math.min(media.volume + .1, 1);
                media.setVolume(newVolume)
            }
        }, {
            keys: [40],
            action: function(player, media) {
                player.container.find(".mejs-volume-slider").css("display", "block");
                if (player.isVideo) {
                    player.showControls();
                    player.startControlsTimer()
                }
                var newVolume = Math.max(media.volume - .1, 0);
                media.setVolume(newVolume)
            }
        }, {
            keys: [37, 227],
            action: function(player, media) {
                if (!isNaN(media.duration) && media.duration > 0) {
                    if (player.isVideo) {
                        player.showControls();
                        player.startControlsTimer()
                    }
                    var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
                    media.setCurrentTime(newTime)
                }
            }
        }, {
            keys: [39, 228],
            action: function(player, media) {
                if (!isNaN(media.duration) && media.duration > 0) {
                    if (player.isVideo) {
                        player.showControls();
                        player.startControlsTimer()
                    }
                    var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
                    media.setCurrentTime(newTime)
                }
            }
        }, {
            keys: [70],
            action: function(player, media) {
                if (typeof player.enterFullScreen !=
                    "undefined")
                    if (player.isFullScreen) player.exitFullScreen();
                    else player.enterFullScreen()
            }
        }, {
            keys: [77],
            action: function(player, media) {
                player.container.find(".mejs-volume-slider").css("display", "block");
                if (player.isVideo) {
                    player.showControls();
                    player.startControlsTimer()
                }
                if (player.media.muted) player.setMuted(false);
                else player.setMuted(true)
            }
        }]
    };
    mejs.mepIndex = 0;
    mejs.players = {};
    mejs.MediaElementPlayer = function(node, o) {
        if (!(this instanceof mejs.MediaElementPlayer)) return new mejs.MediaElementPlayer(node,
            o);
        var t = this;
        t.$media = t.$node = $(node);
        t.node = t.media = t.$media[0];
        if (typeof t.node.player != "undefined") return t.node.player;
        else t.node.player = t;
        if (typeof o == "undefined") o = t.$node.data("mejsoptions");
        t.options = $.extend({}, mejs.MepDefaults, o);
        t.id = "mep_" + mejs.mepIndex++;
        mejs.players[t.id] = t;
        t.init();
        return t
    };
    mejs.MediaElementPlayer.prototype = {
        hasFocus: false,
        controlsAreVisible: true,
        init: function() {
            var t = this;
            var mf = mejs.MediaFeatures;
            var meOptions = $.extend(true, {}, t.options, {
                success: function(media,
                    domNode) {
                    t.meReady(media, domNode)
                },
                error: function(e) {
                    t.handleError(e)
                }
            });
            var tagName = t.media.tagName.toLowerCase();
            t.isDynamic = tagName !== "audio" && tagName !== "video";
            if (t.isDynamic) t.isVideo = t.options.isVideo;
            else t.isVideo = tagName !== "audio" && t.options.isVideo;
            if (mf.isiPad && t.options.iPadUseNativeControls || mf.isiPhone && t.options.iPhoneUseNativeControls) {
                t.$media.attr("controls", "controls");
                if (mf.isiPad && t.media.getAttribute("autoplay") !== null) t.play()
            } else if (mf.isAndroid && t.options.AndroidUseNativeControls);
            else {
                t.$media.removeAttr("controls");
                t.container = $('\x3cdiv id\x3d"' + t.id + '" class\x3d"mejs-container ' + (mejs.MediaFeatures.svg ? "svg" : "no-svg") + '"\x3e' + '\x3cdiv class\x3d"mejs-inner"\x3e' + '\x3cdiv class\x3d"mejs-mediaelement"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-layers"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-controls"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-clear"\x3e\x3c/div\x3e' + "\x3c/div\x3e" + "\x3c/div\x3e").addClass(t.$media[0].className).insertBefore(t.$media);
                t.container.addClass((mf.isAndroid ?
                    "mejs-android " : "") + (mf.isiOS ? "mejs-ios " : "") + (mf.isiPad ? "mejs-ipad " : "") + (mf.isiPhone ? "mejs-iphone " : "") + (t.isVideo ? "mejs-video " : "mejs-audio "));
                if (mf.isiOS) {
                    var $newMedia = t.$media.clone();
                    t.container.find(".mejs-mediaelement").append($newMedia);
                    t.$media.remove();
                    t.$node = t.$media = $newMedia;
                    t.node = t.media = $newMedia[0]
                } else t.container.find(".mejs-mediaelement").append(t.$media);
                t.controls = t.container.find(".mejs-controls");
                t.layers = t.container.find(".mejs-layers");
                var tagType = t.isVideo ? "video" : "audio";
                var capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);
                if (t.options[tagType + "Width"] > 0 || t.options[tagType + "Width"].toString().indexOf("%") > -1) t.width = t.options[tagType + "Width"];
                else if (t.media.style.width !== "" && t.media.style.width !== null) t.width = t.media.style.width;
                else if (t.media.getAttribute("width") !== null) t.width = t.$media.attr("width");
                else t.width = t.options["default" + capsTagName + "Width"];
                if (t.options[tagType + "Height"] > 0 || t.options[tagType + "Height"].toString().indexOf("%") >
                    -1) t.height = t.options[tagType + "Height"];
                else if (t.media.style.height !== "" && t.media.style.height !== null) t.height = t.media.style.height;
                else if (t.$media[0].getAttribute("height") !== null) t.height = t.$media.attr("height");
                else t.height = t.options["default" + capsTagName + "Height"];
                t.setPlayerSize(t.width, t.height);
                meOptions.pluginWidth = t.width;
                meOptions.pluginHeight = t.height
            }
            mejs.MediaElement(t.$media[0], meOptions);
            if (typeof t.container != "undefined" && t.controlsAreVisible) t.container.trigger("controlsshown")
        },
        showControls: function(doAnimation) {
            var t = this;
            doAnimation = typeof doAnimation == "undefined" || doAnimation;
            if (t.controlsAreVisible) return;
            if (doAnimation) {
                t.controls.css("visibility", "visible").stop(true, true).fadeIn(200, function() {
                    t.controlsAreVisible = true;
                    t.container.trigger("controlsshown")
                });
                t.container.find(".mejs-control").css("visibility", "visible").stop(true, true).fadeIn(200, function() {
                    t.controlsAreVisible = true
                })
            } else {
                t.controls.css("visibility", "visible").css("display", "block");
                t.container.find(".mejs-control").css("visibility",
                    "visible").css("display", "block");
                t.controlsAreVisible = true;
                t.container.trigger("controlsshown")
            }
            t.setControlsSize()
        },
        hideControls: function(doAnimation) {
            var t = this;
            doAnimation = typeof doAnimation == "undefined" || doAnimation;
            if (!t.controlsAreVisible || t.options.alwaysShowControls) return;
            if (doAnimation) {
                t.controls.stop(true, true).fadeOut(200, function() {
                    $(this).css("visibility", "hidden").css("display", "block");
                    t.controlsAreVisible = false;
                    t.container.trigger("controlshidden")
                });
                t.container.find(".mejs-control").stop(true,
                    true).fadeOut(200, function() {
                    $(this).css("visibility", "hidden").css("display", "block")
                })
            } else {
                t.controls.css("visibility", "hidden").css("display", "block");
                t.container.find(".mejs-control").css("visibility", "hidden").css("display", "block");
                t.controlsAreVisible = false;
                t.container.trigger("controlshidden")
            }
        },
        controlsTimer: null,
        startControlsTimer: function(timeout) {
            var t = this;
            timeout = typeof timeout != "undefined" ? timeout : 1500;
            t.killControlsTimer("start");
            t.controlsTimer = setTimeout(function() {
                t.hideControls();
                t.killControlsTimer("hide")
            }, timeout)
        },
        killControlsTimer: function(src) {
            var t = this;
            if (t.controlsTimer !== null) {
                clearTimeout(t.controlsTimer);
                delete t.controlsTimer;
                t.controlsTimer = null
            }
        },
        controlsEnabled: true,
        disableControls: function() {
            var t = this;
            t.killControlsTimer();
            t.hideControls(false);
            this.controlsEnabled = false
        },
        enableControls: function() {
            var t = this;
            t.showControls(false);
            t.controlsEnabled = true
        },
        meReady: function(media, domNode) {
            var t = this;
            var mf = mejs.MediaFeatures;
            var autoplayAttr = domNode.getAttribute("autoplay");
            var autoplay = !(typeof autoplayAttr == "undefined" || autoplayAttr === null || autoplayAttr === "false");
            var featureIndex;
            var feature;
            if (t.created) return;
            else t.created = true;
            t.media = media;
            t.domNode = domNode;
            if (!(mf.isAndroid && t.options.AndroidUseNativeControls) && !(mf.isiPad && t.options.iPadUseNativeControls) && !(mf.isiPhone && t.options.iPhoneUseNativeControls)) {
                t.buildposter(t, t.controls, t.layers, t.media);
                t.buildkeyboard(t, t.controls, t.layers, t.media);
                t.buildoverlays(t, t.controls, t.layers, t.media);
                t.findTracks();
                for (featureIndex in t.options.features) {
                    feature = t.options.features[featureIndex];
                    if (t["build" + feature]) try {
                        t["build" + feature](t, t.controls, t.layers, t.media)
                    } catch (e$$0) {}
                }
                t.container.trigger("controlsready");
                t.setPlayerSize(t.width, t.height);
                t.setControlsSize();
                if (t.isVideo) {
                    if (mejs.MediaFeatures.hasTouch) t.$media.bind("touchstart", function() {
                        if (t.controlsAreVisible) t.hideControls(false);
                        else if (t.controlsEnabled) t.showControls(false)
                    });
                    else {
                        t.clickToPlayPauseCallback = function() {
                            if (t.options.clickToPlayPause)
                                if (t.media.paused) t.play();
                                else t.pause()
                        };
                        t.media.addEventListener("click", t.clickToPlayPauseCallback, false);
                        t.container.bind("mouseenter mouseover", function() {
                            if (t.controlsEnabled)
                                if (!t.options.alwaysShowControls) {
                                    t.killControlsTimer("enter");
                                    t.showControls();
                                    t.startControlsTimer(2500)
                                }
                        }).bind("mousemove", function() {
                            if (t.controlsEnabled) {
                                if (!t.controlsAreVisible) t.showControls();
                                if (!t.options.alwaysShowControls) t.startControlsTimer(2500)
                            }
                        }).bind("mouseleave", function() {
                            if (t.controlsEnabled)
                                if (!t.media.paused && !t.options.alwaysShowControls) t.startControlsTimer(1E3)
                        })
                    }
                    if (t.options.hideVideoControlsOnLoad) t.hideControls(false);
                    if (autoplay && !t.options.alwaysShowControls) t.hideControls();
                    if (t.options.enableAutosize) t.media.addEventListener("loadedmetadata", function(e) {
                        if (t.options.videoHeight <= 0 && t.domNode.getAttribute("height") === null && !isNaN(e.target.videoHeight)) {
                            t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
                            t.setControlsSize();
                            t.media.setVideoSize(e.target.videoWidth, e.target.videoHeight)
                        }
                    }, false)
                }
                media.addEventListener("play", function() {
                    for (var playerIndex in mejs.players) {
                        var p = mejs.players[playerIndex];
                        if (p.id != t.id && t.options.pauseOtherPlayers && !p.paused && !p.ended) p.pause();
                        p.hasFocus = false
                    }
                    t.hasFocus = true
                }, false);
                t.media.addEventListener("ended", function(e) {
                    if (t.options.autoRewind) try {
                        t.media.setCurrentTime(0)
                    } catch (exp) {}
                    t.media.pause();
                    if (t.setProgressRail) t.setProgressRail();
                    if (t.setCurrentRail) t.setCurrentRail();
                    if (t.options.loop) t.play();
                    else if (!t.options.alwaysShowControls && t.controlsEnabled) t.showControls()
                }, false);
                t.media.addEventListener("loadedmetadata", function(e) {
                    if (t.updateDuration) t.updateDuration();
                    if (t.updateCurrent) t.updateCurrent();
                    if (!t.isFullScreen) {
                        t.setPlayerSize(t.width, t.height);
                        t.setControlsSize()
                    }
                }, false);
                setTimeout(function() {
                    t.setPlayerSize(t.width, t.height);
                    t.setControlsSize()
                }, 50);
                t.globalBind("resize", function() {
                    if (!(t.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen)) t.setPlayerSize(t.width, t.height);
                    t.setControlsSize()
                });
                if (t.media.pluginType == "youtube" && t.options.autoplay) t.container.find(".mejs-overlay-play").hide()
            }
            if (autoplay && media.pluginType ==
                "native") t.play();
            if (t.options.success)
                if (typeof t.options.success == "string") window[t.options.success](t.media, t.domNode, t);
                else t.options.success(t.media, t.domNode, t)
        },
        handleError: function(e) {
            var t = this;
            t.controls.hide();
            if (t.options.error) t.options.error(e)
        },
        setPlayerSize: function(width, height) {
            var t = this;
            if (!t.options.setDimensions) return false;
            if (typeof width != "undefined") t.width = width;
            if (typeof height != "undefined") t.height = height;
            if (t.height.toString().indexOf("%") > 0 || t.$node.css("max-width") ===
                "100%" || t.$node[0].currentStyle && t.$node[0].currentStyle.maxWidth === "100%") {
                var nativeWidth = function() {
                    if (t.isVideo)
                        if (t.media.videoWidth && t.media.videoWidth > 0) return t.media.videoWidth;
                        else if (t.media.getAttribute("width") !== null) return t.media.getAttribute("width");
                    else return t.options.defaultVideoWidth;
                    else return t.options.defaultAudioWidth
                }();
                var nativeHeight = function() {
                    if (t.isVideo)
                        if (t.media.videoHeight && t.media.videoHeight > 0) return t.media.videoHeight;
                        else if (t.media.getAttribute("height") !==
                        null) return t.media.getAttribute("height");
                    else return t.options.defaultVideoHeight;
                    else return t.options.defaultAudioHeight
                }();
                var parentWidth = t.container.parent().closest(":visible").width();
                var parentHeight = t.container.parent().closest(":visible").height();
                var newHeight = t.isVideo || !t.options.autosizeProgress ? parseInt(parentWidth * nativeHeight / nativeWidth, 10) : nativeHeight;
                if (isNaN(newHeight) || parentHeight != 0 && newHeight > parentHeight) newHeight = parentHeight;
                if (t.container.parent()[0].tagName.toLowerCase() ===
                    "body") {
                    parentWidth = $(window).width();
                    newHeight = $(window).height()
                }
                if (newHeight != 0 && parentWidth != 0) {
                    t.container.width(parentWidth).height(newHeight);
                    t.$media.add(t.container.find(".mejs-shim")).width("100%").height("100%");
                    if (t.isVideo)
                        if (t.media.setVideoSize) t.media.setVideoSize(parentWidth, newHeight);
                    t.layers.children(".mejs-layer").width("100%").height("100%")
                }
            } else {
                t.container.width(t.width).height(t.height);
                t.layers.children(".mejs-layer").width(t.width).height(t.height)
            }
            var playLayer = t.layers.find(".mejs-overlay-play");
            var playButton = playLayer.find(".mejs-overlay-button");
            playLayer.height(t.container.height() - t.controls.height());
            playButton.css("margin-top", "-" + (playButton.height() / 2 - t.controls.height() / 2).toString() + "px")
        },
        setControlsSize: function() {
            var t = this;
            var usedWidth = 0;
            var railWidth = 0;
            var rail = t.controls.find(".mejs-time-rail");
            var total = t.controls.find(".mejs-time-total");
            var current = t.controls.find(".mejs-time-current");
            var loaded = t.controls.find(".mejs-time-loaded");
            var others = rail.siblings();
            var lastControl =
                others.last();
            var lastControlPosition = null;
            if (!t.container.is(":visible") || !rail.length || !rail.is(":visible")) return;
            if (t.options && !t.options.autosizeProgress) railWidth = parseInt(rail.css("width"));
            if (railWidth === 0 || !railWidth) {
                others.each(function() {
                    var $this = $(this);
                    if ($this.css("position") != "absolute" && $this.is(":visible")) usedWidth += $(this).outerWidth(true)
                });
                railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.width())
            }
            do {
                rail.width(railWidth);
                total.width(railWidth - (total.outerWidth(true) -
                    total.width()));
                if (lastControl.css("position") != "absolute") {
                    lastControlPosition = lastControl.position();
                    railWidth--
                }
            } while (lastControlPosition != null && lastControlPosition.top > 0 && railWidth > 0);
            if (t.setProgressRail) t.setProgressRail();
            if (t.setCurrentRail) t.setCurrentRail()
        },
        buildposter: function(player, controls, layers, media) {
            var t = this;
            var poster = $('\x3cdiv class\x3d"mejs-poster mejs-layer"\x3e' + "\x3c/div\x3e").appendTo(layers);
            var posterUrl = player.$media.attr("poster");
            if (player.options.poster !== "") posterUrl =
                player.options.poster;
            if (posterUrl !== "" && posterUrl != null) t.setPoster(posterUrl);
            else poster.hide();
            media.addEventListener("play", function() {
                poster.hide()
            }, false);
            if (player.options.showPosterWhenEnded && player.options.autoRewind) media.addEventListener("ended", function() {
                poster.show()
            }, false)
        },
        setPoster: function(url) {
            var t = this;
            var posterDiv = t.container.find(".mejs-poster");
            var posterImg = posterDiv.find("img");
            if (posterImg.length == 0) posterImg = $('\x3cimg width\x3d"100%" height\x3d"100%" /\x3e').appendTo(posterDiv);
            posterImg.attr("src", url);
            posterDiv.css({
                "background-image": "url(" + url + ")"
            })
        },
        buildoverlays: function(player, controls, layers, media) {
            var t = this;
            if (!player.isVideo) return;
            var loading = $('\x3cdiv class\x3d"mejs-overlay mejs-layer"\x3e' + '\x3cdiv class\x3d"mejs-overlay-loading"\x3e\x3cspan\x3e\x3c/span\x3e\x3c/div\x3e' + "\x3c/div\x3e").hide().appendTo(layers);
            var error = $('\x3cdiv class\x3d"mejs-overlay mejs-layer"\x3e' + '\x3cdiv class\x3d"mejs-overlay-error"\x3e\x3c/div\x3e' + "\x3c/div\x3e").hide().appendTo(layers);
            var bigPlay = $('\x3cdiv class\x3d"mejs-overlay mejs-layer mejs-overlay-play"\x3e' + '\x3cdiv class\x3d"mejs-overlay-button"\x3e\x3c/div\x3e' + "\x3c/div\x3e").appendTo(layers).bind("click", function() {
                if (t.options.clickToPlayPause)
                    if (media.paused) media.play()
            });
            media.addEventListener("play", function() {
                bigPlay.hide();
                loading.hide();
                controls.find(".mejs-time-buffering").hide();
                error.hide()
            }, false);
            media.addEventListener("playing", function() {
                bigPlay.hide();
                loading.hide();
                controls.find(".mejs-time-buffering").hide();
                error.hide()
            }, false);
            media.addEventListener("seeking", function() {
                loading.show();
                controls.find(".mejs-time-buffering").show()
            }, false);
            media.addEventListener("seeked", function() {
                loading.hide();
                controls.find(".mejs-time-buffering").hide()
            }, false);
            media.addEventListener("pause", function() {
                if (!mejs.MediaFeatures.isiPhone) bigPlay.show()
            }, false);
            media.addEventListener("waiting", function() {
                loading.show();
                controls.find(".mejs-time-buffering").show()
            }, false);
            media.addEventListener("loadeddata", function() {
                loading.show();
                controls.find(".mejs-time-buffering").show()
            }, false);
            media.addEventListener("canplay", function() {
                loading.hide();
                controls.find(".mejs-time-buffering").hide()
            }, false);
            media.addEventListener("error", function() {
                loading.hide();
                controls.find(".mejs-time-buffering").hide();
                error.show();
                error.find("mejs-overlay-error").html("Error loading this resource")
            }, false);
            media.addEventListener("keydown", function(e) {
                t.onkeydown(player, media, e)
            }, false)
        },
        buildkeyboard: function(player, controls, layers, media) {
            var t = this;
            t.globalBind("keydown", function(e) {
                return t.onkeydown(player, media, e)
            });
            t.globalBind("click", function(event) {
                player.hasFocus = $(event.target).closest(".mejs-container").length != 0
            })
        },
        onkeydown: function(player, media, e) {
            if (player.hasFocus && player.options.enableKeyboard) {
                var i = 0;
                for (var il = player.options.keyActions.length; i < il; i++) {
                    var keyAction = player.options.keyActions[i];
                    var j = 0;
                    for (var jl = keyAction.keys.length; j < jl; j++)
                        if (e.keyCode == keyAction.keys[j]) {
                            if (typeof e.preventDefault == "function") e.preventDefault();
                            keyAction.action(player, media, e.keyCode);
                            return false
                        }
                }
            }
            return true
        },
        findTracks: function() {
            var t = this;
            var tracktags = t.$media.find("track");
            t.tracks = [];
            tracktags.each(function(index, track) {
                track = $(track);
                t.tracks.push({
                    srclang: track.attr("srclang") ? track.attr("srclang").toLowerCase() : "",
                    src: track.attr("src"),
                    kind: track.attr("kind"),
                    label: track.attr("label") || "",
                    entries: [],
                    isLoaded: false
                })
            })
        },
        changeSkin: function(className) {
            this.container[0].className = "mejs-container " + className;
            this.setPlayerSize(this.width,
                this.height);
            this.setControlsSize()
        },
        play: function() {
            this.load();
            this.media.play()
        },
        pause: function() {
            try {
                this.media.pause()
            } catch (e) {}
        },
        load: function() {
            if (!this.isLoaded) this.media.load();
            this.isLoaded = true
        },
        setMuted: function(muted) {
            this.media.setMuted(muted)
        },
        setCurrentTime: function(time) {
            this.media.setCurrentTime(time)
        },
        getCurrentTime: function() {
            return this.media.currentTime
        },
        setVolume: function(volume) {
            this.media.setVolume(volume)
        },
        getVolume: function() {
            return this.media.volume
        },
        setSrc: function(src) {
            this.media.setSrc(src)
        },
        remove: function() {
            var t = this;
            var featureIndex;
            var feature;
            for (featureIndex in t.options.features) {
                feature = t.options.features[featureIndex];
                if (t["clean" + feature]) try {
                    t["clean" + feature](t)
                } catch (e) {}
            }
            if (!t.isDynamic) {
                t.$media.prop("controls", true);
                t.$node.clone().insertBefore(t.container).show();
                t.$node.remove()
            } else t.$node.insertBefore(t.container);
            if (t.media.pluginType !== "native") t.media.remove();
            delete mejs.players[t.id];
            if (typeof t.container == "object") t.container.remove();
            t.globalUnbind();
            delete t.node.player
        }
    };
    (function() {
        function splitEvents(events, id) {
            var ret = {
                d: [],
                w: []
            };
            $.each((events || "").split(" "), function(k, v) {
                var eventname = v + "." + id;
                if (eventname.indexOf(".") === 0) {
                    ret.d.push(eventname);
                    ret.w.push(eventname)
                } else ret[rwindow.test(v) ? "w" : "d"].push(eventname)
            });
            ret.d = ret.d.join(" ");
            ret.w = ret.w.join(" ");
            return ret
        }
        var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
        mejs.MediaElementPlayer.prototype.globalBind = function(events,
            data, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if (events.d) $(document).bind(events.d, data, callback);
            if (events.w) $(window).bind(events.w, data, callback)
        };
        mejs.MediaElementPlayer.prototype.globalUnbind = function(events, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if (events.d) $(document).unbind(events.d, callback);
            if (events.w) $(window).unbind(events.w, callback)
        }
    })();
    if (typeof $ != "undefined") {
        $.fn.mediaelementplayer = function(options) {
            if (options === false) this.each(function() {
                var player =
                    $(this).data("mediaelementplayer");
                if (player) player.remove();
                $(this).removeData("mediaelementplayer")
            });
            else this.each(function() {
                $(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, options))
            });
            return this
        };
        $(document).ready(function() {
            $(".mejs-player").mediaelementplayer()
        })
    }
    window.MediaElementPlayer = mejs.MediaElementPlayer
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        playpauseText: mejs.i18n.t("Play/Pause")
    });
    $.extend(MediaElementPlayer.prototype, {
        buildplaypause: function(player, controls, layers, media) {
            var t = this;
            var play = $('\x3cdiv class\x3d"mejs-button mejs-playpause-button mejs-play" \x3e' + '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.playpauseText + '" aria-label\x3d"' + t.options.playpauseText + '"\x3e\x3c/button\x3e' + "\x3c/div\x3e").appendTo(controls).click(function(e) {
                e.preventDefault();
                if (media.paused) media.play();
                else media.pause();
                return false
            });
            media.addEventListener("play", function() {
                play.removeClass("mejs-play").addClass("mejs-pause")
            }, false);
            media.addEventListener("playing", function() {
                play.removeClass("mejs-play").addClass("mejs-pause")
            }, false);
            media.addEventListener("pause", function() {
                play.removeClass("mejs-pause").addClass("mejs-play")
            }, false);
            media.addEventListener("paused", function() {
                play.removeClass("mejs-pause").addClass("mejs-play")
            }, false)
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        stopText: "Stop"
    });
    $.extend(MediaElementPlayer.prototype, {
        buildstop: function(player, controls, layers, media) {
            var t = this;
            var stop = $('\x3cdiv class\x3d"mejs-button mejs-stop-button mejs-stop"\x3e' + '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.stopText + '" aria-label\x3d"' + t.options.stopText + '"\x3e\x3c/button\x3e' + "\x3c/div\x3e").appendTo(controls).click(function() {
                if (!media.paused) media.pause();
                if (media.currentTime > 0) {
                    media.setCurrentTime(0);
                    media.pause();
                    controls.find(".mejs-time-current").width("0px");
                    controls.find(".mejs-time-handle").css("left", "0px");
                    controls.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0));
                    controls.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0));
                    layers.find(".mejs-poster").show()
                }
            })
        }
    })
})(mejs.$);
(function($) {
    $.extend(MediaElementPlayer.prototype, {
        buildprogress: function(player, controls, layers, media) {
            $('\x3cdiv class\x3d"mejs-time-rail"\x3e' + '\x3cspan class\x3d"mejs-time-total"\x3e' + '\x3cspan class\x3d"mejs-time-buffering"\x3e\x3c/span\x3e' + '\x3cspan class\x3d"mejs-time-loaded"\x3e\x3c/span\x3e' + '\x3cspan class\x3d"mejs-time-current"\x3e\x3c/span\x3e' + '\x3cspan class\x3d"mejs-time-handle"\x3e\x3c/span\x3e' + '\x3cspan class\x3d"mejs-time-float"\x3e' + '\x3cspan class\x3d"mejs-time-float-current"\x3e00:00\x3c/span\x3e' +
                '\x3cspan class\x3d"mejs-time-float-corner"\x3e\x3c/span\x3e' + "\x3c/span\x3e" + "\x3c/span\x3e" + "\x3c/div\x3e").appendTo(controls);
            controls.find(".mejs-time-buffering").hide();
            var t = this;
            var total = controls.find(".mejs-time-total");
            var loaded = controls.find(".mejs-time-loaded");
            var current = controls.find(".mejs-time-current");
            var handle = controls.find(".mejs-time-handle");
            var timefloat = controls.find(".mejs-time-float");
            var timefloatcurrent = controls.find(".mejs-time-float-current");
            var handleMouseMove = function(e) {
                if (e.originalEvent.changedTouches) var x =
                    e.originalEvent.changedTouches[0].pageX;
                else x = e.pageX;
                var offset = total.offset();
                var width = total.outerWidth(true);
                var percentage = 0;
                var newTime = 0;
                var pos = 0;
                if (media.duration) {
                    if (x < offset.left) x = offset.left;
                    else if (x > width + offset.left) x = width + offset.left;
                    pos = x - offset.left;
                    percentage = pos / width;
                    newTime = percentage <= .02 ? 0 : percentage * media.duration;
                    if (mouseIsDown && newTime !== media.currentTime) media.setCurrentTime(newTime);
                    if (!mejs.MediaFeatures.hasTouch) {
                        timefloat.css("left", pos);
                        timefloatcurrent.html(mejs.Utility.secondsToTimeCode(newTime));
                        timefloat.show()
                    }
                }
            };
            var mouseIsDown = false;
            var mouseIsOver = false;
            total.bind("mousedown touchstart", function(e$$0) {
                if (e$$0.which === 1 || e$$0.which === 0) {
                    mouseIsDown = true;
                    handleMouseMove(e$$0);
                    t.globalBind("mousemove.dur touchmove.dur", function(e) {
                        handleMouseMove(e)
                    });
                    t.globalBind("mouseup.dur touchend.dur", function(e) {
                        mouseIsDown = false;
                        timefloat.hide();
                        t.globalUnbind(".dur")
                    });
                    return false
                }
            }).bind("mouseenter", function(e$$0) {
                mouseIsOver = true;
                t.globalBind("mousemove.dur", function(e) {
                    handleMouseMove(e)
                });
                if (!mejs.MediaFeatures.hasTouch) timefloat.show()
            }).bind("mouseleave", function(e) {
                mouseIsOver = false;
                if (!mouseIsDown) {
                    t.globalUnbind(".dur");
                    timefloat.hide()
                }
            });
            media.addEventListener("progress", function(e) {
                player.setProgressRail(e);
                player.setCurrentRail(e)
            }, false);
            media.addEventListener("timeupdate", function(e) {
                player.setProgressRail(e);
                player.setCurrentRail(e)
            }, false);
            t.loaded = loaded;
            t.total = total;
            t.current = current;
            t.handle = handle
        },
        setProgressRail: function(e) {
            var t = this;
            var target = e != undefined ? e.target :
                t.media;
            var percent = null;
            if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) percent = target.buffered.end(0) / target.duration;
            else if (target && target.bytesTotal != undefined && target.bytesTotal > 0 && target.bufferedBytes != undefined) percent = target.bufferedBytes / target.bytesTotal;
            else if (e && e.lengthComputable && e.total != 0) percent = e.loaded / e.total;
            if (percent !== null) {
                percent = Math.min(1, Math.max(0, percent));
                if (t.loaded && t.total) t.loaded.width(t.total.width() * percent)
            }
        },
        setCurrentRail: function() {
            var t =
                this;
            if (t.media.currentTime != undefined && t.media.duration)
                if (t.total && t.handle) {
                    var newWidth = Math.round(t.total.width() * t.media.currentTime / t.media.duration);
                    var handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2);
                    t.current.width(newWidth);
                    t.handle.css("left", handlePos)
                }
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        duration: -1,
        timeAndDurationSeparator: "\x3cspan\x3e | \x3c/span\x3e"
    });
    $.extend(MediaElementPlayer.prototype, {
        buildcurrent: function(player, controls, layers, media) {
            var t = this;
            $('\x3cdiv class\x3d"mejs-time"\x3e' + '\x3cspan class\x3d"mejs-currenttime"\x3e' + (player.options.alwaysShowHours ? "00:" : "") + (player.options.showTimecodeFrameCount ? "00:00:00" : "00:00") + "\x3c/span\x3e" + "\x3c/div\x3e").appendTo(controls);
            t.currenttime = t.controls.find(".mejs-currenttime");
            media.addEventListener("timeupdate",
                function() {
                    player.updateCurrent()
                }, false)
        },
        buildduration: function(player, controls, layers, media) {
            var t = this;
            if (controls.children().last().find(".mejs-currenttime").length > 0) $(t.options.timeAndDurationSeparator + '\x3cspan class\x3d"mejs-duration"\x3e' + (t.options.duration > 0 ? mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) : (player.options.alwaysShowHours ? "00:" : "") + (player.options.showTimecodeFrameCount ?
                "00:00:00" : "00:00")) + "\x3c/span\x3e").appendTo(controls.find(".mejs-time"));
            else {
                controls.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container");
                $('\x3cdiv class\x3d"mejs-time mejs-duration-container"\x3e' + '\x3cspan class\x3d"mejs-duration"\x3e' + (t.options.duration > 0 ? mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) : (player.options.alwaysShowHours ? "00:" : "") + (player.options.showTimecodeFrameCount ?
                    "00:00:00" : "00:00")) + "\x3c/span\x3e" + "\x3c/div\x3e").appendTo(controls)
            }
            t.durationD = t.controls.find(".mejs-duration");
            media.addEventListener("timeupdate", function() {
                player.updateDuration()
            }, false)
        },
        updateCurrent: function() {
            var t = this;
            if (t.currenttime) t.currenttime.html(mejs.Utility.secondsToTimeCode(t.media.currentTime, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25))
        },
        updateDuration: function() {
            var t = this;
            t.container.toggleClass("mejs-long-video",
                t.media.duration > 3600);
            if (t.durationD && (t.options.duration > 0 || t.media.duration)) t.durationD.html(mejs.Utility.secondsToTimeCode(t.options.duration > 0 ? t.options.duration : t.media.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25))
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        muteText: mejs.i18n.t("Mute Toggle"),
        hideVolumeOnTouchDevices: true,
        audioVolume: "horizontal",
        videoVolume: "vertical"
    });
    $.extend(MediaElementPlayer.prototype, {
        buildvolume: function(player, controls, layers, media) {
            if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices) return;
            var t = this;
            var mode = t.isVideo ? t.options.videoVolume : t.options.audioVolume;
            var mute = mode == "horizontal" ? $('\x3cdiv class\x3d"mejs-button mejs-volume-button mejs-mute"\x3e' +
                '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.muteText + '" aria-label\x3d"' + t.options.muteText + '"\x3e\x3c/button\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"mejs-horizontal-volume-slider"\x3e' + '\x3cdiv class\x3d"mejs-horizontal-volume-total"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-horizontal-volume-current"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-horizontal-volume-handle"\x3e\x3c/div\x3e' + "\x3c/div\x3e").appendTo(controls) : $('\x3cdiv class\x3d"mejs-button mejs-volume-button mejs-mute"\x3e' +
                '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.muteText + '" aria-label\x3d"' + t.options.muteText + '"\x3e\x3c/button\x3e' + '\x3cdiv class\x3d"mejs-volume-slider"\x3e' + '\x3cdiv class\x3d"mejs-volume-total"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-volume-current"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"mejs-volume-handle"\x3e\x3c/div\x3e' + "\x3c/div\x3e" + "\x3c/div\x3e").appendTo(controls);
            var volumeSlider = t.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider");
            var volumeTotal = t.container.find(".mejs-volume-total, .mejs-horizontal-volume-total");
            var volumeCurrent = t.container.find(".mejs-volume-current, .mejs-horizontal-volume-current");
            var volumeHandle = t.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle");
            var positionVolumeHandle = function(volume, secondTry) {
                if (!volumeSlider.is(":visible") && typeof secondTry == "undefined") {
                    volumeSlider.show();
                    positionVolumeHandle(volume, true);
                    volumeSlider.hide();
                    return
                }
                volume = Math.max(0, volume);
                volume = Math.min(volume,
                    1);
                if (volume == 0) mute.removeClass("mejs-mute").addClass("mejs-unmute");
                else mute.removeClass("mejs-unmute").addClass("mejs-mute");
                if (mode == "vertical") {
                    var totalHeight = volumeTotal.height();
                    var totalPosition = volumeTotal.position();
                    var newTop = totalHeight - totalHeight * volume;
                    volumeHandle.css("top", Math.round(totalPosition.top + newTop - volumeHandle.height() / 2));
                    volumeCurrent.height(totalHeight - newTop);
                    volumeCurrent.css("top", totalPosition.top + newTop)
                } else {
                    var totalWidth = volumeTotal.width();
                    totalPosition = volumeTotal.position();
                    var newLeft = totalWidth * volume;
                    volumeHandle.css("left", Math.round(totalPosition.left + newLeft - volumeHandle.width() / 2));
                    volumeCurrent.width(Math.round(newLeft))
                }
            };
            var handleVolumeMove = function(e) {
                var volume = null;
                var totalOffset = volumeTotal.offset();
                if (mode == "vertical") {
                    var railHeight = volumeTotal.height();
                    var totalTop = parseInt(volumeTotal.css("top").replace(/px/, ""), 10);
                    var newY = e.pageY - totalOffset.top;
                    volume = (railHeight - newY) / railHeight;
                    if (totalOffset.top == 0 || totalOffset.left == 0) return
                } else {
                    var railWidth =
                        volumeTotal.width();
                    var newX = e.pageX - totalOffset.left;
                    volume = newX / railWidth
                }
                volume = Math.max(0, volume);
                volume = Math.min(volume, 1);
                positionVolumeHandle(volume);
                if (volume == 0) media.setMuted(true);
                else media.setMuted(false);
                media.setVolume(volume)
            };
            var mouseIsDown = false;
            var mouseIsOver = false;
            mute.hover(function() {
                volumeSlider.show();
                mouseIsOver = true
            }, function() {
                mouseIsOver = false;
                if (!mouseIsDown && mode == "vertical") volumeSlider.hide()
            });
            volumeSlider.bind("mouseover", function() {
                mouseIsOver = true
            }).bind("mousedown",
                function(e$$0) {
                    handleVolumeMove(e$$0);
                    t.globalBind("mousemove.vol", function(e) {
                        handleVolumeMove(e)
                    });
                    t.globalBind("mouseup.vol", function() {
                        mouseIsDown = false;
                        t.globalUnbind(".vol");
                        if (!mouseIsOver && mode == "vertical") volumeSlider.hide()
                    });
                    mouseIsDown = true;
                    return false
                });
            mute.find("button").click(function() {
                media.setMuted(!media.muted)
            });
            media.addEventListener("volumechange", function(e) {
                if (!mouseIsDown)
                    if (media.muted) {
                        positionVolumeHandle(0);
                        mute.removeClass("mejs-mute").addClass("mejs-unmute")
                    } else {
                        positionVolumeHandle(media.volume);
                        mute.removeClass("mejs-unmute").addClass("mejs-mute")
                    }
            }, false);
            if (t.container.is(":visible")) {
                positionVolumeHandle(player.options.startVolume);
                if (player.options.startVolume === 0) media.setMuted(true);
                if (media.pluginType === "native") media.setVolume(player.options.startVolume)
            }
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        usePluginFullScreen: true,
        newWindowCallback: function() {
            return ""
        },
        fullscreenText: mejs.i18n.t("Fullscreen")
    });
    $.extend(MediaElementPlayer.prototype, {
        isFullScreen: false,
        isNativeFullScreen: false,
        isInIframe: false,
        buildfullscreen: function(player, controls, layers, media) {
            if (!player.isVideo) return;
            player.isInIframe = window.location != window.parent.location;
            if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
                var func = function(e) {
                    if (player.isFullScreen)
                        if (mejs.MediaFeatures.isFullScreen()) {
                            player.isNativeFullScreen =
                                true;
                            player.setControlsSize()
                        } else {
                            player.isNativeFullScreen = false;
                            player.exitFullScreen()
                        }
                };
                player.globalBind(mejs.MediaFeatures.fullScreenEventName, func)
            }
            var t = this;
            var normalHeight = 0;
            var normalWidth = 0;
            var container = player.container;
            var fullscreenBtn = $('\x3cdiv class\x3d"mejs-button mejs-fullscreen-button"\x3e' + '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.fullscreenText + '" aria-label\x3d"' + t.options.fullscreenText + '"\x3e\x3c/button\x3e' + "\x3c/div\x3e").appendTo(controls);
            if (t.media.pluginType === "native" || !t.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox) fullscreenBtn.click(function() {
                var isFullScreen = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || player.isFullScreen;
                if (isFullScreen) player.exitFullScreen();
                else player.enterFullScreen()
            });
            else {
                var hideTimeout = null;
                var supportsPointerEvents = function() {
                    var element = document.createElement("x");
                    var documentElement = document.documentElement;
                    var getComputedStyle = window.getComputedStyle;
                    var supports;
                    if (!("pointerEvents" in element.style)) return false;
                    element.style.pointerEvents = "auto";
                    element.style.pointerEvents = "x";
                    documentElement.appendChild(element);
                    supports = getComputedStyle && getComputedStyle(element, "").pointerEvents === "auto";
                    documentElement.removeChild(element);
                    return !!supports
                }();
                if (supportsPointerEvents && !mejs.MediaFeatures.isOpera) {
                    var fullscreenIsDisabled = false;
                    var restoreControls = function() {
                        if (fullscreenIsDisabled) {
                            for (var i in hoverDivs) hoverDivs[i].hide();
                            fullscreenBtn.css("pointer-events",
                                "");
                            t.controls.css("pointer-events", "");
                            t.media.removeEventListener("click", t.clickToPlayPauseCallback);
                            fullscreenIsDisabled = false
                        }
                    };
                    var hoverDivs = {};
                    var hoverDivNames = ["top", "left", "right", "bottom"];
                    var i$$0;
                    var len;
                    var positionHoverDivs = function() {
                        var fullScreenBtnOffsetLeft = fullscreenBtn.offset().left - t.container.offset().left;
                        var fullScreenBtnOffsetTop = fullscreenBtn.offset().top - t.container.offset().top;
                        var fullScreenBtnWidth = fullscreenBtn.outerWidth(true);
                        var fullScreenBtnHeight = fullscreenBtn.outerHeight(true);
                        var containerWidth = t.container.width();
                        var containerHeight = t.container.height();
                        for (i$$0 in hoverDivs) hoverDivs[i$$0].css({
                            position: "absolute",
                            top: 0,
                            left: 0
                        });
                        hoverDivs["top"].width(containerWidth).height(fullScreenBtnOffsetTop);
                        hoverDivs["left"].width(fullScreenBtnOffsetLeft).height(fullScreenBtnHeight).css({
                            top: fullScreenBtnOffsetTop
                        });
                        hoverDivs["right"].width(containerWidth - fullScreenBtnOffsetLeft - fullScreenBtnWidth).height(fullScreenBtnHeight).css({
                            top: fullScreenBtnOffsetTop,
                            left: fullScreenBtnOffsetLeft +
                                fullScreenBtnWidth
                        });
                        hoverDivs["bottom"].width(containerWidth).height(containerHeight - fullScreenBtnHeight - fullScreenBtnOffsetTop).css({
                            top: fullScreenBtnOffsetTop + fullScreenBtnHeight
                        })
                    };
                    t.globalBind("resize", function() {
                        positionHoverDivs()
                    });
                    for (i$$0 = 0, len = hoverDivNames.length; i$$0 < len; i$$0++) hoverDivs[hoverDivNames[i$$0]] = $('\x3cdiv class\x3d"mejs-fullscreen-hover" /\x3e').appendTo(t.container).mouseover(restoreControls).hide();
                    fullscreenBtn.on("mouseover", function() {
                        if (!t.isFullScreen) {
                            var buttonPos =
                                fullscreenBtn.offset();
                            var containerPos = player.container.offset();
                            media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, false);
                            fullscreenBtn.css("pointer-events", "none");
                            t.controls.css("pointer-events", "none");
                            t.media.addEventListener("click", t.clickToPlayPauseCallback);
                            for (i$$0 in hoverDivs) hoverDivs[i$$0].show();
                            positionHoverDivs();
                            fullscreenIsDisabled = true
                        }
                    });
                    media.addEventListener("fullscreenchange", function(e) {
                        t.isFullScreen = !t.isFullScreen;
                        if (t.isFullScreen) t.media.removeEventListener("click",
                            t.clickToPlayPauseCallback);
                        else t.media.addEventListener("click", t.clickToPlayPauseCallback);
                        restoreControls()
                    });
                    t.globalBind("mousemove", function(e) {
                        if (fullscreenIsDisabled) {
                            var fullscreenBtnPos = fullscreenBtn.offset();
                            if (e.pageY < fullscreenBtnPos.top || e.pageY > fullscreenBtnPos.top + fullscreenBtn.outerHeight(true) || e.pageX < fullscreenBtnPos.left || e.pageX > fullscreenBtnPos.left + fullscreenBtn.outerWidth(true)) {
                                fullscreenBtn.css("pointer-events", "");
                                t.controls.css("pointer-events", "");
                                fullscreenIsDisabled =
                                    false
                            }
                        }
                    })
                } else fullscreenBtn.on("mouseover", function() {
                    if (hideTimeout !== null) {
                        clearTimeout(hideTimeout);
                        delete hideTimeout
                    }
                    var buttonPos = fullscreenBtn.offset();
                    var containerPos = player.container.offset();
                    media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, true)
                }).on("mouseout", function() {
                    if (hideTimeout !== null) {
                        clearTimeout(hideTimeout);
                        delete hideTimeout
                    }
                    hideTimeout = setTimeout(function() {
                        media.hideFullscreenButton()
                    }, 1500)
                })
            }
            player.fullscreenBtn = fullscreenBtn;
            t.globalBind("keydown", function(e) {
                if ((mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || t.isFullScreen) && e.keyCode == 27) player.exitFullScreen()
            })
        },
        cleanfullscreen: function(player) {
            player.exitFullScreen()
        },
        containerSizeTimeout: null,
        enterFullScreen: function() {
            var t = this;
            if (t.media.pluginType !== "native" && (mejs.MediaFeatures.isFirefox || t.options.usePluginFullScreen)) return;
            $(document.documentElement).addClass("mejs-fullscreen");
            normalHeight = t.container.height();
            normalWidth =
                t.container.width();
            if (t.media.pluginType === "native")
                if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
                    mejs.MediaFeatures.requestFullScreen(t.container[0]);
                    if (t.isInIframe) setTimeout(function checkFullscreen() {
                        if (t.isNativeFullScreen) {
                            var zoomMultiplier = window["devicePixelRatio"] || 1;
                            var percentErrorMargin = .002;
                            var windowWidth = zoomMultiplier * $(window).width();
                            var screenWidth = screen.width;
                            var absDiff = Math.abs(screenWidth - windowWidth);
                            var marginError = screenWidth * percentErrorMargin;
                            if (absDiff > marginError) t.exitFullScreen();
                            else setTimeout(checkFullscreen, 500)
                        }
                    }, 500)
                } else if (mejs.MediaFeatures.hasSemiNativeFullScreen) {
                t.media.webkitEnterFullscreen();
                return
            }
            if (t.isInIframe) {
                var url = t.options.newWindowCallback(this);
                if (url !== "")
                    if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
                        t.pause();
                        window.open(url, t.id, "top\x3d0,left\x3d0,width\x3d" + screen.availWidth + ",height\x3d" + screen.availHeight + ",resizable\x3dyes,scrollbars\x3dno,status\x3dno,toolbar\x3dno");
                        return
                    } else setTimeout(function() {
                        if (!t.isNativeFullScreen) {
                            t.pause();
                            window.open(url, t.id, "top\x3d0,left\x3d0,width\x3d" + screen.availWidth + ",height\x3d" + screen.availHeight + ",resizable\x3dyes,scrollbars\x3dno,status\x3dno,toolbar\x3dno")
                        }
                    }, 250)
            }
            t.container.addClass("mejs-container-fullscreen").width("100%").height("100%");
            t.containerSizeTimeout = setTimeout(function() {
                t.container.css({
                    width: "100%",
                    height: "100%"
                });
                t.setControlsSize()
            }, 500);
            if (t.media.pluginType === "native") t.$media.width("100%").height("100%");
            else {
                t.container.find(".mejs-shim").width("100%").height("100%");
                t.media.setVideoSize($(window).width(), $(window).height())
            }
            t.layers.children("div").width("100%").height("100%");
            if (t.fullscreenBtn) t.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen");
            t.setControlsSize();
            t.isFullScreen = true;
            t.container.find(".mejs-captions-text").css("font-size", screen.width / t.width * 1 * 100 + "%");
            t.container.find(".mejs-captions-position").css("bottom", "45px")
        },
        exitFullScreen: function() {
            var t = this;
            clearTimeout(t.containerSizeTimeout);
            if (t.media.pluginType !==
                "native" && mejs.MediaFeatures.isFirefox) {
                t.media.setFullscreen(false);
                return
            }
            if (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen)) mejs.MediaFeatures.cancelFullScreen();
            $(document.documentElement).removeClass("mejs-fullscreen");
            t.container.removeClass("mejs-container-fullscreen").width(normalWidth).height(normalHeight);
            if (t.media.pluginType === "native") t.$media.width(normalWidth).height(normalHeight);
            else {
                t.container.find(".mejs-shim").width(normalWidth).height(normalHeight);
                t.media.setVideoSize(normalWidth, normalHeight)
            }
            t.layers.children("div").width(normalWidth).height(normalHeight);
            t.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen");
            t.setControlsSize();
            t.isFullScreen = false;
            t.container.find(".mejs-captions-text").css("font-size", "");
            t.container.find(".mejs-captions-position").css("bottom", "")
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        speeds: ["1.50", "1.25", "1.00", "0.75"],
        defaultSpeed: "1.00"
    });
    $.extend(MediaElementPlayer.prototype, {
        buildspeed: function(player, controls, layers, media) {
            var t = this;
            if (t.media.pluginType == "native") {
                var s = '\x3cdiv class\x3d"mejs-button mejs-speed-button"\x3e\x3cbutton type\x3d"button"\x3e' + t.options.defaultSpeed + 'x\x3c/button\x3e\x3cdiv class\x3d"mejs-speed-selector"\x3e\x3cul\x3e';
                var i;
                var ss;
                if ($.inArray(t.options.defaultSpeed, t.options.speeds) === -1) t.options.speeds.push(t.options.defaultSpeed);
                t.options.speeds.sort(function(a, b) {
                    return parseFloat(b) - parseFloat(a)
                });
                for (i = 0; i < t.options.speeds.length; i++) {
                    s += '\x3cli\x3e\x3cinput type\x3d"radio" name\x3d"speed" value\x3d"' + t.options.speeds[i] + '" id\x3d"' + t.options.speeds[i] + '" ';
                    if (t.options.speeds[i] == t.options.defaultSpeed) {
                        s += "checked\x3dtrue ";
                        s += '/\x3e\x3clabel for\x3d"' + t.options.speeds[i] + '" class\x3d"mejs-speed-selected"\x3e' + t.options.speeds[i] + "x\x3c/label\x3e\x3c/li\x3e"
                    } else s += '/\x3e\x3clabel for\x3d"' + t.options.speeds[i] + '"\x3e' +
                        t.options.speeds[i] + "x\x3c/label\x3e\x3c/li\x3e"
                }
                s += "\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e";
                player.speedButton = $(s).appendTo(controls);
                player.playbackspeed = t.options.defaultSpeed;
                player.speedButton.on("click", "input[type\x3dradio]", function() {
                    player.playbackspeed = $(this).attr("value");
                    media.playbackRate = parseFloat(player.playbackspeed);
                    player.speedButton.find("button").text(player.playbackspeed + "x");
                    player.speedButton.find(".mejs-speed-selected").removeClass("mejs-speed-selected");
                    player.speedButton.find("input[type\x3dradio]:checked").next().addClass("mejs-speed-selected")
                });
                ss = player.speedButton.find(".mejs-speed-selector");
                ss.height(this.speedButton.find(".mejs-speed-selector ul").outerHeight(true) + player.speedButton.find(".mejs-speed-translations").outerHeight(true));
                ss.css("top", -1 * ss.height() + "px")
            }
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        startLanguage: "",
        tracksText: mejs.i18n.t("Captions/Subtitles"),
        hideCaptionsButtonWhenEmpty: true,
        toggleCaptionsButtonWhenOnlyOne: false,
        slidesSelector: ""
    });
    $.extend(MediaElementPlayer.prototype, {
        hasChapters: false,
        buildtracks: function(player, controls, layers, media) {
            if (player.tracks.length === 0) return;
            var t = this;
            var i;
            var options = "";
            if (t.domNode.textTracks)
                for (i = t.domNode.textTracks.length - 1; i >= 0; i--) t.domNode.textTracks[i].mode = "hidden";
            player.chapters = $('\x3cdiv class\x3d"mejs-chapters mejs-layer"\x3e\x3c/div\x3e').prependTo(layers).hide();
            player.captions = $('\x3cdiv class\x3d"mejs-captions-layer mejs-layer"\x3e\x3cdiv class\x3d"mejs-captions-position mejs-captions-position-hover"\x3e\x3cspan class\x3d"mejs-captions-text"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e').prependTo(layers).hide();
            player.captionsText = player.captions.find(".mejs-captions-text");
            player.captionsButton = $('\x3cdiv class\x3d"mejs-button mejs-captions-button"\x3e' + '\x3cbutton type\x3d"button" aria-controls\x3d"' + t.id + '" title\x3d"' + t.options.tracksText + '" aria-label\x3d"' +
                t.options.tracksText + '"\x3e\x3c/button\x3e' + '\x3cdiv class\x3d"mejs-captions-selector"\x3e' + "\x3cul\x3e" + "\x3cli\x3e" + '\x3cinput type\x3d"radio" name\x3d"' + player.id + '_captions" id\x3d"' + player.id + '_captions_none" value\x3d"none" checked\x3d"checked" /\x3e' + '\x3clabel for\x3d"' + player.id + '_captions_none"\x3e' + mejs.i18n.t("None") + "\x3c/label\x3e" + "\x3c/li\x3e" + "\x3c/ul\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e").appendTo(controls);
            var subtitleCount = 0;
            for (i = 0; i < player.tracks.length; i++)
                if (player.tracks[i].kind ==
                    "subtitles") subtitleCount++;
            if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitleCount == 1) player.captionsButton.on("click", function() {
                if (player.selectedTrack === null) lang = player.tracks[0].srclang;
                else lang = "none";
                player.setTrack(lang)
            });
            else {
                player.captionsButton.on("mouseenter focusin", function() {
                    $(this).find(".mejs-captions-selector").css("visibility", "visible")
                }).on("click", "input[type\x3dradio]", function() {
                    lang = this.value;
                    player.setTrack(lang)
                });
                player.captionsButton.on("mouseleave focusout",
                    function() {
                        $(this).find(".mejs-captions-selector").css("visibility", "hidden")
                    })
            }
            if (!player.options.alwaysShowControls) player.container.bind("controlsshown", function() {
                player.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")
            }).bind("controlshidden", function() {
                if (!media.paused) player.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")
            });
            else player.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover");
            player.trackToLoad = -1;
            player.selectedTrack = null;
            player.isLoadingTrack = false;
            for (i = 0; i < player.tracks.length; i++)
                if (player.tracks[i].kind == "subtitles") player.addTrackButton(player.tracks[i].srclang, player.tracks[i].label);
            player.loadNextTrack();
            media.addEventListener("timeupdate", function(e) {
                player.displayCaptions()
            }, false);
            if (player.options.slidesSelector !== "") {
                player.slidesContainer = $(player.options.slidesSelector);
                media.addEventListener("timeupdate", function(e) {
                    player.displaySlides()
                }, false)
            }
            media.addEventListener("loadedmetadata",
                function(e) {
                    player.displayChapters()
                }, false);
            player.container.hover(function() {
                if (player.hasChapters) {
                    player.chapters.css("visibility", "visible");
                    player.chapters.fadeIn(200).height(player.chapters.find(".mejs-chapter").outerHeight())
                }
            }, function() {
                if (player.hasChapters && !media.paused) player.chapters.fadeOut(200, function() {
                    $(this).css("visibility", "hidden");
                    $(this).css("display", "block")
                })
            });
            if (player.node.getAttribute("autoplay") !== null) player.chapters.css("visibility", "hidden")
        },
        setTrack: function(lang) {
            var t =
                this;
            var i;
            if (lang == "none") {
                t.selectedTrack = null;
                t.captionsButton.removeClass("mejs-captions-enabled")
            } else
                for (i = 0; i < t.tracks.length; i++)
                    if (t.tracks[i].srclang == lang) {
                        if (t.selectedTrack === null) t.captionsButton.addClass("mejs-captions-enabled");
                        t.selectedTrack = t.tracks[i];
                        t.captions.attr("lang", t.selectedTrack.srclang);
                        t.displayCaptions();
                        break
                    }
        },
        loadNextTrack: function() {
            var t = this;
            t.trackToLoad++;
            if (t.trackToLoad < t.tracks.length) {
                t.isLoadingTrack = true;
                t.loadTrack(t.trackToLoad)
            } else {
                t.isLoadingTrack =
                    false;
                t.checkForTracks()
            }
        },
        loadTrack: function(index) {
            var t = this;
            var track = t.tracks[index];
            var after = function() {
                track.isLoaded = true;
                t.enableTrackButton(track.srclang, track.label);
                t.loadNextTrack()
            };
            $.ajax({
                url: track.src,
                dataType: "text",
                success: function(d) {
                    if (typeof d == "string" && /<tt\s+xml/ig.exec(d)) track.entries = mejs.TrackFormatParser.dfxp.parse(d);
                    else track.entries = mejs.TrackFormatParser.webvtt.parse(d);
                    after();
                    if (track.kind == "chapters") t.media.addEventListener("play", function(e) {
                        if (t.media.duration >
                            0) t.displayChapters(track)
                    }, false);
                    if (track.kind == "slides") t.setupSlides(track)
                },
                error: function() {
                    t.loadNextTrack()
                }
            })
        },
        enableTrackButton: function(lang, label) {
            var t = this;
            if (label === "") label = mejs.language.codes[lang] || lang;
            t.captionsButton.find("input[value\x3d" + lang + "]").prop("disabled", false).siblings("label").html(label);
            if (t.options.startLanguage == lang) $("#" + t.id + "_captions_" + lang).prop("checked", true).trigger("click");
            t.adjustLanguageBox()
        },
        addTrackButton: function(lang, label) {
            var t = this;
            if (label ===
                "") label = mejs.language.codes[lang] || lang;
            t.captionsButton.find("ul").append($("\x3cli\x3e" + '\x3cinput type\x3d"radio" name\x3d"' + t.id + '_captions" id\x3d"' + t.id + "_captions_" + lang + '" value\x3d"' + lang + '" disabled\x3d"disabled" /\x3e' + '\x3clabel for\x3d"' + t.id + "_captions_" + lang + '"\x3e' + label + " (loading)" + "\x3c/label\x3e" + "\x3c/li\x3e"));
            t.adjustLanguageBox();
            t.container.find(".mejs-captions-translations option[value\x3d" + lang + "]").remove()
        },
        adjustLanguageBox: function() {
            var t = this;
            t.captionsButton.find(".mejs-captions-selector").height(t.captionsButton.find(".mejs-captions-selector ul").outerHeight(true) +
                t.captionsButton.find(".mejs-captions-translations").outerHeight(true))
        },
        checkForTracks: function() {
            var t = this;
            var hasSubtitles = false;
            if (t.options.hideCaptionsButtonWhenEmpty) {
                for (i = 0; i < t.tracks.length; i++)
                    if (t.tracks[i].kind == "subtitles") {
                        hasSubtitles = true;
                        break
                    }
                if (!hasSubtitles) {
                    t.captionsButton.hide();
                    t.setControlsSize()
                }
            }
        },
        displayCaptions: function() {
            if (typeof this.tracks == "undefined") return;
            var t = this;
            var i;
            var track = t.selectedTrack;
            if (track !== null && track.isLoaded) {
                for (i = 0; i < track.entries.times.length; i++)
                    if (t.media.currentTime >=
                        track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop) {
                        t.captionsText.html(track.entries.text[i]).attr("class", "mejs-captions-text " + (track.entries.times[i].identifier || ""));
                        t.captions.show().height(0);
                        return
                    }
                t.captions.hide()
            } else t.captions.hide()
        },
        setupSlides: function(track) {
            var t = this;
            t.slides = track;
            t.slides.entries.imgs = [t.slides.entries.text.length];
            t.showSlide(0)
        },
        showSlide: function(index) {
            if (typeof this.tracks == "undefined" || typeof this.slidesContainer == "undefined") return;
            var t = this;
            var url = t.slides.entries.text[index];
            var img = t.slides.entries.imgs[index];
            if (typeof img == "undefined" || typeof img.fadeIn == "undefined") t.slides.entries.imgs[index] = img = $('\x3cimg src\x3d"' + url + '"\x3e').on("load", function() {
                img.appendTo(t.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
            });
            else if (!img.is(":visible") && !img.is(":animated")) img.fadeIn().siblings(":visible").fadeOut()
        },
        displaySlides: function() {
            if (typeof this.slides == "undefined") return;
            var t = this;
            var slides = t.slides;
            var i;
            for (i = 0; i < slides.entries.times.length; i++)
                if (t.media.currentTime >= slides.entries.times[i].start && t.media.currentTime <= slides.entries.times[i].stop) {
                    t.showSlide(i);
                    return
                }
        },
        displayChapters: function() {
            var t = this;
            var i;
            for (i = 0; i < t.tracks.length; i++)
                if (t.tracks[i].kind == "chapters" && t.tracks[i].isLoaded) {
                    t.drawChapters(t.tracks[i]);
                    t.hasChapters = true;
                    break
                }
        },
        drawChapters: function(chapters) {
            var t = this;
            var i;
            var dur;
            var percent = 0;
            var usedPercent = 0;
            t.chapters.empty();
            for (i = 0; i < chapters.entries.times.length; i++) {
                dur =
                    chapters.entries.times[i].stop - chapters.entries.times[i].start;
                percent = Math.floor(dur / t.media.duration * 100);
                if (percent + usedPercent > 100 || i == chapters.entries.times.length - 1 && percent + usedPercent < 100) percent = 100 - usedPercent;
                t.chapters.append($('\x3cdiv class\x3d"mejs-chapter" rel\x3d"' + chapters.entries.times[i].start + '" style\x3d"left: ' + usedPercent.toString() + "%;width: " + percent.toString() + '%;"\x3e' + '\x3cdiv class\x3d"mejs-chapter-block' + (i == chapters.entries.times.length - 1 ? " mejs-chapter-block-last" :
                    "") + '"\x3e' + '\x3cspan class\x3d"ch-title"\x3e' + chapters.entries.text[i] + "\x3c/span\x3e" + '\x3cspan class\x3d"ch-time"\x3e' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].start) + "\x26ndash;" + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].stop) + "\x3c/span\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e"));
                usedPercent += percent
            }
            t.chapters.find("div.mejs-chapter").click(function() {
                t.media.setCurrentTime(parseFloat($(this).attr("rel")));
                if (t.media.paused) t.media.play()
            });
            t.chapters.show()
        }
    });
    mejs.language = {
        codes: {
            af: "Afrikaans",
            sq: "Albanian",
            ar: "Arabic",
            be: "Belarusian",
            bg: "Bulgarian",
            ca: "Catalan",
            zh: "Chinese",
            "zh-cn": "Chinese Simplified",
            "zh-tw": "Chinese Traditional",
            hr: "Croatian",
            cs: "Czech",
            da: "Danish",
            nl: "Dutch",
            en: "English",
            et: "Estonian",
            fl: "Filipino",
            fi: "Finnish",
            fr: "French",
            gl: "Galician",
            de: "German",
            el: "Greek",
            ht: "Haitian Creole",
            iw: "Hebrew",
            hi: "Hindi",
            hu: "Hungarian",
            is: "Icelandic",
            id: "Indonesian",
            ga: "Irish",
            it: "Italian",
            ja: "Japanese",
            ko: "Korean",
            lv: "Latvian",
            lt: "Lithuanian",
            mk: "Macedonian",
            ms: "Malay",
            mt: "Maltese",
            no: "Norwegian",
            fa: "Persian",
            pl: "Polish",
            pt: "Portuguese",
            ro: "Romanian",
            ru: "Russian",
            sr: "Serbian",
            sk: "Slovak",
            sl: "Slovenian",
            es: "Spanish",
            sw: "Swahili",
            sv: "Swedish",
            tl: "Tagalog",
            th: "Thai",
            tr: "Turkish",
            uk: "Ukrainian",
            vi: "Vietnamese",
            cy: "Welsh",
            yi: "Yiddish"
        }
    };
    mejs.TrackFormatParser = {
        webvtt: {
            pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
            parse: function(trackText) {
                var i = 0;
                var lines = mejs.TrackFormatParser.split2(trackText,
                    /\r?\n/);
                var entries = {
                    text: [],
                    times: []
                };
                var timecode;
                var text;
                for (var identifier; i < lines.length; i++) {
                    timecode = this.pattern_timecode.exec(lines[i]);
                    if (timecode && i < lines.length) {
                        if (i - 1 >= 0 && lines[i - 1] !== "") identifier = lines[i - 1];
                        i++;
                        text = lines[i];
                        for (i++; lines[i] !== "" && i < lines.length;) {
                            text = text + "\n" + lines[i];
                            i++
                        }
                        text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "\x3ca href\x3d'$1' target\x3d'_blank'\x3e$1\x3c/a\x3e");
                        entries.text.push(text);
                        entries.times.push({
                            identifier: identifier,
                            start: mejs.Utility.convertSMPTEtoSeconds(timecode[1]) === 0 ? .2 : mejs.Utility.convertSMPTEtoSeconds(timecode[1]),
                            stop: mejs.Utility.convertSMPTEtoSeconds(timecode[3]),
                            settings: timecode[5]
                        })
                    }
                    identifier = ""
                }
                return entries
            }
        },
        dfxp: {
            parse: function(trackText) {
                trackText = $(trackText).filter("tt");
                var i = 0;
                var container = trackText.children("div").eq(0);
                var lines = container.find("p");
                var styleNode = trackText.find("#" + container.attr("style"));
                var styles;
                var begin;
                var end;
                var text;
                var entries = {
                    text: [],
                    times: []
                };
                if (styleNode.length) {
                    var attributes =
                        styleNode.removeAttr("id").get(0).attributes;
                    if (attributes.length) {
                        styles = {};
                        for (i = 0; i < attributes.length; i++) styles[attributes[i].name.split(":")[1]] = attributes[i].value
                    }
                }
                for (i = 0; i < lines.length; i++) {
                    var style;
                    var _temp_times = {
                        start: null,
                        stop: null,
                        style: null
                    };
                    if (lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("begin"));
                    if (!_temp_times.start && lines.eq(i - 1).attr("end")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i - 1).attr("end"));
                    if (lines.eq(i).attr("end")) _temp_times.stop =
                        mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("end"));
                    if (!_temp_times.stop && lines.eq(i + 1).attr("begin")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i + 1).attr("begin"));
                    if (styles) {
                        style = "";
                        for (var _style in styles) style += _style + ":" + styles[_style] + ";"
                    }
                    if (style) _temp_times.style = style;
                    if (_temp_times.start === 0) _temp_times.start = .2;
                    entries.times.push(_temp_times);
                    text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                        "\x3ca href\x3d'$1' target\x3d'_blank'\x3e$1\x3c/a\x3e");
                    entries.text.push(text);
                    if (entries.times.start === 0) entries.times.start = 2
                }
                return entries
            }
        },
        split2: function(text, regex) {
            return text.split(regex)
        }
    };
    if ("x\n\ny".split(/\n/gi).length != 3) mejs.TrackFormatParser.split2 = function(text, regex) {
        var parts = [];
        var chunk = "";
        var i;
        for (i = 0; i < text.length; i++) {
            chunk += text.substring(i, i + 1);
            if (regex.test(chunk)) {
                parts.push(chunk.replace(regex, ""));
                chunk = ""
            }
        }
        parts.push(chunk);
        return parts
    }
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        "contextMenuItems": [{
            render: function(player) {
                if (typeof player.enterFullScreen == "undefined") return null;
                if (player.isFullScreen) return mejs.i18n.t("Turn off Fullscreen");
                else return mejs.i18n.t("Go Fullscreen")
            },
            click: function(player) {
                if (player.isFullScreen) player.exitFullScreen();
                else player.enterFullScreen()
            }
        }, {
            render: function(player) {
                if (player.media.muted) return mejs.i18n.t("Unmute");
                else return mejs.i18n.t("Mute")
            },
            click: function(player) {
                if (player.media.muted) player.setMuted(false);
                else player.setMuted(true)
            }
        }, {
            isSeparator: true
        }, {
            render: function(player) {
                return mejs.i18n.t("Download Video")
            },
            click: function(player) {
                window.location.href = player.media.currentSrc
            }
        }]
    });
    $.extend(MediaElementPlayer.prototype, {
        buildcontextmenu: function(player, controls, layers, media) {
            player.contextMenu = $('\x3cdiv class\x3d"mejs-contextmenu"\x3e\x3c/div\x3e').appendTo($("body")).hide();
            player.container.bind("contextmenu", function(e) {
                if (player.isContextMenuEnabled) {
                    e.preventDefault();
                    player.renderContextMenu(e.clientX -
                        1, e.clientY - 1);
                    return false
                }
            });
            player.container.bind("click", function() {
                player.contextMenu.hide()
            });
            player.contextMenu.bind("mouseleave", function() {
                player.startContextMenuTimer()
            })
        },
        cleancontextmenu: function(player) {
            player.contextMenu.remove()
        },
        isContextMenuEnabled: true,
        enableContextMenu: function() {
            this.isContextMenuEnabled = true
        },
        disableContextMenu: function() {
            this.isContextMenuEnabled = false
        },
        contextMenuTimeout: null,
        startContextMenuTimer: function() {
            var t = this;
            t.killContextMenuTimer();
            t.contextMenuTimer =
                setTimeout(function() {
                    t.hideContextMenu();
                    t.killContextMenuTimer()
                }, 750)
        },
        killContextMenuTimer: function() {
            var timer = this.contextMenuTimer;
            if (timer != null) {
                clearTimeout(timer);
                delete timer;
                timer = null
            }
        },
        hideContextMenu: function() {
            this.contextMenu.hide()
        },
        renderContextMenu: function(x, y) {
            var t = this;
            var html = "";
            var items = t.options.contextMenuItems;
            var i = 0;
            for (var il = items.length; i < il; i++)
                if (items[i].isSeparator) html += '\x3cdiv class\x3d"mejs-contextmenu-separator"\x3e\x3c/div\x3e';
                else {
                    var rendered = items[i].render(t);
                    if (rendered != null) html += '\x3cdiv class\x3d"mejs-contextmenu-item" data-itemindex\x3d"' + i + '" id\x3d"element-' + Math.random() * 1E6 + '"\x3e' + rendered + "\x3c/div\x3e"
                }
            t.contextMenu.empty().append($(html)).css({
                top: y,
                left: x
            }).show();
            t.contextMenu.find(".mejs-contextmenu-item").each(function() {
                var $dom = $(this);
                var itemIndex = parseInt($dom.data("itemindex"), 10);
                var item = t.options.contextMenuItems[itemIndex];
                if (typeof item.show != "undefined") item.show($dom, t);
                $dom.click(function() {
                    if (typeof item.click != "undefined") item.click(t);
                    t.contextMenu.hide()
                })
            });
            setTimeout(function() {
                t.killControlsTimer("rev3")
            }, 100)
        }
    })
})(mejs.$);
(function($) {
    $.extend(mejs.MepDefaults, {
        postrollCloseText: mejs.i18n.t("Close")
    });
    $.extend(MediaElementPlayer.prototype, {
        buildpostroll: function(player, controls, layers, media) {
            var t = this;
            var postrollLink = t.container.find('link[rel\x3d"postroll"]').attr("href");
            if (typeof postrollLink !== "undefined") {
                player.postroll = $('\x3cdiv class\x3d"mejs-postroll-layer mejs-layer"\x3e\x3ca class\x3d"mejs-postroll-close" onclick\x3d"$(this).parent().hide();return false;"\x3e' + t.options.postrollCloseText + '\x3c/a\x3e\x3cdiv class\x3d"mejs-postroll-layer-content"\x3e\x3c/div\x3e\x3c/div\x3e').prependTo(layers).hide();
                t.media.addEventListener("ended", function(e) {
                    $.ajax({
                        dataType: "html",
                        url: postrollLink,
                        success: function(data, textStatus) {
                            layers.find(".mejs-postroll-layer-content").html(data)
                        }
                    });
                    player.postroll.show()
                }, false)
            }
        }
    })
})(mejs.$);
(function($) {
    var isTouch = function() {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent ||
            navigator.vendor || window.opera).substr(0, 4))
    }();
    var change = function(el) {
        var img = el.find("\x3e div \x3e img");
        var canvas = el.find(".canvas");
        var ratio = el.attr("data-ration");
        if (!ratio || img.get(0).complete) ratio = img.width() / img.height();
        else ratio = parseFloat(ratio);
        var currRatio = (el.width() + parseFloat(el.css("padding-left")) + parseFloat(el.css("padding-right"))) / (el.height() + parseFloat(el.css("padding-top")) + parseFloat(el.css("padding-bottom")));
        el.find("\x3e *").height("");
        if (canvas.length && img.get(0).complete) el.addClass("canvas-visible");
        else img.on("load", function() {
            change(el)
        });
        if (currRatio >= ratio) {
            el.addClass("w");
            if (canvas.length && img.get(0).complete) {
                canvas.height(img.height());
                canvas.width("")
            }
        } else {
            el.removeClass("w");
            if (isTouch) el.find("\x3e *").height(el.height());
            if (canvas.length && img.get(0).complete) {
                canvas.width(img.width());
                canvas.height("")
            }
        }
    };
    $.fn.bgStretch = function() {
        return this.each(function() {
            var el = $(this);
            var wasInit = el.data("bgs") ? true : false;
            if (el.find("\x3e div \x3e img").length) {
                el.data("bgs", true);
                var ratio =
                    el.attr("data-ration");
                var img = el.find("\x3e div \x3e img").eq(0);
                var start = function() {
                    el.addClass("init");
                    change(el);
                    if (!wasInit) $(window).on("resize", function() {
                        change(el)
                    })
                };
                if (ratio || img.get(0).complete) start();
                else img.on("load", start)
            }
        })
    };
    $(function() {
        $(".bgs").bgStretch();
        var interval = setInterval(function() {
            $(".bgs").bgStretch()
        }, 500);
        setTimeout(function() {
            clearInterval(interval)
        }, 15E3)
    })
})(jQuery);
(function(d, s, id) {
    var js;
    var fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs)
})(document, "script", "facebook-jssdk");
var fbShare = function() {};
window.fbAsyncInit = function() {
    FB.init({
        appId: "106920676011663",
        xfbml: true,
        version: "v2.0"
    });
    fbShare = function(linkEncode, imageUrlEncode) {
        FB.ui({
            method: "feed",
            name: $(".app-gallery .photo-slider").attr("data-fbcaption"),
            description: $(".app-gallery .photo-slider").attr("data-fbdescription"),
            link: linkEncode,
            picture: imageUrlEncode
        }, function(response) {});
        return false
    }
};
(function($) {
    var l1 = location.href.split("#")[0];
    var l = l1.split("?")[0];
    var link = encodeURIComponent(l);
    var twitter_text = $(".app-gallery .photo-slider").attr("data-twtext");
    $(".app-gallery .links").each(function() {
        var i = $(this).parent().attr("data-img");
        var pic = encodeURIComponent(i);
        var fb = $(this).find("a.fa-facebook");
        var tw = $(this).find("a.fa-twitter");
        var g = $(this).find("a.fa-google-plus");
        var p = $(this).find("a.fa-pinterest");
        fb.attr("onclick", "javascript:fbShare('" + l + "','" + i + "'); return false;");
        fb.attr("href", "#");
        tw.attr("onclick", "javascript:window.open(this.href, '', 'menubar\x3dno,toolbar\x3dno,resizable\x3dyes,scrollbars\x3dyes,height\x3d600,width\x3d600'); return false;");
        tw.attr("href", "https://twitter.com/share?url\x3d" + link + "\x26text\x3d" + encodeURIComponent(twitter_text));
        g.attr("onclick", "javascript:window.open(this.href, '', 'menubar\x3dno,toolbar\x3dno,resizable\x3dyes,scrollbars\x3dyes,height\x3d600,width\x3d600'); return false;");
        g.attr("href", "https://plus.google.com/share?url\x3d" +
            link);
        p.attr("onclick", "javascript:window.open(this.href, '', 'menubar\x3dno,toolbar\x3dno,resizable\x3dyes,scrollbars\x3dyes,height\x3d600,width\x3d600'); return false;");
        p.attr("href", "http://www.pinterest.com/pin/create/button/?url\x3d" + link + "\x26media\x3d" + pic)
    })
})(jQuery);
(function($) {
    function loadLayoutImages() {
        var $images = $(".js-load-img");
        $images.each(function(i, e) {
            var $this = $(e);
            var type = isMobileView() ? "mobile" : isTabletView() ? "tablet" : "default";
            if ($this.data(type) !== false) e.src = $this.data(type) || $this.data("default")
        })
    }

    function resizeFeaturesItems() {
        var features = $("#features-group .clearfix.switch-group.features \x3e ul").children("li");
        $(features).each(function(index, value) {
            $(value).css("min-height", "")
        });
        if (!(isMobileView() || isTabletView())) {
            var maxItemHeight =
                0;
            $(features).each(function(index, value) {
                var itemHeight = $(value).height();
                if (maxItemHeight < itemHeight) maxItemHeight = itemHeight
            });
            $(features).each(function(index, value) {
                $(value).css("min-height", maxItemHeight + "px")
            })
        } else $(features).each(function(index, value) {
            $(value).css("min-height", "")
        })
    }
    var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        callback()
    };
    var isTouch = function() {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent ||
            navigator.vendor || window.opera).substr(0, 4))
    }();
    if (/android/i.test(navigator.userAgent || navigator.vendor) && /534\.30/i.test(navigator.userAgent || navigator.vendor)) $("html").addClass("native-android-browser");
    var isGecko;
    if ((isGecko = /gecko/i.test(navigator.userAgent || navigator.vendor)) && /like\s*gecko/i.test(navigator.userAgent || navigator.vendor)) isGecko = false;
    var isMobileView;
    var isTabletView;
    var $win = $(window);
    var winWidth = $win.width();
    var windowResizeHandlers = [];
    var checkWinResize = function(callback) {
        var width =
            $win.width();
        if (winWidth != width) {
            winWidth = width;
            typeof callback == "function" && callback()
        }
    };
    (function() {
        function detectMTviewFN() {
            var isMobile = isMobileView();
            var isTablet = isTabletView();
            $("html").toggleClass("mobile-view", isMobile).toggleClass("tablet-view", isTablet).toggleClass("desktop-view", !isMobile && !isTablet)
        }
        var mobileViewDetectElem = $('\x3cdiv class\x3d"mobile-detect mobile-visible"\x3eDetect view\x3c/div\x3e');
        var tabletViewDetectElem = $('\x3cdiv class\x3d"mobile-detect tablet-visible"\x3eDetect view\x3c/div\x3e');
        $("body").append(mobileViewDetectElem).append(tabletViewDetectElem);
        isMobileView = function() {
            if ($.browser.msie && parseInt($.browser.version) <= 8) {
                var winWidth = $win.width();
                if (winWidth <= 767) return true;
                return false
            } else return mobileViewDetectElem.is(":visible")
        };
        isTabletView = function() {
            if ($.browser.msie && parseInt($.browser.version) <= 8) {
                var winWidth = $win.width();
                if (winWidth > 767 && winWidth <= 1199) return true;
                return false
            } else return tabletViewDetectElem.is(":visible")
        };
        detectMTviewFN();
        windowResizeHandlers.push(detectMTviewFN)
    })();
    loadLayoutImages();
    var loadLayoutImagesTimeout = null;
    windowResizeHandlers.push(function() {
        window.clearTimeout(loadLayoutImagesTimeout);
        loadLayoutImagesTimeout = window.setTimeout(function() {
            loadLayoutImages()
        }, 1E3)
    });
    $(".switch-manager").switchManager({
        automaticSwitch: true
    });
    $(".switch-manager-features").switchManager({
        automaticSwitch: true,
        eventHoverForAttr: ["data-feature"]
    });
    $(".switch-manager-color").switchManager({
        attrs: ["href"]
    });
    if (!isMobileView()) $(".switch-manager-dashboard").switchManager({
        automaticSwitch: true,
        eventHoverForAttr: ["data-feature"]
    });
    else $(".switch-manager-dashboard").switchManager({
        automaticSwitch: false,
        eventHoverForAttr: ["data-feature"]
    });
    (function() {
        var startButton = $(".product-info .video-start");
        startButton.on("click", function() {
            var is8IE = $.browser.msie && parseInt($.browser.version) <= 8;
            var $popupYoutubePlayer = $("#video-product .popup-content iframe")[0];
            if (isMobileView() || isTabletView() || is8IE) {
                var videoId = $popupYoutubePlayer.src.match(/embed\/(.+)\?/)[1];
                var link = document.createElement("a");
                link.href = "//www.youtube.com/watch?v\x3d" + videoId;
                if (is8IE) link.target = "_target";
                document.body.appendChild(link);
                link.click()
            } else {
                $popupYoutubePlayer.contentWindow.postMessage('{"event":"command","func":"' + "playVideo" + '","args":""}', "*");
                $("#video-product").popUp({
                    onclose: function() {
                        $popupYoutubePlayer.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}', "*")
                    }
                })
            }
        })
    })();
    if ($.browser.msie && parseInt($.browser.version) <= 8) {
        $(".product-features ul.features li:nth-child(2n+1)").addClass("nth-child-2n-1");
        $(".feature-details .note").prepend('\x3ci class\x3d"before"\x3e\x3c/i\x3e')
    }(function() {
        var lis = [];
        if ($(".product-features .features ul").length > 1) return;
        var ul = $(".product-features .features ul");
        if ($.browser.msie && parseInt($.browser.version) <= 8) ul.find(" \x3e li:nth-child(2n+1)").addClass("nth-child-2n-1");
        ul.find(" \x3e li").each(function() {
            var li = $(this);
            li.data("twoOrder", li.index());
            li.data("singleOrder", li.find("a.switch").data("switchOrder"));
            lis.push(li.get(0))
        });
        var orderLi = function() {
            var sortNameAttr =
                "twoOrder";
            if (isTabletView() || isMobileView()) sortNameAttr = "singleOrder";
            lis.sort(function(a, b) {
                var aO = $(a).data(sortNameAttr);
                var bO = $(b).data(sortNameAttr);
                if (aO > bO) return 1;
                else if (aO < bO) return -1;
                else return 0
            });
            ul.append($(lis))
        };
        windowResizeHandlers.push(orderLi);
        orderLi()
    })();
    (function() {
        function setSectionScrollHeight() {
            var height = Scrolling.getViewerSize().h;
            var headerIndent = $header.outerHeight();
            var indentNav = 0;
            var heightIndent = 0;
            $indentNav.each(function() {
                indentNav = parseInt($(this).css("padding-top"),
                    10);
                if (indentNav > 0) return false
            });
            if (isTabletView()) height = 682;
            else if (height < 800) height = 800;
            if (!isMobileView()) {
                heightIndent = height - headerIndent - indentNav;
                $(".max-height:not(.header-indent)").css("min-height", height + "px");
                $(".max-height.header-indent").css("min-height", heightIndent + "px");
                if (isGecko) $(".max-height.tb").css("height", "1px")
            } else $(".max-height").css("height", "").css("min-height", "")
        }

        function resizingParalax() {
            if (skrollrInstance && skrollrInstance.destroy) skrollrInstance.destroy();
            setSectionScrollHeight();
            if (skrollrInstance && !isMobileView() && !isTabletView()) setTimeout(function() {
                skrollrInstance = skrollr.init({
                    smoothScrolling: false
                })
            }, 10)
        }
        var $indentNav = $(".indent-nav");
        var $header = $("header");
        setSectionScrollHeight();
        var skrollrInstance;
        if (!isTouch) $(function() {
            if (!isMobileView() && !isTabletView()) skrollrInstance = skrollr.init({
                smoothScrolling: false
            });
            else skrollrInstance = true
        });
        resizingParalax();
        windowResizeHandlers.push(resizingParalax);
        Scrolling.on("resize", function() {}, {
            weight: -100
        })
    })();
    (function() {
        var displayUse =
            false;
        var displayUseTimer = null;
        $(window).on("scroll", function() {
            displayUse = true;
            clearTimeout(displayUseTimer);
            displayUseTimer = setTimeout(function() {
                displayUse = false
            }, 500)
        });
        $(".app-gallery .articles").each(function() {
            var human = false;
            var articles = $(this);
            articles.find(" \x3e a").each(function() {
                var a = $(this);
                a.wrap("\x3ch2 /\x3e");
                if (a.find(" \x3e q").length) {
                    a.find(" \x3e q").contents().wrapAll("\x3cspan /\x3e");
                    a.addClass("has-quotation")
                }
                var h = a.closest("h2");
                var aSwitch = $('\x3ca href\x3d"javascript:void(0)" class\x3d"switch" data-media\x3d"' +
                    a.data("media") + '"\x3e\x3c/a\x3e');
                a.removeAttr("data-media");
                a.attr("href", "/buzz");
                a.removeAttr("target");
                aSwitch.insertBefore(articles.find("\x3e h2:eq(0)"));
                aSwitch.on("click", function(e, automatic) {
                    if (!automatic) human = true;
                    articles.find(".active").removeClass("active");
                    aSwitch.addClass("active");
                    h.addClass("active");
                    e.stopPropagation();
                    return false
                })
            });
            var artLength = articles.find("a.switch").length;
            if (artLength >= 2) articles.find("a.switch:eq(" + (artLength - 2) + "), a.switch:eq(" + (artLength - 1) + ")").wrapAll("\x3cnobr /\x3e");
            $(function() {
                var aSwitches = articles.find("a.switch");
                var aCurrIndex = 0;
                (function() {
                    if (human) return;
                    if (!displayUse) {
                        aSwitches.eq(aCurrIndex).trigger("click", [true]);
                        ++aCurrIndex;
                        if (aCurrIndex >= aSwitches.length) aCurrIndex = 0
                    }
                    setTimeout(arguments.callee, 3E3)
                })()
            })
        })
    })();
    (function() {
        var fotoramaDataAuto = $(".fotorama").attr("data-auto");
        if (typeof fotoramaDataAuto !== "undefined" || fotoramaDataAuto === false) return;
        if (typeof jQueryFotorama == typeof undef) return;
        var $fotoramaDiv = jQueryFotorama(".app-gallery .photo-slider");
        if (!$fotoramaDiv.data("mobileRatio")) return;
        var mobileRatio = eval($fotoramaDiv.data("mobileRatio"));
        var optionsD = {
            fit: "contain",
            ratio: eval($fotoramaDiv.data("ratio")),
            height: "auto"
        };
        var optionsM = {
            fit: "contain",
            ratio: mobileRatio,
            height: 510
        };
        $fotoramaDiv.fotorama(isMobileView() ? optionsM : optionsD);
        var fotorama = $fotoramaDiv.data("fotorama");
        windowResizeHandlers.push(function() {
            if (isMobileView()) {
                fotorama.setOptions({
                    fit: optionsM.fit
                });
                fotorama.resize(optionsM)
            } else {
                fotorama.setOptions({
                    fit: optionsD.fit
                });
                fotorama.resize(optionsD)
            }
        });
        if (isMobileView()) fotorama.setOptions({
            fit: "contain",
            ratio: mobileRatio,
            height: 510
        })
    })();
    $(function() {
        $(".awards \x3e div").each(function() {
            function geSlidesToShow() {
                return isTabletView() || isMobileView() ? 3 : 4
            }
            var slider = $(this);
            slider.slick({
                slide: "article",
                infinite: true,
                slidesToShow: geSlidesToShow(),
                slidesToScroll: geSlidesToShow()
            });
            windowResizeHandlers.push(function() {
                var slick = slider.getSlick();
                slick.options.slidesToShow = slick.options.slidesToScroll = geSlidesToShow();
                slick.refresh()
            })
        })
    });
    var subMenuFixed = function() {
        var $headerWrap = $("header.wrapper-header");
        $(".product-sub-nav").each(function() {
            var menu = $(this);
            var scrollTop = $win.scrollTop();
            if (scrollTop >= menu.offset().top) {
                menu.addClass("fixed");
                if ($headerWrap.css("position") == "fixed") menu.find("\x3e *").css("top", $headerWrap.outerHeight() + "px");
                else menu.find("\x3e *").css("top", "0px")
            } else {
                menu.removeClass("fixed");
                menu.find("\x3e *").css("top", "0px")
            }
        })
    };
    subMenuFixed();
    $win.on("scroll", function() {
        requestFrame(function() {
            subMenuFixed()
        })
    });
    windowResizeHandlers.push(function() {
        requestFrame(function() {
            subMenuFixed()
        })
    });
    (function() {
        var dashboardControl = function() {
            $(".app-dashboard").each(function() {
                var dashboard = $(this);
                var sideGroup = dashboard.find(".switch-group ul");
                if (isMobileView())
                    if (!sideGroup.getSlick()) sideGroup.slick({
                        infinite: true,
                        slide: "li",
                        dots: false,
                        onAfterChange: function(slick, curIndex) {
                            $(slick.$slides[curIndex]).find("a").trigger("click")
                        },
                        onInit: function(slick, curIndex) {
                            $(slick.$slides[curIndex]).find("a").trigger("click")
                        }
                    });
                    else sideGroup.getSlick().refresh();
                else if (sideGroup.getSlick()) sideGroup.unslick()
            })
        };
        dashboardControl();
        windowResizeHandlers.push(dashboardControl)
    })();
    (function() {
        var subMenuScroll = new Navigation($('.product-sub-nav ul li a[href^\x3d"#"]'), {
            locationReplace: true,
            locationReversReplace: false,
            easing: "easeOutQuad",
            bySpeed: true,
            duration: 500
        });
        subMenuScroll.activateNavToHash();
        (new Navigation($('.product-sub-nav .logo a[href^\x3d"#"], .product-sub-nav-mobile a[href^\x3d"#"]'), {
            easing: "easeOutQuad",
            bySpeed: true,
            duration: 500
        })).activateNavToHash();
        var anchorScroll = new Navigation($('a.arrow-nav[href^\x3d"#"]'), {
            easing: "easeOutQuad",
            duration: 500,
            bySpeed: true
        });
        anchorScroll.activateNavToHash();
        subMenuScroll.activateDependentNodesByHash()
    })();
    if (!isTouch)(function() {
        function toFixed(elem) {
            var elemFrom = elem;
            var elemTo = elem.closest(".at-fixed-unit").next(".at-fixed-unit").find('.to-fixed[data-fixed-class\x3d"' + elemFrom.attr("data-fixed-class") + '"]');
            if (!elemTo.length) return;
            var scrollTop = Scrolling.getScrollTop();
            var top = elemFrom.data("top-fixed");
            if (top == null) top = elemFrom.offset().top - elem.closest(".at-fixed-unit").offset().top;
            if (!isMobileView() && !isTabletView() && (scrollTop >= elemFrom.closest(".at-fixed-unit").offset().top && scrollTop < elemTo.closest(".at-fixed-unit").offset().top + elemTo.closest(".at-fixed-unit").height() / 2) && elemTo.offset().top - scrollTop > top) requestFrame(function() {
                elemFrom.closest(".at-fixed-unit").addClass("fixed-class-" + elemFrom.attr("data-fixed-class"));
                elemFrom.addClass("fixed");
                elemFrom.css("top",
                    top);
                if (elemFrom.parent().height() < elemFrom.outerHeight()) elemFrom.parent().height(elemFrom.outerHeight());
                elemFrom.data("top-fixed", top);
                elemTo.css("visibility", "hidden")
            });
            else requestFrame(function() {
                elemFrom.removeClass("fixed");
                elemFrom.closest(".at-fixed-unit").removeClass("fixed-class-" + elemFrom.attr("data-fixed-class"));
                elemFrom.css("top", 0);
                elemFrom.parent().height("");
                elemFrom.data("top-fixed", null);
                elemTo.css("visibility", "visible")
            })
        }
        $(".to-fixed").each(function() {
            var elem = $(this);
            toFixed(elem);
            windowResizeHandlers.push(function() {
                requestFrame(function() {
                    toFixed(elem)
                })
            })
        })
    })();
    (function() {
        function transformSlider() {
            var sideSlick = sideGroup.getSlick();
            sideGroupBgs.css({
                height: ""
            });
            if (isMobileView()) {
                if (sliding) sliding.clear();
                if (!sideSlick) sideGroup.slick({
                    infinite: true,
                    dots: true,
                    slide: "div",
                    customPaging: function(slider, i) {
                        return '\x3cbutton type\x3d"button" data-role\x3d"none"\x3e' + "\x3cb\x3e" + (i + 1) + "\x3c/b\x3e" + "\x3c/button\x3e"
                    },
                    onInit: function() {
                        sideGroupBgs = sideGroup.find(".bgs");
                        reHeightSideGroup();
                        setTimeout(reHeightSideGroup, 200)
                    }
                });
                else sideSlick.refresh()
            } else {
                if (sideSlick) sideGroup.unslick();
                if (!sliding) sliding = new Sliding($(".slide"), {
                    locationReplace: false,
                    easing: "easeInOutQuad",
                    duration: 800,
                    useReach: !isTouch,
                    bySpeed: true
                });
                else sliding.activate()
            }
        }
        var sliding = null;
        var sideGroup = $(".slide-group");
        var sideGroupBgs = sideGroup.find(".bgs");
        var reHeightSideGroup = function() {
            sideGroupBgs.css({
                "height": isMobileView() ? sideGroup.height() + "px" : ""
            }).bgStretch()
        };
        transformSlider();
        windowResizeHandlers.push(transformSlider);
        Scrolling.on("resize", function() {}, {
            weight: -101
        })
    })();
    $("form.notify").on("submit", function() {
        var form = $(this);
        var inputVal = $.trim($(this).find('input[type\x3d"email"]').val());
        if (!inputVal || !/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.test(inputVal)) $(this).addClass("error e-1");
        else {
            form.removeClass("error e-1");
            $.getJSON(form.attr("action") + "?callback\x3d?", form.serialize(), function(data) {
                form.removeClass("step-1");
                form.addClass("step-2")
            })
        }
        return false
    });
    $("form.notify a.submit").on("click",
        function() {
            $(this).closest("form").trigger("submit")
        });
    $("form.notify a.keep-exploring").on("click", function() {
        $(this).closest(".popup").popUp({
            getInstance: true
        })[0].down()
    });
    $(document.body).on("touchstart click", ".expand \x3e a", function() {
        $(this).parent().toggleClass("expanded");
        return false
    });
    $win.on("resize", function() {
        checkWinResize(function() {
            windowResizeHandlers.each(function(f) {
                typeof f == "function" && f()
            })
        })
    });
    $(window).resize(function() {
        resizeFeaturesItems()
    });
    resizeFeaturesItems()
})(jQuery);

function showAriaFeatureDetailsPopup() {
    $(".feature-details.weight .bgs").addClass("visible");
    $(".weight-more-popup").addClass("show");
    $(".feature-details.weight .cont").css("display", "none")
}

function hideAriaFeatureDetailsPopup() {
    $(".feature-details.weight .bgs").removeClass("visible");
    $(".weight-more-popup").removeClass("show");
    $(".feature-details.weight .cont").css("display", "")
};
if ($.browser.msie && parseInt($.browser.version) <= 8) $(".ic").prepend('\x3ci class\x3d"before"\x3e\x3c/i\x3e');
(function() {
    function isMobileView() {
        return document.documentElement.className.match(/mobile-view/) ? true : false
    }

    function isTabletView() {
        return document.documentElement.className.match(/tablet-view/) ? true : false
    }

    function isTarget(element, target) {
        for (var node = target; node != document;) {
            if (node == element) return true;
            node = node.parentNode
        }
        return false
    }

    function hasCssTransitions() {
        return document.documentElement.className.match(/^(.+ )?csstransitions/) ? true : false
    }

    function getElementsByTagAndClassNames(element,
        tagName, className) {
        var elements = element.getElementsByTagName(tagName);
        var newElements = [];
        var pattern = new RegExp("^(.+ )?" + className + "( .+)?$");
        for (var i = 0; i < elements.length; i++)
            if (elements[i].className.match(pattern)) newElements.push(elements[i]);
        return newElements.length ? newElements : null
    }

    function cleanupGalleryContainer() {
        for (var galleryContainer = getElementsByTagAndClassNames(document, "div", "fotorama")[0]; galleryContainer.childNodes.length > 0;) galleryContainer.removeChild(galleryContainer.childNodes[0])
    }

    function initGalleryData() {
        var elements = document.getElementsByTagName("div");
        for (var i = 0; i < elements.length; i++)
            if (elements[i].className.match(/(.+ )?fotorama( .+)?/)) {
                var galleryContainer = elements[i];
                for (var j = 0; j < galleryContainer.childNodes.length; j++) {
                    var element = galleryContainer.childNodes[j];
                    if (element.hasAttribute && element.hasAttribute("data-img")) galleryData.push({
                        img: element.getAttribute("data-img"),
                        mobile: element.getAttribute("data-img-mobile"),
                        thumb: element.getAttribute("data-thumb"),
                        thumbratio: element.getAttribute("data-thumbratio"),
                        html: element.innerHTML
                    })
                }
                break
            }
        if (galleryData.length == 0) return false;
        cleanupGalleryContainer();
        return true
    }

    function updateGallery() {
        if (isMobileView()) {
            destroyFotorama();
            destroyThumbnails();
            if (!slick) createSlick()
        } else {
            destroySlick();
            if (fotorama) {
                updateFotorama();
                updateThumbnails()
            } else {
                createFotorama();
                createThumbnails()
            }
        }
    }

    function createSlick() {
        if (slick) return;
        var galleryContainer = $(".fotorama");
        galleryContainer.slick({
            arrows: true
        });
        for (var i = 0; i < galleryData.length; i++) {
            var imageSource = galleryData[i].img;
            if (isMobilePhone() && galleryData[i].mobile) imageSource = galleryData[i].mobile;
            var content = '\x3cdiv\x3e\x3cimg src\x3d"' + imageSource + '" style\x3d"width: 100%; height: auto;"\x3e\x3c/div\x3e';
            galleryContainer.slickAdd(content)
        }
        slick = true
    }

    function destroySlick() {
        if (slick) {
            $(".fotorama").unslick();
            cleanupGalleryContainer();
            slick = false
        }
    }

    function createFotorama() {
        if (fotorama) return;
        var galleryContainer = jQueryFotorama(".fotorama").on("fotorama:show", onFotoramaShowEvent).fotorama({
            data: galleryData,
            arrows: false
        });
        fotorama = galleryContainer.data("fotorama");
        fotoramaStage = getElementsByTagAndClassNames(document, "div", "fotorama__stage")[0];
        if (isMobileDevice()) addEventListener(fotoramaStage, "touchstart", onFotoramaStageTouchOverEventListener, true);
        else {
            addEventListener(fotoramaStage, "mouseover", onFotoramaStageMouseOverEventListener, true);
            addEventListener(fotoramaStage, "mouseout", onFotoramaStageMouseOutEventListener, true)
        }
        updateFotorama()
    }

    function destroyFotorama() {
        if (fotorama) {
            fotorama.destroy();
            fotorama = null
        }
    }

    function updateFotorama() {
        if (isTabletView()) fotorama.resize({
            width: GALLERY_TABLET_WIDTH,
            height: GALLERY_TABLET_HEIGHT
        });
        else fotorama.resize({
            width: GALLERY_DESKTOP_WIDTH,
            height: GALLERY_DESKTOP_HEIGHT
        });
        setFotoramaHTMLVisibility(true);
        if (isMobileDevice() && !hasEventListener(document, "touchstart", onFotoramaStageMouseFirstEventListener)) addEventListener(document, "touchstart", onFotoramaStageMouseFirstEventListener, true)
    }

    function setFotoramaHTMLVisibility(visibile) {
        var fotoramaStage = getElementsByTagAndClassNames(document, "div", "fotorama__stage")[0];
        if (visibile) {
            if (!fotoramaStage.className.match(/links-visible/)) fotoramaStage.className +=
                " links-visible"
        } else fotoramaStage.className = fotoramaStage.className.replace(/ *links-visible/, "")
    }

    function createThumbnails() {
        thumbnails = document.getElementById("thumbnails");
        if (!thumbnails) return;
        var data = fotorama.data;
        thumbnails.style.display = "block";
        scrollLeftButton = document.createElement("div");
        scrollLeftButton.id = "scroll-left-button";
        scrollLeftButton.className = "scroll-button";
        scrollLeftButton.style.display = "none";
        scrollLeftButton.style.webkitTapHighlightColor = "transparent";
        addEventListener(scrollLeftButton,
            "click", onScrollLeftEventListener, true);
        thumbnails.appendChild(scrollLeftButton);
        scrollRightButton = document.createElement("div");
        scrollRightButton.id = "scroll-right-button";
        scrollRightButton.className = "scroll-button";
        scrollRightButton.style.display = "none";
        scrollRightButton.style.webkitTapHighlightColor = "transparent";
        addEventListener(scrollRightButton, "click", onScrollRightEventListener, true);
        thumbnails.appendChild(scrollRightButton);
        thumbnailsContainer = document.createElement("div");
        thumbnailsContainer.style.position =
            "relative";
        thumbnailsContainer.style.width = "100%";
        thumbnailsContainer.style.height = THUMBNAIL_HEIGHT + THUMBNAIL_MARGIN * 2 + "px";
        thumbnailsContainer.style.overflow = "hidden";
        thumbnailsContainer.style.webkitTapHighlightColor = "transparent";
        thumbnails.appendChild(thumbnailsContainer);
        thumbnailsTape = document.createElement("div");
        thumbnailsTape.style.position = "absolute";
        thumbnailsTape.style.left = "0";
        thumbnailsTape.style.top = "0";
        thumbnailsTape.style.width = data.length * THUMBNAIL_WIDTH + (data.length - 1) * THUMBNAIL_MARGIN +
            "px";
        thumbnailsTape.style.height = THUMBNAIL_HEIGHT + THUMBNAIL_MARGIN * 2 + "px";
        setTransitionProperty(thumbnailsTape, "left");
        setTransitionDuration(thumbnailsTape, THUMBNAILS_TAPE_TRANSITION_DURATION);
        if (isMobileDevice()) addEventListener(thumbnailsTape, "touchstart", grab, true);
        else addEventListener(thumbnailsTape, "mousedown", grab, true);
        thumbnailsContainer.appendChild(thumbnailsTape);
        thumbnailBorder = document.createElement("div");
        thumbnailBorder.className = "thumbnail-border";
        thumbnailBorder.style.position = "absolute";
        thumbnailBorder.style.zIndex = "100";
        thumbnailBorder.style.left = "0";
        thumbnailBorder.style.top = THUMBNAIL_MARGIN + "px";
        thumbnailBorder.style.width = THUMBNAIL_WIDTH + "px";
        thumbnailBorder.style.height = THUMBNAIL_HEIGHT + "px";
        setTransitionProperty(thumbnailBorder, "left");
        setTransitionDuration(thumbnailBorder, THUMBNAIL_BORDER_TRANSITION_DURATION);
        thumbnailsTape.appendChild(thumbnailBorder);
        for (var i = 0; i < data.length; i++) {
            var thumbnailContainer = document.createElement("div");
            thumbnailContainer.style.position = "absolute";
            thumbnailContainer.style.zIndex = "1";
            thumbnailContainer.style.top = "0";
            thumbnailContainer.style.left = i * (THUMBNAIL_WIDTH + THUMBNAIL_MARGIN) + "px";
            thumbnailContainer.style.width = THUMBNAIL_WIDTH + "px";
            thumbnailContainer.style.height = THUMBNAIL_HEIGHT + "px";
            thumbnailContainer.style.padding = THUMBNAIL_MARGIN + "px";
            thumbnailContainer.style.paddingLeft = "0";
            thumbnailContainer.style.cursor = "pointer";
            if (i == data.length - 1) thumbnailContainer.style.paddingRight = "0";
            addEventListener(thumbnailContainer, "click", function(index) {
                    return function() {
                        showThumbnail(index)
                    }
                }(i),
                true);
            var imageContainer = document.createElement("div");
            imageContainer.style.position = "relative";
            imageContainer.style.width = THUMBNAIL_WIDTH + "px";
            imageContainer.style.height = THUMBNAIL_HEIGHT + "px";
            imageContainer.style.overflow = "hidden";
            var image = document.createElement("img");
            image.style.display = "block";
            image.style.position = "absolute";
            image.style.left = "0";
            image.style.top = THUMBNAIL_HEIGHT + "px";
            addEventListener(image, "load", onImageLoadEventListener, true);
            if (!isMobileDevice()) {
                addEventListener(image, "mousedown",
                    onPreventDefaultEventListener, true);
                addEventListener(image, "mousemove", onPreventDefaultEventListener, true)
            }
            image.src = data[i].thumb;
            imageContainer.appendChild(image);
            thumbnailContainer.appendChild(imageContainer);
            thumbnailsTape.appendChild(thumbnailContainer);
            updateThumbnails()
        }
    }

    function destroyThumbnails() {
        if (thumbnails) {
            for (removeAllEventListeners(); thumbnails.childNodes.length > 0;) thumbnails.removeChild(thumbnails.childNodes[0]);
            thumbnails.style.display = "none"
        }
    }

    function updateThumbnails() {
        var numberOfVisibleThumbnails;
        if (isTabletView()) numberOfVisibleThumbnails = GALLERY_TABLET_NUMBER_OF_VISIBLE_THUMBNAILS;
        else numberOfVisibleThumbnails = GALLERY_DESKTOP_NUMBER_OF_VISIBLE_THUMBNAILS;
        thumbnails.style.width = THUMBNAIL_WIDTH * numberOfVisibleThumbnails + THUMBNAIL_MARGIN * (numberOfVisibleThumbnails - 1) + "px";
        if (numberOfVisibleThumbnails >= fotorama.data.length) {
            scrollLeftButton.style.display = "none";
            scrollRightButton.style.display = "none"
        } else {
            scrollLeftButton.style.display = "block";
            scrollRightButton.style.display = "block"
        }
    }

    function showThumbnail(index) {
        if (thumbnailsTapeMoved) return;
        fotorama.show(index)
    }

    function updateThumbnailsTapePosition(activeThumbnailIndex) {
        var thumbnailsTapeLeft = parseInt(thumbnailsTape.style.left, 10);
        if (typeof activeThumbnailIndex === "undefined") {
            if (thumbnailsTapeLeft > 0) {
                setThumbnailsTapePosition(0);
                return
            }
            var allowedDistance = Math.abs(thumbnailsContainer.offsetWidth - thumbnailsTape.offsetWidth);
            if (Math.abs(thumbnailsTapeLeft) > allowedDistance) setThumbnailsTapePosition(-allowedDistance)
        } else {
            var thumbnailRight = activeThumbnailIndex * (THUMBNAIL_WIDTH + THUMBNAIL_MARGIN) +
                THUMBNAIL_WIDTH;
            var delta = thumbnailsContainer.offsetWidth - (thumbnailRight + thumbnailsTapeLeft);
            if (delta < 0) {
                setThumbnailsTapePosition(thumbnailsTapeLeft + delta);
                return
            }
            var thumbnailLeft = thumbnailsTapeLeft + activeThumbnailIndex * (THUMBNAIL_WIDTH + THUMBNAIL_MARGIN);
            if (thumbnailLeft < 0) setThumbnailsTapePosition(-activeThumbnailIndex * (THUMBNAIL_WIDTH + THUMBNAIL_MARGIN))
        }
    }

    function scrollThumbnailsTapeLeft() {
        var thumbnailsTapeLeft = parseInt(thumbnailsTape.style.left, 10);
        var availableDistance = Math.abs(thumbnailsContainer.offsetWidth -
            thumbnailsTape.offsetWidth) + thumbnailsTapeLeft;
        var scrollDistance;
        var thumbnailContainerWidth = THUMBNAIL_WIDTH + THUMBNAIL_MARGIN;
        if (availableDistance == 0) scrollDistance = 0;
        else if (availableDistance < thumbnailContainerWidth) scrollDistance = -availableDistance + thumbnailsTapeLeft;
        else scrollDistance = -thumbnailContainerWidth + thumbnailsTapeLeft;
        setThumbnailsTapePosition(scrollDistance)
    }

    function scrollThumbnailsTapeRight() {
        var thumbnailsTapeLeft = parseInt(thumbnailsTape.style.left, 10);
        var availableDistance = Math.abs(thumbnailsTapeLeft);
        var scrollDistance;
        var thumbnailContainerWidth = THUMBNAIL_WIDTH + THUMBNAIL_MARGIN;
        if (availableDistance == 0) scrollDistance = thumbnailsContainer.offsetWidth - thumbnailsTape.offsetWidth;
        else if (availableDistance < thumbnailContainerWidth) scrollDistance = availableDistance + thumbnailsTapeLeft;
        else scrollDistance = thumbnailContainerWidth + thumbnailsTapeLeft;
        setThumbnailsTapePosition(scrollDistance)
    }

    function setThumbnailsTapePosition(position) {
        if (hasCssTransitions()) thumbnailsTape.style.left = position + "px";
        else $(thumbnailsTape).animate({
            left: position +
                "px"
        }, THUMBNAILS_TAPE_TRANSITION_DURATION)
    }

    function setThumbnailBorderPosition(index) {
        var position = index * (THUMBNAIL_WIDTH + THUMBNAIL_MARGIN) + "px";
        if (hasCssTransitions()) thumbnailBorder.style.left = position;
        else $(thumbnailBorder).animate({
            left: position
        }, THUMBNAIL_BORDER_TRANSITION_DURATION)
    }

    function setTransitionDuration(element, duration) {
        if (hasCssTransitions()) {
            element.style.mozTransitionDuration = duration + "ms";
            element.style.msTransitionDuration = duration + "ms";
            element.style.oTransitionDuration = duration +
                "ms";
            element.style.webkitTransitionDuration = duration + "ms";
            element.style.transitionDuration = duration + "ms"
        }
    }

    function setTransitionProperty(element, property) {
        if (hasCssTransitions()) {
            element.style.mozTransitionProperty = property;
            element.style.msTransitionProperty = property;
            element.style.oTransitionProperty = property;
            element.style.webkitTransitionProperty = property;
            element.style.transitionProperty = property
        }
    }

    function grab(e) {
        e = e || window.event;
        setTransitionDuration(thumbnailsTape, 0);
        thumbnailsTapeMoved = false;
        if (isMobileDevice()) {
            addEventListener(document, "touchmove", drag, true);
            addEventListener(document, "touchend", drop, true)
        } else {
            addEventListener(document, "mousemove", drag, true);
            addEventListener(document, "mouseup", drop, true)
        }
        dragAndDropMouseX = e.clientX || e.touches[0].pageX
    }

    function drag(e) {
        e = e || window.event;
        var x = e.clientX || e.touches[0].pageX;
        var dx = dragAndDropMouseX - x;
        dragAndDropMouseX = x;
        thumbnailsTape.style.left = parseInt(thumbnailsTape.style.left, 10) - dx + "px";
        thumbnailsTapeMoved = true
    }

    function drop(e) {
        setTransitionDuration(thumbnailsTape,
            THUMBNAILS_TAPE_TRANSITION_DURATION);
        if (isMobileDevice()) {
            removeEventListener(document, "touchmove", drag);
            removeEventListener(document, "touchend", drop)
        } else {
            removeEventListener(document, "mousemove", drag);
            removeEventListener(document, "mouseup", drop)
        }
        updateThumbnailsTapePosition()
    }

    function addEventListener(element, type, listener, global) {
        if (element.addEventListener) element.addEventListener(type, listener, false);
        else element.attachEvent("on" + type, listener);
        if (global)
            if (!hasEventListener(element, type, listener)) eventListeners.push({
                element: element,
                type: type,
                listener: listener
            })
    }

    function hasEventListener(element, type, listener) {
        for (var i = 0; i < eventListeners.length; i++)
            if (eventListeners[i].element === element && eventListeners[i].type === type && eventListeners[i].listener === listener) return true;
        return false
    }

    function removeAllEventListeners() {
        for (; eventListeners.length > 0;) removeEventListener(eventListeners[0].element, eventListeners[0].type, eventListeners[0].listener)
    }

    function removeEventListener(element, type, listener) {
        if (element.removeEventListener) element.removeEventListener(type,
            listener, false);
        else element.detachEvent("on" + type, listener);
        for (var i = 0; i < eventListeners.length; i++)
            if (eventListeners[i].element === element && eventListeners[i].type === type && eventListeners[i].listener === listener) {
                eventListeners.splice(i, 1);
                return
            }
    }

    function onFotoramaShowEvent(e, fotorama, extra) {
        if (activeIndex == fotorama.activeIndex) return;
        activeIndex = fotorama.activeIndex;
        setThumbnailBorderPosition(activeIndex);
        updateThumbnailsTapePosition(activeIndex)
    }

    function onFotoramaStageMouseOverEventListener(e) {
        setFotoramaHTMLVisibility(true)
    }

    function onFotoramaStageMouseOutEventListener(e) {
        setFotoramaHTMLVisibility(false)
    }

    function onFotoramaStageTouchOverEventListener(e) {
        removeEventListener(fotoramaStage, "touchstart", onFotoramaStageTouchOverEventListener);
        addEventListener(document, "touchstart", onFotoramaStageTouchOutEventListener, true);
        setFotoramaHTMLVisibility(true)
    }

    function onFotoramaStageTouchOutEventListener(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (isTarget(fotoramaStage, target)) return;
        removeEventListener(document,
            "touchstart", onFotoramaStageTouchOutEventListener);
        addEventListener(fotoramaStage, "touchstart", onFotoramaStageTouchOverEventListener, true);
        setFotoramaHTMLVisibility(false)
    }

    function onFotoramaStageMouseFirstEventListener(e) {
        removeEventListener(document, "touchstart", onFotoramaStageMouseFirstEventListener);
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (isTarget(fotoramaStage, target)) return;
        setFotoramaHTMLVisibility(false)
    }

    function onImageLoadEventListener(e) {
        e = e || event;
        var element = e.target ||
            event.srcElement;
        removeEventListener(element, "load", onImageLoadEventListener);
        element.width = THUMBNAIL_WIDTH;
        element.style.top = parseInt((THUMBNAIL_HEIGHT - element.height) / 2, 10) + "px"
    }

    function onReadyEventListener(e) {
        var fotoramaDataAuto = getElementsByTagAndClassNames(document, "div", "fotorama")[0].getAttribute("data-auto");
        if (fotoramaDataAuto === null || fotoramaDataAuto === "" || fotoramaDataAuto === true) return;
        if (!initGalleryData()) return;
        isMobileDevice = function() {
            var mobileDevice = navigator.userAgent.match(/mobile|android/i) ?
                true : false;
            return function() {
                return mobileDevice
            }
        }();
        isMobilePhone = function() {
            var mobilePhone = false;
            if (isMobileDevice()) mobilePhone = document.documentElement.clientWidth <= 767 && document.documentElement.clientHeight <= 767;
            return function() {
                return mobilePhone
            }
        }();
        addEventListener(window, "resize", onResizeEventListener);
        updateGallery()
    }

    function onPreventDefaultEventListener(e) {
        e = e || event;
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false
    }

    function onResizeEventListener(e) {
        updateGallery()
    }

    function onScrollLeftEventListener(e) {
        scrollThumbnailsTapeLeft()
    }

    function onScrollRightEventListener(e) {
        scrollThumbnailsTapeRight()
    }
    var galleryData = [];
    var eventListeners = [];
    var GALLERY_TABLET_WIDTH = 712;
    var GALLERY_TABLET_HEIGHT = 400;
    var GALLERY_TABLET_NUMBER_OF_VISIBLE_THUMBNAILS = 5;
    var GALLERY_DESKTOP_WIDTH = 820;
    var GALLERY_DESKTOP_HEIGHT = 460;
    var GALLERY_DESKTOP_NUMBER_OF_VISIBLE_THUMBNAILS = 6;
    var THUMBNAILS_TAPE_TRANSITION_DURATION = 330;
    var THUMBNAIL_WIDTH = 114;
    var THUMBNAIL_HEIGHT = 70;
    var THUMBNAIL_MARGIN = 10;
    var THUMBNAIL_BORDER_TRANSITION_DURATION = 360;
    var fotorama =
        null;
    var fotoramaStage = null;
    var thumbnails = null;
    var thumbnailsContainer = null;
    var thumbnailsTape = null;
    var thumbnailBorder = null;
    var scrollLeftButton = null;
    var scrollRightButton = null;
    var slick = false;
    var dragAndDropMouseX = 0;
    var thumbnailsTapeMoved = false;
    var activeIndex = 0;
    var isMobileDevice = null;
    var isMobilePhone = null;
    $(document).ready(onReadyEventListener)
})();