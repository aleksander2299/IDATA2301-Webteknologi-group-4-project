import adminStyle from './AdminPage.module.css';

function AdminPage() {
  return (
    <main>
      <header>
        <div className={adminStyle.home}><b>Home</b></div>
      </header>

      {/* Main content */}
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
          <div className={adminStyle["card filters"]}>
            <button className={adminStyle["btn edit"]}>Edit</button>
            <button className={adminStyle["btn hide/show"]}>Hide</button>
            <button className={adminStyle["btn delete"]}>Delete</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminPage;