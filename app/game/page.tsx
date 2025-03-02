"use client";

import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchRandomDestination, checkAnswer } from "../api";
import React, { useState, useEffect, useCallback, useRef } from "react";

import ShareModal from "../components/ShareModal";

const Game = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [destination, setDestination] = useState(null);
	const [selectedOption, setSelectedOption] = useState(null);
	const [feedback, setFeedback] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showConfetti, setShowConfetti] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [windowDimensions, setWindowDimensions] = useState({
		width: null,
		height: null,
	});

	// Get window dimensions for confetti
	useEffect(() => {
		const handleResize = () => {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Load user from localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("globetrotter_user");

		if (!storedUser) {
			router.push("/");
		}

		setUser(JSON.parse(storedUser));
	}, []);

	// Load a random destination
	const loadDestination = useCallback(async () => {
		setIsLoading(true);
		setFeedback(null);
		setSelectedOption(null);

		try {
			const data = await fetchRandomDestination();

			setDestination(data);
		} catch (error) {
			toast.error("Failed to load destination. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Load initial destination
	useEffect(() => {
		if (user) {
			loadDestination();
		}
	}, [user, loadDestination]);

	// Handle option selection
	const handleSelectOption = async (option) => {
		if (selectedOption || isLoading || !destination) return;

		setSelectedOption(option);
		setIsLoading(true);

		try {
			const result = await checkAnswer(destination.id, option.value, user?.id);

			setFeedback(result);

			if (result.isCorrect) {
				setShowConfetti(true);
				setTimeout(() => {
					setShowConfetti(false);
				}, 3000);

				// Update user's score in local storage
				const updatedUser = {
					...user,
					score: {
						correct: user.score.correct + 1,
						incorrect: user.score.incorrect,
					},
				};
				setUser(updatedUser);
				localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
			} else {
				// Update user's score in local storage
				const updatedUser = {
					...user,
					score: {
						correct: user.score.correct,
						incorrect: user.score.incorrect + 1,
					},
				};
				setUser(updatedUser);
				localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
			}
		} catch (error) {
			toast.error("Failed to check answer. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("globetrotter_user");
		router.push("/");
	};

	if (!user) {
		return <div className="card">Loading...</div>;
	}

	return (
		<div className="card">
			{showConfetti && (
				<Confetti
					width={windowDimensions.width}
					height={windowDimensions.height}
					recycle={false}
					numberOfPieces={200}
				/>
			)}

			<div className="game-header">
				<div className="game-logo">
					<span role="img" aria-label="globe">
						🌍
					</span>{" "}
					Globetrotter
				</div>
				<button className="btn btn-secondary" onClick={handleLogout}>
					Logout
				</button>
			</div>

			<div className="score-container">
				<div className="score-item">
					<div className="score-value">{user.score.correct}</div>
					<div className="score-label">Correct</div>
				</div>
				<div className="score-item">
					<div className="score-value">{user.score.incorrect}</div>
					<div className="score-label">Incorrect</div>
				</div>
				<div className="score-item">
					<div className="score-value">
						{user.score.correct + user.score.incorrect > 0
							? Math.round((user.score.correct / (user.score.correct + user.score.incorrect)) * 100)
							: 0}
						%
					</div>
					<div className="score-label">Accuracy</div>
				</div>
			</div>

			{isLoading && !destination ? (
				<div className="text-center">Loading destination...</div>
			) : (
				<>
					<div className="clue-container">
						{destination.clues.map((clue, index) => (
							<div key={index}>
								<strong>Clue {index + 1}:</strong> {clue}
							</div>
						))}
					</div>

					<h3>Where is this place?</h3>

					<div className="options-container">
						{destination?.options.map((option, index) => (
							<button
								key={index}
								className={`option-btn ${selectedOption === option ? (option.correct ? "correct" : "incorrect") : ""}`}
								onClick={() => handleSelectOption(option)}
								disabled={selectedOption !== null}>
								{option.value}
							</button>
						))}
					</div>

					{feedback && (
						<div className={`feedback-container ${feedback.isCorrect ? "correct" : "incorrect"}`}>
							<div className="emoji-animation">{feedback.isCorrect ? "🎉" : "😢"}</div>
							<h3>{feedback.isCorrect ? "Correct!" : "Incorrect!"}</h3>
							<p>
								{feedback.isCorrect
									? `You got it right! ${feedback.correctAnswer} is the answer.`
									: `The correct answer is ${feedback.correctAnswer}.`}
							</p>
							<p style={{ marginTop: "15px" }}>
								<strong>Fun Fact:</strong> {feedback.feedback}
							</p>
						</div>
					)}

					<div className="text-center" style={{ marginTop: "20px" }}>
						{selectedOption && (
							<button className="btn btn-primary" onClick={loadDestination}>
								Next Destination
							</button>
						)}

						<button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => setShowShareModal(true)}>
							Challenge a Friend
						</button>
					</div>
				</>
			)}

			{showShareModal && <ShareModal user={user} onClose={() => setShowShareModal(false)} />}
		</div>
	);
};

export default Game;
