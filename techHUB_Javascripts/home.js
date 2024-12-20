AOS.init();

const chatadmin = document.getElementById("chatadmin").value;
const formreport = document.getElementById("formesreport");
const btnforreports = document.getElementById("btnforreports");

formreport.onsubmit = function (e) {
	e.preventDefault();
};

btnforreports.onclick = function (e) {
	e.preventDefault();

	if (chatadmin === "") {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "../newPhpfileTechhub/reportsend.php", true);
		xhr.onload = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					swal({
						title: "Success!",
						text: "Report has been sent.",
						icon: "success",
						button: "OK",
					});
				} else {
					swal({
						title: "Error!",
						text: "Failed to send report.",
						icon: "error",
						button: "Try Again",
					});
				}
			}
		};
		let inputedreport = new FormData(formreport);
		xhr.send(inputedreport);
	} else {
		swal({
			title: "Error!",
			text: "Enter a message.",
			icon: "error",
			button: "OK",
		});
	}
};

// Search functionality
let search = document.querySelector("#searchbar");
let search3 = document.querySelector(".search3");
let divActive = document.querySelector(".divActive");

search.onkeyup = function (e) {
	e.preventDefault();

	let searchinputed = search.value;
	if (searchinputed !== "") {
		search3.classList.add("active");
	} else {
		search3.classList.remove("active");
		search3.innerHTML = "";
		divActive.style.display = "none";
	}

	let xhr1 = new XMLHttpRequest();
	xhr1.open("POST", "../newPhpfileTechhub/searchhome.php", true);
	xhr1.onload = function () {
		if (xhr1.readyState === XMLHttpRequest.DONE) {
			if (xhr1.status === 200) {
				let data = xhr1.response;
				console.log(data);
				search3.innerHTML = data;
			}
		}
	};
	xhr1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr1.send("searchterm=" + encodeURIComponent(searchinputed));
};

// Post code functionality
const btnPost = document.querySelector("#captbtn");
const postForm = document.querySelector("#postfeed");

postForm.onsubmit = function (e) {
	e.preventDefault();
};

btnPost.onclick = function (e) {
	e.preventDefault();
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "../newPhpfileTechhub/postcode.php", true);

	xhr.onload = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.response);
					if (response.status === "success") {
						swal("Success!", response.message, "success").then(() => {
							location.reload();
						});
					} else {
						swal("Error!", response.message, "error");
					}
				} catch (e) {
					console.error("Error parsing response:", e);
					swal("Error!", "Something went wrong!", "error");
				}
			}
		}
	};

	let formdatainputed = new FormData(postForm);
	xhr.send(formdatainputed);
};

// Logout functionality
const logout = document.querySelector("#logout");
logout.onclick = function (e) {
	console.log("run");
	e.preventDefault();
	window.location.href = "../newPhpfileTechhub/logout.php";
};

document.addEventListener("DOMContentLoaded", function () {
	const reportBtn = document.getElementById("showrepordiv");
	const reportBtnSide = document.getElementById("showrepordiv-side");
	const reportModal = document.getElementById("reportmessage");

	// Handle both buttons
	[reportBtn, reportBtnSide].forEach((btn) => {
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			reportModal.style.display = "block";
		});
	});
});

const closedivreport = document.getElementById("closedivreport");
closedivreport.onclick = function (e) {
	e.preventDefault();
	document.getElementById("reportmessage").style.display = "none";
};

// Feedback functionality
document.addEventListener("DOMContentLoaded", function () {
	// Feedback modal controls
	const feedbackModal = document.getElementById("feedbackModal");
	const closeFeedback = document.getElementById("closeFeedback");
	const feedbackDiv = document.getElementById("feedbackdiv");
	const feedbackForm = document.getElementById("feedbackForm");
	const starRating = document.getElementById("feedbackStars");
	const ratingText = document.getElementById("ratingText");
	const ratingInputs = starRating.querySelectorAll('input[type="radio"]');

	// Show/Hide modal
	feedbackDiv.addEventListener("click", function (e) {
		e.preventDefault();
		feedbackModal.style.display = "block";
	});

	closeFeedback.addEventListener("click", function (e) {
		e.preventDefault();
		feedbackModal.style.display = "none";
	});

	// Star rating functionality
	ratingInputs.forEach((input) => {
		input.addEventListener("change", function () {
			starRating.classList.remove(
				"rate-1",
				"rate-2",
				"rate-3",
				"rate-4",
				"rate-5"
			);
			starRating.classList.add(`rate-${this.value}`);

			const ratingMessages = {
				1: "Poor - 1 Star",
				2: "Fair - 2 Stars",
				3: "Good - 3 Stars",
				4: "Very Good - 4 Stars",
				5: "Excellent - 5 Stars",
			};

			ratingText.textContent = ratingMessages[this.value];
		});
	});

	// Feedback form submission
	feedbackForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const formData = new FormData(this);

		// Debug: Log form data
		for (let pair of formData.entries()) {
			console.log(pair[0] + ": " + pair[1]);
		}

		fetch("../newPhpfileTechhub/feedback.php", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.text())
			.then((data) => {
				console.log("Server response:", data);

				if (data.includes("run")) {
					swal({
						title: "Success!",
						text: "Your feedback has been submitted.",
						icon: "success",
						button: "Close",
					}).then(() => {
						this.reset();
						feedbackModal.style.display = "none";
						ratingText.textContent = "No rating selected";
						starRating.classList.remove(
							"rate-1",
							"rate-2",
							"rate-3",
							"rate-4",
							"rate-5"
						);
					});
				} else {
					swal({
						title: "Error!",
						text: data || "Please fill all fields",
						icon: "error",
						button: "Close",
					});
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				swal({
					title: "Error!",
					text: "Something went wrong. Please try again.",
					icon: "error",
					button: "Close",
				});
			});
	});
});
document.addEventListener("DOMContentLoaded", function () {
	const searchToggle = document.getElementById("search-toggle");
	const searchHeader = document.getElementById("listheader2");
	const searchInput = document.querySelector("#searchbar");

	searchToggle.addEventListener("click", function () {
		searchHeader.classList.add("search-active");
		searchInput.focus();
	});

	// Close search when clicking back or outside
	document.addEventListener("click", function (e) {
		if (!searchHeader.contains(e.target) && !searchToggle.contains(e.target)) {
			searchHeader.classList.remove("search-active");
		}
	});

	// Add back button functionality
	const backButton = document.createElement("div");
	backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
	backButton.className = "search-back";
	backButton.style.display = "none";

	searchHeader.insertBefore(backButton, searchHeader.firstChild);

	backButton.addEventListener("click", function () {
		searchHeader.classList.remove("search-active");
	});
});
