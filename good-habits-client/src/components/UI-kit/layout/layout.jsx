import Footer from "@/components/UI-kit/footer/Footer.jsx";


function Layout({ children }) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}

export default Layout