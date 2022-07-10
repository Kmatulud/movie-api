import "./style.css";
import Alpine from "alpinejs";
window.Alpine = Alpine;
// import dotenv from "dotenv";
// dotenv.config();

const URL_BASE = import.meta.env.VITE_SERVER_URL; 
const API_KEY = import.meta.env.VITE_API_KEY;

Alpine.data("users", () => {
	return {
		init() {
			localStorage.getItem("token")
				fetch(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}`)
					.then((r) => r.json())
					.then((data) => (this.movies = data.tagline));
		},
		movies: [],
		signUpAuthError: "",
		loginAuthError: "",
		password: "",
		username: "",
		password2: "",
		username2: "",
		loggedIn: false,
		signedUp: false,
		home: false,

		loadMovies() {
			fetch(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}`, {
				method: "get",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					alert(err);
				});
		},
		login() {
			if (this.username && this.password) {
				fetch(`http://localhost:9000/api/login`, {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						password: this.password,
						username: this.username,
					}),
				})
					.then((response) => response.text())
					.then((token) => {
						localStorage.setItem("token", token);
						if (localStorage.getItem("token")) {
							this.loadMovies();
							console.log(this.movies);
						}
					})
					.then(() => {
						this.loginAuthError = "Success, redirecting!";
						setTimeout(() => {
							this.loginAuthError = "";
							this.loggedIn = true;
							this.home = true;
						}, 2000);
						this.username = "";
						this.password = "";
					})
					.catch((error) => {
						// console.log(error);
						this.loginAuthError = "Invalid username or password";
					});
			}
		},

		register() {
			if (this.password2 && this.username2) {
				fetch(`http://localhost:9000/api/signup`, {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						password: this.password2,
						username: this.username2,
					}),
				})
					.then((response) => response.json())
					.then(() => {
						this.signUpAuthError = "New user created!";

						setTimeout(() => {
							this.signUpAuthError = "";
							this.signedUp = false;
						}, 3000);
						this.username2 = "";
						this.password2 = "";
					})
					.catch((error) => {
						alert(error);
					});
			}
		},
	};
});

document.querySelector("#app").innerHTML = `
  <h1>Movie Api!</h1>
`;
Alpine.start();
