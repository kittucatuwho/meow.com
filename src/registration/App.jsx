import React, { useState } from 'react';

const initialForm = {
  name: '',
  phone: '',
  guests: '1',
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [isTearing, setIsTearing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isTearing || isSubmitted) return;
    setIsTearing(true);
  }

  function finishTear(event) {
    if (event.animationName !== 'ticket-tear') return;
    setIsTearing(false);
    setIsSubmitted(true);
  }

  return (
    <main className="page">
      <form className="registration" onSubmit={handleSubmit}>
        <section className="form-panel" aria-labelledby="page-title">
          <h1 id="page-title">Регистрация на ивент</h1>

          <fieldset disabled={isTearing || isSubmitted}>
            <label className="field">
              <span>ФИО</span>
              <input
                autoComplete="name"
                name="name"
                onChange={updateField}
                placeholder="синий кот"
                required
                value={form.name}
              />
            </label>

            <label className="field">
              <span>Номер телефона</span>
              <input
                autoComplete="tel"
                inputMode="tel"
                name="phone"
                onChange={updateField}
                pattern="[+]?[0-9() -]{10,}"
                placeholder="+7 (000) 000-00-00"
                required
                title="Введите номер телефона, например +7 (999) 123-45-67"
                type="tel"
                value={form.phone}
              />
            </label>

            <label className="field">
              <span>Количество гостей</span>
              <input
                min="1"
                max="99"
                name="guests"
                onChange={updateField}
                required
                type="number"
                value={form.guests}
              />
            </label>
          </fieldset>
        </section>

        <aside className="ticket-slot" aria-live="polite">
          {isSubmitted ? (
            <div className="success-ticket">
              <span className="success-ticket__check" aria-hidden="true">✓</span>
              <span>Вы в списке!</span>
            </div>
          ) : (
            <div
              className={`ticket${isTearing ? ' ticket--tearing' : ''}`}
              onAnimationEnd={finishTear}
            >
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
                <span>{isTearing ? 'Отправляем' : 'Отправить'}</span>
              </button>
            </div>
          )}
        </aside>
      </form>
    </main>
  );
}
