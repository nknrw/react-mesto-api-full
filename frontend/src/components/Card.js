import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {
	const currentUser = React.useContext(CurrentUserContext);
	const isOwn = props.card.owner === currentUser._id;

	const cardDeleteButtonClassName = (
		`elements__trash-button ${isOwn ? "elements__trash-button_active" : ""}`
	)

	const isLiked = props.card.likes.some((i) => i === currentUser._id);

	const cardLikeButtonClassName = (
		`elements__like-button ${isLiked ? "elements__like-button_active" : ""}`);

	function handleClick() {
		props.onCardClick(props.card);
	}
	function handleLike() {
		props.onCardLike(props.card);
	}

	function handleDelete() {
		props.onCardDelete(props.card);
	}

	return (
		<div className="elements__card">
			<img className="elements__image" src={props.card.link} alt={props.card.name} onClick={handleClick} />
			<button className={cardDeleteButtonClassName} type="button" onClick={handleDelete}/>
				<h2 className="elements__title">{props.card.name}</h2>
				<div className="elements__like-container">
					<button className={cardLikeButtonClassName} type="button" id="like" onClick={handleLike} />
					<span className="elements__like-counter">{props.card.likes.length}</span>
				</div>
		</div>
	);
}