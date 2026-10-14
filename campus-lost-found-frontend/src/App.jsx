import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import api from "./services/api";
import "./App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Campus<span>Find</span></Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/items">Browse Items</Link>
        <Link to="/report">Report Item</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="nav-button">Register</Link>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">CAMPUS LOST & FOUND PORTAL</span>
          <h1>Lost something?<br /><span>Let's find it.</span></h1>
          <p>
            A simple place for students and staff to report lost belongings
            and help reunite found items with their owners.
          </p>
          <div className="hero-actions">
            <Link to="/items" className="button">Find an Item</Link>
            <Link to="/report" className="button button-light">
              Report an Item
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="search-illustration">⌕</div>
          <div className="floating-card">
            <span className="item-icon">🎒</span>
            <div>
              <strong>Lost something?</strong>
              <p>Start your search here.</p>
            </div>
          </div>
          <div className="hero-circle">✓</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Getting your belongings back is simple</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">🔎</div>
            <h3>Search items</h3>
            <p>Browse reported belongings and search by name or category.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Report an item</h3>
            <p>Share the item details, location and date it was lost or found.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Reconnect</h3>
            <p>Contact the campus team and verify ownership before collection.</p>
          </article>
        </div>
      </section>

      <section className="callout">
        <div>
          <h2>Found something on campus?</h2>
          <p>Help someone get their belongings back.</p>
        </div>
        <Link to="/report" className="button">Report Found Item</Link>
      </section>
    </main>
  );
}

const demoItems = [
  { id: 1, name: "Black Backpack", category: "Bags", location: "Library", date: "2026-10-05", status: "Found", icon: "🎒" },
  { id: 2, name: "Blue Water Bottle", category: "Accessories", location: "Cafeteria", date: "2026-10-06", status: "Lost", icon: "🧴" },
  { id: 3, name: "Student Notebook", category: "Books", location: "Block A", date: "2026-10-07", status: "Found", icon: "📒" },
  { id: 4, name: "Wireless Earbuds", category: "Electronics", location: "Lab 2", date: "2026-10-08", status: "Lost", icon: "🎧" },
];

function BrowseItems() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [items, setItems] = useState(demoItems);

  const filtered = items.filter((item) => {
    const matchesSearch =
      `${item.name} ${item.category} ${item.location}`
        .toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (status === "All" || item.status === status);
  });

  return (
    <main className="page-container">
      <span className="eyebrow">ITEM DIRECTORY</span>
      <h1 className="page-title">Browse reported items</h1>
      <p className="muted">Search belongings reported around your campus.</p>

      <div className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item, category or location..."
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Lost</option>
          <option>Found</option>
        </select>
      </div>

      <div className="item-grid">
        {filtered.map((item) => (
          <article className="item-card" key={item.id}>
            <div className="item-picture">{item.icon}</div>
            <div className="item-details">
              <span className={`status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
              <h3>{item.name}</h3>
              <p>Category: {item.category}</p>
              <p>📍 {item.location}</p>
              <p>📅 {item.date}</p>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty">No matching items. Try a different search.</p>
      )}
      <p className="demo-note">
        Demo items are sample data. They are not yet loaded from MySQL.
      </p>
      <button className="button" onClick={() => setItems(demoItems)}>
        Reset sample items
      </button>
    </main>
  );
}

function ReportItem() {
  const [type, setType] = useState("Lost");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const report = {
      type,
      name,
      category,
      location,
      date,
      description,
    };

    const saved = JSON.parse(localStorage.getItem("campusReports") || "[]");
    localStorage.setItem(
      "campusReports",
      JSON.stringify([...saved, { ...report, id: Date.now() }])
    );

    setMessage("Report saved in this browser for demonstration.");
    setName("");
    setLocation("");
    setDate("");
    setDescription("");
  }

  return (
    <main className="form-page">
      <div className="form-card wide">
        <span className="eyebrow">HELP YOUR CAMPUS COMMUNITY</span>
        <h1>Report an item</h1>
        <p className="muted">Enter as much accurate information as you can.</p>

        <form onSubmit={handleSubmit}>
          <label>Report type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={type === "Lost" ? "type-active" : ""}
              onClick={() => setType("Lost")}
            >I lost an item</button>
            <button
              type="button"
              className={type === "Found" ? "type-active" : ""}
              onClick={() => setType("Found")}
            >I found an item</button>
          </div>

          <label>Item name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Black backpack" />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Electronics</option>
            <option>Bags</option>
            <option>Books</option>
            <option>Accessories</option>
            <option>Clothing</option>
            <option>Other</option>
          </select>

          <label>Location on campus</label>
          <input required value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library, Block A" />

          <label>Date</label>
          <input required type="date" value={date}
            onChange={(e) => setDate(e.target.value)} />

          <label>Description</label>
          <textarea required value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item and any identifying features." />

          <button className="button full-width" type="submit">
            Submit Report
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        <p className="demo-note">
          This starter form saves locally. We'll connect it to Spring Boot next.
        </p>
      </div>
    </main>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/users/register", form);
      setMessage("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Registration failed. Check that Spring Boot is running and the API is configured."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <span className="eyebrow">JOIN THE COMMUNITY</span>
        <h1>Create your account</h1>
        <p className="muted">Register to use CampusFind.</p>
        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input name="name" required value={form.name} onChange={update}
            placeholder="Enter your name" />

          <label>Email address</label>
          <input name="email" required type="email" value={form.email}
            onChange={update} placeholder="you@example.com" />

          <label>Password</label>
          <input name="password" required type="password" minLength="8"
            value={form.password} onChange={update}
            placeholder="At least 8 characters" />

          <label>Phone number</label>
          <input name="phone" required value={form.phone} onChange={update}
            placeholder="Enter your phone number" />

          <button className="button full-width" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <p className="form-bottom">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert(
      "The login screen is ready, but login is not connected yet. " +
      "We need to implement a Spring Boot login endpoint and secure password handling."
    );
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Log in</h1>
        <p className="muted">Access your CampusFind account.</p>
        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input required type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" />
          <label>Password</label>
          <input required type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" />
          <button className="button full-width">Log In</button>
        </form>
        <p className="form-bottom">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <strong>CampusFind</strong>
      <p>Helping campus belongings find their way home.</p>
      <small>Campus Lost and Found System</small>
    </footer>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<BrowseItems />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <main className="page-container">
            <h1>Page not found</h1>
            <Link to="/">Return home</Link>
          </main>
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}