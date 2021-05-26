import React, { Component } from "react";
import http from "../../../services/httpService";
import auth from "../../../services/authService";

class Login extends Component {
    state = {
        form: { name: "", password: "" },
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
    validatePassword = (password) =>
        !password ? "Password must be entered" : password.length < 7 ? "Password must be of 7 characters" : "";

    handleSubmit = (e) => {
        e.preventDefault();
        this.login("/login", this.state.form);
    };
    async login(url, obj) {
        try {
            let response = await http.post(url, obj);
            let { data } = response;
            auth.login(data);
            console.log(data);
            data.role === "manager" ? window.location = "/admin"
                : window.location = "/emp";
        }
        catch (ex) {
            if (ex.response && ex.response.status === 500){
                let errors = {};
                errors.login = "Login Failed. Please Check Your Username And Password";
                this.setState({ errors: errors });
            }
        }
    }

    render() {
        const { name, password } = this.state.form;
        const { errors } = this.state;

        return (
            <div className="container text-center pt-5">
                <h3>Welcome to GBI Bank</h3>
                <div className="container mt-5">
                    {errors.login && <span className="text-danger">{errors.login}</span>}
                    <h6>User Name</h6>
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6 form-group">
                            <input type="text" className="form-control" name="name" value={name} 
                                placeholder="Enter your Name" onChange={this.handleChange} />
                            <span>We'll never share your user name with anyone else.</span>
                        </div>
                        <div className="col-3"></div>
                    </div>
                    <h6>Password</h6>
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6 form-group">
                            <input type="password" className="form-control" name="password" value={password} 
                                placeholder="Password" onChange={this.handleChange} onBlur={this.handleValidate} />
                            {errors.password && <span className="text-danger">{errors.password}</span>}
                        </div>
                        <div className="col-3"></div>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleSubmit} 
                        disabled={!name || !password || errors.password ? true : false}>Login</button>
                </div>
            </div>
        );
    }
}
export default Login;