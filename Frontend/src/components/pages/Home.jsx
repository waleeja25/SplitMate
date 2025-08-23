import { Link } from "react-router-dom";
import NavBar from "../ui/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { actions, steps, FEATURES, testimonials, emojis } from "../../lib/home";

export default function Home() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % actions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://formspree.io/f/mvgqenwp", {
        method: "POST",
        body: JSON.stringify({
          email,
          message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setShowDialog(true);
        e.target.reset();
      } else {
        alert("Oops! Something went wrong.");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Poppins']">
      <NavBar />

      <section
        id="hero"
        className="hero min-h-[95vh] bg-gradient-to-b from-[rgba(42,128,109,0.05)] to-[rgb(245,252,250)] "
      >
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0 H0 V40"
                fill="none"
                stroke="#2A806D"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="hero-content flex-col text-center font-inter ">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
              Split Expenses
            </span>{" "}
            <span className="bg-gradient-to-r from-[#3d3c3c] via-[#333] to-[#444] bg-clip-text text-transparent">
              Without the Hassle
            </span>
          </motion.h1>

          <div className="mt-3 sm:mt-6 lg:mt-10 mb-3 font-inter px-4 sm:px-0">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium">
                The simplest way to{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={actions[index].first}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="relative inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm whitespace-nowrap"
                  >
                    {actions[index].first}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="relative flex justify-center items-center italic h-[50px] sm:h-[55px] md:h-[60px] lg:h-[70px] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={actions[index].word + actions[index].sub}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-[#555454] via-[#333] to-[#444] bg-clip-text text-transparent whitespace-nowrap"
                  >
                    {actions[index].word} {actions[index].sub}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-5">
              {emojis.map((emoji, idx) => (
                <motion.img
                  key={idx}
                  src={emoji.src}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                  style={{
                    filter: `invert(32%) sepia(94%) saturate(500%) hue-rotate(120deg)`,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    delay: idx * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed font-inter">
            Keep track of shared expenses and balances with{" "}
            <span className="text-[#2a806d] font-semibold">friends</span>,{" "}
            <span className="text-[#2a806d] font-semibold">groups</span>,{" "}
            <span className="text-[#2a806d] font-semibold">trips</span>, and
            more — all in one place.
          </p>

          <div className="mt-10">
            <Link
              to="/signup"
              className="btn bg-[#2a806d] hover:bg-[#1d4d3a] text-white text-lg md:text-xl rounded-lg px-10 py-5 shadow-lg border-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-[rgb(245 252 250)] py-6 min-h-[90vh]
      "
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Smart Features
        </motion.h2>
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <div
                key={title}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1"
              >
                <div className="card-body items-center text-center space-y-4">
                  <div className={`rounded-full p-3 ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="working"
        className=" w-full mt-5 bg-dots min-h-[90vh] mx-auto py-8 px-4 md:px-0"
      >
        <div className="flex flex-col items-center">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            How SplitMate Works
          </motion.h2>

          <p className="text-lg md:text-xl lg:text-xl text-gray-600 max-w-2xl leading-relaxed font-inter italic text-center mt-5">
            Here’s a quick look at{" "}
            <span className="text-[#2a806d] font-semibold">
              how SplitMate works
            </span>{" "}
            to make splitting expenses effortless.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ title, Icon, bg, color, description }) => (
              <div
                key={title}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1"
              >
                <div className="card-body items-center text-center space-y-4">
                  <div
                    className={`rounded-full p-3 ${bg}`}
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="people"
        className="w-full max-w-2xl mx-auto mb-7 text-center px-4 py-6 min-h-[65vh]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          What People Are Saying
        </motion.h2>

        <div className="relative mb-16">
          <motion.div
            key={index}
            className="card bg-base-100 shadow-xl p-8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg md:text-xl text-gray-700 italic mb-6 font-inter">
              "{testimonials[index].quote}"
            </p>
            <p className="font-bold text-[#333]">
              — {testimonials[index].author}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-md rounded-xl p-4 max-w-md mx-auto border border-gray-200 font-inter font-normal"
        >
          <h3 className="text-xl font-semibold text-[#2a806d] mb-4">
            Share Your Feedback
          </h3>

          <form onSubmit={handleSubmit} method="POST" className="space-y-3">
            <label htmlFor="email"></label>
            <input
              type="email"
              placeholder="Your Email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36a186] outline-none text-sm"
            />

            <textarea
              placeholder="Your Feedback..."
              rows={3}
              name="message"
              id="message"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36a186] outline-none text-sm"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] hover:shadow-md transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {showDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">
                <h2 className="text-xl font-bold text-[#2A806D] mb-4">
                  Thank you for your feedback!
                </h2>
                <button
                  onClick={() => setShowDialog(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-[#2A806D] text-white font-semibold hover:bg-[#36a186] transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <footer className="footer footer-center bg-[#2a806d] text-white p-3">
        <p className="text-sm">© 2025 SplitMate | Made by Waleeja Ali</p>
      </footer>
    </div>
  );
}
