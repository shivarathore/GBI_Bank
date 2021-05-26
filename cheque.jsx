import React, { Component } from "react";
import http from "../../../services/httpService";

class Cheque extends Component {
    state = {
        form: { chequeNumber: "", bankName: "", branch: "", amount: "" },
        errors: {},
        banks: [],
    };

    async componentDidMount() {
        let response = await http.get(`/getBanks`);
        console.log(response);
        let { data } = response;
        this.setState({ banks: data });
    }

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
        switch(input.name) {
            case "chequeNumber": s1.errors.chequeNumber = this.validateChequeNumber(input.value); break;
            case "branch": s1.errors.branch = this.validateBranch(input.value); break;
            default: break;
        }
        this.setState(s1);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if(this.isValid(errors)){
            let s1 = this.state.form;
            s1.name = this.props.user.name;
            this.postData("/postCheque", s1);
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
        alert("Details Added Successfully");
        this.props.history.push("/customer");
    }

    validateAll = () => {
        let { chequeNumber, bankName, branch, amount } = this.state.form;
        let errors = {};
        errors.chequeNumber = this.validateChequeNumber(chequeNumber);
        errors.bankName = this.validateBankName(bankName);
        errors.branch = this.validateBranch(branch);
        errors.amount = this.validateAmount(amount);
        return errors;
    };
    validateChequeNumber = (chequeNumber) =>
        !chequeNumber ? "Cheque Number must be entered." : chequeNumber.length < 11 ? "Enter your 11 digit Cheque Number." : "";
    validateBankName = (bankName) =>
        !bankName ? "Bank should be selected." : "";
    validateBranch = (branch) =>
        !branch ? "Branch must be entered." : branch.length < 4 ? "Enter 4 digit code of branch" : "";
    validateAmount = (amount) =>
        !amount ? "Amount must be entered." : amount < 0 ? "Amount can not be negative." : "";
    
    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc,curr) => (errors[curr] ? acc+1 : acc),0);
        return count === 0;
    };
    
    render(){
        const { chequeNumber, bankName, branch, amount } = this.state.form;
        const { errors, banks = [] } = this.state;

        return (
            <div className="container pt-4">
                <h4>Deposit Cheque</h4>
                <div className="form-group">
                    <label className="font-weight-bold">Cheque Number<span className="text-danger">*</span></label>
                    <input type="number" className="form-control" name="chequeNumber" value={chequeNumber} 
                        placeholder="Enter Cheque Number" onChange={this.handleChange} onBlur={this.handleValidate} />
                    {errors.chequeNumber && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.chequeNumber}</div>}
                </div>
                <hr />
                <div className="form-group">
                    <label className="font-weight-bold">Bank Name<span className="text-danger">*</span></label>
                    <select className="form-control" name="bankName" value={bankName} onChange={this.handleChange}>
                        <option disabled value="">Select Bank</option>
                        {banks.map((c1, index) => (
                            <option key={index}>{c1}</option>
                        ))}
                    </select>
                    {errors.bankName && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.bankName}</div>}
                </div>
                <hr />
                <div className="form-group">
                    <label className="font-weight-bold">Branch<span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="branch" value={branch} 
                        placeholder="Enter Branch Code" onChange={this.handleChange} onBlur={this.handleValidate} />
                    {errors.branch && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.branch}</div>}
                </div>    
                <div className="form-group">
                    <label className="font-weight-bold">Amount<span className="text-danger">*</span></label>
                    <input type="number" className="form-control" name="amount" value={amount}
                        placeholder="Enter Amount" onChange={this.handleChange} onBlur={this.handleValidate} />
                    {errors.amount && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.amount}</div>}
                </div>
                <hr />
                <button className="btn btn-primary" onClick={this.handleSubmit}>Add Cheque</button>
            </div>
        );
    }
}
export default Cheque;