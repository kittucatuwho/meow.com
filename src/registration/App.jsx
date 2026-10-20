import React, { useState } from 'react';
import glitchTicket from './meow-ticket-crt.png';

function phoneDigits(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatPhone(value) {
  const digits = phoneDigits(value);
  if (!digits) return '';
  let formatted = '+7 (' + digits.slice(0, 3);
  if (digits.length >= 3) formatted += ')';
  if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
  if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
  if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
  return formatted;
}

const initialForm = {
  name: '',
  phone: '',
  guests: '',
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [isTearing, setIsTearing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const isFormComplete = form.name.trim().length > 0 && phoneDigits(form.phone).length === 10 && Number(form.guests) >= 1;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updatePhone(event) {
    const input = event.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = phoneDigits(input.value.slice(0, caret)).length;
    const nextPhone = formatPhone(input.value);
    setForm((current) => ({ ...current, phone: nextPhone }));
    requestAnimationFrame(() => {
      const updated = input;
      let nextCaret = 0;
      let digitCount = 0;
      while (nextCaret < nextPhone.length && digitCount < digitsBeforeCaret) {
        if (/\d/.test(nextPhone[nextCaret])) digitCount += 1;
        nextCaret += 1;
      }
      updated.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isTearing || isSubmitted) return;
    setHasAttemptedSubmit(true);
    if (!isFormComplete) return;
    setIsTearing(true);
  }

  function finishTear(event) {
    if (event.animationName !== 'ticket-tear') return;
    setIsTearing(false);
    setIsSubmitted(true);
  }

  return (
    <main className="page">
      <form className="registration" noValidate onSubmit={handleSubmit}>
        <div className="ticket-card">
        <section className="form-panel" aria-labelledby="page-title">
          <h1 id="page-title">Регистрация на ивент</h1>

          <fieldset disabled={isTearing || isSubmitted}>
            <label className="field">
              <span>(фио)</span>
              <input
                autoComplete="name"
                name="name"
                onChange={updateField}
                placeholder="синий кот"
                aria-invalid={hasAttemptedSubmit && !form.name.trim()}
                required
                value={form.name}
              />
            </label>

            <label className="field">
              <span>(номер телефона)</span>
              <input
                autoComplete="tel"
                inputMode="numeric"
                name="phone"
                onChange={updatePhone}
                onInput={updatePhone}
                aria-invalid={hasAttemptedSubmit && phoneDigits(form.phone).length !== 10}
                pattern="\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}"
                placeholder="+7 (000) 000-00-00"
                required
                title="Введите номер телефона, например +7 (999) 123-45-67"
                type="tel"
                value={form.phone}
              />
            </label>

            <label className="field">
              <span>(количество гостей)</span>
              <input
                min="1"
                max="99"
                name="guests"
                onChange={updateField}
                required
                aria-invalid={hasAttemptedSubmit && !(Number(form.guests) >= 1)}
                placeholder="1"
                type="number"
                value={form.guests}
              />
            </label>
          </fieldset>
        </section>

        <aside className={`ticket-slot${isTearing || isSubmitted ? ' ticket-slot--torn' : ''}`} aria-live="polite">
            <div
              className={`ticket${isTearing ? ' ticket--tearing' : ''}${isSubmitted ? ' ticket--torn' : ''}${isTearing || isSubmitted ? ' ticket--effect' : ''}`}
              onAnimationEnd={finishTear}
            >
              {(isTearing || isSubmitted) && (
                <img className="ticket__glitch-art" src={glitchTicket} alt="" aria-hidden="true" />
              )}
              <div className="ticket__perforation" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <span className="ticket__hole" key={index} />
                ))}
              </div>
              <span className="ticket__notch ticket__notch--top" aria-hidden="true" />
              <span className="ticket__notch ticket__notch--middle" aria-hidden="true" />
              <span className="ticket__notch ticket__notch--bottom" aria-hidden="true" />
              <button
                aria-label="Отправить регистрацию"
                className="ticket__send"
                disabled={isTearing}
                type="submit"
              >
                <span>{isTearing || isSubmitted ? 'отправлено!' : 'отправить!'}</span>
              </button>
            </div>
        </aside>
        </div>
      </form>
    </main>
  );
}
