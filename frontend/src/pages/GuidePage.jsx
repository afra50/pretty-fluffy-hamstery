import React from "react";
import Button from "../components/ui/Button";
import FoodPhoto from "../assets/guide-food.webp";
import HomePhoto from "../assets/guide-home.jpg";
import HealthPhoto from "../assets/guide-health.jpg";
import {
  FaLeaf,
  FaHome,
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import "../styles/pages/guide-page.scss";

// --- DANE PORADNIKA (ŁATWA EDYCJA) ---
const guideData = [
  {
    id: "nutrition",
    chapterNumber: "01",
    title: "Żywienie",
    icon: <FaLeaf />,
    leadText:
      "Pamiętaj, że chomiki to zwierzęta wszystkożerne – do pełni zdrowia potrzebują zarówno bogatej w zioła mieszanki, jak i białka zwierzęcego.",
    subChapters: [
      {
        id: "nutrition-1",
        number: "1.1",
        title: "Podstawa diety: Zioła i nasiona",
        content: (
          <>
            <p>
              Świeży pokarm podajemy wieczorem, gdy chomik budzi się do życia.
              Resztki, których nie zje przez noc, należy rano usunąć z
              terrarium, aby zapobiec pleśnieniu zapasów. Gotowe mieszanki z
              marketu często są pełne chemii – stawiaj na naturalne karmy od
              sprawdzonych producentów.
            </p>
            <div className="image-breakout">
              <img src={FoodPhoto} alt="Zdrowa dieta chomika" />
            </div>
          </>
        ),
      },
      {
        id: "nutrition-2",
        number: "1.2",
        title: "Suplementacja i przekąski",
        content: (
          <>
            <p>
              Białko zwierzęce to absolutny must-have. Możesz podawać suszone
              mączniki, świerszcze, a raz w tygodniu odrobinę gotowanego (bez
              soli) kurczaka.
            </p>
            <div className="comparison-box">
              <div className="good-box">
                <h4>
                  <FaCheckCircle className="icon-good" /> Bezpieczne
                </h4>
                <ul>
                  <li>Suszone zioła (babka, mniszek)</li>
                  <li>Korzeń mniszka, gałązki jabłoni</li>
                  <li>Suszone owady</li>
                </ul>
              </div>
              <div className="bad-box">
                <h4>
                  <FaExclamationTriangle className="icon-bad" /> Zakazane
                </h4>
                <ul>
                  <li>Kolby i dropsy z miodem</li>
                  <li>Cytrusy, cebula, czosnek</li>
                  <li>Ludzkie jedzenie (chleb, ser)</li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "housing",
    chapterNumber: "02",
    title: "Wyprawka",
    icon: <FaHome />,
    leadText:
      "Odpowiednie lokum to podstawa zdrowego i bezstresowego życia Twojego małego przyjaciela.",
    subChapters: [
      {
        id: "housing-1",
        number: "2.1",
        title: "Wybór odpowiedniego terrarium",
        content: (
          <>
            <div className="feature-block-home">
              <img src={HomePhoto} alt="Idealne terrarium" className="bg-img" />
              <div className="overlay"></div>
              <div className="content">
                <h3>Klatka to przeżytek</h3>
                <p>
                  Minimum 100x50 cm w podstawie. Brak prętów, po których można
                  się wspinać.
                </p>
              </div>
            </div>
            <p>
              Chomiki to zwierzęta naziemne, które w naturze przemierzają
              kilometry. Terrarium chroni je przed przeciągami i pozwala na
              usypanie ogromnej ilości ściółki.
            </p>
          </>
        ),
      },
      {
        id: "housing-2",
        number: "2.2",
        title: "Ściółka i akcesoria",
        content: (
          <>
            <div className="text-columns">
              <div className="col">
                <strong>Głęboka warstwa do kopania</strong>
                <p>
                  Aby chomik mógł kopać tunele, warstwa trocin odpylonych lub
                  ściółki konopnej powinna wynosić{" "}
                  <strong>minimum 20 cm</strong>.
                </p>
              </div>
              <div className="col">
                <strong>Piaskownica</strong>
                <p>
                  Chomiki nie kąpią się w wodzie! Do higieny futerka służy im
                  piasek dla szynszyli. To obowiązkowy element wyposażenia.
                </p>
              </div>
            </div>
            <div className="info-alert">
              <strong>Wymiary kołowrotka to kwestia zdrowia!</strong>
              <p>
                Dla chomika syryjskiego minimalna średnica kołowrotka to 28 cm.
                Zbyt mały kołowrotek powoduje bolesne wygięcie kręgosłupa i
                prowadzi do trwałych urazów.
              </p>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "health",
    chapterNumber: "03",
    title: "Zdrowie",
    icon: <FaHeart />,
    leadText:
      "Chomiki instynktownie ukrywają choroby, aby nie stać się ofiarą drapieżników. Bądź czujny.",
    subChapters: [
      {
        id: "health-1",
        number: "3.1",
        title: "Codzienna rutyna opiekuna",
        content: (
          <div className="image-side-by-side">
            <div className="text-content">
              <ul>
                <li>Oczy: czyste, nie zaropiałe?</li>
                <li>Oddech: cichy, bez "klikania"?</li>
                <li>Waga: czy chomik nie chudnie w oczach?</li>
                <li>Okolice ogona: czyste i suche?</li>
              </ul>
              <p className="small-note">
                Wszelkie odstępstwa od normy wymagają natychmiastowej wizyty u
                weterynarza egzotycznego.
              </p>
            </div>
            <div className="img-content">
              <img src={HealthPhoto} alt="Badanie chomika" />
            </div>
          </div>
        ),
      },
    ],
  },
];

const GuidePage = () => {
  return (
    <div className="guide-page-wrapper fade-in-active">
      <div className="unusual-guide-page">
        {/* --- LEWA STRONA: STICKY MENU --- */}
        <aside className="sticky-intro">
          <div className="intro-content">
            <span className="label">Spis treści</span>
            <h1 className="main-title">Kompendium Opiekuna</h1>
            <p className="description">
              Wiedza to fundament zaufania. Przygotowaliśmy ten przewodnik, abyś
              mógł stworzyć swojemu nowemu przyjacielowi najlepsze warunki do
              życia.
            </p>

            <nav className="guide-nav">
              {guideData.map((chapter) => (
                <div key={chapter.id} className="nav-chapter-group">
                  <a href={`#${chapter.id}`} className="nav-item">
                    <span className="icon">{chapter.icon}</span>
                    <span className="text">{chapter.title}</span>
                  </a>
                  {/* Wyświetlanie podrozdziałów w menu */}
                  <div className="nav-sub-items">
                    {chapter.subChapters.map((sub) => (
                      <a
                        href={`#${sub.id}`}
                        key={sub.id}
                        className="nav-sub-item"
                      >
                        <span className="sub-num">{sub.number}</span>{" "}
                        {sub.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- PRAWA STRONA: TREŚĆ (RENDEROWANA Z TABLICY) --- */}
        <main className="main-guide-content">
          {guideData.map((chapter) => (
            <article className="guide-chapter" id={chapter.id} key={chapter.id}>
              <header className="chapter-header">
                <span className="chapter-number">
                  Rozdział {chapter.chapterNumber}
                </span>
                <h2>{chapter.title}</h2>
                {chapter.leadText && (
                  <p className="lead-text">{chapter.leadText}</p>
                )}
              </header>

              <div className="chapter-body">
                {chapter.subChapters.map((subChapter) => (
                  <section
                    className="sub-chapter"
                    id={subChapter.id}
                    key={subChapter.id}
                  >
                    <div className="sub-chapter-header">
                      <span className="sub-number">{subChapter.number}</span>
                      <h3>{subChapter.title}</h3>
                    </div>
                    <div className="sub-content">{subChapter.content}</div>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};

export default GuidePage;
