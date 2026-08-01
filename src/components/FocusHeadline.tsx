// Static "focus lens" headline. The whole line is rendered twice, stacked:
//   • bottom layer: softly blurred = uncorrected vision
//   • top layer: sharp, but revealed ONLY inside a fixed circular lens (CSS mask)
// A black lens ring + glass sheen sits exactly over the reveal. Static and
// server-rendered — no cursor tracking, works everywhere, verifiable.
// The metaphor is the promise: through our lens, the world is clear.

type Props = {
  lines: [string, string] // two headline lines
  accentWord?: string // a word (in either line) rendered in the accent colour
  lensX?: number // lens centre X, %
  lensY?: number // lens centre Y, %
  lensR?: number // lens radius, px
}

// render a line, colouring `accentWord` if present
function renderLine(line: string, accentWord?: string) {
  if (!accentWord || !line.includes(accentWord)) return line
  const [pre, ...rest] = line.split(accentWord)
  return (
    <>
      {pre}
      <span className="text-accent">{accentWord}</span>
      {rest.join(accentWord)}
    </>
  )
}

export function FocusHeadline({ lines, accentWord, lensX = 50, lensY = 50, lensR = 150 }: Props) {
  const mask = `radial-gradient(circle ${lensR}px at ${lensX}% ${lensY}%, #000 0%, #000 74%, transparent 100%)`
  const content = (
    <>
      {renderLine(lines[0], accentWord)}
      <br />
      {renderLine(lines[1], accentWord)}
    </>
  )

  // pb + relaxed leading so descenders (the "y" in perfectly/clear) never clip
  const typeClass =
    'font-display text-5xl leading-[1.02] tracking-tight pb-[0.12em] sm:text-8xl'

  return (
    <div className="relative">
      {/* blurred (uncorrected) layer */}
      <h1 className={`${typeClass} text-void/70 [filter:blur(4px)]`}>{content}</h1>

      {/* sharp layer, revealed only inside the lens */}
      <h1
        aria-hidden
        className={`absolute inset-0 ${typeClass} text-void`}
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {content}
      </h1>

      {/* the lens: black ring + glass sheen, centred on the reveal */}
      <span
        aria-hidden
        className="pointer-events-none absolute border-[1.5px] border-void"
        style={{
          left: `${lensX}%`,
          top: `${lensY}%`,
          width: lensR * 2,
          height: lensR * 2,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          boxShadow: 'inset 0 2px 16px rgba(10,10,10,0.10), 0 18px 50px -18px rgba(10,10,10,0.45)',
          background: 'radial-gradient(130% 130% at 30% 22%, rgba(255,255,255,0.55), rgba(255,255,255,0) 52%)',
        }}
      />
    </div>
  )
}
