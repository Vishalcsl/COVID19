import React from 'react';
import stateInfo from '../stateInfo.json';
import axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import { ProgressBar } from 'react-bootstrap';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class Survey extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.state = {
            fullname: '',
            email: '',
            aadhar: '',
            phoneNumber: '',
            state: '',
            district: '',
            city: '',
            zip: '',
            permanentAddress: '',
            currentAddress: '',
            submitCheck: false,
            resultCheck: false,
            districtCheck: false,
            internationalTravel: 'No',
            nationalTravel: 'No',
            errors: {
                fullname: '',
                email: '',
                currentAddress: '',
                permanentAddress: '',
                city: '',
                aadhar: '',
                phoneNumber: '',
                zip: '',
                state: '',
                district: ''
            },
            stateOptions: [],
            districtOptions: [],
            result: [],
            message: '',
            valid: false
        }
    }

    componentDidMount() {
        var temp = [];
        for (let key in stateInfo) {
            temp.push(key);
        }
        let errors = this.state.errors;
        for (let key in errors) {
            errors[key] = '';
        }
        this.setState({ errors, stateOptions: temp, districtCheck: false });
        console.log(stateInfo);
    }

    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let errors = this.state.errors;

        switch (name) {
            case 'fullname':
                errors['fullname'] = value.length < 5 ? 'Fullname too short' : '';
                break;
            case 'phoneNumber':
                errors['phoneNumber'] = value.length < 10 || value.length > 10 ? 'Phone number not valid' : '';
                break;
            case 'aadhar':
                errors['aadhar'] = value.length < 12 || value.length > 12 ? 'Aadhar number not valid' : '';
                break;
            case 'email':
                errors['email'] = validEmailRegex.test(value) ? '' : 'Email not Valid';
                break;
            case 'permanentAddress':
                errors['permanentAddress'] = value.length < 10 ? 'Invalid Address' : '';
                break;
            case 'currentAddress':
                errors['currentAddress'] = value.length < 10 ? 'Invalid Address' : '';
                break;
            case 'zip':
                errors['zip'] = value.length < 6 || value.length > 6 ? 'Invalid Zip' : '';
                break;
            case 'city':
                errors['city'] = value.length === 0 ? "Invalid City Name" : '';
                break;
            case 'state':
                this.setState({ districtOptions: stateInfo[value], districtCheck: true })
                errors['state'] = value === '' ? 'Required' : '';
                break;
            case 'district':
                errors['district'] = value === '' ? 'Required' : '';
                break;
        }

        this.setState({ errors, [name]: value })
    }


    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm(this.state.errors)) {
            // console.log(this.state);
            console.info('Valid Form');
            this.setState({ submitCheck: true });

            const formData = new FormData();
            const { fullname, email, state, district, city, zip, phoneNumber, aadhar, internationalTravel, nationalTravel,
                permanentAddress, currentAddress } = this.state;

            const dataToSend = {
                fullname: fullname,
                email: email,
                state: state,
                district: district,
                city: city,
                zip: zip,
                phoneNumber: phoneNumber,
                aadhar: aadhar,
                internationalTravel: internationalTravel,
                nationalTravel: nationalTravel,
                permanentAddress: permanentAddress,
                currentAddress: currentAddress
            }

            // http://localhost:8080
            const url = "/api/survey";

            axios.post(url, dataToSend)
                .then(response => {
                    if (response.status === 200) {
                        console.log("yes I am in ");
                        console.log(response);
                        this.setState({ resultCheck: true, result: response.data, valid: true, submitCheck: false })
                        console.log(this.state.result)
                    } else if (response.status === 500) {
                        this.setState({ resultCheck: true, result: response.data, valid: false, submitCheck: false })
                        console.log(this.state.result)
                    }
                }, error => {
                    const resMessage = (error.response && error.response.data
                        && error.response.data.message) || error.message || error.toString();

                    this.setState({ message: resMessage, submitCheck: false });
                    console.log(this.state.result)
                }
                )
        } else {
            console.error('Invalid Form')
        }
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach((val) =>
            val.length > 0 && (valid = false)
        )
        return valid;
    }

    render() {
        const stateOptions = this.state.stateOptions.map(name => (
            <option value={name} key={name}>{name}</option>
        ));

        return (
            <div className="surveyMainContainer">
                {this.state.submitCheck === false && this.state.resultCheck === false && (
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="email">Email</label>
                                <input type="email" className="form-control" placeholder="Email"
                                    name="email" value={this.state.email} onChange={this.handleChange} />
                                {this.state.errors.email.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.email}</span>}
                            </div>
                            <div className="form-group col-md-6">
                                <label for="fullname">Fullname</label>
                                <input type="fullname" className="form-control" placeholder="Fullname"
                                    name="fullname" value={this.state.fullname} onChange={this.handleChange} />
                                {this.state.errors.fullname.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.fullname}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="currentAddress">Currrent Address</label>
                            <input type="text" className="form-control" placeholder="1234 Main St"
                                name="currentAddress" value={this.state.currentAddress} onChange={this.handleChange} />
                            {this.state.errors.currentAddress.length > 0 &&
                                <span className='alert alert-danger'>{this.state.errors.currentAddress}</span>}
                        </div>
                        <div className="form-group">
                            <label for="permanentAddress">Permanent Address</label>
                            <input type="text" className="form-control" placeholder="1234 Main St"
                                name="permanentAddress" value={this.state.permanentAddress} onChange={this.handleChange} />
                            {this.state.errors.permanentAddress.length > 0 &&
                                <span className='alert alert-danger'>{this.state.errors.permanentAddress}</span>}
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="mobile">Phone Number</label>
                                <input type="number" className="form-control" placeholder="Contact number"
                                    name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange} />
                                {this.state.errors.phoneNumber.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.phoneNumber}</span>}
                            </div>
                            <div className="form-group col-md-6">
                                <label for="aadhar">Aadhar Number</label>
                                <input type="number" className="form-control" placeholder="Aadhar number"
                                    name="aadhar" value={this.state.aadhar} onChange={this.handleChange} />
                                {this.state.errors.aadhar.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.aadhar}</span>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label for="state">State</label>
                                <select className="form-control" name="state"
                                    value={this.state.state} onChange={this.handleChange}>
                                    <option selected>Choose...</option>
                                    {stateOptions}
                                </select>
                            </div>
                            <div className="form-group col-md-3">
                                <label for="district">District</label>
                                <select className="form-control" name="district"
                                    value={this.state.district} onChange={this.handleChange}>
                                    <option selected>Choose...</option>
                                    {this.state.districtCheck === true && this.state.districtOptions && (this.state.districtOptions.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    )))}
                                </select>
                            </div>
                            <div className="form-group col-md-3">
                                <label for="city">City</label>
                                <input type="text" className="form-control" placeholder="city"
                                    name="city" value={this.state.city} onChange={this.handleChange} />
                                {this.state.errors.city.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.city}</span>}
                            </div>

                            <div className="form-group col-md-3">
                                <label for="zip">Zip</label>
                                <input type="number" className="form-control" placeholder="zip"
                                    name="zip" value={this.state.zip} onChange={this.handleChange} />
                                {this.state.errors.zip.length > 0 &&
                                    <span className='alert alert-danger'>{this.state.errors.zip}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="internationalTravel">If Travelled Internationally</label>
                                <select className="form-control" name="internationalTravel"
                                    value={this.state.internationalTravel} onChange={this.handleChange}>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>

                            <div className="form-group col-md-6">
                                <label for="nationalTravel">If Travelled Nationally</label>
                                <select className="form-control" name="nationalTravel"
                                    value={this.state.nationalTravel} onChange={this.handleChange}>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                )}

                {this.state.submitCheck === true && this.state.resultCheck === false && (
                    <div className="resultDisplay">
                        <Loader
                            type="Rings"
                            color="#00BFFF"
                        />
                    </div>
                )}

                {this.state.resultCheck === true && this.state.valid === true && (
                    <div className="resultDisplay" >
                        <div className="successResult">
                            {this.state.result.zone === "Orange" && (
                                <i className="far fa-meh fa-5x" style={{ color: "orange" }}>
                                </i>
                            )}
                            {this.state.result.zone === "Green" && (
                                <i className="far fa-smile-beam fa-5x" style={{ color: "green" }}>
                                </i>
                            )}
                            {this.state.result.zone === "Red" && (
                                <i className="far fa-sad-tear fa-5x" style={{ color: "red" }}>
                                </i>
                            )}

                        </div>
                        <div className="successResult">
                            <span>Zone</span>
                            <h3>{this.state.result.zone}</h3>
                        </div>
                        <div className="successResult">
                            <span>Safety Scale</span>
                            <h3>{this.state.result.safetyMeter.toPrecision(2)}</h3>
                            <ProgressBar stripped variant="success" animated now={Math.ceil(this.state.result.safetyMeter)}
                                label={`${this.state.result.safetyMeter.toPrecision(2)}%`} />
                        </div>
                        <div className="successResult">
                            <span>Danger Scale</span>
                            <h3>{this.state.result.dangerMeter.toPrecision(2)}</h3>
                            <ProgressBar stripped variant="danger" animated now={Math.ceil(this.state.result.dangerMeter)}
                                label={`${this.state.result.dangerMeter.toPrecision(2)}%`} />
                        </div>
                        <div className="successResult">
                            <span>Message</span>
                            <h3>{this.state.result.message}</h3>
                        </div>
                    </div>
                )}


                {this.state.resultCheck === true && this.state.valid === false && (
                    <div className="resultDisplay" >
                        <div className="errorResult">
                            <i className="far fa-meh-rolling-eyes fa-5x" style={{ color: "orange" }}></i>
                        </div>
                        <div className="row errorResult"><span>Result</span>: {this.state.result.message}</div>
                    </div>
                )}

                {this.state.message !== '' && this.state.resultCheck === false && (
                    <div className="resultDisplay" >
                        <div className="errorResult">
                            <i className="far fa-tired fa-5x" style={{ color: "red" }}></i>
                        </div>
                        <div className="row errorResult">
                            <h3>{this.state.result.message}</h3>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Survey;