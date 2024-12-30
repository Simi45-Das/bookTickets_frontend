const BASE_URL = "http://43.204.227.235:3000"; // Adjust to your server's URL
let token = "";

// Utility: Fetch seats and render
async function fetchSeats() {
  try {
    const response = await fetch(`${BASE_URL}/seats`, {
      headers: { Authorization: token },
    });

    if (!response.ok) throw new Error("Failed to fetch seats");

    const seats = await response.json();
    renderSeats(seats);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Render seats
function renderSeats(seats) {
  const seatsContainer = document.querySelector(".seats");
  seatsContainer.innerHTML = ""; // Clear the container

  seats.forEach((seat) => {
    const seatDiv = document.createElement("div");
    seatDiv.className = `seat ${seat.is_booked ? "booked" : ""}`;
    seatDiv.innerText = seat.seat_number;
    seatsContainer.appendChild(seatDiv);
  });
}

// Fetch and display seat counts
async function fetchSeatCounts() {
  try {
    const response = await fetch(`${BASE_URL}/seat-counts`, {
      headers: { Authorization: token },
    });

    if (!response.ok) throw new Error("Failed to fetch seat counts");

    const { available_count, reserved_count } = await response.json();
    displaySeatCounts(available_count, reserved_count);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Display seat counts on the frontend
function displaySeatCounts(availableCount, reservedCount) {
  document.getElementById("available-seats").innerText = availableCount;
  document.getElementById("reserved-seats").innerText = reservedCount;
}

// Toggle the visibility of booking section based on user login
function toggleBookingSection(isLoggedIn) {
  const authSection = document.querySelector(".auth-section");
  const bookingSection = document.querySelector(".booking-section");
  if (isLoggedIn) {
    authSection.classList.add("hidden");
    bookingSection.classList.remove("hidden");
    fetchSeats();
    fetchSeatCounts();
  } else {
    authSection.classList.remove("hidden");
    bookingSection.classList.add("hidden");
  }
}

// Signup
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

      
    if (response.ok) {
      const data = await response.json();
      token = data.token;
      alert("Signup successful! \n login to book seats");
  
      toggleBookingSection(true);
    } else {
      alert("Signup failed");
    }
  } catch (error) {
    alert(`Error1: ${error.message}`);
  }
});

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      token = data.token;
      alert("Login successful!");
      toggleBookingSection(true);
    } else {
      alert("Login failed");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Book Seats
document.getElementById("book-seats").addEventListener("click", async () => {
  const seatsRequested = parseInt(document.getElementById("seats-requested").value);
  if (seatsRequested < 1 || seatsRequested > 7) {
    alert("Please request between 1 and 7 seats.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ seatsRequested }),
    });

    if (response.ok) {
      alert("Seats booked successfully!");
      fetchSeats();
      fetchSeatCounts();
    } else {
      alert("Failed to book seats");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Cancel Booking
document.getElementById("cancel-booking").addEventListener("click", async () => {
  const seatsRequested = parseInt(document.getElementById("seats-requested").value);
  if (seatsRequested < 1) {
    alert("Please specify at least one seat to cancel.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ seatsToCancel: seatsRequested }),
    });

    if (response.ok) {
      alert("Seats canceled successfully!");
      fetchSeats();
      fetchSeatCounts();
    } else {
      alert("Failed to cancel seats");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});


const resetButtons = document.querySelectorAll("button[type='reset']");
resetButtons.forEach((button) =>
  button.addEventListener("click", () => {
    document.getElementById("signup-form").reset();
    document.getElementById("login-form").reset();
  })
);

