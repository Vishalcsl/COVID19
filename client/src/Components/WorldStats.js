import React from 'react';

class WorldStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            indiaData: []
        }
    }

    componentDidMount() {
        fetch('https://covid-india-cases.herokuapp.com/states')
            .then(res => res.json())
            .then(data => this.setState({ indiaData: data }))
    }

    render() {
        const allCountryData = this.props.data;
        const rowItems = allCountryData.map(country => (
            <tr key={country.code}>
                <th scope="row">{country.name}</th>
                <td>{country.latest_data.confirmed}</td>
                <td>{country.latest_data.deaths}</td>
                <td>{country.latest_data.recovered}</td>
            </tr>
        ))
        const rowItems2 = this.state.indiaData.map(state => (
            <tr key={state.state}>
                <th scope="row">{state.state}</th>
                <td>{state.noOfCases}</td>
                <td>{state.deaths}</td>
                <td>{state.cured}</td>
            </tr>
        ))
        return (
            <div className="worldStats">
                <div className="row">
                    <div className="col">
                        <p className="tableHead">World Data</p>
                        <div className="card worldData">

                            <table className="table table-striped">
                                <thead>
                                    <tr className="table-danger">
                                        <th scope="col">Country</th>
                                        <th scope="col">Confirmed</th>
                                        <th scope="col">Deaths</th>
                                        <th scope="col">Recovered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowItems}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <p className="tableHead">India Data</p>
                        <div className="card indiaData">

                            <table className="table table-striped">
                                <thead>
                                    <tr className="table-danger">
                                        <th scope="col">State</th>
                                        <th scope="col">Confirmed</th>
                                        <th scope="col">Deaths</th>
                                        <th scope="col">Recovered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowItems2}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default WorldStats;