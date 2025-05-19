import adminStyle from './AdminPage.module.css';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';

function AdminPage() {
  return (
    <>
      <Header />
      <div className={adminStyle.adminpagebody}>
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