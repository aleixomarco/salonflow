document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("whatsappBookingForm");
  const toast = document.getElementById("toast");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");

  // HIER DIE WHATSAPP-NUMMER DES FRISEURS EINTRAGEN
  // Beispiel: +49 176 12345678 wird zu 4917612345678
  const friseurWhatsAppNummer = "491736625474";

  // HIER BEREITS GEBUCHTE TERMINE EINTRAGEN
  // Format: YYYY-MM-DD und HH:MM
  const bookedAppointments = [
    {
      date: "2026-06-08",
      time: "09:00"
    },
    {
      date: "2026-06-08",
      time: "09:15"
    },
    {
      date: "2026-06-08",
      time: "14:30"
    },
    {
      date: "2026-06-09",
      time: "10:00"
    }
  ];

  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function createTimeOptions(startHour, endHour) {
    const options = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === endHour && minute > 0) continue;

        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");

        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }

    return options;
  }

  function isBooked(date, time) {
    return bookedAppointments.some(function (appointment) {
      return appointment.date === date && appointment.time === time;
    });
  }

  function updateTimeOptions() {
    if (!dateInput || !timeSelect) return;

    const selectedDate = dateInput.value;

    timeSelect.innerHTML = "";

    if (!selectedDate) {
      timeSelect.innerHTML = `<option value="">Bitte zuerst Datum wählen</option>`;
      return;
    }

    const date = new Date(selectedDate + "T00:00:00");
    const day = date.getDay();

    // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    if (day === 0) {
      timeSelect.innerHTML = `<option value="">Sonntag geschlossen</option>`;
      showToast("Sonntags sind keine Termine möglich.");
      return;
    }

    let allTimes = [];

    if (day >= 1 && day <= 5) {
      allTimes = createTimeOptions(9, 18);
    }

    if (day === 6) {
      allTimes = createTimeOptions(10, 16);
    }

    const availableTimes = allTimes.filter(function (time) {
      return !isBooked(selectedDate, time);
    });

    if (availableTimes.length === 0) {
      timeSelect.innerHTML = `<option value="">Keine freien Termine verfügbar</option>`;
      showToast("An diesem Tag sind keine freien Termine verfügbar.");
      return;
    }

    timeSelect.innerHTML = `<option value="">Bitte Uhrzeit wählen</option>`;

    availableTimes.forEach(function (time) {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  }

  if (dateInput) {
    dateInput.addEventListener("change", updateTimeOptions);
  }

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !phone || !service || !date || !time) {
      showToast("Bitte fülle alle Felder aus.");
      return;
    }

    if (isBooked(date, time)) {
      showToast("Dieser Termin ist leider bereits vergeben. Bitte wähle eine andere Uhrzeit.");
      updateTimeOptions();
      return;
    }

    const formattedDate = formatDate(date);

    const whatsappText =
`Neue Terminanfrage:

Name: ${name}
Telefon: ${phone}
Leistung: ${service}
Datum: ${formattedDate}
Uhrzeit: ${time}

Hinweis:
Der Termin ist noch nicht bestätigt. Bitte antworte dem Kunden zur Bestätigung.`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${friseurWhatsAppNummer}?text=${encodedText}`;

    showToast("WhatsApp wird geöffnet ...");

    setTimeout(function () {
      window.open(whatsappUrl, "_blank");
    }, 500);
  });
});