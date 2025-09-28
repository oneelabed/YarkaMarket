import "./Dashboard.css"
import SideNav from "./SideNav"
import { Outlet } from "react-router-dom"
import { Helmet } from "react-helmet-async";

function Dashboard() {
    return (
        <div className="Dashboard">
            <Helmet>
                <title>Yarka Market - Dashboard</title>
                <link rel="canonical" href="https://yarkamarket.org/dashboard" />
            </Helmet>
            <SideNav/>
            <Outlet/>
        </div>
    )
}

export default Dashboard