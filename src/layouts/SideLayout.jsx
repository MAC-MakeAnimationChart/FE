import Footer from "./Footer"
import Header from "./Header"
import Sidebar from './Sidebar'


function SideLayout({ children }) {
    return (
        <>
            <Header />
            <main className='side-layout'>
                <Sidebar />
                {children}
            </main>
            <Footer />
        </>
    )
}

export default SideLayout
