"use client";

import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useRef, useEffect, useState } from "react";

const ShareModal = ({ user, onClose }) => {
	const inviteCardRef = useRef(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [isGenerating, setIsGenerating] = useState(true);

	const inviteUrl = `${window.location.origin}/game/invitation?code=${user.invitationCode}`;

	useEffect(() => {
		const generateImage = async () => {
			if (inviteCardRef.current) {
				try {
					const canvas = await html2canvas(inviteCardRef.current, {
						scale: 2,
						logging: false,
						useCORS: true,
						allowTaint: true,
					});

					const dataUrl = canvas.toDataURL("image/png");
					setImageUrl(dataUrl);
				} catch (error) {
					console.error("Error generating image:", error);
				} finally {
					setIsGenerating(false);
				}
			}
		};

		setTimeout(() => {
			generateImage();
		}, 300);
	}, []);

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

				{isGenerating ? (
					<div className="text-center" style={{ margin: "20px 0" }}>
						Generating invitation image...
					</div>
				) : (
					<>
						{imageUrl && (
							<div className="text-center" style={{ margin: "20px 0" }}>
								<img src={imageUrl} alt="Invitation" className="invite-image" />
							</div>
						)}

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
					</>
				)}
			</div>
		</div>
	);
};

export default ShareModal;
