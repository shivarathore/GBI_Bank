import React, { Component } from "react";
import http from "../../../services/httpService";

class NomineeDetails extends Component {
    state = {
        form: { nomineeName: "", gender: "", dob: "", relationship: "", jointsignatory: "", day: "", month: "", year: "" },
        errors: {},
        months: ["January", "February", "March", "April", "May", "June", "July", "August", 
            "September", "October", "November", "December"],
        days: [],
    };

    async componentDidMount() {
        let response = await http.get(`/getNominee/${this.props.user.name}`);
        let { data } = response;
        console.log(data);
        if(data){
            let suc = true;
            this.setState({ form: data, suc: suc });
        }
    }

    handleChange = (e) =>{
        const { currentTarget: input } = e;
        let s1 = {...this.state};
        input.type === "checkbox"
            ? s1.form[input.name] = input.checked
            : s1.form[input.name] = input.value;
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
        alert(this.props.user.name + " Your nominee :: " + data.nomineeName);
        this.props.history.push("/customer");
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if(this.isValid(errors)){
            let s1 = {...this.state.form};
            let obj = {};
            obj.name = this.props.user.name;
            obj.nomineeName = s1.nomineeName;
            obj.gender = s1.gender;
            obj.dob = s1.day + "-" + s1.month + "-" + s1.year;
            obj.relationship = s1.relationship;
            obj.jointSignatory = s1.jointsignatory ? true : false;
            this.postData(`/nomineeDetails`, obj);
        }
        else {
            let s1 = {...this.state};
            s1.errors = errors;
            this.setState(s1);
        } 
    };
    validateAll = () => {
        let { nomineeName, gender, day, month, year, relationship } = this.state.form;
        let errors = {};
        errors.nomineeName = this.validateNomineeName(nomineeName);
        errors.gender = this.validateGender(gender);
        errors.day = this.validateDay(day);
        errors.month = this.validateMonth(month);
        errors.year = this.validateYear(year);
        errors.relationship = this.validateRelationship(relationship);       
        return errors;
    };
    validateNomineeName = (nomineeName) =>
        !nomineeName ? "Nominee Name must be entered" : "";
    validateGender = (gender) =>
        !gender ? "Gender must be selected" : "";
    validateDay = (day) =>
        !day ? "Day must be selected" : "";
    validateMonth = (month) =>
        !month ? "Month must be selected" : "";
    validateYear = (year) =>
        !year ? "Year must be selected" : "";
    validateRelationship = (relationship) =>
        !relationship ? "relationship must be entered" : "";

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
        let { nomineeName, gender, dob = "", relationship, jointsignatory = "", day, month, year } = this.state.form;
        let { errors, months, days } = this.state;
        const years = this.makeYearsArr();

        let index = dob.indexOf("-");
        day = day ? day : dob.substring(0, index);
        let index1 = dob.indexOf("-", (index+1));
        month = month ? month : dob.substring(index+1, index1);
        year = year ? year : dob.substring(index1+1);
        days = dob ? this.makeDaysArr(month, year) : days;

        return (
            <div className="container pt-4">
                <h4>Nominee Details</h4>
                <label className="font-weight-bold">Name<span className="text-danger">*</span></label>
                <div className="form-group">
                    <input type="text" className="form-control" name="nomineeName" value={nomineeName} 
                        placeholder="" onChange={this.handleChange} />
                    {errors.nomineeName && <span className="text-danger">{errors.nomineeName}</span>}
                </div>
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
                <hr />
                <label className="font-weight-bold">Relationship<span className="text-danger">*</span></label>
                <div className="form-group">
                    <input type="text" className="form-control" name="relationship" value={relationship} 
                        placeholder="" onChange={this.handleChange} />
                    {errors.relationship && <span className="text-danger">{errors.relationship}</span>}
                </div>
                <div className="form-group container ml-1">
                    <input className="form-check-input" type="checkbox" name="jointsignatory" value={jointsignatory} 
                        checked={jointsignatory} onChange={this.handleChange} />
                    <label className="form-check-label">Joint Signatory</label>
                    {errors.jointsignatory && <span className="text-danger ml-n5">{errors.jointsignatory}</span>}
                </div>
                {this.state.suc ? "" : <button className="btn btn-primary" onClick={this.handleSubmit}>Add Nominee</button>}
            </div>
        );
    }
}
export default NomineeDetails;