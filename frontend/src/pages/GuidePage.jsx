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
  FaHandHoldingHeart,
} from "react-icons/fa";
import "../styles/pages/guide-page.scss";

// --- DANE PORADNIKA (ROZBUDOWANE) ---
const guideData = [
  {
    id: "nutrition",
    chapterNumber: "01",
    title: "Żywienie",
    icon: <FaLeaf />,
    leadText:
      "Pamiętaj, że chomiki to zwierzęta wszystkożerne – do pełni zdrowia potrzebują zarówno bogatej w zioła mieszanki, jak i białka zwierzęcego. Ich dieta powinna jak najwierniej odwzorowywać to, co znalazłyby w naturze.",
    subChapters: [
      {
        id: "nutrition-1",
        number: "1.1",
        title: "Podstawa diety: Zioła i nasiona",
        content: (
          <>
            <p>
              Świeży pokarm podajemy wieczorem, gdy chomik budzi się do życia i
              zaczyna swoją aktywność. Resztki pokarmu wilgotnego (warzywa,
              owoce), których nie zje przez noc, należy rano usunąć z terrarium,
              aby zapobiec pleśnieniu zapasów w domku. Gotowe, kolorowe
              mieszanki z marketu często są pełne chemii, sztucznych barwników i
              cukru – stawiaj na naturalne karmy od sprawdzonych producentów
              (np. Mixerama, Futterparadies).
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
        title: "Białko i świeże dodatki",
        content: (
          <>
            <div className="text-columns">
              <div className="col">
                <strong>Białko zwierzęce</strong>
                <p>
                  To absolutny must-have. Możesz podawać suszone mączniki,
                  świerszcze, jedwabniki, a raz w tygodniu odrobinę gotowanego
                  (bez soli i przypraw) kurczaka lub białka jaja kurzego.
                </p>
              </div>
              <div className="col">
                <strong>Warzywa i owoce</strong>
                <p>
                  Warzywa podajemy regularnie w małych ilościach (np. ogórek,
                  brokuł, cukinia). Owoce (jabłko, gruszka) traktuj wyłącznie
                  jako rzadki smakołyk ze względu na wysoką zawartość cukru.
                </p>
              </div>
            </div>
            <div className="comparison-box">
              <div className="good-box">
                <h4>
                  <FaCheckCircle className="icon-good" /> Bezpieczne
                </h4>
                <ul>
                  <li>Suszone zioła (babka lancetowata, mniszek lekarski)</li>
                  <li>Korzeń mniszka, gałązki jabłoni do ścierania zębów</li>
                  <li>Suszone owady i krewetki słodkowodne</li>
                  <li>Nasiona dyni i słonecznika (w małych ilościach)</li>
                </ul>
              </div>
              <div className="bad-box">
                <h4>
                  <FaExclamationTriangle className="icon-bad" /> Zakazane
                </h4>
                <ul>
                  <li>Kolby i dropsy sklejane miodem lub syropem</li>
                  <li>Cytrusy, cebula, czosnek, por</li>
                  <li>Ludzkie jedzenie (chleb, ser żółty, przyprawy)</li>
                  <li>Rośliny strączkowe (fasola, groch)</li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
      {
        id: "nutrition-3",
        number: "1.3",
        title: "Woda: Poidełko czy miseczka?",
        content: (
          <p>
            Chomik musi mieć stały dostęp do czystej wody pitnej, zmienianej
            każdego dnia. Możesz używać klasycznego poidełka kulkowego, jednak
            coraz więcej opiekunów decyduje się na małą, ciężką miseczkę
            ceramiczną (np. taką na tealighty). Picie z miseczki wymusza na
            chomiku bardziej naturalną postawę ciała i eliminuje problem
            zacinających się kulek w poidełkach.
          </p>
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
      "Odpowiednie lokum to fundament. Chomiki to niezwykle aktywne zwierzęta, które potrafią w ciągu jednej nocy przebiec w kołowrotku nawet kilka kilometrów.",
    subChapters: [
      {
        id: "housing-1",
        number: "2.1",
        title: "Wybór odpowiedniego lokum",
        content: (
          <>
            <div className="feature-block-home">
              <img
                src={HomePhoto}
                alt="Wnętrze odpowiedniego lokum"
                className="bg-img"
              />
              <div className="overlay"></div>
              <div className="content">
                <h3>Przestrzeń to wolność</h3>
                <p>
                  Minimum 100x50 cm w podstawie przestrzeni użytkowej dla
                  jednego chomika.
                </p>
              </div>
            </div>
            <p>
              Wybór odpowiedniego lokum sprowadza się do jednej zasady: im
              więcej ciągłej przestrzeni w podstawie, tym lepiej.
              <strong> Terraria i duże akwaria</strong> są bardzo popularne,
              ponieważ chronią przed przeciągami, świetnie trzymają grubą
              warstwę trocin i dają idealny widok na zwierzaka.
            </p>
            <p>
              <strong>Czy klatka to zły wybór?</strong> Absolutnie nie! Klatka
              może być świetnym domem, o ile spełnia minimum wymiarowe (100x50
              cm) oraz posiada bardzo głęboką kuwetę (np. klatki typu Alaska czy
              Barney). Chomiki są zwierzętami naziemnymi, więc klatki wysokie, z
              wieloma pięterkami, mija się z celem – liczy się powierzchnia
              parteru.
            </p>
          </>
        ),
      },
      {
        id: "housing-2",
        number: "2.2",
        title: "Głęboka ściółka i piaskownica",
        content: (
          <>
            <div className="text-columns">
              <div className="col">
                <strong>Naturalny instynkt kopania</strong>
                <p>
                  Chomiki w naturze żyją w norkach pod ziemią. Aby mogły budować
                  trwałe tunele w warunkach domowych, potrzebują odpylonych
                  trocin drzewnych lub ściółki konopnej zmieszanej z siankiem.
                  Warstwa ściółki powinna wynosić <strong>minimum 20 cm</strong>{" "}
                  (im więcej, tym lepiej).
                </p>
              </div>
              <div className="col">
                <strong>Kąpiele piaskowe</strong>
                <p>
                  Chomiki kategorycznie nie kąpią się w wodzie! Do higieny
                  futerka, ścierania pazurków i odstresowania służy im piasek
                  dla szynszyli. Piaskownica (np. duże ceramiczne naczynie) to
                  obowiązkowy element wyposażenia każdego lokum.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: "housing-3",
        number: "2.3",
        title: "Kołowrotek i wyposażenie",
        content: (
          <>
            <div className="info-alert">
              <strong>
                Kołowrotek: Wymiary to kwestia zdrowia kręgosłupa!
              </strong>
              <p>
                Dla chomika syryjskiego absolutne{" "}
                <strong>minimum średnicy kołowrotka to 28 cm</strong> (często
                zalecane 30-33 cm). Dla chomików karłowatych jest to minimum
                20-22 cm. Zbyt mały kołowrotek zmusza zwierzę do wyginania
                kręgosłupa w kształt litery "U", co po krótkim czasie prowadzi
                do bolesnych i nieodwracalnych zmian zwyrodnieniowych.
                Kołowrotek nie może mieć szczebelków ani efektu gilotyny –
                bieżnia musi być pełna i bezpieczna.
              </p>
            </div>
            <p>
              Oprócz kołowrotka i piaskownicy, w lokum powinien znaleźć się
              wielokomorowy drewniany domek (bez dna, stawiany bezpośrednio na
              ściółce), drewniane mostki, korkowe tunele oraz materiał na
              gniazdo (np. miękkie chusteczki bezzapachowe – nigdy wata!).
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "health",
    chapterNumber: "03",
    title: "Zdrowie i Profilaktyka",
    icon: <FaHeart />,
    leadText:
      "Chomiki to zwierzęta ofiarne. Instynkt każe im ukrywać wszelkie oznaki słabości, aby nie stać się łatwym celem dla drapieżników. Kiedy widzisz, że chomik jest chory, sytuacja jest już bardzo poważna.",
    subChapters: [
      {
        id: "health-1",
        number: "3.1",
        title: "Codzienna kontrola i rutyna",
        content: (
          <div className="image-side-by-side">
            <div className="text-content">
              <p>
                Każdego dnia, podczas podawania pokarmu, zwróć uwagę na kilka
                kluczowych aspektów:
              </p>
              <ul>
                <li>
                  <strong>Oczy i pyszczek:</strong> Czy oczy są w pełni otwarte,
                  jasne i bez wycieków? Czy zęby nie przerosły?
                </li>
                <li>
                  <strong>Oddech:</strong> Czy oddech jest cichy? Jakiekolwiek
                  "klikanie", świszczenie lub piszczenie przy oddychaniu wymaga
                  natychmiastowej wizyty w klinice.
                </li>
                <li>
                  <strong>Aktywność:</strong> Czy chomik w nocy korzysta z
                  kołowrotka? Czy jedzenie znika z miseczki?
                </li>
                <li>
                  <strong>Okolice ogona:</strong> Zawsze muszą być całkowicie
                  suche i czyste.
                </li>
              </ul>
              <p className="small-note">
                Znajdź w swojej okolicy weterynarza specjalizującego się w
                zwierzętach egzotycznych lub małych ssakach, zanim jeszcze
                chomik zagości w Twoim domu. Standardowy psi/koci weterynarz
                rzadko ma wiedzę o tak małych organizmach.
              </p>
            </div>
            <div className="img-content">
              <img src={HealthPhoto} alt="Badanie chomika w dłoni" />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "taming",
    chapterNumber: "04",
    title: "Oswajanie",
    icon: <FaHandHoldingHeart />,
    leadText:
      "Cierpliwość to klucz do serca chomika. Nie przyspieszaj procesu oswajania – pozwól mu ustalić własne tempo.",
    subChapters: [
      {
        id: "taming-1",
        number: "4.1",
        title: "Pierwsze dni w nowym domu",
        content: (
          <p>
            Przeprowadzka to dla tak małego stworzenia ogromny stres. Po
            wpuszczeniu chomika do docelowego lokum,
            <strong> zostaw go w spokoju przez pierwsze 3 do 5 dni</strong>.
            Podawaj tylko świeże jedzenie i wodę, oraz mów do niego cichym
            głosem. Nie próbuj go dotykać, wyciągać na siłę ani burzyć mu
            gniazda. Musi najpierw poczuć, że jego nowe terytorium jest w 100%
            bezpieczne.
          </p>
        ),
      },
      {
        id: "taming-2",
        number: "4.2",
        title: "Budowanie zaufania krok po kroku",
        content: (
          <>
            <p>
              Gdy chomik przestanie panikować na Twój widok, zacznij podawać mu
              przysmaki (np. pestkę dyni lub suszonego mącznika) przez otwarte
              drzwiczki lub z góry terrarium. Z czasem połóż przysmak na
              płaskiej, otwartej dłoni wewnątrz klatki. Pozwól, by chomik sam na
              nią wszedł.
            </p>
            <div className="info-alert">
              <strong>Zasada wanny</strong>
              <p>
                Świetnym sposobem na oswajanie zaawansowane jest przeniesienie
                chomika do czystej, suchej wanny wyłożonej kocykiem. Usiądź w
                niej razem z nim. Chomik będzie ciekawsko po Tobie wchodził, a
                brak możliwości ucieczki sprawi, że szybko zrozumie, że jesteś
                świetnym, bezpiecznym "placem zabaw".
              </p>
            </div>
          </>
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
