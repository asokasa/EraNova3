import "./Info.css";
import My_Footer from "../components/My_Footter";

export default function Info() {
  return (
    <div className="info">
      <div className="info_info">
        <h2>A fesztiválról</h2>
        <p>Idén augusztusban is várunk minden kedves érdeklődőt a Nemeshanyba,
          a Kemencés Vendégház és Pajtaszínházba, ahol a klasszikus zenei koncertek
          mellett a művészetek ezerféle fajtájával találkozhat a közönségünk. A három napos programsorozat alaphangulatát a helyszín, Nemeshany falusi
          környezete biztosítja, ahol csupán a levegőbe szippantani is élmény. Programjaink között rendezőként, az Era Nova Kamarazenekar klasszikus zenei
          koncertjei kiemelt szerepet kapnak, kamarazenei és zenekari koncertek által hozva
          közelebb mindannyiunkhoz a zene szeretetét! A klasszikus zenei előadások mellett
          esténként népzenével, Alternatív Rock és Folk Rock műfajok képviselőivel is találkozhat
          a hozzánk látogató!
        </p>
      </div>
      
      
      <div class="custom-shape-divider-bottom-1752702800">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
              </svg>
          </div>
      
          <My_Footer />
    </div>
  );
}