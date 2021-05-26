import React, { Component } from "react";
import http from "./../../../services/httpService";

class AddCustomer extends Component {
    state = {
        form: { name: "", password: "", cpassword: "" },
        errors: {},
    };

    handleChange = (e) =>{
        const { currentTarget: input } = e;
        let s1 = {...this.state};
        s1.form[input.name] = input.value;
        this.handleValidate(e);
        this.setState(s1);
    };
    handleValidate = (e) => {
        let { currentTarget: input } = e;
        let s1 = {...this.state};
        if(input.name === "password") 
            s1.errors.password = this.validatePassword(input.value);
        this.setState(s1);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if(this.isValid(errors)){
            const { form } = this.state;
            let obj = {...form};
            delete obj.cpassword;
            this.postData("/register", obj);
        }
        else {
            let s1 = {...this.state};
            s1.errors = errors;
            this.setState(s1);
        } 
    };
    async postData(url, obj) {
        let response = await http.post(url, obj);
        console.log(response);
        alert("Customer added successfully");
        this.props.history.push("/admin");
    }

    validateAll = () => {
        let { name, password, cpassword } = this.state.form;
        let errors = {};
        errors.name = this.validateName(name);
        errors.password = this.validatePassword(password);
        errors.cpassword = this.validateCpassword(password, cpassword);
        return errors;
    };
    validateName = (name) =>
        !name ? "Name must be entered" : "";
    validatePassword = (password) =>
        !password ? "Password can not be blank" : password.length < 7 
        ? "Password can not be blank. Minimum length shoult be of 7 characters" : "";
    validateCpassword = (password, cpassword) =>
        password === cpassword ? "" : "Password do not match";
    
    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc,curr) => (errors[curr] ? acc+1 : acc),0);
        return count === 0;
    };
    
    render(){
        const { name, password, cpassword } = this.state.form;
        const { errors } = this.state;

        return (
            <div className="container pt-4">
                <h4>New Customer</h4>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" value={name} 
                        placeholder="Enter Customer Name" onChange={this.handleChange} />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" value={password} 
                        placeholder="" onChange={this.handleChange} onBlur={this.handleValidate} />
                    {errors.password && <span className="text-danger">{errors.password}</span>}
                </div>    
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" value={cpassword}
                        placeholder="" onChange={this.handleChange} />
                    {errors.cpassword && <span className="text-danger">{errors.cpassword}</span>}
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
            </div>
        );
    }
}
export default AddCustomer;