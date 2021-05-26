import React, { Component } from "react";
import http from "../../../services/httpService";

class CustomerDetails extends Component {
    state = {
        form: { name: "", gender: "", dob: "", PAN: "", addressLine1: "", addressLine2: "", state: "", city: "",
            day: "", month: "", year: "" },
        statecity: [],
        errors: {},
        months: ["January", "February", "March", "April", "May", "June", "July", "August", 
            "September", "October", "November", "December"],
        days: [],
    };

    async componentDidMount() {
        let response = await http.get(`/getCustomer/${this.props.user.name}`);
        let { data } = response;
        console.log(data);
        if(data){
            let suc = true;
            this.setState({ form: data, suc: suc });
        }
        let response1 = await http.get(`/statecity`);
        this.setState({ statecity: response1.data });
    }

    handleChange = (e) =>{
        const { currentTarget: input } = e;
        let s1 = {...this.state};
        s1.form[input.name] = input.value;
        s1.days = s1.form.year && s1.form.month ? this.makeDaysArr(s1.form.year, s1.form.month) : []; 
        if(input.name === "year") {
            s1.form.month = "";
            s1.form.day = "";
            s1.days = [];
        }
        if(input.name === "month") s1.form.day = "";
        this.setState(s1);
    };

    async postData(url, obj) {
        let response = await http.post(url, obj);
        let { data } = response;
        console.log(data);
        alert(this.props.user.name + " details Added Successfully");
        this.props.history.push("/customer");
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if(this.isValid(errors)){
            let s1 = {...this.state.form};
            let obj = {};
            obj.name = this.props.user.name;
            obj.gender = s1.gender;
            obj.dob = s1.day + "-" + s1.month + "-" + s1.year;
            obj.PAN = s1.PAN;
            obj.addressLine1 = s1.addressLine1;
            obj.addressLine2 = s1.addressLine2;
            obj.state = s1.state;
            obj.city = s1.city;
            this.postData(`/customerDetails`, obj);
        }
        else {
            let s1 = {...this.state};
            s1.errors = errors;
            this.setState(s1);
        } 
    };
    validateAll = () => {
        let { gender, day, month, year, PAN, state, city } = this.state.form;
        let errors = {};
        errors.gender = this.validateGender(gender);
        errors.day = this.validateDay(day);
        errors.month = this.validateMonth(month);
        errors.year = this.validateYear(year);
        errors.PAN = this.validatePAN(PAN);
        errors.state = this.validateState(state);
        errors.city = this.validateCity(city);
        return errors;
    };
    validateGender = (gender) =>
        !gender ? "Gender must be selected" : "";
    validateDay = (day) =>
        !day ? "Day must be selected" : "";
    validateMonth = (month) =>
        !month ? "Month must be selected" : "";
    validateYear = (year) =>
        !year ? "Year must be selected" : "";
    validatePAN = (PAN) =>
        !PAN ? "PAN must be entered" : "";
    validateState = (state) =>
        !state ? "State must be selected" : "";
    validateCity = (city) =>
        !city ? "City must be selected" : "";

    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc,curr) => (errors[curr] ? acc+1 : acc),0);
        return count === 0;
    };

    makeYearsArr = () => {
        let arr = [];
        for(let i=1970; i<=2021; i++)
            arr[i] = i;
        return arr;
    };
    checkLeapYear = (year) => {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    };
    makeDaysArr = (year, month) => {
        let arr = [];
        if(this.checkLeapYear(year) && month === "February"){
            for(let i=1; i<=29; i++)
                arr[i] = i;
        }
        else if(!this.checkLeapYear(year) && month === "February"){
            for(let i=1; i<=28; i++)
                arr[i] = i;
        }
        else if(month === "April" || month === "June" || month === "September" || month === "November"){
            for(let i=1; i<=30; i++)
                arr[i] = i;
        }
        else {
            for(let i=1; i<=31; i++)
                arr[i] = i;
        }
        return arr;
    };
    
    render(){
        let { gender, dob = "", PAN, addressLine1, addressLine2 = "", state, city, day, month, year } = this.state.form;
        let { errors, statecity = [], months, days } = this.state;
        const years = this.makeYearsArr();

        let index = dob.indexOf("-");
        day = day ? day : dob.substring(0, index);
        let index1 = dob.indexOf("-", (index+1));
        month = month ? month : dob.substring(index+1, index1);
        year = year ? year : dob.substring(index1+1);
        days = dob ? this.makeDaysArr(month, year) : days;

        let states = statecity.reduce((acc,curr) => acc.find((val) => val === curr.stateName) ? acc : [...acc, curr.stateName], []);
        let indexCity = statecity.findIndex((item) => item.stateName === state);
        let cities = indexCity === -1 ? [] : statecity[indexCity].cityArr;

        return (
            <div className="container pt-4">
                <h4>Customer Details</h4>
                <div className="row">
                    <div className="col-3">
                        <label className="font-weight-bold">Gender<span className="text-danger">*</span></label>
                    </div>
                    <div className="col-3 form-check">
                        <input className="form-check-input" type="radio" name="gender" value="Male" 
                            checked={gender === "Male"} onChange={this.handleChange} />
                        <label className="form-check-label">Male</label>
                    </div>
                    <div className="col-3 form-check">
                        <input className="form-check-input" type="radio" name="gender" value="Female" 
                            checked={gender === "Female"} onChange={this.handleChange} />
                        <label className="form-check-label">Female</label>
                    </div>
                    <div className="col-3"></div>
                    {errors.gender && <span className="text-danger ml-3">{errors.gender}</span>}
                </div>
                <hr />
                <label className="font-weight-bold">Date of Birth<span className="text-danger">*</span></label>
                <div className="row">
                    <div className="col-4 form-group">
                        <select className="form-control" name="year" value={year} onChange={this.handleChange}>
                            <option disabled value="">Select Year</option>
                            {years.map((c1, index) => (
                                <option key={index}>{c1}</option>
                            ))}
                        </select>
                        {errors.year && <span className="text-danger">{errors.year}</span>}
                    </div>
                    <div className="col-4 form-group">
                        <select className="form-control" name="month" value={month} onChange={this.handleChange}>
                            <option disabled value="">Select Month</option>
                            {months.map((c1, index) => (
                                <option key={index}>{c1}</option>
                            ))}
                        </select>
                        {errors.month && <span className="text-danger">{errors.month}</span>}
                    </div>
                    <div className="col-4 form-group">
                        <select className="form-control" name="day" value={day} onChange={this.handleChange}>
                            <option disabled value="">Select Day</option>
                            {days.map((c1, index) => (
                                <option key={index}>{c1}</option>
                            ))}
                        </select>
                        {errors.day && <span className="text-danger">{errors.day}</span>}
                    </div>
                    
                </div>
                <label className="font-weight-bold">PAN<span className="text-danger">*</span></label>
                <div className="form-group">
                    <input type="text" className="form-control" name="PAN" value={PAN} 
                        placeholder="" onChange={this.handleChange} />
                    {errors.PAN && <span className="text-danger">{errors.PAN}</span>}
                </div>
                <label className="font-weight-bold">Address</label>
                <div className="row">
                    <div className="col-6 form-group">
                        <input type="text" className="form-control" name="addressLine1" value={addressLine1} 
                            placeholder="Line 1" onChange={this.handleChange} />
                    </div>
                    <div className="col-6 form-group">
                        <input type="text" className="form-control" name="addressLine2" value={addressLine2} 
                            placeholder="Line 2" onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label className="font-weight-bold">State<span className="text-danger">*</span></label>
                    </div>
                    <div className="col-6">
                        <label className="font-weight-bold">City<span className="text-danger">*</span></label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 form-group">
                        <select className="form-control" name="state" value={state} onChange={this.handleChange}>
                            <option disabled value="">Select State</option>
                            {states.map((c1, index) => (
                                <option key={index}>{c1}</option>
                            ))}
                        </select>
                        {errors.state && <span className="text-danger">{errors.state}</span>}
                    </div>
                    <div className="col-6 form-group">
                        <select className="form-control" name="city" value={city} onChange={this.handleChange}>
                            <option disabled value="">Select City</option>
                            {cities.map((c1, index) => (
                                <option key={index}>{c1}</option>
                            ))}
                        </select>
                        {errors.city && <span className="text-danger">{errors.city}</span>}
                    </div>
                </div>
                {this.state.suc ? "" : <button className="btn btn-primary" onClick={this.handleSubmit}>Add Details</button>}
            </div>
        );
    }
}
export default CustomerDetails;