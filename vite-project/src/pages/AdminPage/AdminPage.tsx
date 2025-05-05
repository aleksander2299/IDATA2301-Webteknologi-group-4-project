import adminStyle from './AdminPage.module.css';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';

function AdminPage() {
  return (
    <main>
      <Header />

      {/* Main content */}
      <div className={adminStyle.adminPageBody}>
        <div className={adminStyle.container}>

          {/* Top Buttons */}
          <div className={adminStyle["top-buttons"]}>
            <button className={adminStyle["nav-button"]}>Rooms</button>
            <button className={adminStyle["nav-button"]}>Provider</button>
          </div>

          {/* Search Bar */}
          <div className={adminStyle["search-bar"]}>
            <form className={adminStyle["search-field"]}>
              <label htmlFor="Search">Search for hotel/location</label>
              <input type="search" name="Search" id="Search" />
            </form>
            <button className={adminStyle["search-btn"]}>Search</button>
          </div>

          {/* Card */}
          <div className={adminStyle["admin-card"]}>
            <div className={adminStyle["image-placeholder"]}>Image</div>
            <div className={adminStyle["card-info"]}>
              <p>Lorem Ipsum, Lorem Ipsum, Lorem Ipsum</p>
            </div>
            <div className={adminStyle["card-filters"]}>
              <button className={adminStyle["btn-edit"]}>Edit</button>
              <button className={adminStyle["btn-hide/show"]}>Hide</button>
              <button className={adminStyle["btn-delete"]}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default AdminPage;