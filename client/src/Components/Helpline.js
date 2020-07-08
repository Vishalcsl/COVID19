import React from 'react';


class Helpline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: []
        }
    }
    componentDidMount() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = 'https://covid-19india-api.herokuapp.com/v2.0/helpline_numbers';
        fetch(proxyurl + url)
            .then(res => res.json())
            .then(data => this.setState({ result: data[1].contact_details }))
    }

    render() {
        const rowItems1 = this.state.result.map((data, index) => (
            <tr className="table-info" key={index}>
                <th scope="row">{data.state_or_UT}</th>
                <td>{data.helpline_number}</td>
            </tr>
        ))
        return (
            <div style={{ 'width': '100%', 'height': 'auto' }}>
                <p className="infoText" style={{ fontSize: '16px' }}>Helpline Numbers</p>
                <table className="table">
                    <tbody>
                        {rowItems1}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default Helpline;