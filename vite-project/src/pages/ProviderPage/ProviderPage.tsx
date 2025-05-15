import '../../styles/main.css';
import providerPageStyle from './ProviderPage.module.css';

import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

function ProviderPage() {

    return (
        <>
            <Header />
            <div className={providerPageStyle.contentWrapper}>
                <div className={providerPageStyle.manageBox}>Choose room to manage: </div>
                <section>

                </section>

            </div>

            <Footer />
        </>
    );
}

export default ProviderPage;
