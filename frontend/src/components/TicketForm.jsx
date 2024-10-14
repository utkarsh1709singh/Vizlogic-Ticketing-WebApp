import React, { useState } from "react";

const TicketForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    let formErrors = {};
    if (!title) formErrors.title = "Title is required";
    if (!description) formErrors.description = "Description is required";
    if (file && file.size > 5000000) formErrors.file = "File size exceeds 5MB";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    // Create ticket object
    const newTicket = {
      title,
      description,
      file,
      status: "Submitted", // initial status
      id: Date.now(),
    };

    // Trigger submit callback with the ticket object
    onSubmit(newTicket);

    // Reset form fields
    setTitle("");
    setDescription("");
    setFile(null);
    setErrors({});
  };

  return (
    <div>
      <h2>Submit a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div>
          <label>File Attachment:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {errors.file && <p style={{ color: "red" }}>{errors.file}</p>}
        </div>

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
};

export default TicketForm;
