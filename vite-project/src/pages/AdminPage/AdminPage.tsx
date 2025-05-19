import adminStyle from './AdminPage.module.css';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';

function AdminPage() {
  return (
    <>
      <Header />
      <div className={adminStyle.adminPageBody}>
        {/* Top textbox */}
        <div className={adminStyle.manageBox}>Choose what to add, manage or delete: </div>
        {/* Search bar component */}
        <section>

        </section>

        {/* Hotelcard component */}
        <section>

        </section>
      </div>

      <Footer />
    </>
  );
}

export default AdminPage;