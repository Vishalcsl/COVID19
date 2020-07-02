import React from 'react';
import Chart from 'chart.js';


class WorldLineGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            worldCasesArray: [],
            checkWorld: false,
        }
    }

    componentDidMount() {

        fetch(`https://corona-api.com/timeline`)
            .then(res => res.json())
            .then(data => data.data)
            .then(data => {
                var totalcaseArray = [];
                data.map((ele) => {
                    totalcaseArray.push({ date: ele.date, total: ele.confirmed, death: ele.deaths, recovered: ele.recovered })
                })
                totalcaseArray.reverse();
                this.setState({ worldCasesArray: totalcaseArray, checkWorld: true })
            })
            .then(() => {
                var ctx = document.getElementById('myChart');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.state.worldCasesArray.map(ele => ele.date),
                        datasets: [{
                            label: 'Total Cases',
                            data: this.state.worldCasesArray.map(ele => ele.total),
                            pointBackgroundColor: "orange",
                            pointBorderColor: 'brown',
                            pointBorderWidth: 0.2,
                            borderColor: "orange"
                        }, {
                            label: 'Total Deaths',
                            data: this.state.worldCasesArray.map(ele => ele.death),
                            pointBackgroundColor: "red",
                            pointBorderColor: 'brown',
                            pointBorderWidth: 0.2,
                            borderColor: "red"
                        }, {
                            label: 'Total Recovered',
                            data: this.state.worldCasesArray.map(ele => ele.recovered),
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
            <div className="trans" style={{ marginLeft: "4vw" }}>
                <canvas id="myChart" width="100%" height="100%"></canvas>
            </div>
        )

    }
}

export default WorldLineGraph;