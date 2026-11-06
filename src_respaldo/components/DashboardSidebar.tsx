import { Link, NavLink } from "react-router-dom";
import BrandMark from "./BrandMark";

export default function DashboardSidebar(){
    return(
        <aside className="sidebar" >
            <Link className = "brand" to="/">
            <BrandMark/><span className="brand-name">demo</span>
            </Link>
            <div className="sidebar_label">Menu principal</div>
            <nav className="side-nav" aria-label="Navegacion principal">
                <NavLink to='/' end className={''}></NavLink>
            </nav>
        </aside>
    )
}