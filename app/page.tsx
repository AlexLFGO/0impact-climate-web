export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Background video from 0G.ai footer */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="https://cdn.prod.website-files.com/680b884d38733122a923739b/68472a74f675fac2540505e5_panda%20loop_v5-transcode.webm" type="video/webm" />
          <source src="https://cdn.prod.website-files.com/680b884d38733122a923739b/68472a74f675fac2540505e5_panda%20loop_v5-transcode.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* Subtle hype text at top */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-400 text-sm font-mono tracking-wider opacity-60 animate-pulse">
            The Future is Loading...
          </p>
        </div>

      </div>
    </main>
  );
}
