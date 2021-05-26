import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
    render() {
        const { user } = this.props;

        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-warning">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        {!user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                        {user && user.role === "manager" && (
                            <React.Fragment>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" to="/admin">Customers</Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/addCustomer">Add Customer</Link>
                                        <Link className="dropdown-item" to="/allCustomers?page=1">View All Customers</Link>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" to="/admin">Transactions</Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/allCheque?page=1">Cheques</Link>
                                        <Link className="dropdown-item" to="/allNet?page=1">Net Banking</Link>
                                    </div>
                                </li>
                            </React.Fragment>
                        )}
                        {user && user.role === "customer" && (
                            <React.Fragment>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" to="">View</Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/viewCheque?page=1">Cheque</Link>
                                        <Link className="dropdown-item" to="/viewNet?page=1">Net Banking</Link>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" to="">Details</Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/customerDetails">Customer</Link>
                                        <Link className="dropdown-item" to="/nomineeDetails">Nominee</Link>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" to="">Transaction</Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/addPayee">Add Payee</Link>
                                        <Link className="dropdown-item" to="/cheque">Cheque</Link>
                                        <Link className="dropdown-item" to="/netBanking">Net Banking</Link>
                                    </div>
                                </li>
                            </React.Fragment>
                        )}
                    </ul>
                    <div className="ml-auto">
                        <ul className="navbar-nav">
                            {user && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="">Welcome {user.name}</Link>
                                </li>
                            )}
                            {user && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/logout">Logout</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
export default NavBar;