import "./Dashboard.css"
import SideNav from "./SideNav"
import { Routes, Route } from "react-router-dom"
import Market from "./Marketplace.js"
import CreateListing from "./CreateListing.js"

function Dashboard() {
    return (
        <div className="Dashboard">
            <SideNav/>
            <Routes>
                <Route path="market" element={<Market/>}></Route>
                <Route path="create-listing" element={<CreateListing/>}></Route>
            </Routes>
        </div>
    )
}

export default Dashboard