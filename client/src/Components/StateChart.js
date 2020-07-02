import React from 'react';
import Chart from 'chart.js';
const dummyAllStateTimelineData = require('../StatewiseReport.json');

class StateChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            statesTimeLine: [],
            timeline: false,
            statesData: [],
            dataCheck: false,
            currentStateData: [],
        }

    }
    UNSAFE_componentWillReceiveProps() {
        var currentStateTimeline = this.state.statesTimeLine.find(state => state['State UT'] === this.props.name);
        var currentStateData = this.state.statesData.find(state => state['state'] === this.props.name);
        this.setState({ currentStateData: currentStateData })
        console.log(this.state.statesData, this.props.name)
        var x = [];
        var y = [];
        for (let key in currentStateTimeline) {
            y.push(currentStateTimeline[key]);
            x.push(key)
        }

        // if (myChart) {
        //     console.log("Yes")
        //     myChart.destroy();
        // }

        if (currentStateTimeline !== undefined) {
            var ctx = document.getElementById('line');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: x,
                    datasets: [{
                        label: 'Total Cases',
                        data: y,
                        pointBackgroundColor: "orange",
                        pointBorderColor: 'brown',
                        pointBorderWidth: 0.2,
                        borderColor: "orange"
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

        // })



        if (currentStateData !== undefined) {
            var ctx2 = document.getElementById('pie');
            var myChart2 = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [currentStateData.noOfCases, currentStateData.cured, currentStateData.deaths],
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



    }
    componentDidMount() {

        fetch('https://covid-india-cases.herokuapp.com/states')
            .then(res => res.json())
            .then(data => data)
            .then(data => {
                this.setState({ statesData: data, dataCheck: true })
                var currentStateData = this.state.statesData.find(state => state['state'] === this.props.name);
                this.setState({ currentStateData: currentStateData })
            })
            .catch(error => {
                console.log(error)
            })

        fetch('https://covid-india-cases.herokuapp.com/statetimeline/')
            .then(res => res.json())
            .then(data => {
                console.log(data[0]['State UT'], this.props.name)
                this.setState({ statesTimeLine: data, timeline: true })
            })
            .catch((error) => {
                console.log(error);
                //console.log(require('../StatewiseReport.json'))
                this.setState({ statesTimeLine: dummyAllStateTimelineData, timeline: true })
            })
    }

    render() {
        if (this.state.timeline === true && this.state.dataCheck === true) {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <div className="row sideData">
                        <canvas id="line" width="100%" height="100%"></canvas>
                    </div>
                    <div className="row sideData">
                        <canvas id="pie" width="100%" height="100%"></canvas>
                    </div>
                    <div className="container sideData" style={{ border: "1px solid black" }}>
                        {this.state.dataCheck && this.state.currentStateData !== undefined && (
                            <div className="row infosec" >
                                <div className="col-4 card state-info shadow">{this.state.currentStateData.noOfCases}</div>
                                <div className="col-4card state-info shadow">{this.state.currentStateData.cured}</div>
                                <div className="col-4 card state-info shadow">{this.state.currentStateData.deaths}</div>
                            </div>
                        )}

                        {this.state.dataCheck && this.state.currentStateData !== undefined && (
                            <div className="row infosec">
                                <div className="col-4 card state-info shadow">{this.state.currentStateData.noOfCases - this.state.currentStateData.cured - this.state.currentStateData.deaths}</div>
                                <div className="col-4 card state-info shadow">{(this.state.currentStateData.deaths / this.state.currentStateData.cured).toPrecision(3)}</div>
                                <div className="col-4 card state-info shadow">{(this.state.currentStateData.cured / this.state.currentStateData.noOfCases).toPrecision(3)}</div>
                            </div>
                        )}

                    </div>
                </div>
            )
        } else {
            return (
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                    style={{ width: "100%", height: "100%" }} />
            )
        }

    }
}

export default StateChart;