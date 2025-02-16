import Footer from "@/components/UI-kit/footer/Footer.jsx";
import TelegramIntegration from "@/lib/TelegramIntegration.jsx";
import {UserProvider} from "@/store/user-provider.jsx";


function Layout({ children }) {
    return (
        <UserProvider>
            <TelegramIntegration/>
            {children}
            <Footer />
        </UserProvider>
    );
}

export default Layout