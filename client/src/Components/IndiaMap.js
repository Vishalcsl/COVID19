// commented out return statement on mouse enter if error persists do the changes

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3';
import ReactTooltip from 'react-tooltip';
import IndiaLineGraph from './IndiaLineGraph';
import StateChart from './StateChart';
import LinearGradient from './LinearGradient.js';

/**
* Courtesy: https://github.com/varunon9/india-choropleth-javascript/blob/master
* for other countries/world? 
* Visit: https://github.com/markmarkoh/datamaps
*/
const INDIA_TOPO_JSON = require('../india.topo.json');

const PROJECTION_CONFIG = {
    scale: 350,
    center: [78.9629, 22.5937]
};

// Red Variants
const COLOR_RANGE = [
    '#ffedea',
    '#ffcec5',
    '#ffad9f',
    '#ff8a75',
    '#ff5533',
    '#e2492d',
    '#be3d26',
    '#9a311f',
    '#782618'
];

const DEFAULT_COLOR = '#EEE';

// const getRandomInt = () => {
//     return parseInt(Math.random() * 100);
// };

const geographyStyle = {
    default: {
        outline: true
    },
    hover: {
        fill: '#ccc',
        transition: 'all 250ms',
        outline: 'none'
    },
    pressed: {
        outline: 'none'
    }
};

var stateData = [
    { id: 'AN', state: 'Andaman and Nicobar Islands' },
    { id: 'AP', state: 'Andhra Pradesh' },
    { id: 'AR', state: 'Arunachal Pradesh' },
    { id: 'AS', state: 'Assam' },
    { id: 'BR', state: 'Bihar' },
    { id: 'CH', state: 'Chandigarh' },
    { id: 'CT', state: 'Chhattisgarh' },
    { id: 'DN', state: 'Dadra and Nagar Haveli' },
    { id: 'DL', state: 'Delhi' },
    { id: 'GA', state: 'Goa' },
    { id: 'GJ', state: 'Gujarat' },
    { id: 'HR', state: 'Haryana' },
    { id: 'HP', state: 'Himachal Pradesh' },
    { id: 'JK', state: 'Jammu and Kashmir' },
    { id: 'JH', state: 'Jharkhand' },
    { id: 'KA', state: 'Karnataka' },
    { id: 'KL', state: 'Kerala' },
    { id: 'LA', state: 'Ladakh' },
    { id: 'LD', state: 'Lakshadweep' },
    { id: 'MP', state: 'Madhya Pradesh' },
    { id: 'MH', state: 'Maharashtra' },
    { id: 'MN', state: 'Manipur' },
    { id: 'ML', state: 'Meghalaya' },
    { id: 'MZ', state: 'Mizoram' },
    { id: 'NL', state: 'Nagaland' },
    { id: 'OR', state: 'Odisha' },
    { id: 'PY', state: 'Puducherry' },
    { id: 'PB', state: 'Punjab' },
    { id: 'RJ', state: 'Rajasthan' },
    { id: 'SK', state: 'Sikkim' },
    { id: 'TN', state: 'Tamil Nadu' },
    { id: 'TG', state: 'Telengana' },
    { id: 'TR', state: 'Tripura' },
    { id: 'UP', state: 'Uttar Pradesh' },
    { id: 'UK', state: 'Uttarakhand' },
    { id: 'WB', state: 'West Bengal' }
];

// will generate random heatmap data on every cal
var stateName = stateData.map(ele => ele.state);
const getHeatMapData = () => {
    fetch('https://covid-india-cases.herokuapp.com/states')
        .then(res => res.json())
        .then(data => data)
        .then(data => {
            //dummyAllStateData = data;
            data.map((state, index) => stateData[index]['value'] = state.noOfCases)
        })

    return stateData;
};

function IndiaMap() {

    const [tooltipContent, setTooltipContent] = useState('');
    const [data, setData] = useState(getHeatMapData());
    const [value, setValue] = useState('Andaman and Nicobar Islands');
    //const [currentState, setCurrentState] = useState({});
    // console.log(data);

    const gradientData = {
        fromColor: COLOR_RANGE[0],
        toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
        min: data.reduce((min, item) => (item.value < min ? item.value : min), 100000),
        max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
    };

    const colorScale = scaleQuantile()
        .domain(data.map(d => d.value))
        .range(COLOR_RANGE);

    const onMouseEnter = (geo, current) => {
        return () => {
            setTooltipContent(`${geo.properties.name}: ${current.value}`);
        };
    };

    const onMouseLeave = () => {
        setTooltipContent('');
    };

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(value)
    }

    const options = stateName.map(name => (
        <option value={name} key={name}>{name}</option>
    ));

    return (
        <div className="row">
            <div className="col full-width-height map-container-left">
                <ReactTooltip>{tooltipContent}</ReactTooltip>
                <ComposableMap
                    projectionConfig={PROJECTION_CONFIG}
                    projection="geoMercator"
                    width={200}
                    height={180}
                    data-tip=""
                >
                    <Geographies geography={INDIA_TOPO_JSON}>
                        {({ geographies }) =>
                            geographies.map(geo => {
                                const current = data.find(s => s.id === geo.id);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                                        style={geographyStyle}
                                        onMouseEnter={onMouseEnter(geo, current)}
                                        onMouseLeave={onMouseLeave}
                                    />
                                );
                            })
                        }
                    </Geographies >
                </ComposableMap>
                <LinearGradient data={gradientData} />
                <form onSubmit={handleSubmit}>
                    <label>
                        select the state:
                    <select value={value} onChange={handleChange}>
                            {options}
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div className="col full-width-height map-container-right">
                <StateChart name={value} />
            </div>
        </div>
    );
}

export default IndiaMap;