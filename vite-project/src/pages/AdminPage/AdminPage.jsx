import './AdminPage.css';

function AdminPage() {
  return (
    <main>
      <header>
        <div className="home"><b>Home</b></div>
      </header>

      {/* Main content */}
      <div className="container">

        {/* Top Buttons */}
        <div className="top-buttons">
          <button className="nav-button">Rooms</button>
          <button className="nav-button">Provider</button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <form className="search-field">
            <label htmlFor="Search">Search for hotel/location</label>
            <input type="search" name="Search" id="Search" />
          </form>
          <button className="search-btn">Search</button>
        </div>

        {/* Card */}
        <div className="admin-card">
          <div className="image-placeholder">Image</div>
          <div className="card-info">
            <p>Lorem Ipsum, Lorem Ipsum, Lorem Ipsum</p>
          </div>
          <div className="card filters">
            <button className="btn edit">Edit</button>
            <button className="btn hide/show">Hide</button>
            <button className="btn delete">Delete</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminPage;