import React from 'react';
import WOW from 'wowjs'

class ThingsToTakeCare extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inst1: [
                "Isolate yourself in a well-ventilated with an attached toilet. If another member is sharing the same room, they are advised to keep a distance of at least 1 meter",
                "Stay away from the vulnerable group, including elderly people, pregnant women, children and persons with co-morbidities",
                "There should be minimum movement in and outside the house",
                "Wash hands often with either soap or water or hand sanitizer",
                "Do not share common household items like glasses, cups, utensils, bedding, etc",
                "Cover your mouth and nose with a surgical mask, which should be changed every 6-8 hours",
                "The used masks should be properly disposed of by burning or burial after disinfecting it with an ordinary bleach solution (5%) or sodium hypochlorite solution (1%)"
            ],
            inst2: [
                "Only one of the family members should take care of the person, and no visitors should be allowed",
                "Avoid direct touch and use gloves whenever you meet the quarantined person",
                "Never forget to sanitize yourself properly before and after meeting the person",
                "If the home quarantined person develops symptoms, all his/ her family members will be quarantined for 14 days, with a follow up of another 14 days, till the reports turn negative"
            ]
        }
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            const wow = new WOW.WOW({
                live: true,
            })
            wow.init()
        }
    }

    render() {
        const rowItems1 = this.state.inst1.map((inst, index) => (
            index % 2 === 0 ?
                <tr key={index} className="table-warning">
                    <td>{index + 1} </td>
                    <td>{inst}</td>
                </tr>
                :
                <tr key={index} className="table-info">
                    <td>{index + 1} </td>
                    <td>{inst}</td>
                </tr>
        ))

        const rowItems2 = this.state.inst2.map((inst, index) => (
            index % 2 === 0 ?
                <tr key={index} className="table-warning">
                    <td>{index + 1} </td>
                    <td>{inst}</td>
                </tr>
                :
                <tr key={index} className="table-info">
                    <td>{index + 1} </td>
                    <td>{inst}</td>
                </tr>
        ))

        var flag = false;
        setInterval(() => {
            if (flag === false) {
                document.getElementById("flash").style.backgroundColor = 'yellow';
                flag = true;
            } else {
                document.getElementById("flash").style.backgroundColor = 'lightgreen';
                flag = false;
            }

        }, 100);

        return (
            <div className="guidelines">
                <p className="wow bounceInUp" id="flash">Pay Attention Here</p>
                <div className="row">
                    <div className="col">
                        <p className="tableHead">Guidelines for Home Quarantined</p>
                        <div className="card wow slideInRight" data-wow-duration="2s" data-wow-delay="1s">
                            <table className="table">
                                <tbody>
                                    {rowItems1}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <p className="tableHead">Guidelines for General People</p>
                        <div className="card wow bounceInUp" data-wow-duration="2s" data-wow-delay="2s">
                            <table className="table">
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

export default ThingsToTakeCare;