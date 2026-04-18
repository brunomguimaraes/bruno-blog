"use client";

import { useEasterEggs } from "./context";

export default function CyberterrorAlert() {
  const { alarmOpen } = useEasterEggs();
  return (
    <div className={"alarm" + (alarmOpen ? " show" : "")} aria-hidden={!alarmOpen}>
      <div className="flash" />
      <div className="scanbars" />
      <div className="noise" />
      <div className="msg">
        <div className="code">ERR 0xBRC · TRACE: OUTER DARK</div>
        <h2>SIGNATURE DETECTED</h2>
        <div className="det">Hostile signature inbound. Shields up.</div>
        <div className="bar"><i /></div>
      </div>
    </div>
  );
}
