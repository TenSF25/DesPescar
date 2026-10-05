interface KoiAvatarProps {
  /** KOI está respondiendo: el tecleo y las chispas se aceleran. */
  working?: boolean;
  /** Easter egg del mareo: reemplaza temporalmente la animación de tecleo. */
  dizzy?: boolean;
}

const AVATAR_STYLES = `
  @keyframes koi-typing-bob {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(-1deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  @keyframes koi-spark {
    0%, 100% { opacity: 0; transform: scale(0.3); }
    40% { opacity: 1; transform: scale(1); }
    70% { opacity: 0.2; transform: scale(0.6); }
  }
  @keyframes koi-click {
    0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.2); }
    70%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
  }
  @keyframes koi-dizzy-spin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.8); }
    100% { transform: rotate(360deg) scale(1); }
  }

  .koi-avatar-bob { animation: koi-typing-bob 0.7s steps(2, jump-none) infinite; }
  .koi-avatar-spark {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: #fbbf24;
    box-shadow: 0 0 5px 1px #f97316;
    opacity: 0;
    animation: koi-spark 0.9s ease-in-out infinite;
  }
  .koi-avatar-click {
    position: absolute;
    left: 50%;
    top: 90%;
    width: 12px;
    height: 12px;
    border: 1.5px solid #fde68a;
    border-radius: 9999px;
    opacity: 0;
    animation: koi-click 1.4s ease-out infinite;
  }
  .koi-avatar-working .koi-avatar-bob { animation-duration: 0.35s; }
  .koi-avatar-working .koi-avatar-spark { animation-duration: 0.45s; }
  .koi-avatar-working .koi-avatar-click { animation-duration: 0.7s; }
  .koi-avatar-dizzy { animation: koi-dizzy-spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

  @media (prefers-reduced-motion: reduce) {
    .koi-avatar-bob, .koi-avatar-dizzy { animation: none !important; }
    .koi-avatar-spark, .koi-avatar-click { animation: none !important; opacity: 0 !important; }
  }
`;

export default function KoiAvatar({ working = false, dizzy = false }: KoiAvatarProps) {
  return (
    <>
      <style>{AVATAR_STYLES}</style>
      <span
        className={`relative block aspect-360/325 w-16 ${working ? 'koi-avatar-working' : ''} ${
          dizzy ? 'koi-avatar-dizzy' : 'koi-avatar-bob'
        }`}
      >
        <img src="/koi/koi.webp" alt="" className="h-full w-full object-contain" />
        <span aria-hidden="true" className="koi-avatar-spark" style={{ left: '8%', top: '74%' }} />
        <span
          aria-hidden="true"
          className="koi-avatar-spark"
          style={{ left: '15%', top: '79%', animationDelay: '0.3s' }}
        />
        <span
          aria-hidden="true"
          className="koi-avatar-spark"
          style={{ left: '21%', top: '73%', animationDelay: '0.6s' }}
        />
        <span aria-hidden="true" className="koi-avatar-click" />
      </span>
    </>
  );
}
