import React, { Component } from "react";
import queryString from "query-string";
import http from "../../../services/httpService";

class ViewCheque extends Component {
    state= { 
        data: [],
    };

    async fetchData() {
        let queryParams = queryString.parse(this.props.location.search);
        let searchStr = this.makeSearchString(queryParams);
        let response = await http.get(`/getChequeByName/${this.props.user.name}?${searchStr}`);
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
        this.callURL(`/viewCheque`, queryParams);
    };

    callURL = (url, options) => {
        let searchString = this.makeSearchString(options);
        this.props.history.push({
            pathname: url,
            search: searchString,
        });
    };

    makeSearchString = (options) => {
        let { page } = options;
        let searchStr = "";
        searchStr  = this.addToQueryString(searchStr, "page", page);
        return searchStr;
    };

    addToQueryString = (str, paramName, paramValue) => 
        paramValue 
            ? str 
                ? `${str}&${paramName}=${paramValue}`
                : `${paramName}=${paramValue}`
            : str;

    render(){
        const { page, items = [], totalItems, totalNum } = this.state.data;
        let startIndex = totalItems === 5 ? (page - 1) * totalItems : (page - 1) * 5;
        let endIndex = startIndex < totalNum
            ? startIndex + totalItems - 1
            : totalNum - 1;

        return (
            <div className="container pt-4">
                <h4>All Cheque Details</h4>
                {items.length === 0 ? <h5 className="text-danger">No Transactions to show</h5>
                : <React.Fragment>
                    {startIndex + 1} - {endIndex + 1} of {totalNum}
                    <div className="row font-weight-bold border py-2 text-center">
                        <div className="col-4">Cheque Number</div>
                        <div className="col-3">Bank Name</div>
                        <div className="col-2">Branch</div>
                        <div className="col-3">Amount</div>
                    </div>
                    {items.map((item, index) => (
                        <div className={index %2 === 0 ? "row py-2 border bg-light text-center" : "row py-2 border text-center"} 
                            key={index}>
                            <div className="col-4">{item.chequeNumber}</div>
                            <div className="col-3">{item.bankName}</div>
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
                </React.Fragment>}
            </div>
        );
    }
}
export default ViewCheque;