"use client";

import { Suspense } from "react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { getUserByInvitationCode } from "../../api";
import { useRouter, useSearchParams } from "next/navigation";

const InvitationScreen = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [invitingUser, setInvitingUser] = useState(null);

	const code = searchParams.get("code");

	useEffect(() => {
		// Only run the effect if code exists
		if (!code) {
			setIsLoading(false);
			return;
		}

		const fetchInvitingUser = async () => {
			try {
				const user = await getUserByInvitationCode(code);
				setInvitingUser(user);
			} catch (error) {
				toast.error("Invalid invitation link");
				router.push("/");
			} finally {
				setIsLoading(false);
			}
		};

		fetchInvitingUser();
	}, [code]);

	const handleContinueAsGuest = () => {
		router.push("/game");
	};

	const handleJoinWithUsername = async (e) => {
		e.preventDefault();

		if (!username.trim()) {
			toast.error("Please enter a username");

			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to create user");
			}

			const user = await response.json();
			localStorage.setItem("globetrotter_user", JSON.stringify(user));
			toast.success("Account created! Happy guessing!");
			router.push("/game");
		} catch (error) {
			if (error.message === "Username already taken") {
				toast.error("Username already taken. Please choose another one.");
			} else {
				toast.error("Failed to create account. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="card">
				<h2>Loading invitation...</h2>
			</div>
		);
	}

	return (
		<Suspense>
			<div className="card">
				<h1>🌍 You've Been Challenged!</h1>

				{invitingUser && (
					<div className="text-center" style={{ marginBottom: "20px" }}>
						<p>
							<strong>{invitingUser.username}</strong> has challenged you to beat their score in Globetrotter!
						</p>

						<div className="score-container">
							<div className="score-item">
								<div className="score-value">{invitingUser.score.correct}</div>
								<div className="score-label">Correct</div>
							</div>
							<div className="score-item">
								<div className="score-value">{invitingUser.score.incorrect}</div>
								<div className="score-label">Incorrect</div>
							</div>
							<div className="score-item">
								<div className="score-value">
									{invitingUser.score.correct + invitingUser.score.incorrect > 0
										? Math.round(
												(invitingUser.score.correct / (invitingUser.score.correct + invitingUser.score.incorrect)) * 100
										  )
										: 0}
									%
								</div>
								<div className="score-label">Accuracy</div>
							</div>
						</div>
					</div>
				)}

				<h3>Join the challenge!</h3>

				<form onSubmit={handleJoinWithUsername}>
					<input
						type="text"
						placeholder="Create your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						disabled={isLoading}
						required
					/>
					<button className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
						{isLoading ? "Loading..." : "Join Challenge"}
					</button>
				</form>

				<div className="text-center" style={{ marginTop: "20px" }}>
					<button className="btn btn-secondary" onClick={handleContinueAsGuest}>
						Continue as Guest
					</button>
				</div>
			</div>
		</Suspense>
	);
};

export default InvitationScreen;
