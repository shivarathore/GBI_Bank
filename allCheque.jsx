import React, { Component } from "react";
import queryString from "query-string";
import http from "../../../services/httpService";
import LeftComp from "./leftCompAdmin";

class AllCheque extends Component {
    state= { 
        data: [],
    };

    async fetchData() {
        let queryParams = queryString.parse(this.props.location.search);
        let searchStr = this.makeSearchString(queryParams);
        let response = await http.get(`/getAllCheques?${searchStr}`);
        console.log(response);
        let { data } = response;
        this.setState({ data: data });
    }
    
    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps !== this.props)
            this.fetchData();
    }

    handlePage = (incr) => {
        let queryParams = queryString.parse(this.props.location.search);
        let page = this.state.data.page;
        let newPage = +page + incr;
        queryParams.page = newPage;
        this.callURL(`/allCheque`, queryParams);
    };

    callURL = (url, options) => {
        let searchString = this.makeSearchString(options);
        this.props.history.push({
            pathname: url,
            search: searchString,
        });
    };

    makeSearchString = (options) => {
        let { page, bank, amount } = options;
        let searchStr = "";
        searchStr  = this.addToQueryString(searchStr, "page", page);
        searchStr  = this.addToQueryString(searchStr, "bank", bank);
        searchStr  = this.addToQueryString(searchStr, "amount", amount);
        return searchStr;
    };

    addToQueryString = (str, paramName, paramValue) => 
        paramValue 
            ? str 
                ? `${str}&${paramName}=${paramValue}`
                : `${paramName}=${paramValue}`
            : str;

    handleOptionChange = (options) => {
        options.page = "1";
        this.callURL(`/allCheque`, options);
    };

    render(){
        const { page, items = [], totalItems, totalNum } = this.state.data;
        let startIndex = totalItems === 5 ? (page - 1) * totalItems : (page - 1) * 5;
        let endIndex = startIndex < totalNum
            ? startIndex + totalItems - 1
            : totalNum - 1;
        let queryParams = queryString.parse(this.props.location.search);

        return (
            <div className="container pt-4">
                <h4>All Cheque Transactions</h4>
                <div className="row">
                    <div className="col-3">
                        <LeftComp options={queryParams} onOptionChange={this.handleOptionChange} />
                    </div>
                    <div className="col-9">
                        {startIndex + 1} - {endIndex + 1} of {totalNum}
                        <div className="row font-weight-bold border py-2">
                            <div className="col-2">Name</div>
                            <div className="col-3">Cheque Number</div>
                            <div className="col-2">Bank Name</div>
                            <div className="col-2">Branch</div>
                            <div className="col-3">Amount</div>
                        </div>
                        {items.map((item, index) => (
                            <div className={index %2 === 0 ? "row py-2 border bg-light" : "row py-2 border"} key={index}>
                                <div className="col-2">{item.name}</div>
                                <div className="col-3">{item.chequeNumber}</div>
                                <div className="col-2">{item.bankName}</div>
                                <div className="col-2">{item.branch}</div>
                                <div className="col-3">{item.amount}</div>
                            </div>
                        ))}
                        <div className="row mt-3">
                            <div className="col-2">
                                {startIndex > 1 ? 
                                    <button className="btn btn-secondary" onClick={() => this.handlePage(-1)}>Prev</button> 
                                : ""}
                            </div>
                            <div className="col-8"></div>
                            <div className="col-2 text-right">
                                {endIndex < totalNum - 1 ? 
                                    <button className="btn btn-secondary" onClick={() => this.handlePage(1)}>Next</button> 
                                : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default AllCheque;