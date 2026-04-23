import LogoutButton from "./logout-button";
import TopologyImage from "./topology-image";

type Resource = {
  title: string;
  url?: string;
  note?: string;
  tag: string;
};

const resources: Resource[] = [
  {
    tag: "Video",
    title: "YouTube – prezentace / ukázka ",
    url: "https://www.youtube.com/watch?v=eK-E-OoftQM",
  },
  {
    tag: "PDF",
    title: "NÚKIB – Informace ke kybernetické bezpečnosti (normativní akty)",
    url: "https://nukib.gov.cz/download/uredni_deska/odpovedi_106/2025_13_Informace_ke_kyberneticke_bezpecnosti_normativni_akty.pdf",
  },
  {
    tag: "Odkaz",
    title: "č. 264/2025 Sb., o kybernetické bezpečnosti, vyhláška č. 409/2025 Sb., § 19, odstavec 4, písmeno a)",
    note: "Reference ve Sbírce zákonů ČR",
  },
  {
    tag: "Dokumentace",
    title: "LLMNR poisoning v praxi – Cyber Rangers",
    url: "https://www.cyber-rangers.com/cs/clanek/llmnr-poisoning-v-praxi-6krOQo",
    note: "Podklad k bodu 5a/5b – návrh průniku a záchyt hesla/hashe/certifikátu",
  },
];

export default function Page() {
  return (
    <main className="page">
      <div className="container">
        <div className="header">
          <div>
            <div className="title">Praktická maturita</div>
            <div className="subtitle">Rozcestník materiálů</div>
          </div>
          <LogoutButton />
        </div>

        <div className="section-heading">Návrh topologie sítě</div>
        <TopologyImage />

        <div className="section-heading">Zdroje</div>
        <div className="list">
          {resources.map((r, i) => {
            const body = (
              <>
                <div>
                  <span className="tag">{r.tag}</span>
                  <span className="card-title">{r.title}</span>
                </div>
                {r.url && <div className="card-sub">{r.url}</div>}
                {r.note && <div className="card-sub">{r.note}</div>}
              </>
            );
            return r.url ? (
              <a
                key={i}
                className="card"
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {body}
              </a>
            ) : (
              <div key={i} className="card">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
