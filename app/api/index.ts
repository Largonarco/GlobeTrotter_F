const API_URL = process.env.REACT_APP_API_URL || "https://globetrotter-b.onrender.com/api";

export const fetchRandomDestination = async () => {
	try {
		const response = await fetch(`${API_URL}/destinations/random`);

		if (!response.ok) {
			throw new Error("Failed to fetch random destination");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching random destination:", error);
		throw error;
	}
};

export const checkAnswer = async (destinationId: any, selectedOption: any, userId = null) => {
	try {
		const response = await fetch(`${API_URL}/destinations/check-answer`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ destinationId, selectedOption, userId }),
		});

		if (!response.ok) {
			throw new Error("Failed to check answer");
		}

		return await response.json();
	} catch (error) {
		console.error("Error checking answer:", error);
		throw error;
	}
};

export const createUser = async (username: any) => {
	try {
		const response = await fetch(`${API_URL}/users`, {
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

		return await response.json();
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
};

export const getUserByInvitationCode = async (code: any) => {
	try {
		const response = await fetch(`${API_URL}/users/invitation/${code}`);

		if (!response.ok) {
			throw new Error("Failed to get user by invitation code");
		}

		return await response.json();
	} catch (error) {
		console.error("Error getting user by invitation code:", error);
		throw error;
	}
};

export const updateUserScore = async (userId: any, score: any) => {
	try {
		const response = await fetch(`${API_URL}/users/${userId}/score`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(score),
		});

		if (!response.ok) {
			throw new Error("Failed to update user score");
		}

		return await response.json();
	} catch (error) {
		console.error("Error updating user score:", error);
		throw error;
	}
};
