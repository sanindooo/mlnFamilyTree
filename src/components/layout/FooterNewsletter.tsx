"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import React, { useState } from "react";

const useForm = () => {
	const [email, setEmail] = useState("");
	const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log({ email });
	};
	return {
		email,
		handleSetEmail,
		handleSubmit,
	};
};

export function FooterNewsletter() {
	const formState = useForm();

	return (
		<div className="w-full max-w-md">
			<form
				className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
				onSubmit={formState.handleSubmit}
			>
				<Input
					id="email"
					type="email"
					placeholder="Email"
					value={formState.email}
					onChange={formState.handleSetEmail}
				/>
				<Button title="Subscribe" variant="secondary" size="sm">
					Subscribe
				</Button>
			</form>
			<p className="text-xs text-muted">
				We respect your privacy and only send what matters.
			</p>
		</div>
	);
}

