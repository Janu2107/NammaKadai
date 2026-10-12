import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./index.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  // Fetch products using Axios
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products?limit=100",
        );

        setProducts(response.data.products);
      } catch (err) {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Available categories from API data
  const categories = useMemo(() => {
    return [...new Set(products.map((item) => item.category))].sort();
  }, [products]);

  // Search, category filter and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);

      const matchesCategory = category === "all" || item.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, search, category, sort]);

  // Total quantity in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Total cart price
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Add product to cart
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find((item) => item.id === product.id);

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    setNotice(`${product.title} added to cart`);
    setCartOpen(false);
  };

  // Change item quantity
  const changeQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // Remove an item completely
  const removeItem = (id) => {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  };

  // Demo checkout
  const checkout = () => {
    if (cart.length === 0) {
      setNotice("Your cart is empty");
      setCartOpen(false);
      return;
    }

    alert(
      `Demo checkout\n\nItems: ${cartCount}\nTotal: $${cartTotal.toFixed(
        2,
      )}\n\nNo payment has been processed.`,
    );
  };

  const showAllProducts = () => {
    setCategory("all");
    setSearch("");
    setMobileMenu(false);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="top-header">
        <div className="header-main">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            {mobileMenu ? "✕" : "☰"}
          </button>

          <button
            className="brand"
            onClick={showAllProducts}
            aria-label="Namma Kadai home"
          >
            <span className="brand-name">Namma Kadai</span>
            <span className="brand-smile">⌣</span>
          </button>

          <button className="delivery-info" onClick={showAllProducts}>
            <span className="delivery-icon">⌖</span>
            <span>
              <small>Deliver to</small>
              <strong>Your location</strong>
            </span>
          </button>

          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <select
              aria-label="Search category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="search"
              placeholder="Search Namma Kadai"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />

            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <button
            className="header-link account-link"
            onClick={() =>
              alert(
                "Welcome to Namma Kadai! Account login is a future feature.",
              )
            }
          >
            <small>Hello, shopper</small>
            <strong>Account & Lists</strong>
          </button>

          <button
            className="header-link orders-link"
            onClick={() =>
              alert("Your orders will appear here after checkout integration.")
            }
          >
            <small>Returns</small>
            <strong>& Orders</strong>
          </button>

          <button
            className="cart-link"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span className="cart-emoji">🛒</span>
            <span className="cart-badge">{cartCount}</span>
            <strong>Cart</strong>
          </button>
        </div>

        {/* SECONDARY NAVIGATION */}
        <nav className="sub-header">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="all-menu"
          >
            ☰ All
          </button>
          <button onClick={showAllProducts}>Today's Deals</button>
          <button onClick={showAllProducts}>Best Sellers</button>
          <button onClick={showAllProducts}>New Arrivals</button>
          <button onClick={showAllProducts}>Customer Service</button>
          <span className="nav-promo">Shop smarter. Save more.</span>
        </nav>

        {mobileMenu && (
          <div className="mobile-navigation">
            <button onClick={showAllProducts}>All Products</button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item);
                  setMobileMenu(false);
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => {
                setCartOpen(true);
                setMobileMenu(false);
              }}
            >
              Open Cart ({cartCount})
            </button>
          </div>
        )}
      </header>

      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-label">THE NAMMA KADAI COLLECTION</span>
            <h1>
              Find your next
              <span> favourite thing.</span>
            </h1>
            <p>
              Everyday essentials, trending finds and great deals, all in one
              place.
            </p>
            <button className="hero-button" onClick={showAllProducts}>
              Explore products <span>→</span>
            </button>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-circle">
              <span className="art-bag">🛍️</span>
              <span className="art-star star-one">✦</span>
              <span className="art-star star-two">✧</span>
              <span className="art-star star-three">✦</span>
            </div>
            <div className="art-caption">GOOD FINDS. GREAT FEELING.</div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="main-content" id="products">
        <section className="category-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BROWSE YOUR WAY</span>
              <h2>Shop by category</h2>
            </div>
            <span className="muted-text">{categories.length} categories</span>
          </div>

          <div className="category-list">
            <button
              className={
                category === "all" ? "category-chip selected" : "category-chip"
              }
              onClick={() => setCategory("all")}
            >
              <span>✦</span> All Products
            </button>

            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item ? "category-chip selected" : "category-chip"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT HEADING AND SORT */}
        <section className="catalog-section">
          <div className="catalog-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>{category === "all" ? "Explore our products" : category}</h2>
              <p>
                {filteredProducts.length} products found
                {search ? ` for "${search}"` : ""}
              </p>
            </div>

            <div className="sort-control">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Finding great products for you...</p>
            </div>
          )}

          {!loading && error && (
            <div className="status-message error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((item) => (
                <article className="product-card" key={item.id}>
                  <button
                    className="product-image"
                    onClick={() => {
                      alert(
                        `${item.title}\n\n${item.description}\n\nPrice: $${item.price}\nRating: ${item.rating}/5`,
                      );
                    }}
                    aria-label={`View details for ${item.title}`}
                  >
                    <span className="product-discount">
                      {Math.round(item.discountPercentage)}% OFF
                    </span>
                    <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  </button>

                  <div className="product-info">
                    <span className="product-category">{item.category}</span>

                    <button
                      className="product-title"
                      onClick={() =>
                        alert(
                          `${item.title}\n\n${item.description}\n\nPrice: $${item.price}`,
                        )
                      }
                    >
                      {item.title}
                    </button>

                    <div className="rating-row">
                      <span className="stars">★★★★★</span>
                      <span className="rating-number">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="product-description">{item.description}</p>

                    <div className="price-row">
                      <span className="currency">$</span>
                      <strong>{item.price.toFixed(2)}</strong>
                    </div>

                    <p className="delivery-text">
                      FREE delivery on eligible orders
                    </p>

                    <button
                      className="add-button"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-results">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
              <button onClick={showAllProducts}>Clear filters</button>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </button>

        <div className="footer-content">
          <div className="footer-brand">
            <h2>Namma Kadai</h2>
            <p>Your everyday shopping destination.</p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <button onClick={showAllProducts}>All Products</button>
            <button
              onClick={() => {
                setSort("low");
                showAllProducts();
              }}
            >
              Budget Finds
            </button>
          </div>

          <div className="footer-column">
            <h3>Your Shopping</h3>
            <button onClick={() => setCartOpen(true)}>Shopping Cart</button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Namma Kadai</span>
          <span>Demo storefront · No real payments</span>
        </div>
      </footer>

      {/* TOAST MESSAGE */}
      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      {/* CART BACKDROP */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}></div>
      )}

      {/* CART DRAWER */}
      <aside
        className={cartOpen ? "cart-drawer open" : "cart-drawer"}
        aria-label="Shopping cart"
        aria-hidden={!cartOpen}
      >
        <div className="cart-drawer-header">
          <div>
            <h2>Your Cart</h2>
            <p>{cartCount} items in your bag</p>
          </div>

          <button
            className="close-cart"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button onClick={() => setCartOpen(false)}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />

                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <strong>${item.price.toFixed(2)}</strong>

                    <div className="quantity-control">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong className="item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-line">
                <span>Subtotal ({cartCount} items)</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <p className="tax-note">
                Shipping and taxes are not included in this demo.
              </p>

              <button className="checkout-button" onClick={checkout}>
                Proceed to Checkout
              </button>

              <button className="clear-cart-button" onClick={() => setCart([])}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default App;
