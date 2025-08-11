import "./Dashboard.css"
import SideNav from "./SideNav"
import { Outlet } from "react-router-dom"

function Dashboard() {
    return (
        <div className="Dashboard">
            <SideNav/>
            <Outlet/>
        </div>
    )
}

export default Dashboard