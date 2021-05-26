import React, { Component } from "react";
import http from "../../../services/httpService";

class NetBanking extends Component {
    state = {
        form: { payeeName: "", amount: "", comment: "" },
        errors: {},
        data: [],
    };

    async componentDidMount() {
        let response = await http.get(`/getPayees/${this.props.user.name}`);
        console.log(response);
        let { data } = response;
        this.setState({ data: data });
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
            let s1 = {...this.state};
            let obj = {...s1.form};
            obj.name = this.props.user.name;
            let index = s1.data.findIndex((item) => item.payeeName === s1.form.payeeName);
            obj.bankName = s1.data[index].bankName;
            this.postData("/postNet", obj);
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
        let { payeeName, amount } = this.state.form;
        let errors = {};
        errors.payeeName = this.validatePayeeName(payeeName);
        errors.amount = this.validateAmount(amount);
        return errors;
    };
    validatePayeeName = (payeeName) =>
        !payeeName ? "Payee Name must be entered." : "";
    validateAmount = (amount) =>
        !amount ? "Amount must be entered." : amount < 0 ? "Amount can not be negative." : "";
    
    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc,curr) => (errors[curr] ? acc+1 : acc),0);
        return count === 0;
    };
    
    render(){
        const { payeeName, amount, comment } = this.state.form;
        const { errors, data = [] } = this.state;
        let payees = data.reduce((acc,curr) => acc.find((val) => val === curr.payees) ? acc : [...acc, curr.payeeName], []);

        return (
            <div className="container pt-4">
                <h4>Net Banking Details</h4>
                <div className="form-group">
                    <label className="font-weight-bold">Payee Name<span className="text-danger">*</span></label>
                    <select className="form-control" name="payeeName" value={payeeName} onChange={this.handleChange}>
                        <option disabled value="">Select Payee</option>
                        {payees.map((c1, index) => (
                            <option key={index}>{c1}</option>
                        ))}
                    </select>
                    {errors.payeeName && <span className="text-danger">{errors.payeeName}</span>}
                </div> 
                <div className="form-group">
                    <label className="font-weight-bold">Amount<span className="text-danger">*</span></label>
                    <input type="number" className="form-control" name="amount" value={amount}
                        placeholder="Enter Amount" onChange={this.handleChange} />
                    {errors.amount && <span className="text-danger">{errors.amount}</span>}
                </div>
                <hr />
                <div className="form-group">
                    <label className="font-weight-bold">Comment</label>
                    <input type="text" className="form-control" name="comment" value={comment} 
                        placeholder="Enter Comment" onChange={this.handleChange} />
                </div> 
                <button className="btn btn-primary" onClick={this.handleSubmit}>Add Transaction</button>
            </div>
        );
    }
}
export default NetBanking;