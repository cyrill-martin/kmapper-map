// Setting the radii for the degrees of relatedness
var b_radii = [98, 180, 270, 365, 465];
// Setting the color of the background circles
var b_color = "#F5F5F5";
// Setting the regular opacity of elements
var opacity = 1.0;

// Setting the viewBox side length
var s = 1000;
// Setting the center of the viewBox
var c = s / 2;
// Setting the degrees between categories
var degree = 360 / kmap.categories.length;
// Setting the root radius
var root_r = 85;

// Different size settings according to number of involved categories
if (kmap.categories.length > 25) {
    // Setting the radius of an article cluster
    var cluster_r = degree * 1.8;
    // Setting the stroke width of an article cluster
    var cluster_stroke = degree / 1.8;
    // Setting the font size of article numbers
    var font_size = degree * 1.4 + "px";
    // Setting the stroke width of category lines
    var l_stroke = degree / 1.8;
    // Setting the stroke width of background circles
    var b_stroke = degree / 1.8
} else {
    var cluster_r = 25;
    var cluster_stroke = 10;
    var font_size = "20px";
    var l_stroke = 10;
    var b_stroke = 6
};

// Setting offset for article number placement
var offset = 5;

// String for root cluster at the center
var root_text = ["You are here"];

// Setting up the viewBox for the kmap
var svg = d3
    .select("#kmap_map")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + s + " " + s);

// Draw the initial kmap (background circles and category lines)
function drawKmap(kmap) {
    // Draw the background circles
    svg.selectAll("b_circle")
    // ...based on the given radii
        .data(b_radii)
        .enter()
        .append("circle")
        .attr("class", "b_circle")
        .attr("id", function (d, i) {
            return "b_circle_" + i
        })
        .attr("cx", c)
        .attr("cy", c)
        .attr("r", function (d) {
            return d
        })
        .attr("stroke", b_color)
        .attr("stroke-width", b_stroke)
        .attr("fill", "none");

    // Draw the category lines
    svg.selectAll("category_line")
    // ...based on the involved categories in the kmap object
        .data(kmap.categories)
        .enter()
        .append("line")
        .attr("class", "category_line")
        .attr("id", function (d, i) {
            return "category_line_" + d.id
        })
        .attr("x1", c)
        .attr("y1", c)
        .attr("x2", function (d, i) {
            if (i * degree == 0) {
                return c + b_radii[d.length]
            } else if (i * degree == 90) {
                return c
            } else if (i * degree > 0 && i * degree < 90) {
                return c + (b_radii[d.length] * Math.cos(i * degree * Math.PI / 180))
            } else if (i * degree > 90 && i * degree < 180) {
                return c + (b_radii[d.length] * Math.cos(i * degree * Math.PI / 180))
            } else if (i * degree == 180) {
                return c - b_radii[d.length]
            } else if (i * degree > 180 && i * degree < 270) {
                return c + (b_radii[d.length] * Math.cos(i * degree * Math.PI / 180))
            } else if (i * degree == 270) {
                return c
            } else if (i * degree > 270 && i * degree < 361) {
                return c + (b_radii[d.length] * Math.cos(i * degree * Math.PI / 180))
            }
        })
        .attr("y2", function (d, i) {
            if (i * degree == 0) {
                return c
            } else if (i * degree > 0 && i * degree < 180) {
                return c - (b_radii[d.length] * Math.sin(i * degree * Math.PI / 180))
            } else if (i * degree == 180) {
                return c
            } else if (i * degree > 180 && i * degree < 361) {
                return c + (b_radii[d.length] * Math.sin(i * degree * Math.PI / 180)) * -1
            }
        })
        .attr("stroke", function (d, i) {
            return kmap.categories[i].color
        })
        .attr("opacity", opacity)
        .attr("stroke-width", l_stroke);
};

// Draw the article clusters
function drawClusters(class_string, data_d, position, radius, stroke_width, integer) {
    svg.selectAll(class_string)
        .data(data_d)
        .enter()
        .append("circle")
        .attr("class", class_string)
        .attr("id", function (d) {
            return "cluster_" + integer + "_" + d.category_id
        })
        .attr("cx", function (d) {
            var cat_i = kmap
                .categories
                .findIndex(x => x.id === d.category_id);
            if (cat_i * degree == 0) {
                return position + b_radii[integer]
            } else if (cat_i * degree == 90) {
                return position
            } else if (cat_i * degree > 0 && cat_i * degree < 90) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree > 90 && cat_i * degree < 180) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 180) {
                return position - b_radii[integer]
            } else if (cat_i * degree > 180 && cat_i * degree < 270) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 270) {
                return position
            } else if (cat_i * degree > 270 && cat_i * degree < 361) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            }
        })
        .attr("cy", function (d) {
            var cat_i = kmap
                .categories
                .findIndex(x => x.id === d.category_id);
            if (cat_i * degree == 0) {
                return position
            } else if (cat_i * degree > 0 && cat_i * degree < 180) {
                return position - (b_radii[integer] * Math.sin(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 180) {
                return position
            } else if (cat_i * degree > 180 && cat_i * degree < 361) {
                return position + (b_radii[integer] * Math.sin(cat_i * degree * Math.PI / 180)) * -1
            }
        })
        .attr("r", radius)
        .attr("stroke", function (d) {
            return kmap
                .categories
                .find(x => x.id === d.category_id)
                .color
        })
        .attr("stroke-width", stroke_width)
        .attr("fill", "white")
};

// Draw/write the article counts
function drawCounts(class_string, data_d, position, radius, integer) {
    svg.selectAll(class_string)
        .data(data_d)
        .enter()
        .append("text")
        .text(function (d) {
            return d.articles.length
        })
        .attr("class", class_string)
        .attr("id", function (d) {
            return "count_" + integer + "_" + d.category_id
        })
        .attr("text-anchor", "middle")
        .attr("x", function (d) {
            var cat_i = kmap
                .categories
                .findIndex(x => x.id === d.category_id);
            if (cat_i * degree == 0) {
                return position + b_radii[integer]
            } else if (cat_i * degree == 90) {
                return position
            } else if (cat_i * degree > 0 && cat_i * degree < 90) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree > 90 && cat_i * degree < 180) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 180) {
                return position - b_radii[integer]
            } else if (cat_i * degree > 180 && cat_i * degree < 270) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 270) {
                return position
            } else if (cat_i * degree > 270 && cat_i * degree < 361) {
                return position + (b_radii[integer] * Math.cos(cat_i * degree * Math.PI / 180))
            }
        })
        .attr("y", function (d) {
            var cat_i = kmap
                .categories
                .findIndex(x => x.id === d.category_id);
            if (cat_i * degree == 0) {
                return position + offset
            } else if (cat_i * degree > 0 && cat_i * degree < 180) {
                return position + offset - (b_radii[integer] * Math.sin(cat_i * degree * Math.PI / 180))
            } else if (cat_i * degree == 180) {
                return position + offset
            } else if (cat_i * degree > 180 && cat_i * degree < 361) {
                return position + offset + (b_radii[integer] * Math.sin(cat_i * degree * Math.PI / 180)) * -1
            }
        })
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("font-size", font_size)
        .attr("font-weight", "bold")
        .attr("fill", "grey")
        .attr("pointer-events", "none")
};

function mousecluster(t) {
    $(document)
        .ready(function () {
            $("." + t)
                .mouseover(function () {
                    var t = $(this)
                            .attr("id")
                            .slice(10, 20),
                        r = $(this)
                            .attr("id")
                            .slice(8, 9);
                    $(this)
                        .attr("r", 1.4 * cluster_r)
                        .attr("stroke-width", 1.5 * cluster_stroke)
                        .attr("fill", "whitesmoke")
                        .attr("cursor", "pointer"),
                    $("#t_circle_" + t)
                        .attr("r", 12)
                        .attr("stroke-width", 5.35),
                    $("#t_heading_" + t).css("background-color", "whitesmoke"),
                    $("#t_category_text_" + t).css("font-weight", "bold"),
                    $("#t_degree_" + r + "_" + t).css("font-weight", "bold"),
                    $("#t_articles_" + r + "_" + t)
                        .children(".t_article")
                        .css("background-color", "whitesmoke")
                        .css("border-radius", "4px"),
                    setTimeout(function () {
                        $("#t_articles_" + r + "_" + t)
                            .children(".t_article")
                            .css("background-color", "white")
                    }, 8e3)
                }),
            $("." + t).mouseout(function () {
                var t = $(this)
                        .attr("id")
                        .slice(10, 20),
                    r = $(this)
                        .attr("id")
                        .slice(8, 9);
                $(this)
                    .attr("r", cluster_r)
                    .attr("stroke-width", cluster_stroke)
                    .attr("fill", "white"),
                $("#t_circle_" + t)
                    .attr("r", 10)
                    .attr("stroke-width", 3.57),
                $("#t_heading_" + t).css("background-color", "white"),
                $("#t_category_text_" + t).css("font-weight", "normal"),
                $("#t_degree_" + r + "_" + t).css("font-weight", "normal")
            })
        })
};

function mouserootcluster() {
    $(document)
        .ready(function () {
            $(".root_cluster")
                .mouseover(function () {
                    var t = $(this)
                        .attr("id")
                        .slice(5, 10);
                    $(this)
                        .attr("r", 1.1 * root_r)
                        .attr("stroke-width", 1.5 * cluster_stroke)
                        .attr("fill", "whitesmoke")
                        .attr("cursor", "pointer"),
                    $("#t_circle_" + t)
                        .attr("r", 12)
                        .attr("stroke-width", 5.35),
                    $("#t_heading_" + t).css("background-color", "whitesmoke"),
                    $("#t_category_text_" + t).css("font-weight", "bold"),
                    $("#t_degree_root_" + t).css("font-weight", "bold"),
                    $("#t_articles_root_" + t)
                        .children(".t_article")
                        .css("background-color", "whitesmoke")
                        .css("border-radius", "4px"),
                    setTimeout(function () {
                        $("#t_articles_root_" + t)
                            .children(".t_article")
                            .css("background-color", "white")
                    }, 8e3)
                }),
            $(".root_cluster").mouseout(function () {
                var t = $(this)
                    .attr("id")
                    .slice(5, 10);
                $(this)
                    .attr("r", root_r)
                    .attr("stroke-width", cluster_stroke)
                    .attr("fill", "white"),
                $("#t_circle_" + t)
                    .attr("r", 10)
                    .attr("stroke-width", 3.57),
                $("#t_heading_" + t).css("background-color", "white"),
                $("#t_category_text_" + t).css("font-weight", "normal"),
                $("#t_degree_root_" + t).css("font-weight", "normal")
            })
        })
};

function mousecategoryline(t) {
    $(document)
        .ready(function () {
            $(".category_line")
                .mouseover(function () {
                    var r = $(this)
                        .attr("id")
                        .slice(14, 20);
                    $("#cluster_" + t + "_" + r)
                        .attr("r", 1.4 * cluster_r)
                        .attr("stroke-width", 1.5 * cluster_stroke)
                        .attr("fill", "whitesmoke"),
                    $("#root_" + r)
                        .attr("r", 1.1 * root_r)
                        .attr("stroke-width", 1.5 * cluster_stroke),
                    $("#t_circle_" + r)
                        .attr("r", 12)
                        .attr("stroke-width", 5.35),
                    $(this)
                        .attr("stroke-width", 2 * l_stroke)
                        .attr("cursor", "pointer"),
                    $("#t_heading_" + r).css("background-color", "whitesmoke"),
                    $("#t_category_text_" + r).css("font-weight", "bold")
                }),
            $(".category_line").mouseout(function () {
                var r = $(this)
                    .attr("id")
                    .slice(14, 20);
                $("#cluster_" + t + "_" + r)
                    .attr("r", cluster_r)
                    .attr("stroke-width", cluster_stroke)
                    .attr("fill", "white"),
                $("#root_" + r)
                    .attr("r", root_r)
                    .attr("stroke-width", cluster_stroke),
                $("#t_circle_" + r)
                    .attr("r", 10)
                    .attr("stroke-width", 3.57),
                $(this).attr("stroke-width", l_stroke),
                $("#t_heading_" + r).css("background-color", "white"),
                $("#t_category_text_" + r).css("font-weight", "normal")
            })
        })
};