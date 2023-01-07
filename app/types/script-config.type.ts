import { DetailedHTMLProps, ScriptHTMLAttributes } from "react";

export type ScriptConfig = DetailedHTMLProps<
    ScriptHTMLAttributes<HTMLScriptElement>, 
    HTMLScriptElement
> & {
    label: string;
    repo: string;
    theme: string;
    'issue-term': string;
};