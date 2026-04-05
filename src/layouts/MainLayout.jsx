import Header from './Header'
import Footer from './Footer'

function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main className='main-content'>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default MainLayout
