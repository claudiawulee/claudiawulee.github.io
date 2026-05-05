function getSessionTimes() {
  return [
    { id: "sun-afternoon", day: 0, start: 13 * 60 + 30, end: 16 * 60 + 30, label: "Sunday (1:30–4:30 PM)" },
    { id: "sun-evening", day: 0, start: 19 * 60 + 30, end: 22 * 60 + 30, label: "Sunday (7:30–10:30 PM)" },
    { id: "mon-evening", day: 1, start: 19 * 60 + 30, end: 22 * 60 + 30, label: "Monday (7:30–10:30 PM)" },
    { id: "tue-evening", day: 2, start: 19 * 60 + 30, end: 22 * 60 + 30, label: "Tuesday (7:30–10:30 PM)" },
    { id: "wed-evening", day: 3, start: 19 * 60 + 30, end: 22 * 60 + 30, label: "Wednesday (7:30–10:30 PM)" }
  ];
}

function formatCountdown(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function updateSessionBanner() {
  const banner = document.getElementById("session-banner");
  if (!banner) return;

  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sessions = getSessionTimes();

  // 1. Check if currently in a session
  for (const session of sessions) {
    if (session.day === day && currentMinutes >= session.start && currentMinutes <= session.end) {
      banner.textContent = `🟢 CURRENT SESSION: ${session.label} 🟢`;
      banner.className = "session-banner active";
      return;
    }
  }

  // 2. Find next session
  let nextSession = null;
  let minDiff = Infinity;

  sessions.forEach(session => {
    let dayDiff = session.day - day;
    if (dayDiff < 0) dayDiff += 7;

    const totalMinutes = dayDiff * 1440 + session.start;
    const nowTotal = currentMinutes;

    const diff = totalMinutes - nowTotal;

    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      nextSession = session;
    }
  });

  if (nextSession) {
    banner.textContent = `NEXT SESSION: ${nextSession.label} (in ${formatCountdown(minDiff)})`;
    banner.className = "session-banner next";
  } else {
    banner.textContent = "NO UPCOMING SESSIONS";
    banner.className = "session-banner";
  }
}

// run once + update every minute
updateSessionBanner();
setInterval(updateSessionBanner, 60000);