import React from 'react';

const Contact = () => (
	<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
		<h2 className="text-3xl font-bold text-green-700 mb-4">Contact Us</h2>
		<form className="bg-white shadow rounded-lg p-8 w-full max-w-md">
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">Name</label>
				<input className="w-full border border-gray-300 rounded px-3 py-2" type="text" placeholder="Your Name" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">Email</label>
				<input className="w-full border border-gray-300 rounded px-3 py-2" type="email" placeholder="Your Email" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">Message</label>
				<textarea className="w-full border border-gray-300 rounded px-3 py-2" rows="4" placeholder="Your Message"></textarea>
			</div>
			<button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Send</button>
		</form>
	</div>
);

export default Contact;
