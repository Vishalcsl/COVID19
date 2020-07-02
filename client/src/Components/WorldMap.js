import React from 'react';
import { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear, color, event } from 'd3';
import useResizeObserver from "./useResizeObserver";

function WorldMap({ data, property }) {
    // console.log("From World Map:", data['features'][0]['properties'][property])
    // data.features.map(feature => {
    //     console.log(feature.properties[property].total_case)
    // })
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleClick = (country) => {
        console.log(country.properties.name, country.properties.wb_a2);
        const url = `/info/${country.properties.wb_a2}/${country.properties['name']}`;
        window.location.replace(url);
    }

    //called on every data change
    useEffect(() => {
        const svg = select(svgRef.current);

        const minProp = min(data.features, feature => feature.properties[property]['total_case']);
        const maxProp = max(data.features, feature => feature.properties[property]['total_case']);
        const colorScale = scaleLinear()
            .domain([minProp, maxProp])
            .range(["#ccc", "red"]);

        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

        //projecting geo-coordinates on a 2D-plane
        const projection = geoMercator()
            .fitSize([width, height], selectedCountry || data)
            .precision(100);

        //takes geojson data, 
        //transforms that into the d attribute of a path

        const pathGenerator = geoPath().projection(projection);

        var div = select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //rendering each country
        svg
            .selectAll(".country")
            .data(data.features)
            .join("path")
            .on("click", (feature, d) => {

                handleClick(feature);
                select('.tooltip').remove();
                setSelectedCountry(selectedCountry === feature ? null : feature);
            })
            .on('mouseover', function (feature) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Country : " + feature.properties['name'] + "<br/>" +
                    "Total-Cases : " + feature.properties[property]['total_case'] + "<br/>" +
                    "Total-Deaths : " + feature.properties[property]['total_death'] + "<br/>" +
                    "Total-Recovered : " + feature.properties[property]['total_recovered'] + "<br/>" +
                    "Death-Rate : " + feature.properties[property]['death_rate'] + "<br/>" +
                    "Recovery-Rate : " + feature.properties[property]['recovery_rate'] + "<br/>" +
                    "Test-per-Million-Population : " + feature.properties[property]['cases_per_million_population'])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                select(this).classed("selected", true)
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(50)
                    .style("opacity", 0);
                select(this).classed("selected", false)
            })
            .attr("class", "country")
            .transition()
            .attr("fill", feature => colorScale(feature.properties[property]['total_case']))
            .attr("d", feature => pathGenerator(feature))


        // svg
        //     .selectAll(".label")
        //     .data([selectedCountry])
        //     .join("text")
        //     .attr("fill", "blue")
        //     .attr("class", "label")
        //     .text(
        //         feature =>
        //             feature &&
        //             feature.properties.name +
        //             ": " +
        //             "Total Cases : " + feature.properties[property]['total_case'] +
        //             "Total Death : " + feature.properties[property]['total_death'] +
        //             "Total Recoverd : " + feature.properties[property]['total_recovered'] +
        //             "Death Rate : " + feature.properties[property]['death_rate'] +
        //             "Recovery Rate : " + feature.properties[property]['recovery_rate']
        //         // JSON.stringify(feature.properties[property])
        //     )
        //     .attr("x", 10)
        //     .attr("y", 25);



    }, [data, dimensions, property, selectedCountry]);

    return (
        <div ref={wrapperRef} className="worldMapWrapper">
            <svg ref={svgRef}></svg>
        </div>
    );
}


export default WorldMap;