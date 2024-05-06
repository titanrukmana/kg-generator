import axios from "axios";
import React, { useState, FormEvent } from "react";

interface ITextBoxProp {
	onChange: (arg: string) => void;
}

const TextBox: React.FC<ITextBoxProp> = ({ onChange }) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [completion, setCompletion] = useState<string | null>(null); // Use null to differentiate between initial and fetched data

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(import.meta.env.VITE_API_URL + "llms", {
				prompt: inputValue,
			});

			setCompletion(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSave = () => {
		if (!completion) return;
		onChange(completion);
	};

	return (
		<div className="max-w-md mx-auto mt-8">
			<form onSubmit={handleSubmit} className="flex items-center">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className="border border-gray-300 px-4 py-2 mr-2 w-full bg-transparent rounded"
					placeholder="Ask anything..."
				/>
				<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
					Submit
				</button>
			</form>
			{completion !== null && (
				<div>
					<div className="mt-4 p-4 border border-gray-300 rounded">
						<p>{completion}</p>{" "}
					</div>
					<button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default TextBox;
