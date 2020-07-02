import React from 'react';
import WOW from 'wowjs';

var key = '3475b37b953e49fe8593157e1f179931'
class News extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkIndiaNews: false,
            checkWorldNews: false,
            worldNews: [],
            indiaNews: []
        }
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            const wow = new WOW.WOW({
                live: true,
            })
            wow.init()
        }
        fetch(`http://newsapi.org/v2/top-headlines?country=in&q=corona&apiKey=${key}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    return data.articles
                } else {
                    return [];
                }
            })
            .then(data => this.setState({ indiaNews: data, checkIndiaNews: true }));


        fetch(`http://newsapi.org/v2/top-headlines?country=us&q=corona&apiKey=${key}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.status === 'ok') {
                    return data.articles
                } else {
                    return [];
                }
            })
            .then(data => this.setState({ worldNews: data, checkWorldNews: true }));
    }

    render() {
        // console.log(this.state.worldNews)
        const rowItems1 = this.state.worldNews.map((news, index) => (
            <tr className="table-info" key={index}>
                <th scope="row">{news.source.name}</th>
                <td>{news.author}: <br />
                    <a href={news.url} style={{ textDecoration: 'none' }}>{news.title}</a>
                </td>
            </tr>
        ))

        const rowItems2 = this.state.indiaNews.map((news, index) => (
            <tr className="table-warning" key={index}>
                <th scope="row">{news.source.name}</th>
                <td>{news.author}: <br />
                    <a href={news.url} style={{ textDecoration: 'none' }}>{news.title}</a>
                </td>
            </tr>
        ))

        var flag = false;
        setInterval(() => {
            if (flag === false) {
                document.getElementById("flashAgain").style.backgroundColor = 'yellow';
                flag = true;
            } else {
                document.getElementById("flashAgain").style.backgroundColor = 'lightgreen';
                flag = false;
            }

        }, 100);


        return (
            <div className="news">
                <p className="wow bounceInUp" id="flashAgain">Corona News Update</p>
                <div className="row">
                    <div className="col">
                        <p className="tableHead">World News</p>
                        <div className="card wow bounceInDown worldNews" data-wow-duration="2s" data-wow-delay="1s">
                            {this.state.worldNews !== [] && (
                                <table className="table">
                                    <tbody>
                                        {rowItems1}
                                    </tbody>
                                </table>
                            )}
                            {this.state.worldNews === [] && {
                                //Loader or dipaly regret
                            }}
                        </div>
                    </div>
                    <div className="col">
                        <p className="tableHead">India News</p>
                        <div className="card wow bounceInUp indiaNews" data-wow-duration="2s" data-wow-delay="2s">
                            {this.state.indiaNews !== [] && (
                                <table className="table">
                                    <tbody>
                                        {rowItems2}
                                    </tbody>
                                </table>
                            )}
                            {this.state.indiaNews === [] && {
                                //Loader or dipaly regret
                            }}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default News;