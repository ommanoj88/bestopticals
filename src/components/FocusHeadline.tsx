// Static "focus lens" headline. The whole line is rendered twice, stacked:
//   • bottom layer: softly blurred = uncorrected vision
//   • top layer: sharp, but revealed ONLY inside a fixed circular lens (CSS mask)
// A black lens ring + glass sheen sits exactly over the reveal. Static and
// server-rendered — no cursor tracking, works everywhere, verifiable.
// The metaphor is the promise: through our lens, the world is clear.

type Props = {
  lines: [string, string] // two headline lines
  lensX?: number // lens centre X, % (default 62)
  lensY?: number // lens centre Y, % (default 56)
  lensR?: number // lens radius, px (default 150)
}

export function FocusHeadline({ lines, lensX = 62, lensY = 56, lensR = 150 }: Props) {
  const mask = `radial-gradient(circle ${lensR}px at ${lensX}% ${lensY}%, #000 0%, #000 74%, transparent 100%)`
  const content = (
    <>
      {lines[0]}
      <br />
      {lines[1]}
    </>
  )

  return (
    <div className="relative">
      {/* blurred (uncorrected) layer */}
      <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-chalk/70 [filter:blur(4px)] sm:text-8xl">
        {content}
      </h1>

      {/* sharp layer, revealed only inside the lens */}
      <h1
        aria-hidden
        className="absolute inset-0 font-display text-5xl leading-[0.95] tracking-tight text-chalk sm:text-8xl"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {content}
      </h1>

      {/* the lens: black ring + glass sheen, centred on the reveal */}
      <span
        aria-hidden
        className="pointer-events-none absolute border-[1.5px] border-chalk"
        style={{
          left: `${lensX}%`,
          top: `${lensY}%`,
          width: lensR * 2,
          height: lensR * 2,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          boxShadow: 'inset 0 2px 16px rgba(12,15,22,0.10), 0 18px 50px -18px rgba(12,15,22,0.55)',
          background: 'radial-gradient(130% 130% at 30% 22%, rgba(255,255,255,0.5), rgba(255,255,255,0) 52%)',
        }}
      />
    </div>
  )
}
