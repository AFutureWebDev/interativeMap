const svg = d3.select("svg");

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);


const g = svg.append('g');

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: "Sphere"}));

svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}))

Promise.all([
    d3.tsv('http://unpkg.com/world-atlas@1.1.4/world/50m.tsv'), 
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {
    
    //Using reduce to get the country name to show on hover (Cleaner approach)
    const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
    }, {});
    
    //Another way to get the country name to show on hover
    // const countryName = {};
    // tsvData.forEach(d => {
    //     countryName[d.iso_n3] = d.name;
    // });

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
       g.selectAll('path').data(countries.features)
        .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator) 
        .append('title')
            .text(d => countryName[d.id]);
});

