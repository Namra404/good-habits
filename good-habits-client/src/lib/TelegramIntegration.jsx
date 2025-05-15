/* global Telegram */
import {useContext, useEffect, useState} from 'react';
import {useUser} from "@/store/user-provider.jsx";


const TelegramIntegration = () => {
    const [tgData, setTgData] = useState(null);
    const {user, error} = useUser()
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setTgData({
                initData: window.Telegram.WebApp.initData,
                initDataUnsafe: window.Telegram.WebApp.initDataUnsafe,
            });
        }
    }, []);

    return (
        <div style={{backgroundColor: 'red'}}>
            {/*<h3>Telegram WebApp Data:</h3>*/}
            {/*<pre>{JSON.stringify(user, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(tgData, null, 2)}</pre>*/}
        </div>
    );
};

export default TelegramIntegration;
