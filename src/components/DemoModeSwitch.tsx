import { useNavigate } from "react-router-dom";

export function DemoModeSwitch({ mode }: { mode: "rogers" | "verizon" }) {
  const navigate = useNavigate();
  const buttonClass = "rounded-md px-2.5 py-1.5 text-xs font-semibold transition";

  return (
    <div className="demo-mode-switch flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 p-1" role="group" aria-label="Choose demo experience">
      <button
        type="button"
        aria-pressed={mode === "rogers"}
        className={`${buttonClass} ${mode === "rogers" ? "bg-rogers text-white" : "text-slate-700 hover:bg-white"}`}
        onClick={() => navigate("/")}
      >
        Rogers
      </button>
      <button
        type="button"
        aria-pressed={mode === "verizon"}
        className={`${buttonClass} ${mode === "verizon" ? "bg-red-600 text-white" : "text-slate-700 hover:bg-white"}`}
        onClick={() => navigate("/verizon")}
      >
        Verizon Business Group
      </button>
    </div>
  );
}
