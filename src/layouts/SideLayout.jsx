import Footer from "./Footer"
import Header from "./Header"
import Sidebar from './Sidebar'

function SideLayout({ children, columns, settings, onSettingsChange, onFileUpload }) {
    return (
        <>
            <Header />
            <main className='side-layout'>
                <Sidebar
                    columns={columns}
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                    onFileUpload={onFileUpload}
                />
                {children}
            </main>
            <Footer />
        </>
    )
}

export default SideLayout