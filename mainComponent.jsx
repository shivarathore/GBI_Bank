import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./navbar";
import Login from "./login";
import Logout from "./logout";
import NotAllowed from "./notAllowed";
import auth from "./../../../services/authService";
import Admin from "./admin";
import AllCustomers from "./allCustomers";
import AddCustomer from "./addCustomer";
import AllCheque from "./allCheque";
import AllNet from "./allNet";
import Customer from "./customer";
import ViewCheque from "./viewCheque";
import ViewNet from "./viewNet";
import CustomerDetails from "./customerDetails";
import NomineeDetails from "./nomineeDetails";
import Cheque from "./cheque";
import AddPayee from "./addPayee";
import NetBanking from "./netBanking";

class MainComponent extends Component {
    render() {
        const user = auth.getUser();

        return (
            <div className="">
                <NavBar user={user} />
                <Switch>
                    <Route 
                        path="/allCustomers" 
                        render={(props) => user ? user.role === "manager" ? <AllCustomers {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/addCustomer" 
                        render={(props) => user ? user.role === "manager" ? <AddCustomer {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/allCheque" 
                        render={(props) => user ? user.role === "manager" ? <AllCheque {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/allNet" 
                        render={(props) => user ? user.role === "manager" ? <AllNet {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/admin" 
                        render={(props) => user ? user.role === "manager" ? <Admin {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/netBanking" 
                        render={(props) => user ? user.role === "customer" ? <NetBanking {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/addPayee" 
                        render={(props) => user ? user.role === "customer" ? <AddPayee {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/cheque" 
                        render={(props) => user ? user.role === "customer" ? <Cheque {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/nomineeDetails" 
                        render={(props) => user ? user.role === "customer" ? <NomineeDetails {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/customerDetails" 
                        render={(props) => user ? user.role === "customer" ? <CustomerDetails {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/viewNet" 
                        render={(props) => user ? user.role === "customer" ? <ViewNet {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/viewCheque" 
                        render={(props) => user ? user.role === "customer" ? <ViewCheque {...props} user={user} /> 
                        : <Redirect to="/notAllowed" /> : <Redirect to="/login" />} 
                    />
                    <Route 
                        path="/customer" 
                        render={(props) => user ? user.role === "customer" ? <Customer {...props} /> : <Redirect to="/notAllowed" />
                        : <Redirect to="/login" />} 
                    /> 
                    <Route path="/login" 
                        render={(props) => user ? user.role === "manager" ? <Redirect to="/admin" /> : <Redirect to="/customer" /> 
                        : <Login {...props} />} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/notAllowed" component={NotAllowed} />
                    <Redirect from="/" to="/login" />
                </Switch>
            </div>
        );
    }
}
export default MainComponent;