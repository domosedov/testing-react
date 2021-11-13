import { atom } from "jotai";

export const atomScope = Symbol();

export const count = atom(0);
