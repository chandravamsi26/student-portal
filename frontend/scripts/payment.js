const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");

const courseDetailsEl = document.getElementById("courseDetails");
const statusEl = document.getElementById("status");
const payBtn = document.getElementById("payBtn");
const spinner = document.getElementById("spinner");

let courseClassName = "";
let courseTitle = "";
let coursePrice = 0;

if (!courseId || !token) {
  courseDetailsEl.innerHTML = "<p>Invalid access.</p>";
  payBtn.disabled = true;
} else {
  // 🔍 Fetch course details
  fetch(`http://localhost:8080/api/courses/details/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch course details");
      return res.json();
    })
    .then(course => {
      courseTitle = course.title;
      courseClassName = course.className;
      coursePrice = course.price;

      courseDetailsEl.innerHTML = `
        <p><strong>Title:</strong> ${course.title}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Instructor:</strong> ${course.instructorName}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Price:</strong> ₹${course.price}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      courseDetailsEl.innerHTML = "<p>Error fetching course details.</p>";
      payBtn.disabled = true;
    });

  // 💳 Handle Razorpay payment
  payBtn.addEventListener("click", async () => {
    payBtn.disabled = true;
    spinner.style.display = "block";
    statusEl.style.color = "#333";
    statusEl.textContent = "Creating payment...";

    try {
      // ✅ Step 1: Create order from backend
      const res = await fetch("http://localhost:8080/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, amount: coursePrice })
      });

      if (!res.ok) throw new Error("Failed to create payment");

      const data = await res.json(); // contains: orderId, key, amount

      const options = {
        key: data.key, // ✅ Razorpay public key
        amount: data.amount * 100, // in paise
        currency: "INR",
        name: "Student Portal",
        description: courseTitle,
        order_id: data.orderId, // ✅ Razorpay order ID from backend
        handler: async function (response) {
          spinner.style.display = "block";
          statusEl.textContent = "Verifying payment...";

          try {
            const confirmRes = await fetch("http://localhost:8080/api/payment/confirm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!confirmRes.ok) {
              const errorText = await confirmRes.text();
              throw new Error(errorText);
            }

            // ✅ Step 3: Enroll the student
            const enrollRes = await fetch("http://localhost:8080/api/enroll/mock", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                courseId: courseId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                status: "SUCCESS"
              })
            });

            const msg = await enrollRes.text();

            if (!enrollRes.ok) throw new Error(msg);

            statusEl.style.color = "green";
            statusEl.textContent = "Enrollment successful!";
            setTimeout(() => {
              window.location.href = `enrolled.html`;
            }, 2000);

          } catch (error) {
            spinner.style.display = "none";
            statusEl.style.color = "red";
            statusEl.textContent = "Verification failed: " + error.message;
            payBtn.disabled = false;
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#007bff"
        }
      };

      spinner.style.display = "none";
      statusEl.textContent = "";

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      spinner.style.display = "none";
      statusEl.style.color = "red";
      statusEl.textContent = "Error: " + error.message;
      payBtn.disabled = false;
    }
  });
}
