import { useEffect, useMemo, useState } from 'react';
import {
  contrastRatio,
  formatOklch,
  type Oklch,
  oklchToRgb,
  parseOklch,
  wcagRating,
} from '../../../lib/color';

/** The tokens the studio exposes for live editing. */
const EDITABLE_TOKENS = [
  '--paper',
  '--surface',
  '--ink',
  '--ink-muted',
  '--shu',
  '--shu-strong',
] as const;
type TokenName = (typeof EDITABLE_TOKENS)[number];

type TokenState = Record<TokenName, Oklch>;

const FALLBACKS: TokenState = {
  '--paper': { l: 0.972, c: 0.005, h: 85 },
  '--surface': { l: 0.99, c: 0.003, h: 85 },
  '--ink': { l: 0.26, c: 0.012, h: 60 },
  '--ink-muted': { l: 0.47, c: 0.012, h: 60 },
  '--shu': { l: 0.585, c: 0.165, h: 36 },
  '--shu-strong': { l: 0.52, c: 0.17, h: 36 },
};

function readCurrentTokens(): TokenState {
  const styles = getComputedStyle(document.documentElement);
  const state = { ...FALLBACKS };
  for (const name of EDITABLE_TOKENS) {
    const parsed = parseOklch(styles.getPropertyValue(name));
    if (parsed) state[name] = parsed;
  }
  return state;
}

export default function TokenStudio() {
  const [tokens, setTokens] = useState<TokenState>(FALLBACKS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTokens(readCurrentTokens());
  }, []);

  function update(name: TokenName, channel: keyof Oklch, value: number) {
    setTokens((prev) => {
      const next = { ...prev, [name]: { ...prev[name], [channel]: value } };
      document.documentElement.style.setProperty(name, formatOklch(next[name]));
      return next;
    });
  }

  function reset() {
    for (const name of EDITABLE_TOKENS) {
      document.documentElement.style.removeProperty(name);
    }
    setTokens(readCurrentTokens());
  }

  const cssBlock = useMemo(() => {
    const lines = EDITABLE_TOKENS.map((n) => `  ${n}: ${formatOklch(tokens[n])};`);
    return `:root {\n${lines.join('\n')}\n}`;
  }, [tokens]);

  async function copyCss() {
    await navigator.clipboard.writeText(cssBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const inkOnPaper = contrastRatio(oklchToRgb(tokens['--ink']), oklchToRgb(tokens['--paper']));
  const shuOnPaper = contrastRatio(
    oklchToRgb(tokens['--shu-strong']),
    oklchToRgb(tokens['--paper']),
  );

  return (
    <div className="ts">
      <p className="ts-note">
        These sliders edit this page's real CSS custom properties: the whole site re-themes as you
        drag. Reset puts the stylesheet back in charge.
      </p>

      <div className="ts-badges" aria-live="polite">
        <Badge label="ink on paper" ratio={inkOnPaper} />
        <Badge label="shu-strong on paper" ratio={shuOnPaper} />
      </div>

      <div className="ts-grid">
        {EDITABLE_TOKENS.map((name) => (
          <fieldset key={name} className="ts-token">
            <legend>
              <span
                className="ts-swatch"
                style={{ background: `var(${name})` }}
                aria-hidden="true"
              />
              <code>{name}</code>
            </legend>
            <Slider
              id={`${name}-l`}
              label="L"
              min={0}
              max={1}
              step={0.005}
              value={tokens[name].l}
              onChange={(v) => update(name, 'l', v)}
            />
            <Slider
              id={`${name}-c`}
              label="C"
              min={0}
              max={0.3}
              step={0.005}
              value={tokens[name].c}
              onChange={(v) => update(name, 'c', v)}
            />
            <Slider
              id={`${name}-h`}
              label="H"
              min={0}
              max={360}
              step={1}
              value={tokens[name].h}
              onChange={(v) => update(name, 'h', v)}
            />
          </fieldset>
        ))}
      </div>

      <pre className="ts-css">
        <code>{cssBlock}</code>
      </pre>

      <div className="ts-actions">
        <button type="button" className="btn btn-fill" onClick={copyCss}>
          {copied ? 'Copied ✓' : 'Copy CSS'}
        </button>
        <button type="button" className="btn" onClick={reset}>
          Reset tokens
        </button>
      </div>

      <style>{`
        .ts { max-width: 860px; }
        .ts-note { color: var(--ink-muted); max-width: 60ch; }
        .ts-badges { display: flex; gap: .8rem; flex-wrap: wrap; margin-top: 1.4rem; }
        .ts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.2rem; margin-top: 1.6rem; }
        .ts-token { border: 1px solid var(--line); padding: 1rem; margin: 0; }
        .ts-token legend { display: flex; align-items: center; gap: .5rem; font-family: var(--font-mono); font-size: .78rem; padding: 0 .4rem; }
        .ts-swatch { width: 14px; height: 14px; border: 1px solid var(--line); display: inline-block; }
        .ts-row { display: grid; grid-template-columns: 1.2rem 1fr 3.4rem; align-items: center; gap: .6rem; margin-top: .5rem; font-family: var(--font-mono); font-size: .74rem; }
        .ts-row input[type="range"] { width: 100%; accent-color: var(--shu); min-height: 24px; }
        .ts-css { background: var(--surface-sunk); padding: 1rem 1.2rem; margin-top: 1.8rem; overflow-x: auto; font-family: var(--font-mono); font-size: .8rem; border-radius: var(--radius-1); }
        .ts-actions { display: flex; gap: .8rem; margin-top: 1.2rem; }
        .ts-badge { font-family: var(--font-mono); font-size: .74rem; border: 1px solid var(--line); padding: .35rem .7rem; display: inline-flex; gap: .5rem; align-items: center; }
        .ts-badge[data-rating="FAIL"] { border-color: var(--shu); color: var(--shu-strong); }
        .ts-badge[data-rating="AA"], .ts-badge[data-rating="AAA"] { color: var(--ink-muted); }
      `}</style>
    </div>
  );
}

function Slider(props: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="ts-row" htmlFor={props.id}>
      <span>{props.label}</span>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.currentTarget.value))}
      />
      <span>{props.value.toFixed(props.step >= 1 ? 0 : 3)}</span>
    </label>
  );
}

function Badge({ label, ratio }: { label: string; ratio: number }) {
  const rating = wcagRating(ratio);
  return (
    <span className="ts-badge" data-rating={rating}>
      {label}: {ratio.toFixed(2)}:1 · {rating}
    </span>
  );
}
