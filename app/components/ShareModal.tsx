"use client";

import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useRef, useEffect, useState } from "react";

const ShareModal = ({ user, onClose }) => {
	const inviteCardRef = useRef(null);

	const inviteUrl = `${window.location.origin}/invitation/${user.invitationCode}`;

	const shareOnWhatsApp = () => {
		const message = `I challenge you to beat my score on Globetrotter! Join me at: ${inviteUrl}`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

		window.open(whatsappUrl, "_blank");
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<span className="close-modal" onClick={onClose}>
					&times;
				</span>
				<h2>Challenge a Friend!</h2>

				<div ref={inviteCardRef} className="share-container">
					<div style={{ textAlign: "center", padding: "20px" }}>
						<div style={{ fontSize: "50px", marginBottom: "10px" }}>🌍</div>
						<h3 style={{ marginBottom: "15px" }}>Globetrotter Challenge</h3>
						<p style={{ marginBottom: "10px" }}>
							<strong>{user.username}</strong> has challenged you to a game of Globetrotter!
						</p>
						<div
							style={{
								display: "flex",
								justifyContent: "space-around",
								margin: "15px 0",
								backgroundColor: "white",
								padding: "10px",
								borderRadius: "8px",
							}}>
							<div style={{ textAlign: "center" }}>
								<div style={{ fontSize: "20px", fontWeight: "bold" }}>{user.score.correct}</div>
								<div style={{ fontSize: "12px" }}>Correct</div>
							</div>
							<div style={{ textAlign: "center" }}>
								<div style={{ fontSize: "20px", fontWeight: "bold" }}>{user.score.incorrect}</div>
								<div style={{ fontSize: "12px" }}>Incorrect</div>
							</div>
							<div style={{ textAlign: "center" }}>
								<div style={{ fontSize: "20px", fontWeight: "bold" }}>
									{user.score.correct + user.score.incorrect > 0
										? Math.round((user.score.correct / (user.score.correct + user.score.incorrect)) * 100)
										: 0}
									%
								</div>
								<div style={{ fontSize: "12px" }}>Accuracy</div>
							</div>
						</div>
						<p style={{ fontSize: "14px", color: "#6c757d", marginTop: "10px" }}>Scan or click the link to play!</p>
					</div>
				</div>

				<div className="text-center" style={{ margin: "20px 0" }}></div>
				<div className="text-center">
					<p style={{ marginBottom: "15px" }}>Share this invitation link:</p>
					<div
						style={{
							padding: "10px",
							backgroundColor: "#f8f9fa",
							borderRadius: "5px",
							marginBottom: "15px",
							wordBreak: "break-all",
						}}>
						{inviteUrl}
					</div>

					<button className="btn btn-success" onClick={shareOnWhatsApp}>
						Share on WhatsApp
					</button>

					<button
						className="btn btn-primary"
						style={{ marginLeft: "10px" }}
						onClick={() => {
							navigator.clipboard.writeText(inviteUrl);
							toast.success("Link copied to clipboard!");
						}}>
						Copy Link
					</button>
				</div>
			</div>
		</div>
	);
};

export default ShareModal;
