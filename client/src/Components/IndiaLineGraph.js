import React from 'react';
import Chart from 'chart.js';


class IndiaLineGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            indiaCasesArray: [],
            checkIndia: false
        }
    }

    componentDidMount() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://corona-api.com/countries/IN";
        fetch(proxyurl + url)
            .then(res => res.json())
            .then(data => data.data.timeline)
            .then(data => {
                console.log("India Graph", data)
                var totalcaseArray = [];
                data.map((ele) => {
                    totalcaseArray.push({
                        date: ele.date, total: ele.confirmed,
                        death: ele.deaths, recovered: ele.recovered
                    })
                })
                totalcaseArray.reverse();
                this.setState({ indiaCasesArray: totalcaseArray, checkIndia: true })
            })
            .then(() => {
                var ctx = document.getElementById(this.props.Id);
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.state.indiaCasesArray.map(ele => ele.date),
                        datasets: [{
                            label: 'Total Cases',
                            data: this.state.indiaCasesArray.map(ele => ele.total),
                            pointBackgroundColor: "orange",
                            pointBorderColor: 'brown',
                            pointBorderWidth: 0.2,
                            borderColor: "orange"
                        }, {
                            label: 'Total Deaths',
                            data: this.state.indiaCasesArray.map(ele => ele.death),
                            pointBackgroundColor: "red",
                            pointBorderColor: 'brown',
                            pointBorderWidth: 0.2,
                            borderColor: "red"
                        }, {
                            label: 'Total Recovered',
                            data: this.state.indiaCasesArray.map(ele => ele.recovered),
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
            })

    }

    render() {
        return (
            <div className="trans" style={{ marginLeft: "6vw" }}>
                <canvas id="myChart2" width="100%" height="100%"></canvas>
            </div>
        )

    }
}

export default IndiaLineGraph;