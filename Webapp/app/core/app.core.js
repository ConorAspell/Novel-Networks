﻿(function () {

    'use strict';

    angular
        .module('app')
        .controller('CoreController', ['$state', 'storage', core]);

    function core($state, storage) {

        var core = this;
        core.test = 'TEST';

        var data = JSON.parse(sessionStorage.stats);

        if (JSON.parse(sessionStorage.stats) == '') {
            $state.go('home');
        }

        var barchart = d3.select("svg.barchart"), margin = { top: 20, right: 20, bottom: 30, left: 40 };
        var g = barchart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var keys = ['core', 'degree'];
        var width = barchart.attr("width") - 60;
        var height = barchart.attr("height") - 50;
        var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
        var x1 = d3.scaleBand().padding(0.05);
        var y = d3.scaleLinear().rangeRound([height, 0]);
        var z = d3.scaleOrdinal().range(["#106CC8", "#ff8c00"]);

        x0.domain(data.Node_stats.map(function (d) { return d.node; }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data.Node_stats, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();

        g.append("g")
          .selectAll("g")
          .data(data.Node_stats)
          .enter().append("g")
          .attr("transform", function (d) { return "translate(" + x0(d.node) + ",0)"; })
          .selectAll("rect")
          .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
          .enter().append("rect")
          .attr("x", function (d) { return x1(d.key); })
          .attr("y", function (d) { return y(d.value); })
          .attr("width", x1.bandwidth())
          .attr("height", function (d) { return height - y(d.value); })
          .attr("fill", function (d) { return z(d.key); });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Statistics");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });
    }
})();

