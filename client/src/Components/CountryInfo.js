import React from 'react';
import Chart from 'chart.js'
import { rgb } from 'd3';
const { getCode } = require('country-list');


class CountryInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            country: '',
            countryData: [],
            countryInfo: [],
            check: false
        }
    }

    componentDidUpdate() {
        var ctx = document.getElementById('lineGraph');
        var { countryData } = this.state;
        var countryDataNew = countryData.reverse();
        if (!lineChart) {
            var lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: countryDataNew.map(ele => ele.date),
                    datasets: [{
                        label: 'Total Cases',
                        data: countryDataNew.map(ele => ele.confirmed),
                        pointBackgroundColor: "orange",
                        pointBorderColor: 'brown',
                        pointBorderWidth: 0.2,
                        borderColor: "orange",
                    }, {
                        label: 'Total Deaths',
                        data: countryDataNew.map(ele => ele.deaths),
                        pointBackgroundColor: "red",
                        pointBorderColor: 'brown',
                        pointBorderWidth: 0.2,
                        borderColor: "red"
                    }, {
                        label: 'Total Recovered',
                        data: countryDataNew.map(ele => ele.recovered),
                        pointBackgroundColor: "green",
                        pointBorderColor: 'brown',
                        pointBorderWidth: 0.2,
                        borderColor: "green"
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000,
                        easing: 'easeInCubic'
                    }
                }
            });
        }


        var ctx2 = document.getElementById("doughGraph");
        var doughChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [this.state.countryInfo.total, this.state.countryInfo.recovered
                        , this.state.countryInfo.deaths],
                    backgroundColor: ['Yellow', 'Green', 'Red'],
                    hoverBackgroundColor: 'Gray'
                }],
                labels: [
                    'Active',
                    'Cured',
                    'Dead'
                ],
            },
            options: {
                rotation: -0.5 * Math.PI,
                circumference: 2 * Math.PI,
                animation: {
                    animateRotate: true,
                    duration: 1500
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        })
    }
    componentDidMount() {
        console.log("Country-Info")
        const pathParams = window.location.pathname.split('/');
        const country = pathParams[pathParams.length - 1]
        this.setState({ country: country });
        const code = getCode(country)
        const proxy_url = "https://cors-anywhere.herokuapp.com/";
        const url = `http://corona-api.com/countries/${code}`



        fetch(proxy_url + url)
            .then(res => res.json())
            .then(data => data.data)
            .then(data => {
                this.setState({ countryData: data.timeline });

                const temp = {
                    name: data.name,
                    population: data.population,
                    total: data.latest_data.confirmed,
                    newtotal: data.timeline[0].new_confirmed,
                    deaths: data.latest_data.deaths,
                    newDeaths: data.timeline[0].new_deaths,
                    recovered: data.latest_data.recovered,
                    newRecovered: data.timeline[0].new_recovered,
                    critical: data.latest_data.critical,
                    deathRate: data.latest_data.calculated.death_rate,
                    recoveryRate: data.latest_data.calculated.recovery_rate,
                    casePerMillion: data.latest_data.calculated.cases_per_million_population,

                }

                this.setState({ countryInfo: temp })
            })
    }

    render() {

        return (
            <div style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
                <div className="row justify-content-md-center">
                    <div id="country-name" className="card shadow">{this.state.countryInfo.name} Corona Info</div>
                </div>
                <div className=" main-info" >
                    <div className="row" style={{ width: "100%", height: "100%" }}>
                        <div className="col-md-3 col-info">
                            <div className="singleInfoBlock shadow">
                                <p>Total Cases</p>
                                <p>{this.state.countryInfo.total}(+{this.state.countryInfo.newtotal})</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Deaths</p>
                                <p>{this.state.countryInfo.deaths}(+{this.state.countryInfo.newDeaths})</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Recovered</p>
                                <p>{this.state.countryInfo.recovered}(+{this.state.countryInfo.newRecovered})</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Critical</p>
                                <p>{this.state.countryInfo.critical}</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-info">
                            <div className="graphBlock">
                                <canvas id="lineGraph" width="100%" height="100%"></canvas>
                            </div>
                            <div className="graphBlock">
                                <canvas id="doughGraph" width="100%" height="100%"></canvas>
                            </div>
                        </div>
                        <div className="col-md-3 col-info">
                            <div className="singleInfoBlock shadow">
                                <p>Population</p>
                                <p>{this.state.countryInfo.population}</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Cases Per Million</p>
                                <p>{this.state.countryInfo.casePerMillion}</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Death Rate</p>
                                <p>{this.state.countryInfo.deathRate}</p>
                            </div>
                            <div className="singleInfoBlock shadow">
                                <p>Recovery Rate</p>
                                <p>{this.state.countryInfo.recoveryRate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default CountryInfo;