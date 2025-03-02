"use client";

import { useState } from "react";
import { createUser } from "./api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Welcome = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!username.trim()) {
			toast.error("Please enter a username");
			return;
		}

		setIsLoading(true);
		try {
			const user = await createUser(username);
			localStorage.setItem("globetrotter_user", JSON.stringify(user));

			toast.success("Welcome to Globetrotter!");

			router.push("/game");
		} catch (error: any) {
			if (error.message === "Username already taken") {
				toast.error("Username already taken. Please choose another one.");
			} else {
				toast.error("Failed to create user. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="card">
			<h1>🌍 Welcome to Globetrotter!</h1>
			<h2>The Ultimate Travel Guessing Game</h2>

			<p className="text-center" style={{ marginBottom: "20px" }}>
				Guess famous destinations from cryptic clues and challenge your friends to beat your score!
			</p>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Enter your username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					disabled={isLoading}
					required
				/>
				<button className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
					{isLoading ? "Loading..." : "Start Playing"}
				</button>
			</form>
		</div>
	);
};

export default Welcome;
