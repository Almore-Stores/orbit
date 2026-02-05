import { atom } from "recoil";

const getInitialTheme = (): "light" | "dark" => {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("theme");
		if (stored === "dark" || stored === "light") return stored;
	}
<<<<<<< HEAD
	return "dark"; // fallback default -- yes BLACK MODE. because light is a crime in society
=======
	return "dark"; // fallback default
>>>>>>> df5fe157747e255433e6e19194f21e4b1a0e229f
};

const __global = globalThis as any;
__global.__recoilAtoms = __global.__recoilAtoms || {};

export const themeState = __global.__recoilAtoms.themeState || (__global.__recoilAtoms.themeState = atom<"light" | "dark">({
	key: "themeState",
	default: getInitialTheme(),
}));
