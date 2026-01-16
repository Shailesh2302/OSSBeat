export default function RunningWhiteDog() {
  return (
    <div className="dog-track">
      <svg
        className="dog"
        width="64"
        height="26"
        viewBox="0 0 64 26"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail */}
        <rect x="0" y="9" width="6" height="3" fill="white" className="tail" />

        {/* Body */}
        <rect x="6" y="8" width="30" height="9" fill="white" className="body" />

        {/* Head */}
        <rect x="36" y="6" width="14" height="12" fill="white" className="head" />
        <rect x="38" y="2" width="3" height="4" fill="white" /> {/* ear */}
        <rect x="43" y="10" width="2" height="2" fill="black" /> {/* eye */}
        <rect x="50" y="10" width="4" height="4" fill="white" /> {/* snout */}

        {/* Legs */}
        <rect x="10" y="17" width="3" height="9" fill="white" className="leg front a" />
        <rect x="16" y="17" width="3" height="9" fill="white" className="leg front b" />
        <rect x="26" y="17" width="3" height="9" fill="white" className="leg back b" />
        <rect x="32" y="17" width="3" height="9" fill="white" className="leg back a" />
      </svg>

      <style>{`
        /* ZERO spacing */
        .dog-track {
          position: relative;
          width: 100%;
          height: 26px;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .dog {
          position: absolute;
          top: 0;
          left: -64px;
          animation: move 9.8s linear infinite;
        }

        /* ===== WORLD MOTION ===== */

        @keyframes move {
          from { transform: translateX(0); }
          to { transform: translateX(110vw); }
        }

        /* ===== BODY BOB ===== */

        .body {
          animation: bodyBob 0.6s infinite ease-in-out;
        }

        .head {
          animation: headBob 0.6s infinite ease-in-out;
        }

        @keyframes bodyBob {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }

        @keyframes headBob {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(0.5px); }
          100% { transform: translateY(0); }
        }

        /* ===== LEGS ===== */

        .leg {
          transform-origin: top;
        }

        .leg.front.a,
        .leg.back.a {
          animation: strideA 0.4s infinite ease-in-out;
        }

        .leg.front.b,
        .leg.back.b {
          animation: strideB 0.4s infinite ease-in-out;
        }

        @keyframes strideA {
          0%   { transform: rotate(20deg); }
          50%  { transform: rotate(-10deg); }
          100% { transform: rotate(20deg); }
        }

        @keyframes strideB {
          0%   { transform: rotate(-10deg); }
          50%  { transform: rotate(20deg); }
          100% { transform: rotate(-10deg); }
        }

        /* ===== TAIL (FOLLOW-THROUGH) ===== */

        .tail {
          transform-origin: right center;
          animation: tailFollow 0.6s infinite ease-in-out;
        }

        @keyframes tailFollow {
          0%   { transform: rotate(6deg); }
          50%  { transform: rotate(-10deg); }
          100% { transform: rotate(6deg); }
        }
      `}</style>
    </div>
  );
}
