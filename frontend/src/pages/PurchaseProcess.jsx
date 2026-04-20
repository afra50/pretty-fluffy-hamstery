import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroBanner from "../components/ui/HeroBanner"; // Import nowego komponentu
import PurchaseBanner from "../assets/purchase.webp";
import CuteHamster from "../assets/cutehamster.jpg";
import "../styles/pages/purchase-process.scss";
import Button from "../components/ui/Button";

const steps = [
  {
    id: 1,
    title: "Przeczytanie poradnika",
    desc: "Zapoznaj się z naszymi wymaganiami dotyczącymi klatek, kołowrotków i żywienia.",
    link: { url: "/poradnik", text: "Przeczytaj poradnik" },
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Wypełnienie ankiety",
    desc: "Opisz swoje warunki i doświadczenie. To podstawa do rozpoczęcia rozmów.",
    link: { url: "/ankieta", text: "Wypełnij ankietę" },
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Odpowiedź i rozmowa",
    desc: "Odezwiemy się do Ciebie i umówimy na krótką wideorozmowę, aby się poznać.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Rezerwacja",
    desc: "Po pozytywnej weryfikacji konkretny maluch zostaje dla Ciebie oficjalnie zarezerwowany.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Umowa",
    desc: "Zapoznajesz się i podpisujesz umowę kupna-sprzedaży chomika z rodowodem.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Wpłata zadatku",
    desc: "Regulujesz płatność przelewem zgodnie z ustaleniami zawartymi w umowie.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: 7,
    title: "Odbiór",
    desc: "Zabierasz zwierzaka do w pełni wyposażonego, bezpiecznego nowego domku!",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 8,
    title: "Aklimatyzacja",
    desc: "Dajesz maluchowi czas na oswojenie się z otoczeniem, a my służymy wsparciem po adopcji.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "Czy mogę przyjechać obejrzeć chomiki przed wypełnieniem ankiety?",
    a: "Ze względu na bezpieczeństwo i stres naszych zwierząt, nie prowadzimy 'odwiedzin' jak w sklepie zoologicznym. Zdjęcia i filmy maluchów regularnie publikujemy na naszej stronie i w social mediach. Wizyta możliwa jest dopiero na etapie odbioru zarezerwowanego malucha.",
  },
  {
    q: "Czy pomagacie w skompletowaniu wyprawki?",
    a: "Oczywiście! Na etapie wideorozmowy chętnie podpowiemy, jakie marki karmy są najlepsze i jaki rozmiar kołowrotka będzie bezpieczny.",
  },
  {
    q: "Co się stanie, jeśli zrezygnuję po wpłaceniu zadatku?",
    a: "Zadatek jest bezzwrotny. Ma on na celu zabezpieczenie rezerwacji i pokrycie kosztów związanych z odrzucaniem innych chętnych na danego chomika. Prosimy o przemyślane decyzje.",
  },
];

const PurchaseProcess = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className={`process-page ${isVisible ? "fade-in-active" : ""}`}>
      {/* UŻYCIE KOMPONENTU BANERA */}
      <HeroBanner
        title="Zostań opiekunem"
        subtitle="Poznaj proces zakupu rodowodowego malucha"
        image={PurchaseBanner}
      />

      <div className="process-content-wrapper">
        <div className="intro-section">
          <h2>Jak wygląda procedura?</h2>
          <p>
            Naszym priorytetem jest zdrowie i bezpieczeństwo naszych
            podopiecznych. Proces rezerwacji składa się z etapów, które
            pozwalają nam upewnić się, że maluchy trafią do najlepszych domów.
          </p>
        </div>

        <section className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="step-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {step.link && (
                <Link to={step.link.url} className="step-link">
                  {step.link.text} &rarr;
                </Link>
              )}
            </div>
          ))}
        </section>

        <section className="faq-section">
          <h2>Najczęściej zadawane pytania (FAQ)</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? "open" : ""}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h4>{faq.q}</h4>
                  <span className="icon">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* NOWOCZESNE CTA: ORGANICZNE ZDJĘCIE */}
      <section className="cta-organic-section">
        <div className="cta-organic-container">
          <div className="cta-image-wrapper">
            {/* Dekoracyjne tło pod zdjęciem (blob) */}
            <div className="cta-image-blob-bg"></div>

            {/* Zdjęcie przycięte do organicznego kształtu */}
            <img
              src={CuteHamster}
              alt="Uroczy chomik"
              className="cta-organic-image"
            />
          </div>

          <div className="cta-content-wrapper">
            <span className="cta-subtitle">Ostatni krok</span>
            <h2>Gotowy na nowego członka rodziny?</h2>
            <p>
              Jeśli nasze zasady i podejście do hodowli są Ci bliskie, nie
              zwlekaj. Zrób pierwszy krok w stronę nowej przyjaźni.
            </p>

            <div className="cta-action-group">
              <Button to="/mioty" variant="primary" className="btn-solid">
                Zobacz dostępne mioty
              </Button>
              <Link to="/ankieta" className="btn-text">
                Przejdź do ankiety &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PurchaseProcess;
