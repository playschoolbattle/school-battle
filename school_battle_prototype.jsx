import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { id: "phone", label: "Téléphone", points: 12, noise: 18, duration: 2000, emoji: "📱", color: "from-cyan-500 to-blue-600" },
  { id: "eat", label: "Manger", points: 18, noise: 12, duration: 3000, emoji: "🍔", color: "from-orange-500 to-yellow-500" },
  { id: "sleep", label: "Dormir", points: 30, noise: 24, duration: 4000, emoji: "💤", color: "from-violet-500 to-fuchsia-600" },
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
  console.assert(getTeacherById("strict").name === "Mr. Strict", "getTeacherById finds a teacher");
  console.assert(getTeacherById("unknown").id === "strict", "getTeacherById falls back to first teacher");
  console.assert(TEACHER_MOVES.writing.duration === 5000, "writing lasts 5 seconds");
  console.assert(TEACHER_MOVES.desk.duration === 3500, "desk lasts 3.5 seconds");
  console.assert(ACTIONS.find((a) => a.id === "phone")?.duration === 2000, "phone lasts 2 seconds");
  console.assert(ACTIONS.find((a) => a.id === "eat")?.duration === 3000, "eat lasts 3 seconds");
  console.assert(ACTIONS.find((a) => a.id === "sleep")?.duration === 4000, "sleep lasts 4 seconds");
  console.assert(["watching", "writing", "desk"].includes(chooseNextTeacherMove(TEACHERS[0])), "teacher move is valid");
}

function BackOfStudentHead({ activeAction }) {
  const action = ACTIONS.find((item) => item.id === activeAction);

  return (
    <motion.div
      animate={{ y: activeAction ? [0, -2, 0] : 0 }}
      transition={{ repeat: activeAction ? Infinity : 0, duration: 0.4 }}
      className="absolute left-1/2 bottom-28 z-20 h-28 w-36 -translate-x-1/2 pointer-events-none"
    >
      <div className="absolute bottom-0 left-1/2 h-5 w-32 -translate-x-1/2 rounded-t-xl border-2 border-amber-950 bg-amber-800 shadow-xl" />
      <div className="absolute bottom-4 left-1/2 h-14 w-24 -translate-x-1/2 rounded-t-3xl border-2 border-slate-700 bg-slate-950 shadow-xl" />
      <div className="absolute bottom-14 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-orange-300 bg-orange-200 shadow-xl" />
      <div className="absolute bottom-24 left-1/2 h-8 w-20 -translate-x-1/2 rounded-t-2xl border-4 border-red-900 bg-red-600 shadow-xl" />
      <div className="absolute bottom-20 left-1/2 h-6 w-9 -translate-x-1/2 rounded-full border-4 border-red-900 bg-red-600" />
      <div className="absolute bottom-20 left-1/2 h-4 w-14 -translate-x-1/2 rounded-b-2xl bg-amber-950" />
      <div className="absolute bottom-5 left-6 h-5 w-14 rotate-[-12deg] rounded-full border-2 border-slate-700 bg-slate-900" />
      <div className="absolute bottom-5 right-6 h-5 w-14 rotate-[12deg] rounded-full border-2 border-slate-700 bg-slate-900" />
      {action && <div className="absolute bottom-1 left-1/2 z-50 -translate-x-1/2 text-2xl">{action.emoji}</div>}
    </motion.div>
  );
}

function TeacherAvatar({ isLooking, teacher }) {
  const face = teacher.id === "focus" ? "👩‍🔬" : teacher.id === "sleepy" ? "👴" : "👨‍🏫";

  return (
    <motion.div
      animate={{ scale: isLooking ? 1.03 : 1, rotate: isLooking ? 0 : 30, x: isLooking ? 0 : 55 }}
      transition={{ duration: 0.25 }}
      className="absolute left-1/2 top-48 z-20 -translate-x-1/2 origin-center"
    >
      {isLooking ? (
        <div className="text-8xl drop-shadow-2xl">{face}</div>
      ) : (
        <div className="relative h-36 w-36">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-500 bg-yellow-400 shadow-2xl" />
          <div className="absolute left-1/2 top-0 h-16 w-28 -translate-x-1/2 rounded-b-full bg-gray-400" />
          <div className="absolute left-1 top-14 h-10 w-6 rounded-full bg-orange-300" />
          <div className="absolute right-1 top-14 h-10 w-6 rounded-full bg-orange-300" />
        </div>
      )}
    </motion.div>
  );
}

export default function SchoolBattlePrototype() {
  const [screen, setScreen] = useState("home");
  const [teacherId, setTeacherId] = useState("strict");
  const [teacherMove, setTeacherMove] = useState("watching");
  const [moveTimeLeft, setMoveTimeLeft] = useState(0);
  const [attention, setAttention] = useState(35);
  const [rep, setRep] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState("Attends que le prof se retourne...");
  const [activeAction, setActiveAction] = useState(null);
  const [actionTimeLeft, setActionTimeLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [paused, setPaused] = useState(false);
  const [assistMode, setAssistMode] = useState(true);

  const gameTimerRef = useRef(null);
  const teacherTimerRef = useRef(null);
  const moveCountdownRef = useRef(null);
  const actionRef = useRef(null);
  const actionCountdownRef = useRef(null);
  const activeActionRef = useRef(null);

  const teacher = useMemo(() => getTeacherById(teacherId), [teacherId]);
  const currentMove = TEACHER_MOVES[teacherMove];
  const isLooking = currentMove.looking;
  const gameActive = screen === "game" && !paused;
  const attentionPercent = Math.round((attention / teacher.tolerance) * 100);
  const currentActionData = ACTIONS.find((action) => action.id === activeAction);

  useEffect(() => {
    runTinySelfTests();
    try {
      const savedBest = window.localStorage.getItem("school-battle-best");
      if (savedBest) setBest(Number(savedBest));
    } catch {
      setBest(0);
    }
  }, []);

  const saveBest = (score) => {
    setBest((previousBest) => {
      const nextBest = Math.max(previousBest, score);
      try {
        window.localStorage.setItem("school-battle-best", String(nextBest));
      } catch {
        // Storage can be blocked in preview mode.
      }
      return nextBest;
    });
  };

  const clearAllTimers = () => {
    clearInterval(gameTimerRef.current);
    clearTimeout(teacherTimerRef.current);
    clearInterval(moveCountdownRef.current);
    clearTimeout(actionRef.current);
    clearInterval(actionCountdownRef.current);
  };

  const resetGame = () => {
    clearAllTimers();
    setTeacherMove("watching");
    setMoveTimeLeft(TEACHER_MOVES.watching.duration / 1000);
    setAttention(35);
    setRep(0);
    setCombo(0);
    setMessage("Attends que le prof se retourne...");
    activeActionRef.current = null;
    setActiveAction(null);
    setActionTimeLeft(0);
    setTimeLeft(60);
    setPaused(false);
    setScreen("game");
  };

  const caught = (reason = "Grillé !") => {
    clearAllTimers();
    activeActionRef.current = null;
    setActiveAction(null);
    setActionTimeLeft(0);
    setMessage(reason);
    setScreen("caught");
    saveBest(rep);
  };

  useEffect(() => {
    if (!gameActive) return undefined;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearAllTimers();
          setScreen("win");
          saveBest(rep);
          return 0;
        }
        return currentTime - 1;
      });
      setAttention((currentAttention) => clamp(currentAttention - 3, 0, teacher.tolerance));
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameActive, rep, teacher.tolerance]);

  useEffect(() => {
    if (!gameActive) return undefined;

    const startMove = (move) => {
      const moveData = TEACHER_MOVES[move];
      setTeacherMove(move);
      setMoveTimeLeft(moveData.duration / 1000);
      setMessage(moveData.looking ? "Le prof regarde ! Ne bouge plus." : `${moveData.label}... GO !`);

      if (moveData.looking && activeActionRef.current) {
        caught("Le prof s'est retourné pendant ton action !");
        return;
      }

      clearTimeout(teacherTimerRef.current);
      teacherTimerRef.current = setTimeout(() => {
        startMove(chooseNextTeacherMove(teacher));
      }, moveData.duration);
    };

    startMove("writing");
    return () => clearTimeout(teacherTimerRef.current);
  }, [gameActive, teacher]);

  useEffect(() => {
    if (!gameActive) return undefined;

    moveCountdownRef.current = setInterval(() => {
      setMoveTimeLeft((currentTime) => Math.max(0, Number((currentTime - 0.1).toFixed(1))));
    }, 100);

    return () => clearInterval(moveCountdownRef.current);
  }, [gameActive, teacherMove]);

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const doAction = (action) => {
    if (!gameActive || activeAction) return;

    if (isLooking) {
      setAttention((currentAttention) => clamp(currentAttention + action.noise + 30, 0, teacher.tolerance));
      caught(`${action.label} devant le prof... mauvaise idée.`);
      return;
    }

    if (assistMode && moveTimeLeft < action.duration / 1000) {
      setMessage(`Mode facile : trop risqué, ${action.label} prend ${action.duration / 1000}s.`);
      return;
    }

    activeActionRef.current = action.id;
    setActiveAction(action.id);
    setActionTimeLeft(action.duration / 1000);
    setMessage(`${action.emoji} ${action.label} en douce...`);

    actionCountdownRef.current = setInterval(() => {
      setActionTimeLeft((currentTime) => Math.max(0, Number((currentTime - 0.1).toFixed(1))));
    }, 100);

    actionRef.current = setTimeout(() => {
      clearInterval(actionCountdownRef.current);
      activeActionRef.current = null;
      setActiveAction(null);
      setActionTimeLeft(0);
      setCombo((currentCombo) => currentCombo + 1);
      setRep((currentRep) => currentRep + action.points + combo);
      setAttention((currentAttention) => {
        const nextAttention = clamp(currentAttention + action.noise, 0, teacher.tolerance);
        if (nextAttention >= teacher.tolerance) {
          setTimeout(() => caught("Trop de bruit. Le prof t'a capté."), 50);
        }
        return nextAttention;
      });
      setMessage("Bien joué. Reste discret.");
    }, action.duration);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-3 font-sans">
      <div className="w-full max-w-md h-[820px] bg-slate-900 rounded-[2rem] overflow-y-auto overflow-x-hidden shadow-2xl border border-white/10 relative touch-pan-y">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(59,130,246,.22),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,.18),transparent_30%)] pointer-events-none" />

        {screen === "home" && (
          <div className="relative min-h-[920px] overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-black">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,.45),transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,.25),rgba(15,23,42,.9))]" />

            <div className="absolute top-5 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3 bg-slate-950/75 backdrop-blur rounded-2xl px-3 py-2 border border-white/10 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-2xl">🧢</div>
                <div>
                  <div className="font-black text-sm">NoobMaster</div>
                  <div className="text-[11px] text-slate-300">{best}/2000</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 font-black text-cyan-300">💎 165</div>
                <button className="w-12 h-12 rounded-xl bg-slate-950/70 border border-white/10 text-xl">⚙️</button>
              </div>
            </div>

            <div className="absolute top-28 left-5 z-20">
              <div className="text-6xl leading-none font-black tracking-tight text-white drop-shadow-2xl">SCHOOL</div>
              <div className="text-5xl leading-none font-black tracking-tight text-amber-400 drop-shadow-2xl -mt-1">BATTLE</div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-52 w-[92%] h-[360px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-slate-700 to-slate-950">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,130,246,.12),rgba(15,23,42,.85))]" />
              <div className="absolute left-10 bottom-8 text-[11rem] drop-shadow-2xl">🧑‍🎓</div>
              <div className="absolute right-8 bottom-8 text-[11rem] drop-shadow-2xl">👧</div>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute left-1/2 -translate-x-1/2 bottom-10 text-7xl drop-shadow-2xl">📱</motion.div>
              <div className="absolute top-8 left-8 bg-black/45 backdrop-blur rounded-2xl px-4 py-2 border border-white/10">
                <div className="text-xs text-slate-300 font-black">BEST FRIENDS</div>
                <div className="text-2xl font-black text-white">Ready for chaos.</div>
              </div>
              <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute right-8 top-8 bg-amber-400 text-slate-950 rounded-2xl px-4 py-3 font-black shadow-xl">DON'T GET CAUGHT!</motion.div>
            </div>

            <div className="absolute left-4 top-[360px] w-40 space-y-3 z-20">
              <button onClick={() => setScreen("teachers")} className="w-full bg-amber-400 active:scale-95 text-slate-950 rounded-2xl p-4 shadow-2xl border-b-4 border-amber-700">
                <div className="font-black text-2xl">▶ PLAY</div>
                <div className="text-xs font-bold opacity-80">QUICK GAME</div>
              </button>
              <button className="w-full bg-blue-600 active:scale-95 rounded-2xl p-4 shadow-xl border-b-4 border-blue-900 text-left">
                <div className="font-black text-xl">🌍 MULTI</div>
                <div className="text-xs text-blue-100">PLAY WITH FRIENDS</div>
              </button>
              <button className="w-full bg-purple-600 active:scale-95 rounded-2xl p-4 shadow-xl border-b-4 border-purple-900 text-left">
                <div className="font-black text-xl">🎉 EVENTS</div>
                <div className="text-xs text-purple-100">LIVE CHALLENGES</div>
              </button>
            </div>

            <div className="absolute left-0 right-0 top-[650px] bg-slate-950/95 border-t border-white/10 p-4 pb-8 z-20">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[2000, 2500, 3000, 4000].map((value) => (
                  <div key={value} className="bg-slate-800 rounded-2xl p-3 text-center border border-white/10">
                    <div className="text-2xl">📦</div>
                    <div className="text-xs font-black mt-1">{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-lime-400 rounded-3xl p-4 text-slate-950 shadow-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black">NEW SEASON</div>
                  <div className="font-black text-xl">SCHOOL'S OUT</div>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs font-black text-slate-300 pb-4">
                <button className="bg-slate-800 rounded-xl py-4 border border-white/10 min-h-[64px]">🏠<br />HOME</button>
                <button onClick={() => setScreen("customize")} className="bg-slate-800 rounded-xl py-4 border border-white/10 min-h-[64px]">🎒<br />SHOP</button>
                <button className="bg-slate-800 rounded-xl py-4 border border-white/10 min-h-[64px]">🏆<br />RANK</button>
                <button className="bg-slate-800 rounded-xl py-4 border border-white/10 min-h-[64px]">👥<br />SOCIAL</button>
              </div>
            </div>
          </div>
        )}

        {screen === "teachers" && (
          <div className="relative min-h-[820px] p-5">
            <button onClick={() => setScreen("home")} className="mb-4 text-slate-300">← Retour</button>
            <h2 className="text-3xl font-black mb-1">Choisis ton prof</h2>
            <p className="text-slate-300 mb-5">Chaque prof change le rythme de la partie.</p>
            <div className="space-y-3">
              {TEACHERS.map((item) => (
                <button key={item.id} onClick={() => setTeacherId(item.id)} className={`w-full text-left rounded-3xl p-4 border flex gap-4 items-center ${teacherId === item.id ? "bg-amber-400 text-slate-950 border-amber-200" : "bg-slate-800 border-white/10"}`}>
                  <div className="text-5xl">{item.id === "strict" ? "👨‍🏫" : item.id === "sleepy" ? "👴" : "👩‍🔬"}</div>
                  <div className="flex-1">
                    <div className="text-xl font-black">{item.name}</div>
                    <div className="text-sm opacity-80">{item.subject} · {item.difficulty}</div>
                    <div className="text-sm mt-1 font-semibold">“{item.quote}”</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={resetGame} className="absolute bottom-5 left-5 right-5 bg-emerald-500 rounded-2xl p-4 text-2xl font-black shadow-lg">LANCER LA PARTIE</button>
          </div>
        )}

        {screen === "customize" && (
          <div className="relative min-h-[820px] p-5">
            <button onClick={() => setScreen("home")} className="mb-4 text-slate-300">← Retour</button>
            <h2 className="text-3xl font-black">Personnalise ton élève</h2>
            <p className="text-slate-300 mb-5">MVP visuel : options payantes plus tard.</p>
            <div className="bg-slate-800 rounded-[2rem] p-5 border border-white/10 text-center">
              <div className="text-[9rem]">🧑‍🎓</div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-blue-500 rounded-2xl p-3 font-black">Garçon</button>
                <button className="bg-pink-500 rounded-2xl p-3 font-black">Fille</button>
              </div>
            </div>
          </div>
        )}

        {screen === "game" && (
          <div className="relative min-h-[820px] flex flex-col">
            <div className="relative z-10 p-3 flex items-center gap-3 bg-slate-950/80 backdrop-blur border-b border-white/10">
              <button onClick={() => setPaused((value) => !value)} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10">{paused ? "▶" : "Ⅱ"}</button>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black mb-1"><span>NIVEAU 1</span><span>{timeLeft}s</span></div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div className={`h-full ${attentionPercent > 75 ? "bg-red-500" : attentionPercent > 45 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${attentionPercent}%` }} />
                </div>
                <div className="text-[10px] text-slate-300 mt-1">Attention du prof</div>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950">
              <div className="absolute inset-x-6 top-16 h-40 rounded-b-2xl bg-slate-600 border-b-8 border-slate-700 shadow-2xl">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-4xl font-black tracking-tight drop-shadow-lg">2x + 4 = 12</div>
              </div>

              <div className={`absolute top-10 left-4 right-4 rounded-2xl p-4 text-center font-black text-2xl shadow-2xl border-b-4 ${isLooking ? "bg-red-500 border-red-800" : "bg-emerald-500 border-emerald-800"}`}>
                <div>{isLooking ? "LE PROF REGARDE !" : "LE PROF NE REGARDE PAS"}</div>
                <div className="text-sm mt-1 opacity-90 font-bold">{currentMove.label}</div>
              </div>

              <div className="absolute top-28 right-16 text-5xl rotate-12">✏️</div>
              <TeacherAvatar isLooking={isLooking} teacher={teacher} />

              <div className="absolute top-[210px] left-1/2 -translate-x-1/2 w-52 h-3 bg-slate-950/60 rounded-full overflow-hidden border border-white/10 z-40">
                <motion.div key={`${teacherMove}-${screen}`} initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: currentMove.duration / 1000, ease: "linear" }} className={`h-full ${isLooking ? "bg-red-400" : teacherMove === "writing" ? "bg-emerald-400" : "bg-amber-400"}`} />
              </div>
              <div className="absolute top-[228px] left-1/2 -translate-x-1/2 text-sm font-black text-white/90 z-40">≈ {moveTimeLeft.toFixed(1)}s avant changement</div>

              {isLooking && <div className="absolute top-[360px] left-1/2 -translate-x-1/2 text-red-500 text-8xl font-black animate-pulse z-30">!</div>}

              <div className="absolute left-0 right-0 bottom-0 h-[420px] bg-gradient-to-b from-transparent to-black" />
              <BackOfStudentHead activeAction={activeAction} />

              <AnimatePresence>
                {activeAction && (
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute bottom-[360px] left-1/2 translate-x-16 z-30">
                    <div className="relative w-24 h-24 rounded-full bg-black/75 border-4 border-white/20 flex flex-col items-center justify-center shadow-2xl">
                      <div className="text-5xl">{ACTIONS.find((action) => action.id === activeAction)?.emoji}</div>
                      <div className="absolute -bottom-3 bg-amber-400 text-slate-950 rounded-xl px-3 py-1 text-sm font-black">{actionTimeLeft.toFixed(1)}s</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-6 left-3 right-3 bg-black/75 backdrop-blur rounded-[2rem] border border-white/10 p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-3">
                  <div><div className="text-xs text-slate-300">Réputation</div><div className="text-3xl font-black">{rep}</div></div>
                  <div className="text-right"><div className="text-xs text-slate-300">Combo</div><div className="text-2xl font-black text-amber-400">x{combo}</div></div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="text-sm text-slate-200 min-h-5 flex-1">{message}</div>
                  <button onClick={() => setAssistMode((value) => !value)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black border ${assistMode ? "bg-emerald-500 text-slate-950 border-emerald-300" : "bg-red-500 text-white border-red-300"}`}>{assistMode ? "FACILE" : "DIFFICILE"}</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIONS.map((action) => (
                    <button key={action.id} onClick={() => doAction(action)} disabled={!!activeAction || paused} className="bg-slate-800 active:scale-95 disabled:opacity-50 rounded-2xl p-3 border border-white/10 flex flex-col items-center gap-1 font-black relative overflow-hidden">
                      <div className={`absolute inset-0 opacity-20 bg-gradient-to-b ${action.color}`} />
                      <span className="text-3xl relative z-10">{action.emoji}</span>
                      <span className="text-xs relative z-10">{action.label}</span>
                      <span className="text-[10px] text-emerald-300 relative z-10">+{action.points}</span>
                      <span className="text-[10px] text-slate-300 relative z-10">{(action.duration / 1000).toFixed(0)}s</span>
                      {activeAction === action.id && (
                        <>
                          <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: action.duration / 1000, ease: "linear" }} className="absolute bottom-0 left-0 h-2 bg-white" />
                          <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-20"><div className="bg-amber-400 text-slate-950 rounded-xl px-3 py-1 text-lg font-black">{actionTimeLeft.toFixed(1)}s</div></div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                {currentActionData && (
                  <div className="mt-3 bg-slate-900/70 rounded-xl p-2 border border-white/10 text-center">
                    <div className="text-xs text-slate-300">Action en cours</div>
                    <div className="font-black text-lg">{currentActionData.emoji} {currentActionData.label}</div>
                    <div className="text-xs text-amber-300">Temps restant : {actionTimeLeft.toFixed(1)}s</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(screen === "caught" || screen === "win") && (
          <div className="relative min-h-[820px] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,.12),transparent_40%)]" />
            {screen === "caught" ? (
              <>
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: [1, 1.08, 1], opacity: 1 }} transition={{ repeat: Infinity, duration: 1.2 }} className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-red-500 blur-3xl opacity-40 scale-125" />
                  <motion.div animate={{ rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 0.22 }} className="relative w-56 h-56 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-[10px] border-red-300 shadow-[0_0_80px_rgba(239,68,68,.6)] flex items-center justify-center overflow-hidden">
                    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-[8rem] drop-shadow-2xl">{teacher.id === "focus" ? "👩‍🔬" : teacher.id === "sleepy" ? "👴" : "👨‍🏫"}</motion.div>
                    <motion.div animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ repeat: Infinity, duration: 0.4 }} className="absolute inset-0 bg-white" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [1, 1.04, 1], opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-6xl font-black mb-3 text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,.7)]">CAUGHT!</motion.div>
              </>
            ) : (
              <>
                <motion.div animate={{ rotate: [-8, 8, -8], y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-[10rem] mb-2">🏆</motion.div>
                <div className="text-5xl font-black mb-3 text-amber-400">SURVÉCU !</div>
              </>
            )}
            <p className="text-slate-200 mb-6 text-lg relative z-10">{message}</p>
            <div className="bg-slate-800/90 backdrop-blur rounded-3xl p-5 border border-white/10 w-full mb-5 relative z-10 shadow-2xl">
              <div className="flex justify-between text-lg"><span>Score</span><b>{rep}</b></div>
              <div className="flex justify-between mt-2 text-lg"><span>Meilleur</span><b>{Math.max(best, rep)}</b></div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={resetGame} className="w-full bg-amber-400 text-slate-950 rounded-2xl p-4 font-black text-2xl shadow-[0_10px_30px_rgba(251,191,36,.35)] relative z-10">↻ REJOUER</motion.button>
            <button onClick={() => setScreen("home")} className="mt-4 text-slate-300 relative z-10 hover:text-white transition-colors">Menu principal</button>
          </div>
        )}
      </div>
    </div>
  );
}
