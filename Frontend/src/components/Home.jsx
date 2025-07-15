// import React from 'react'

// const Home = () => {
//   return (
//     <div>
//     </div>
//   )
// }

// export default Home
// app/page.tsx or src/pages/Home.tsx
// For Next.js — remove if you're using CRA
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

export default function Home() {
  return (
    <div >
      <NavBar />
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center px-4 py-10">
      {/* Logo / Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-800 mb-4">
        SplitMate
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Split group expenses. Fairly. Instantly.  
        Create a group, track who paid, and settle up easily.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/create">
          <button className="px-6 py-3 bg-cyan-700 hover:bg-cyan-800 text-white text-lg rounded-xl shadow">
            ➕ Create a Group
          </button>
        </Link>

        <Link href="/join">
          <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg rounded-xl shadow">
            🔗 Join a Group
          </button>
        </Link>
      </div>

      {/* How it Works Section */}
      <div className="mt-16 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-700">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div>
            <div className="text-3xl mb-2">🛠️</div>
            <p className="font-semibold">Create a Group</p>
            <p className="text-sm">Name your group and invite members</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💸</div>
            <p className="font-semibold">Add Expenses</p>
            <p className="text-sm">Track who paid and for whom</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✅</div>
            <p className="font-semibold">Settle Up</p>
            <p className="text-sm">Instantly calculate and simplify debts</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-gray-400 text-sm text-center">
        Made with 💙 by Waleeja Ali • v1.0
      </footer>
    </div>
    </div>
  );
}
