import React, { Component } from "react";
import logo from "./image/cartoon-retro-bank-building-courthouse-with-columns-illustration-isolated-white_53562-8133.jpg";

class Customer extends Component {

    render(){
        
        return (
            <div className="container text-center">
                <h3 className="text-danger mt-4">Welcome to GBI BANK Customer Portal</h3>
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <img src={logo} alt="bank" style={{width: "100%", height: "auto"}} />
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        );
    }
}
export default Customer;