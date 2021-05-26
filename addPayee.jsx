import React, { Component } from "react";
import http from "../../../services/httpService";

class AddPayee extends Component {
    state = {
        form: { payeeName: "", accNumber: "", bankType: "Same Bank", bankName: "", IFSC: "" },
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
        this.setState(s1);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if(this.isValid(errors)){
            let s1 = this.state.form;
            let obj = {};
            obj.name = this.props.user.name;
            obj.payeeName = s1.payeeName;
            obj.accNumber = s1.accNumber;
            obj.bankName = s1.bankType === "Same Bank" ? "GBI" : s1.bankName;
            obj.IFSC = s1.bankType === "Same Bank" ? "" : s1.IFSC;
            this.postData("/addPayee", obj);
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
        alert("Payee added to your list :: " + this.state.form.payeeName);
        this.props.history.push("/customer");
    }

    validateAll = () => {
        let { payeeName, accNumber, bankType, bankName, IFSC } = this.state.form;
        let errors = {};
        errors.payeeName = this.validatePayeeName(payeeName);
        errors.accNumber = this.validateAccNumber(accNumber);
        if(bankType === "Other Bank"){
            errors.bankName = this.validateBankName(bankName);
            errors.IFSC = this.validateIFSC(IFSC);
        }
        return errors;
    };
    validatePayeeName = (payeeName) =>
        !payeeName ? "Payee Name must be entered." : "";
    validateAccNumber = (accNumber) =>
        !accNumber ? "Account Number must be entered." : "";
    validateBankName = (bankName) =>
        !bankName ? "Bank should be selected." : "";
    validateIFSC = (IFSC) =>
        !IFSC ? "IFSC Code must be entered." : "";
    
    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc,curr) => (errors[curr] ? acc+1 : acc),0);
        return count === 0;
    };
    
    render(){
        const { payeeName, accNumber, bankName, bankType, IFSC } = this.state.form;
        const { errors, banks = [] } = this.state;

        return (
            <div className="container pt-4">
                <h4>Add Payee</h4>
                <div className="form-group">
                    <label className="font-weight-bold">Payee Name<span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="payeeName" value={payeeName} 
                        placeholder="Enter Payee Name" onChange={this.handleChange} />
                    {errors.payeeName && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.payeeName}</div>}
                </div>
                <div className="form-group">
                    <label className="font-weight-bold">Account Number<span className="text-danger">*</span></label>
                    <input type="number" className="form-control" name="accNumber" value={accNumber} 
                        placeholder="Enter Payee Account Number" onChange={this.handleChange} />
                    {errors.accNumber && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.accNumber}</div>}
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="bankType" value="Same Bank" 
                        checked={bankType === "Same Bank"} onChange={this.handleChange} />
                    <label className="form-check-label">Same Bank</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="bankType" value="Other Bank" 
                        checked={bankType === "Other Bank"} onChange={this.handleChange} />
                    <label className="form-check-label">Other Bank</label>
                </div>
                <br />
                {bankType === "Other Bank" 
                ? <React.Fragment>
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
                    <div className="form-group">
                        <label className="font-weight-bold">IFSC Code<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" name="IFSC" value={IFSC}
                            placeholder="Enter IFSC Code" onChange={this.handleChange} />
                        {errors.IFSC && <div className="px-3 py-2" style={{backgroundColor: "lightpink"}}>{errors.IFSC}</div>}
                    </div>
                 </React.Fragment>
                : "" }
                <button className="btn btn-primary" onClick={this.handleSubmit}>Add Payee</button>
            </div>
        );
    }
}
export default AddPayee;