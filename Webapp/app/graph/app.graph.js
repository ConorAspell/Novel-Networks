(function () {

    'use strict';

    angular
        .module('app')
        .controller('GraphController', ['$state', 'storage', graph])
        .controller('GraphCentralityController', ['$state', 'storage', graph_centrality])
        .controller('GraphCoreController', ['$state', 'storage', graph_core]);

    function graph($state, storage) {
    }

    function graph_centrality($state, storage) {

        var graph = this;
        graph.centrality = "Inbetweeness";

        var info = JSON.parse(sessionStorage.info);
        if (info == '') {
            $state.go('home');
        }

        graph.groups = [];
        graph.temp = [];
        graph.sel = []
        for(var i=0; i<info.question.length;i++){
            if(!graph.groups.includes(info.question[i].question)){
                graph.groups.push(info.question[i].question);
                graph.sel.push(info.question[i].question);
                graph.temp.push(info.question[i].question);
            }
        }
        graph.changes = function(item) {
            if (graph.sel.includes(item)) {
                var index = graph.sel.indexOf(item);
                graph.sel.splice(index,1);
            }
            else {
                graph.sel.push(item);
            }
            d3.select(svg.graph)
            console.log(graph.sel);
            restart();
        }
        graph.type = function(d) {
            return graph.sel.includes(d)?true:false;
        }
        graph.linkfilter = function (d) {
            var result = info.question.filter(function (obj) { return obj.id == d.target })[0];
            var result2 = info.question.filter(function (obj) { return obj.id == d.source })[0];

            return !graph.sel.includes(result.question) || !graph.sel.includes(result2.question) ?  false:true ;
        }
        graph.nodefilter = function(d){
            return graph.sel.includes(d.question)? true : false;
        }

        graph.linkfilterUpdate = function (d) {
            var result = info.question.filter(function (obj) { return obj.id == d.target.id })[0];
            var result2 = info.question.filter(function (obj) { return obj.id == d.source.id })[0];

            return !graph.sel.includes(result.question) || !graph.sel.includes(result2.question) ? false : true;
        }

        
        var svg = d3.select("svg.graph"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))//.distance(function (d) { return 300; }))
            .force("charge", d3.forceManyBody().strength(function (d) { return d.Centrality[graph.centrality] *-1000; }))
            .force("center", d3.forceCenter(width / 2, height / 2.5))
            

        // console.log(temp);
        var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(info.links.filter(graph.linkfilter))
                .enter().append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });
        ;
        var node = svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data(info.nodes.filter(graph.nodefilter))
          .enter().append("circle")
            .attr("r", function (d) {
                return d.Centrality.Inbetweeness;
            })
            .attr("fill", function (d) { return color(d.group); })
            .attr("type", function(d){return d.question})
            .html(function (d) { return d.id })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        var texts = svg.selectAll("text.label")
        .data(info.nodes.filter(graph.nodefilter))
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function (d) {
            return d.id;

        });
        node.append("title")
            .text(function (d) { return d.id; });

        node.append("span")
            .text(function (d) { return d.id });

        node.append("text")
              .attr("dx", 12)
              .attr("dy", ".35em")
            .text(function (d) { return d.id });

        

        simulation
            .nodes(info.nodes.filter(graph.nodefilter))
            .on("tick", ticked);

        simulation.force("link")
            .links(info.links.filter(graph.linkfilter));

        graph.change = function (value) {
            graph.centrality = value;
            simulation.force("charge", d3.forceManyBody().strength(function (d) { return d.Centrality[graph.centrality] *-100; }))
            node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {return d.y;})
            .attr("r", function (d) {               
                return d.Centrality[graph.centrality];
            });
        }
        function restart() {

            // Apply the general update pattern to the nodes.
            node = node.data(info.nodes.filter(graph.nodefilter), function (d) { return d.id; });
            node.exit().remove();
            node = node.enter()
                .append("circle")
                .attr("fill", function (d) { return color(d.group); })
                .attr("r", function (d) {
                         return d.Centrality.Inbetweeness;
                })
                .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
                .merge(node);
            //    .attr("class", "nodes")
            //    .append("circle")
           
            //.attr("fill", function (d) { return color(d.group); })
            //.attr("type", function (d) { return d.question })
            //.call(d3.drag()
            //    .on("start", dragstarted)
            //    .on("drag", dragged)
            //    .on("end", dragended));

            texts = texts.data(info.nodes.filter(graph.nodefilter), function (d) { return d.id; });
            texts.exit().remove();
            texts = texts.enter()
                .append("text")
                 .attr("class", "label")
                .text(function (d) {
                    return d.id;
                })
                   .merge(texts);

            // Apply the general update pattern to the links.
            link = link.data(info.links.filter(graph.linkfilterUpdate));
            link.exit().remove();
            link = link.enter()
                .append("line")
                .attr("class", "links")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                })
                .merge(link);

            
            // Update and restart the simulation.
            simulation.nodes(info.nodes.filter(graph.nodefilter));
            simulation.force("link").links(info.links.filter(graph.linkfilterUpdate));
            simulation.alpha(1).restart();
        }

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) { return d.y; })
                .attr("r", function (d) {
                    return d.Centrality[graph.centrality];
                })

            texts.attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.6).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }



    };

    function graph_core($state, storage) {
        
        var graphcore = this;
        graphcore.test = 'TEST';

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
        var z = d3.scaleOrdinal().range(["#7b6888", "#ff8c00"]);

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

