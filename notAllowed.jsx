import React, { Component } from "react";

class NotAllowed extends Component {

    render(){
        
        return (
            <div className="container text-center">
                <h4 className="text-danger mt-5">You don't have Access Rights!</h4>
            </div>
        );
    }
}
export default NotAllowed;