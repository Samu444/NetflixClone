import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WhosWatching.css";
import "./HelpCentre.css";

interface HelpItem {
  question: string;
  answer: string;
}

const HELP_ITEMS: HelpItem[] = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to the Sign In page and click 'Forgot password?'. Enter the email linked to your account and we'll send you a 6-digit code to reset your password.",
  },
  {
    question: "How do I create or switch profiles?",
    answer:
      "Click your profile icon in the top right of the navbar and select 'Switch Profiles'. From there you can also click 'Manage Profiles' to add, edit, or delete a profile. Each account can have up to 5 profiles.",
  },
  {
    question: "Why can't I see some titles on my profile?",
    answer:
      "If you're using a Kids profile, only kid-friendly movies and series are shown. Switch to a standard profile to see the full catalogue.",
  },
  {
    question: "How do I verify my email after signing up?",
    answer:
      "After registering, check your inbox (and spam folder) for a 6-digit verification code. Enter it on the verification screen to activate your account. Codes expire after 10 minutes.",
  },
  {
    question: "Why is a trailer not playing?",
    answer:
      "Some titles may not have a trailer available yet. If a trailer isn't loading, try refreshing the page or check your internet connection.",
  },
  {
    question: "How do I update my account details?",
    answer:
      "Click your profile icon in the navbar and select 'Account'. From there you can view your name, email, and change your password.",
  },
  {
    question: "How do I sign out?",
    answer:
      "Click your profile icon in the top right of the navbar and select 'Sign Out of Netflix' at the bottom of the menu.",
  },
  {
    question: "I didn't receive my verification or reset code. What do I do?",
    answer:
      "Check your spam or junk folder first. If it's still not there after a few minutes, try requesting a new code — codes expire after 10 minutes for security.",
  },
];

function HelpCentre() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="whos-watching-page">
      <h1 className="whos-watching-title">Help Centre</h1>
      <p className="help-subtitle">
        Find answers to common questions about your account and profiles.
      </p>

      <div className="help-list">
        {HELP_ITEMS.map((item, index) => (
          <div className="help-item" key={index}>
            <button
              className="help-question"
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <span className="help-toggle-icon">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="help-answer">{item.answer}</p>
            )}
          </div>
        ))}
      </div>

      <button className="manage-profiles-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div>
  );
}

export default HelpCentre;