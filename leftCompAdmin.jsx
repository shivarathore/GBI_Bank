import React, { Component } from "react";
import http from "../../../services/httpService";

class LeftComp extends Component{
    state= { 
        banks: [],
    };

    async componentDidMount() {
        let response = await http.get(`/getBanks`);
        console.log(response);
        let { data } = response;
        this.setState({ banks: data });
    }

    handleChange = (e) => {
        let {currentTarget: input} = e;
        let options = {...this.props.options};
        options[input.name] = input.value;
        this.props.onOptionChange(options);
    };

    render(){
        let { bank = "", amount = "" } = this.props.options;
        const { banks = [] } = this.state;

        return (
            <div className="container px-5"> 
                <div className="row border bg-light">
                    <div className="col-12">
                        <h6>Bank</h6>
                    </div>
                </div>
                {banks.map((d1) => (
                    <div className="row border">
                        <div className="form-check col-12 py-1 ml-3">
                            <input className="form-check-input" type="radio" name="bank" value={d1} 
                                checked={bank === d1} onChange={this.handleChange} />
                            <label className="form-check-label">{d1}</label>
                        </div>
                    </div>
                ))}
                <hr />
                <div className="row border bg-light">
                    <div className="col-12">
                        <h6>Amount</h6>
                    </div>
                </div>
                <div className="row border">
                    <div className="form-check col-12 py-1 ml-3">
                        <input className="form-check-input" type="radio" name="amount" value="<10000" 
                            checked={amount === "<10000"} onChange={this.handleChange} />
                        <label className="form-check-label">{"<10000"}</label>
                    </div>
                </div>
                <div className="row border">
                    <div className="form-check col-12 py-1 ml-3">
                        <input className="form-check-input" type="radio" name="amount" value=">10000" 
                            checked={amount === ">10000"} onChange={this.handleChange} />
                        <label className="form-check-label">{">10000"}</label>
                    </div>
                </div>
            </div>
        );
    }
}
export default LeftComp;