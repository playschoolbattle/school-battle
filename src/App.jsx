import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const ACTIONS = [
  { id: "phone", label: "Téléphone", points: 12, duration: 2000, emoji: "📱" },
  { id: "eat", label: "Manger", points: 18, duration: 3000, emoji: "🍔" },
  { id: "sleep", label: "Dormir", points: 30, duration: 4000, emoji: "💤" },
];

const TEACHERS = [
  { id: "strict", name: "Mr. Strict", subject: "Math", difficulty: "Normal", lookChance: 0.58, tolerance: 100, quote: "Je vois TOUT." },
  { id: "sleepy", name: "Dr. Sleepy", subject: "History", difficulty: "Easy", lookChance: 0.38, tolerance: 120, quote: "Zzz... hein ?" },
  { id: "focus", name: "Mrs. Focus", subject: "Science", difficulty: "Hard", lookChance: 0.7, tolerance: 85, quote: "Pas un bruit." },
];

const TEACHER_MOVES = {
  watching: { label: "👀 Il surveille", duration: 1800, looking: true },
  writing: { label: "✏️ Il écrit au tableau", duration: 5000, looking: false },
  desk: { label: "🪑 Il va au bureau", duration: 3500, looking: false },
};

const REWARDS = [
  { score: 2000, reward: "🎒", label: "BACKPACK" },
  { score: 2500, reward: "🧥", label: "HOODIE" },
  { score: 3000, reward: "🍔", label: "GOLD BURGER" },
  { score: 4000, reward: "👑", label: "SECRET PROF" },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getTeacherById(id) {
  return TEACHERS.find((teacher) => teacher.id === id) || TEACHERS[0];
}

function chooseNextTeacherMove(teacher) {
  const willWatch = Math.random() < teacher.lookChance;
  if (willWatch) return "watching";
  return Math.random() < 0.65 ? "writing" : "desk";
}

function runTinySelfTests() {
  console.assert(clamp(5, 0, 10) === 5, "clamp keeps value inside range");
  console.assert(clamp(-5, 0, 10) === 0, "clamp applies minimum");
  console.assert(clamp(15, 0, 10) === 10, "clamp applies maximum");
  console.assert(getTeacherById("strict").name === "Mr. Strict", "teacher found");
  console.assert(getTeacherById("unknown").id === "strict", "fallback teacher works");
  console.assert(["watching", "writing", "desk"].includes(chooseNextTeacherMove(TEACHERS[0])), "teacher move valid");
  console.assert(REWARDS.length === 4, "home has four rewards");
  console.assert(ACTIONS.find((action) => action.id === "sleep")?.duration === 4000, "sleep lasts 4 seconds");
}

function HomeScreen({ best, onPlay }) {
  return (
    <div className="relative min-h-[920px] overflow-hidden bg-gradient-to-b from-[#17284a] via-[#0f172a] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(59,130,246,.25),transparent_32%),radial-gradient(circle_at_60%_70%,rgba(168,85,247,.18),transparent_32%)]" />

      <div className="absolute top-5 left-4 right-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 bg-black/65 backdrop-blur rounded-2xl px-3 py-2 border border-white/10 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center text-2xl shadow-xl">🧢</div>
          <div>
            <div className="font-black text-sm">NoobMaster</div>
            <div className="text-[11px] text-slate-300">{best}/2000</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/65 border border-white/10 rounded-xl px-3 py-2 font-black text-cyan-300 shadow-xl">💎 165</div>
          <button className="w-12 h-12 rounded-xl bg-black/65 border border-white/10 text-xl shadow-xl">⚙️</button>
        </div>
      </div>

      <div className="absolute top-28 left-5 z-40 pointer-events-none">
        <div className="text-6xl leading-none font-black tracking-tight text-white drop-shadow-2xl">SCHOOL</div>
        <div className="text-5xl leading-none font-black tracking-tight text-amber-400 drop-shadow-2xl -mt-1">BATTLE</div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-40 w-[94%] h-[560px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
        <img
          src="/45de301d-cff4-4674-98aa-45756c09839e.png"
          alt="Classroom background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,.06),rgba(2,6,23,.46))]" />

        <div className="absolute top-5 left-5 right-16 bg-black/60 backdrop-blur-md rounded-[2rem] px-5 py-4 border border-white/10 shadow-2xl z-30">
          <div className="text-[11px] tracking-[0.22em] text-slate-300 font-black uppercase">Classroom Chaos</div>
          <div className="text-5xl leading-[0.9] font-black text-white mt-2 drop-shadow-xl">Eat. Sleep.</div>
          <div className="text-5xl leading-[0.9] font-black text-red-400 mt-2 drop-shadow-xl">Don’t get caught.</div>
        </div>

        <motion.div
          animate={{ rotate: [5, 8, 5], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute right-4 top-20 bg-amber-400 text-slate-950 rounded-2xl px-4 py-3 text-base font-black shadow-2xl z-40 border-b-4 border-amber-700"
        >
          ⚠ DON&apos;T GET CAUGHT!
        </motion.div>
      </div>

      <div className="absolute left-6 top-[470px] w-44 space-y-4 z-50">
        <button
          onClick={onPlay}
          className="w-full bg-amber-400 active:scale-95 text-slate-950 rounded-2xl p-4 shadow-2xl border-b-4 border-amber-700"
        >
          <div className="font-black text-2xl">▶ PLAY</div>
          <div className="text-xs font-bold opacity-80">QUICK GAME</div>
        </button>

        <button className="w-full bg-slate-700/90 rounded-2xl p-4 shadow-xl border-b-4 border-slate-900 text-left opacity-90 relative overflow-hidden cursor-not-allowed">
          <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-1 rounded-full">SOON</div>
          <div className="font-black text-xl">🌍 MULTI</div>
          <div className="text-xs text-slate-300">PLAY WITH FRIENDS</div>
        </button>
      </div>

      <div className="absolute left-0 right-0 top-[690px] bg-slate-950/95 border-t border-white/10 p-4 pb-8 z-30">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {REWARDS.map((item) => (
            <div key={item.score} className="relative bg-slate-800 rounded-2xl p-3 text-center border border-white/10 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="relative text-3xl mb-1">{item.reward}</div>
              <div className="relative text-sm font-black text-white">{item.score}</div>
              <div className="relative text-[10px] text-amber-300 font-black mt-1 tracking-wide">{item.label}</div>
              <div className="relative h-1.5 bg-slate-950 rounded-full overflow-hidden mt-2">
                <div className="h-full w-1/2 bg-lime-400 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeachersScreen({ teacherId, setTeacherId, startGame, goHome }) {
  return (
    <div className="relative min-h-[820px] p-5 bg-gradient-to-b from-slate-900 to-black">
      <button onClick={goHome} className="mb-4 text-slate-300">← Retour</button>
      <h2 className="text-3xl font-black mb-1">Choose your teacher</h2>
      <p className="text-slate-300 mb-5">Chaque prof change le rythme de la partie.</p>
      <div className="space-y-3">
        {TEACHERS.map((teacher) => (
          <button key={teacher.id} onClick={() => setTeacherId(teacher.id)} className={`w-full text-left rounded-3xl p-4 border flex gap-4 items-center ${teacherId === teacher.id ? "bg-amber-400 text-slate-950 border-amber-200" : "bg-slate-800 border-white/10"}`}>
            <div className="text-5xl">{teacher.id === "strict" ? "👨‍🏫" : teacher.id === "sleepy" ? "👴" : "👩‍🔬"}</div>
            <div className="flex-1">
              <div className="text-xl font-black">{teacher.name}</div>
              <div className="text-sm opacity-80">{teacher.subject} · {teacher.difficulty}</div>
              <div className="text-sm mt-1 font-semibold">“{teacher.quote}”</div>
            </div>
          </button>
        ))}
      </div>
      <button onClick={startGame} className="absolute bottom-5 left-5 right-5 bg-emerald-500 rounded-2xl p-4 text-2xl font-black shadow-lg text-slate-950">START GAME</button>
    </div>
  );
}

function GameScreen({ goHome }) {
  return (
    <div className="relative min-h-[820px] bg-gradient-to-b from-slate-700 to-slate-950 p-4">
      <div className="flex items-center gap-3 bg-slate-950/80 rounded-2xl p-3 border border-white/10">
        <button className="w-12 h-12 bg-slate-800 rounded-xl">Ⅱ</button>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-black"><span>NIVEAU 1</span><span>60s</span></div>
          <div className="h-3 bg-slate-800 rounded-full mt-1"><div className="h-full w-1/3 bg-emerald-400 rounded-full" /></div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-emerald-500 p-4 text-center text-2xl font-black shadow-2xl">LE PROF NE REGARDE PAS</div>
      <div className="text-center text-[8rem] mt-10">👨‍🏫</div>

      <div className="absolute bottom-8 left-4 right-4 bg-black/80 rounded-[2rem] p-4 border border-white/10">
        <div className="flex justify-between mb-4"><b>Réputation 0</b><b>Combo x0</b></div>
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map((action) => (
            <button key={action.id} className="bg-slate-800 rounded-2xl p-3 font-black border border-white/10">
              <div className="text-3xl">{action.emoji}</div>
              <div className="text-xs">{action.label}</div>
              <div className="text-[10px] text-emerald-300">+{action.points}</div>
            </button>
          ))}
        </div>
        <button onClick={goHome} className="mt-4 w-full text-slate-300">Menu principal</button>
      </div>
    </div>
  );
}

export default function SchoolBattlePrototype() {
  const [screen, setScreen] = useState("home");
  const [teacherId, setTeacherId] = useState("strict");
  const [best] = useState(184);

  const teacher = useMemo(() => getTeacherById(teacherId), [teacherId]);
  void teacher;

  useEffect(() => {
    runTinySelfTests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-3 font-sans">
      <div className="w-full max-w-md h-[820px] bg-slate-900 rounded-[2rem] overflow-y-auto overflow-x-hidden shadow-2xl border border-white/10 relative touch-pan-y">
        {screen === "home" && <HomeScreen best={best} onPlay={() => setScreen("teachers")} />}
        {screen === "teachers" && (
          <TeachersScreen
            teacherId={teacherId}
            setTeacherId={setTeacherId}
            startGame={() => setScreen("game")}
            goHome={() => setScreen("home")}
          />
        )}
        {screen === "game" && <GameScreen goHome={() => setScreen("home")} />}
      </div>
    </div>
  );
}
