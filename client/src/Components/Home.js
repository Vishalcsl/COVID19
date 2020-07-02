import React from 'react';
import Wdata from '../custom.geo.json';
import WorldMap from './WorldMap';
import WorldStats from './WorldStats';
import ThingsToTakeCare from './ThingsToTakeCare';
import News from './News';
import WorldLineGraph from './WorldLineGraph';
import IndiaLineGraph from './IndiaLineGraph';


class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            check: false,
            property: "",
            data: [],
            worldStats: []
        }
    }


    componentDidMount() {
        fetch("https://corona-api.com/countries")
            .then(res => res.json())
            .then(data => data.data)
            .then(data => {
                this.setState({ worldStats: data })
                // console.log("ApiCheck: ", data[0]['name'])
                Wdata['features'].map(feature => {
                    let flag = false;
                    data.map(country => {
                        if (country.name === 'USA' && feature['properties']['name'] === 'United States') {
                            feature['properties']['corona'] = {
                                "total_case": country.latest_data.confirmed,
                                "total_death": country.latest_data.deaths,
                                "total_recovered": country.latest_data.recovered,
                                "death_rate": country.latest_data.calculated.death_rate,
                                "recovery_rate": country.latest_data.calculated.recovery_rate,
                                "cases_per_million_population": country.latest_data.calculated.cases_per_million_population
                            }
                            flag = true;
                        }

                        if (country.name.toLowerCase() === feature['properties']['name'].toLowerCase() ||
                            country.name.toLowerCase() === feature['properties']['admin'].toLowerCase() ||
                            country.name.toLowerCase() === feature['properties']['adm0_a3']) {
                            flag = true;

                            feature['properties']['corona'] = {
                                "total_case": country.latest_data.confirmed,
                                "total_death": country.latest_data.deaths,
                                "total_recovered": country.latest_data.recovered,
                                "death_rate": country.latest_data.calculated.death_rate,
                                "recovery_rate": country.latest_data.calculated.recovery_rate,
                                "cases_per_million_population": country.latest_data.calculated.cases_per_million_population
                            }
                        }
                    })

                    if (flag == false) {
                        feature['properties']['corona'] = {
                            "total_case": 0,
                            "total_death": 0,
                            "total_recovered": 0,
                            "death_rate": 0,
                            "recovery_rate": 0,
                            "cases_per_million_population": 0
                        }
                    }
                    // console.log(data.indexOf(feature['properties']['name']))
                })
                this.setState({ check: true, data: Wdata, property: "corona" });
                // this.setState({ property: "pop_est" })
                // console.log("Local Data Check:", Wdata['features'][0]['properties']['corona'])
            })
    }

    render() {
        return (
            <div>
                <h2>World Map Chart</h2>
                {this.state.check === true && (
                    <WorldMap data={this.state.data} property={this.state.property} />
                )}

                {this.state.check === true && (
                    <WorldStats data={this.state.worldStats} />

                )}
                <div>
                    <div className="row">
                        <div className="col">
                            <WorldLineGraph />
                        </div>
                        <div className="col">
                            <IndiaLineGraph Id={'myChart2'} />
                        </div>
                    </div>
                </div>

                <ThingsToTakeCare />
                <News />
            </div>
        )
    }
}

export default Home;