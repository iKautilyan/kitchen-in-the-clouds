import { useState } from "react";

export default function App() {
  const menu = [
    {
      id: 1,
      name: "Pulled Chicken Sandwich",
      price: 180,
      image: "https://via.placeholder.com/300x200",
      addons: [
        { name: "Bacon", price: 50 },
        { name: "Shitake Mushrooms", price: 60 }
      ]
    },
    {
      id: 2,
      name: "Fries",
      price: 100,
      image: "https://via.placeholder.com/300x200"
    }
  ];

  const [selectedAddons, setSelectedAddons] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  const getItemPrice = (item) => {
    const addons = selectedAddons[item.id] || [];
    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    return item.price + addonsPrice;
  };

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const addToCart = (item) => {
    const addons = selectedAddons[item.id] || [];
    const options = selectedOptions[item.id] || {};
    const qty = quantities[item.id] || 1;

    if (item.name === "Pulled Chicken Sandwich") {
      if (!options.bread || !options.sauce) {
        alert("Please select bread and sauce");
        return;
      }
    }

    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const itemTotal = (item.price + addonsPrice) * qty;

    setCart([
      ...cart,
      {
        ...item,
        selectedAddons: addons,
        selectedOptions: options,
        quantity: qty,
        totalPrice: itemTotal
      }
    ]);

    setSelectedAddons({ ...selectedAddons, [item.id]: [] });
    setSelectedOptions({ ...selectedOptions, [item.id]: {} });
    setQuantities({ ...quantities, [item.id]: 1 });
  };

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setPlacingOrder(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: cart.map(item => `${item.name} x${item.quantity}`).join(", "),
      total
    };

    // await fetch("https://script.google.com/macros/s/AKfycbzFb9ThpL8Anc2w24EpDFG1cOyoPmsUJawdK0c5oAZKbn1zHutLO818nYL3ZlkZemUqAg/exec", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //     body: JSON.stringify(payload)

    // });

    await fetch("https://script.google.com/macros/s/AKfycby748eds-CkC2D9t9yX4ri84oBgp_hczaTB2wZX1KsTMm9kjx0cuC2IXnsbUDDjkdA2yw/exec", {
      method: "POST",
       mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
       },
    body: new URLSearchParams({
    name: form.name,
    phone: form.phone,
    address: form.address,
    items: cart.map(item => `${item.name} x${item.quantity} (${item.selectedOptions?.bread || 'No bread'}, ${item.selectedOptions?.sauce || 'No sauce'})`).join(", "),
    total: total
  })
});

    alert("Order placed!");
    setCart([]);
    setPlacingOrder(false);
  };

  return (
    <div style={styles.app}>
      
      {/* HEADER */}
      <div style={styles.header}>
        🍔 Kitchen in the Clouds 🍔
      </div>

      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>Menu</h2>
        <h2 style={styles.sectionTitle}>the sandwiches will be ready and awailable for pickup or delivery by saturday (4th April) 10am</h2>
        {menu.map((item) => {
          const displayPrice = getItemPrice(item);

          return (
            <div key={item.id} style={styles.card}>
              
              <img src={item.image} alt="" style={styles.image} />

              <div style={{ flex: 1 }}>
                <h3 style={styles.title}>{item.name}</h3>
                <p style={styles.price}>₹{displayPrice}</p>

                {/* DROPDOWNS */}
                {item.name === "Pulled Chicken Sandwich" && (
                  <>
                    <select
                      style={styles.select}
                      value={selectedOptions[item.id]?.bread || ""}
                      onChange={(e) =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [item.id]: {
                            ...selectedOptions[item.id],
                            bread: e.target.value
                          }
                        })
                      }
                    >
                      <option value="">Bread</option>
                      {/* <option>Milk Bread</option> */}
                      <option>Sourdough</option>
                      {/* <option>Multigrain</option> */}
                    </select>

                    <select
                      style={styles.select}
                      value={selectedOptions[item.id]?.sauce || ""}
                      onChange={(e) =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [item.id]: {
                            ...selectedOptions[item.id],
                            sauce: e.target.value
                          }
                        })
                      }
                    >
                      <option value="">Sauce</option>
                      <option>Teriyaki Sauce</option>
                      <option>Lemon Garlic Yoghurt</option>
                    </select>
                  </>
                )}

                {/* ADDONS */}
                {item.addons && item.addons.map((addon, i) => (
                  <label key={i} style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={
                        selectedAddons[item.id]?.some(a => a.name === addon.name) || false
                      }
                      onChange={(e) => {
                        const prev = selectedAddons[item.id] || [];
                        if (e.target.checked) {
                          setSelectedAddons({
                            ...selectedAddons,
                            [item.id]: [...prev, addon]
                          });
                        } else {
                          setSelectedAddons({
                            ...selectedAddons,
                            [item.id]: prev.filter(a => a.name !== addon.name)
                          });
                        }
                      }}
                    />
                    {addon.name} (+₹{addon.price})
                  </label>
                ))}

                {/* ACTION */}
                <div style={styles.actionRow}>
                  <div>
                    <button style={styles.qtyBtn}
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [item.id]: Math.max((quantities[item.id] || 1) - 1, 1)
                        })
                      }>−</button>

                    <span style={{ margin: "0 10px" }}>
                      {quantities[item.id] || 1}
                    </span>

                    <button style={styles.qtyBtn}
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [item.id]: (quantities[item.id] || 1) + 1
                        })
                      }>+</button>
                  </div>

                  <button style={styles.addBtn} onClick={() => addToCart(item)}>
                    ADD
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* CART */}
        <div style={styles.cart}>
          <h3>🛒 Cart</h3>
          {cart.map((item, i) => (
            <div key={i} style={styles.cartItem}>
              <span>
                {item.name} x{item.quantity}
                {item.selectedOptions?.bread && item.selectedOptions?.sauce && 
                  ` (${item.selectedOptions.bread}, ${item.selectedOptions.sauce})`
                }
              </span>
              <b>₹{item.totalPrice}</b>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
        </div>

        {/* FORM */}
        <div style={styles.form}>
          <input style={styles.input} placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input style={styles.input} placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input style={styles.input} placeholder="How will you be recieving it?"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <button style={styles.orderBtn} onClick={placeOrder} disabled={placingOrder}>
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  app: {
    background: "#0f0f0f",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Arial"
  },
  header: {
    padding: 20,
    fontSize: 22,
    fontWeight: "bold",
    borderBottom: "1px solid #222"
  },
  container: {
    padding: 20,
    maxWidth: 900,
    margin: "auto"
  },
  sectionTitle: {
    marginBottom: 10
  },
  card: {
    display: "flex",
    background: "#1a1a1a",
    padding: "15px",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden"
  },
  image: {
    width: 140,
    objectFit: "cover"
  },
  title: {
    margin: 0
  },
  price: {
    color: "#ff7a18",
    fontWeight: "bold"
  },
  select: {
    background: "#222",
    color: "#fff",
    border: "1px solid #333",
    padding: 6,
    borderRadius: 6,
    marginTop: 5
  },
  checkbox: {
    display: "block",
    fontSize: 14,
    marginTop: 5
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10
  },
  qtyBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    padding: "4px 10px",
    borderRadius: 6
  },
  addBtn: {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8
  },
  cart: {
    background: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginTop: 20
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between"
  },
  form: {
    marginTop: 20
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#222",
    color: "#fff"
  },
  orderBtn: {
    width: "100%",
    padding: 12,
    background: "#00c853",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: "bold"
  }
};