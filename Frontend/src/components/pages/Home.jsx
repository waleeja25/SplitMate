// import { Link } from "react-router-dom";
// import NavBar from "../ui/NavBar";

// export default function Home() {
//   return (
//     <div className="font-['Poppins']">
//       <NavBar />
      
//       {/* Hero Section */}
//       <section className="min-h-screen bg-gradient-to-b from-[rgba(42,128,109,0.1)] to-[rgb(245,252,250)] flex flex-col items-center justify-center px-4 py-20">
        
//         {/* Main Heading */}
//         <div className="text-center mb-16 max-w-4xl">
//           <h1 className="text-5xl md:text-7xl font-bold text-[#2a806d] mb-6">
//             Split Expenses <span className="text-[#333]">Without the Hassle</span>
//           </h1>
//           <p className="text-xl text-[#333] leading-relaxed max-w-2xl mx-auto">
//             The simplest way to manage group expenses. Track who paid, calculate balances,
//             and settle up - all in one place.
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col md:flex-row gap-6 mb-40">
//           <Link 
//             to="/create"
//             className="px-8 py-4 bg-[#2a806d] hover:bg-[#20765f] text-white text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
//           >
//             Create New Group
//           </Link>
//           <Link 
//             to="/join"
//             className="px-8 py-4 bg-white hover:bg-[#f0f0f0] text-[#333] border border-[#ccc] text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
//           >
//             Join Existing Group
//           </Link>
//         </div>

//         {/* Feature Preview Image */}
//         <div className="w-full max-w-5xl mb-40 rounded-2xl overflow-hidden shadow-2xl">
//           <img 
//             src="https://placehold.co/1200x650" 
//             alt="SplitMate app interface showing expense tracking dashboard with charts and transaction list"
//             className="w-full h-auto"
//           />
//         </div>

//         {/* How It Works Section */}
//         <section className="w-full max-w-6xl mb-32">
//           <h2 className="text-4xl font-bold text-[#2a806d] text-center mb-16">How SplitMate Works</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             {/* Step 1 */}
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <div className="text-5xl text-[#2a806d] mb-6">1</div>
//               <h3 className="text-2xl font-bold text-[#333] mb-4">Create Your Group</h3>
//               <p className="text-[#333]">
//                 Start by creating a group and adding members. Give it a name that reflects your purpose - 
//                 'Road Trip 2023' or 'Roommates Expenses'.
//               </p>
//             </div>

//             {/* Step 2 */}
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <div className="text-5xl text-[#2a806d] mb-6">2</div>
//               <h3 className="text-2xl font-bold text-[#333] mb-4">Add Expenses</h3>
//               <p className="text-[#333]">
//                 Log any shared expenses. Split them equally or customize who paid and who owes. 
//                 Add receipts for easy reference.
//               </p>
//             </div>

//             {/* Step 3 */}
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <div className="text-5xl text-[#2a806d] mb-6">3</div>
//               <h3 className="text-2xl font-bold text-[#333] mb-4">Settle Up</h3>
//               <p className="text-[#333]">
//                 Let SplitMate calculate who owes whom. Send payment requests and mark them as 
//                 paid when settled.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="w-full max-w-4xl mb-32 text-center">
//           <h2 className="text-3xl font-bold text-[#2a806d] mb-12">What People Are Saying</h2>
//           <div className="bg-white p-10 rounded-xl shadow-lg">
//             <p className="text-xl text-[#333] italic mb-8">
//               "SplitMate saved our group trips from endless spreadsheet arguments. Now we actually enjoy splitting bills!"
//             </p>
//             <p className="font-bold text-[#333]">— Sarah & Her Travel Friends</p>
//           </div>
//         </section>

//         {/* Final CTA */}
//         <div className="text-center mb-20">
//           <h2 className="text-3xl font-bold text-[#2a806d] mb-8">Ready to Simplify Your Group Expenses?</h2>
//           <Link 
//             to="/create"
//             className="px-10 py-5 bg-[#2a806d] hover:bg-[#20765f] text-white text-xl rounded-xl shadow-lg transition-all duration-300 inline-block"
//           >
//             Get Started - It's Free
//           </Link>
//         </div>

//       </section>

//       {/* Footer */}
//       <footer className="bg-[#2a806d] text-white p-8 text-center">
//         <p className="text-sm">© 2023 SplitMate | Made with ♥ by Waleeja Ali</p>
//       </footer>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import NavBar from "../ui/NavBar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="font-['Poppins']">
      <NavBar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-[rgba(42,128,109,0.05)] to-[rgb(245,252,250)] flex flex-col items-center justify-center px-4 pt-24 pb-10">
        
        {/* Main Heading */}
        <motion.div 
          className="text-center mb-16 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#2a806d] mb-6">
            Split Expenses <span className="text-[#333]">Without the Hassle</span>
          </h1>
          <p className="text-xl text-[#333] leading-relaxed max-w-2xl mx-auto">
            The simplest way to manage group expenses. Track who paid, calculate balances,
            and settle up — all in one place.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 mb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link 
            to="/create"
            className="px-8 py-4 bg-[#2a806d] hover:bg-[#20765f] text-white text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Create New Group
          </Link>
          <Link 
            to="/join"
            className="px-8 py-4 bg-white hover:bg-[#f0f0f0] text-[#333] border border-[#ccc] text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Join Existing Group
          </Link>
        </motion.div>

        {/* Feature Preview Image */}
        <motion.div 
          className="w-full max-w-5xl mb-40 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <img 
            src="https://placehold.co/1200x650" 
            alt="SplitMate app dashboard"
            className="w-full h-auto"
          />
        </motion.div>

        {/* How It Works Section */}
        <section className="w-full max-w-6xl mb-32">
          <motion.h2 
            className="text-4xl font-bold text-[#2a806d] text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            How SplitMate Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((step, idx) => {
              const titles = ["Create Your Group", "Add Expenses", "Settle Up"];
              const descs = [
                "Start by creating a group and adding members. Give it a name like 'Road Trip 2023' or 'Roommates'.",
                "Log any shared expenses. Split equally or customize who paid and who owes. Add receipts easily.",
                "Let SplitMate calculate who owes whom. Mark payments as settled when complete."
              ];

              return (
                <motion.div
                  key={step}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                >
                  <div className="text-5xl text-[#2a806d] mb-6">{step}</div>
                  <h3 className="text-2xl font-bold text-[#333] mb-4">{titles[idx]}</h3>
                  <p className="text-[#333]">{descs[idx]}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <motion.section 
          className="w-full max-w-4xl mb-32 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-[#2a806d] mb-12">What People Are Saying</h2>
          <div className="bg-white p-10 rounded-xl shadow-lg">
            <p className="text-xl text-[#333] italic mb-8">
              "SplitMate saved our group trips from endless spreadsheet arguments. Now we actually enjoy splitting bills!"
            </p>
            <p className="font-bold text-[#333]">— Sarah & Her Travel Friends</p>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[#2a806d] mb-8">Ready to Simplify Your Group Expenses?</h2>
          <Link 
            to="/create"
            className="px-10 py-5 bg-[#2a806d] hover:bg-[#20765f] text-white text-xl rounded-xl shadow-lg transition-all duration-300 inline-block hover:scale-105"
          >
            Get Started — It's Free
          </Link>
        </motion.div>

      </section>

      {/* Footer */}
      <footer className="bg-[#2a806d] text-white p-8 text-center">
        <p className="text-sm">© 2023 SplitMate | Made with ♥ by Waleeja Ali</p>
      </footer>
    </div>
  );
}
